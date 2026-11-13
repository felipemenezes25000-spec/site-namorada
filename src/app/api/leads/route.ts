import { NextResponse, after } from "next/server";
import { buildAppointmentSchema } from "@/lib/validations";
import { treatmentOptions } from "@/lib/lead-treatments";
import { getServerSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { sendLeadNotification, isEmailConfigured } from "@/lib/email";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import type { LeadsResponse, NewAppointmentLead } from "@/types/lead";
import { PRIVACY_POLICY_VERSION } from "@/lib/content";

export const runtime = "nodejs";
// Teto da função: com os prazos de 8 s abaixo, o paciente nunca fica preso num "carregando".
export const maxDuration = 15;

/*
 * Contrato de resposta (JSON, sempre com Cache-Control: no-store):
 *   200 { ok: true, persisted: boolean, emailed: boolean | "pending" }   lead gravado e/ou enviado por e-mail.
 *       "pending": sem banco, o e-mail passou do prazo de 8 s; ele segue sendo enviado em segundo plano
 *       (after()), e a resposta não vira 503 por lentidão (o paciente não reenvia e não duplica o lead).
 *   200 { ok: true, ..., duplicate: true }   mesmo `submissionId` repetido em até 10 min: nada é gravado
 *       nem enviado de novo (o formulário repete o id nas novas tentativas do mesmo envio).
 *   400 { ok: false, error: "invalid_json" }
 *   403 { ok: false, error: "forbidden" }                     origem diferente do site
 *   413 { ok: false, error: "payload_too_large" }
 *   422 { ok: false, error: "validation", fieldErrors: { [campo]: string[] }, formErrors: string[] }
 *       Mensagens em português. O tipo compartilhado com o formulário é LeadsResponse (types/lead.ts).
 *   429 { ok: false, error: "rate_limited", retryAfter: number }   + cabeçalho Retry-After (segundos)
 *       Dois níveis: 30 requisições / 10 min por IP (qualquer corpo, contra abuso) e
 *       5 leads VÁLIDOS / 10 min por IP. Erro de preenchimento (422) não gasta o segundo
 *       limite, então quem erra o formulário (ou divide o IP de operadora) não perde o lead.
 *   503 { ok: false, error: "delivery_failed" }               lead NÃO gravado e NÃO enviado: mostrar o atalho de WhatsApp
 *
 * Opcional no corpo: `formStartedAt` (ms desde 1970, quando o paciente abriu o formulário).
 * Se vier e o envio ocorrer em menos de MIN_FILL_MS, tratamos como robô: 200 { ok:true, persisted:false,
 * emailed:false, trap:true }, sem gravar. O formulário não deve contar conversão quando `trap` vier true.
 * Campo ausente ou com relógio no futuro NÃO é suspeito (relógio errado de celular não pode custar um lead).
 * Nenhum dado pessoal é escrito em log.
 */
const NO_STORE = { "Cache-Control": "no-store" } as const;
const MAX_BODY_BYTES = 20_000;
const MIN_FILL_MS = 3000;
const EXTERNAL_TIMEOUT_MS = 8000;
const TRAP_BODY = { ok: true, persisted: false, emailed: false, trap: true } as const;

/** Envios já recebidos (submissionId -> instante), para descartar repetições. Por instância (memória). */
const DEDUPE_MS = 10 * 60 * 1000;
const recentSubmissions = new Map<string, number>();
function seenSubmission(id: string, now: number): boolean {
  for (const [k, at] of recentSubmissions) if (now - at > DEDUPE_MS) recentSubmissions.delete(k);
  if (recentSubmissions.has(id)) return true;
  recentSubmissions.set(id, now);
  return false;
}

/** Resolve com `fallback` se `promise` passar de `ms` (a chamada externa nunca prende o paciente). */
function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<T>((resolve) => {
    timer = setTimeout(() => resolve(fallback), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

const appointmentSchema = buildAppointmentSchema(treatmentOptions);

function reply(body: LeadsResponse, status = 200, headers: Record<string, string> = {}) {
  return NextResponse.json(body, { status, headers: { ...NO_STORE, ...headers } });
}

export async function POST(request: Request) {
  // 1) Origem: navegadores mandam Origin (POST) e Sec-Fetch-Site, e os dois têm de apontar para o
  //    próprio site. Clientes que não são navegadores (curl) podem omitir ambos; para eles valem o
  //    limite de taxa e a validação. É defesa contra uso a partir de outro site, não autenticação.
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin && host) {
    try {
      if (new URL(origin).host !== host) {
        return reply({ ok: false, error: "forbidden" }, 403);
      }
    } catch {
      return reply({ ok: false, error: "forbidden" }, 403);
    }
  }

  const fetchSite = request.headers.get("sec-fetch-site");
  if (!origin && fetchSite && fetchSite !== "same-origin" && fetchSite !== "none") {
    return reply({ ok: false, error: "forbidden" }, 403);
  }

  // 2) Limite amplo por IP, antes de ler o corpo (contra laço/abuso). O limite estrito de
  //    leads válidos vem depois da validação.
  const ip = clientIp(request.headers);
  const limit = rateLimit(`leads-any:${ip}`, 30, 10 * 60 * 1000);
  if (!limit.ok) {
    return reply({ ok: false, error: "rate_limited", retryAfter: limit.retryAfter }, 429, {
      "Retry-After": String(limit.retryAfter),
    });
  }

  const declared = Number(request.headers.get("content-length") ?? 0);
  if (declared > MAX_BODY_BYTES) {
    return reply({ ok: false, error: "payload_too_large" }, 413);
  }

  let body: Record<string, unknown>;
  try {
    const raw = await request.text();
    if (Buffer.byteLength(raw, "utf8") > MAX_BODY_BYTES)
      return reply({ ok: false, error: "payload_too_large" }, 413);
    const parsedJson: unknown = JSON.parse(raw);
    if (!parsedJson || typeof parsedJson !== "object" || Array.isArray(parsedJson)) {
      return reply({ ok: false, error: "invalid_json" }, 400);
    }
    body = parsedJson as Record<string, unknown>;
  } catch {
    return reply({ ok: false, error: "invalid_json" }, 400);
  }

  // 3) Honeypot: se preenchido, finge sucesso sem persistir.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return reply(TRAP_BODY);
  }

  // 3b) Armadilha de tempo: preenchimento humano leva mais que MIN_FILL_MS.
  const startedAt = Number(body.formStartedAt);
  if (Number.isFinite(startedAt) && startedAt > 0) {
    const elapsed = Date.now() - startedAt;
    if (elapsed >= 0 && elapsed < MIN_FILL_MS) {
      return reply(TRAP_BODY);
    }
  }

  const parsed = appointmentSchema.safeParse(body);
  if (!parsed.success) {
    const flat = parsed.error.flatten();
    return reply(
      {
        ok: false,
        error: "validation",
        fieldErrors: flat.fieldErrors,
        formErrors: flat.formErrors,
      },
      422,
    );
  }

  // 3c) Limite estrito: só leads válidos gastam as 5 vagas / 10 min.
  const strict = rateLimit(`leads:${ip}`, 5, 10 * 60 * 1000);
  if (!strict.ok) {
    return reply({ ok: false, error: "rate_limited", retryAfter: strict.retryAfter }, 429, {
      "Retry-After": String(strict.retryAfter),
    });
  }

  // 3d) Repetição do mesmo envio (rede caiu e o paciente tentou de novo): não grava nem envia outra vez.
  const submissionId =
    typeof body.submissionId === "string" && /^[A-Za-z0-9-]{8,64}$/.test(body.submissionId)
      ? body.submissionId
      : null;
  if (submissionId && seenSubmission(submissionId, Date.now())) {
    return reply({ ok: true, persisted: false, emailed: false, duplicate: true });
  }

  const data = parsed.data;
  const attr = data.attribution;
  // Registro do consentimento: o mesmo instante e a mesma versão vão ao e-mail e ao banco.
  const consentAt = new Date().toISOString();
  const temDadoDeSaude = Boolean(data.mainComplaint) || data.hasXray === "sim";
  const healthConsent: "sim" | "nao" | "nao_se_aplica" =
    data.healthConsent === true ? "sim" : temDadoDeSaude ? "nao" : "nao_se_aplica";
  // Identificador de clique do Google Ads (gclid; gbraid/wbraid no iOS levam
  // prefixo para permanecerem distinguíveis na importação de conversões offline).
  const clickId =
    attr?.gclid ||
    (attr?.gbraid ? `gbraid:${attr.gbraid}` : null) ||
    (attr?.wbraid ? `wbraid:${attr.wbraid}` : null);

  // 4) Enviar e-mail de notificação para a Dra. (assíncrono, não bloqueia resposta).
  const emailPromise = isEmailConfigured()
    ? sendLeadNotification({
        fullName: data.fullName,
        whatsapp: data.whatsapp,
        email: data.email || null,
        treatmentInterest: data.treatmentInterest,
        preferredPeriod: data.preferredPeriod || null,
        preferredDate: data.preferredDate || null,
        hasXray: data.hasXray || null,
        mainComplaint: data.mainComplaint || null,
        source: data.source || null,
        gclid: clickId,
        utmSource: attr?.utmSource || null,
        utmMedium: attr?.utmMedium || null,
        utmCampaign: attr?.utmCampaign || null,
        landingPage: attr?.landingPage || null,
        consentAt,
        privacyPolicyVersion: PRIVACY_POLICY_VERSION,
        healthConsent,
      })
    : Promise.resolve({ ok: false, reason: "not_configured" });
  // Falha de envio nunca derruba a resposta: o resultado só conta se o e-mail sair.
  const emailSettled = withTimeout(
    emailPromise.catch(() => ({ ok: false, reason: "send_failed" })),
    EXTERNAL_TIMEOUT_MS,
    { ok: false, reason: "timeout" },
  );

  const lead: NewAppointmentLead = {
    full_name: data.fullName,
    whatsapp: data.whatsapp,
    email: data.email || null,
    treatment_interest: data.treatmentInterest || null,
    preferred_date: data.preferredDate || null,
    preferred_period: data.preferredPeriod || null,
    main_complaint: data.mainComplaint || null,
    source: data.source || null,
    lgpd_consent: data.lgpdConsent,
    lgpd_consent_at: consentAt,
    privacy_policy_version: PRIVACY_POLICY_VERSION,
    health_consent: data.healthConsent === true,
    gclid: clickId,
    utm_source: attr?.utmSource || null,
    utm_medium: attr?.utmMedium || null,
    utm_campaign: attr?.utmCampaign || null,
    utm_term: attr?.utmTerm || null,
    utm_content: attr?.utmContent || null,
    landing_page: attr?.landingPage || null,
    referrer: attr?.referrer || null,
    status: "new",
  };

  // 5) Persistir no Supabase (quando configurado).
  let persisted = false;
  if (isSupabaseConfigured()) {
    try {
      const supabase = getServerSupabase();
      if (supabase) {
        let { error } = await supabase
          .from("appointment_leads")
          .insert(lead)
          .abortSignal(AbortSignal.timeout(EXTERNAL_TIMEOUT_MS));
        // Banco ainda sem a coluna health_consent (migração pendente): grava sem ela, para não
        // perder o lead. A coluna é criada por supabase/schema.sql.
        if (error && (error.code === "PGRST204" || error.code === "42703")) {
          const { health_consent: _semColuna, ...semSaude } = lead;
          void _semColuna;
          ({ error } = await supabase
            .from("appointment_leads")
            .insert(semSaude)
            .abortSignal(AbortSignal.timeout(EXTERNAL_TIMEOUT_MS)));
        }
        // Só o código do erro: a mensagem do Postgres pode citar valores do lead.
        if (error) console.error("[leads] supabase insert error:", error.code ?? "unknown");
        else persisted = true;
      }
    } catch (err) {
      console.error(
        "[leads] supabase unexpected error:",
        err instanceof Error ? err.name : "unknown",
      );
    }
  }

  // Espera o e-mail terminar (já disparou em paralelo).
  const emailResult = await emailSettled;
  const emailed = "ok" in emailResult && emailResult.ok === true;

  // E-mail lento (passou do prazo), mas ainda em andamento: a função continua viva até ele terminar
  // (after) e a resposta não vira 503, que faria o paciente reenviar o mesmo lead.
  if (!emailed && emailResult.reason === "timeout") {
    try {
      after(() =>
        emailPromise.then(
          () => undefined,
          () => undefined,
        ),
      );
    } catch {
      /* fora do ciclo de uma requisição do Next (testes): a promessa segue sozinha */
    }
    if (!persisted) return reply({ ok: true, persisted, emailed: "pending" });
  }

  // Nem gravado nem enviado: o lead se perderia. Erro explícito para o formulário
  // oferecer o atalho de WhatsApp em vez de mostrar um falso sucesso.
  if (!persisted && !emailed) {
    console.error("[leads] lead não entregue (sem banco e sem e-mail)");
    return reply({ ok: false, error: "delivery_failed" }, 503);
  }

  return reply({ ok: true, persisted, emailed });
}
