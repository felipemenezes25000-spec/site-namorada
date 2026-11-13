import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

/** E-mail de destino para notificações de lead. */
const NOTIFY_EMAIL = process.env.LEAD_NOTIFY_EMAIL || "draanabeatrizodontologia@gmail.com";

/** Remetente — usar domínio verificado no Resend quando disponível. */
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "Site Dra. Ana <onboarding@resend.dev>";

export function isEmailConfigured(): boolean {
  return Boolean(resend);
}

export interface LeadEmailData {
  fullName: string;
  whatsapp: string;
  email?: string | null;
  treatmentInterest: string;
  preferredPeriod?: string | null;
  preferredDate?: string | null;
  hasXray?: string | null;
  mainComplaint?: string | null;
  source?: string | null;
  /** Atribuição de campanha — presente quando o lead veio de anúncio. */
  gclid?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  landingPage?: string | null;
  /**
   * Registro do consentimento (LGPD), o mesmo que vai ao banco quando ele está ativo. Sem banco,
   * o e-mail é o registro: a Política de Privacidade promete data, hora e versão do texto aceito.
   */
  consentAt: string;
  privacyPolicyVersion: string;
  /** Consentimento para dado de saúde (queixa ou exame): "sim", ou "não se aplica" sem esses dados. */
  healthConsent: "sim" | "nao" | "nao_se_aplica";
}

/** Uma linha só: quebra de linha no assunto abriria cabeçalho novo no e-mail. */
const oneLine = (v: string) => v.replace(/[\p{Cc}\p{Zl}\p{Zp}]+/gu, " ").trim();

/** Escapa HTML — os valores vêm do formulário e de parâmetros de URL (UTM). */
export const escapeHtml = (v: string) =>
  v
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const TD_LABEL = "padding:8px 12px;font-weight:600;color:#1a3c2a;border-bottom:1px solid #eee";
const TD_VALUE = "padding:8px 12px;border-bottom:1px solid #eee";

/** Uma linha da tabela. O valor SEMPRE passa pelo escape (o HTML só entra por `link`). */
function row(label: string, value: string, opts: { link?: string; small?: boolean } = {}) {
  const v = escapeHtml(value);
  const conteudo = opts.link
    ? `<a href="${escapeHtml(opts.link)}" style="color:#25D366">${v}</a>`
    : v;
  const estilo = opts.small ? `${TD_VALUE};font-size:11px;word-break:break-all` : TD_VALUE;
  return `<tr><td style="${TD_LABEL}">${escapeHtml(label)}</td><td style="${estilo}">${conteudo}</td></tr>`;
}

/** "2026-11-13T14:05:09.123Z" -> "13/11/2026 11:05 (horário de Brasília)". */
function dataHoraBrasilia(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const f = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${f.format(d).replace(",", "")} (horário de Brasília)`;
}

const SAUDE: Record<LeadEmailData["healthConsent"], string> = {
  sim: "sim",
  nao: "não",
  nao_se_aplica: "não se aplica (sem queixa nem exame informados)",
};

/** Monta assunto e corpo do aviso (função pura, testada em email.test.ts). */
export function buildLeadEmail(data: LeadEmailData): { subject: string; html: string } {
  const whatsappNumber = data.whatsapp.replace(/\D/g, "");
  const pares: [string, string, Parameters<typeof row>[2]?][] = [
    ["Nome", data.fullName],
    ["WhatsApp", data.whatsapp, { link: `https://wa.me/55${whatsappNumber}` }],
  ];
  if (data.email) pares.push(["E-mail", data.email]);
  pares.push(["Tratamento", data.treatmentInterest]);
  if (data.preferredPeriod) pares.push(["Período", data.preferredPeriod]);
  if (data.preferredDate) pares.push(["Melhor dia", data.preferredDate]);
  if (data.hasXray) pares.push(["Exame radiográfico", data.hasXray === "sim" ? "Sim" : "Não"]);
  if (data.mainComplaint) pares.push(["Queixa", data.mainComplaint]);
  if (data.source) pares.push(["Como conheceu", data.source]);

  // Origem de campanha — mostra de qual anúncio/campanha o lead veio.
  const origem: string[] = [];
  if (data.gclid) origem.push("Google Ads");
  if (data.utmSource)
    origem.push(`${data.utmSource}${data.utmMedium ? ` / ${data.utmMedium}` : ""}`);
  if (data.utmCampaign) origem.push(`campanha: ${data.utmCampaign}`);
  if (origem.length) pares.push(["Origem (anúncio)", origem.join(" · ")]);
  if (data.landingPage) pares.push(["Página de entrada", data.landingPage]);
  if (data.gclid) pares.push(["ID do clique (gclid)", data.gclid, { small: true }]);

  // Registro do consentimento (Política de Privacidade, seções 2 e 10).
  pares.push([
    "Consentimento (LGPD)",
    `sim, em ${dataHoraBrasilia(data.consentAt)}; Política de Privacidade versão ${data.privacyPolicyVersion}`,
  ]);
  pares.push(["Consentimento para dado de saúde", SAUDE[data.healthConsent]]);

  const primeiroNome = data.fullName.trim().split(/\s+/)[0] ?? "";
  const waLink = `https://wa.me/55${whatsappNumber}?text=${encodeURIComponent(
    `Olá, ${primeiroNome}! Recebi sua solicitação pelo site e gostaria de confirmar seu agendamento.`,
  )}`;

  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:560px;margin:0 auto;color:#333">
      <div style="background:#1a3c2a;padding:24px 20px;border-radius:12px 12px 0 0">
        <h1 style="color:#fff;font-size:18px;margin:0">Novo lead pelo site</h1>
        <p style="color:#c9a96e;font-size:14px;margin:6px 0 0">Alguém preencheu o formulário de agendamento</p>
      </div>
      <div style="background:#fff;padding:20px;border:1px solid #eee;border-top:none">
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          ${pares.map(([l, v, o]) => row(l, v, o)).join("\n")}
        </table>
        <div style="margin-top:20px;text-align:center">
          <a href="${escapeHtml(waLink)}" style="display:inline-block;background:#25D366;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">
            Responder no WhatsApp
          </a>
        </div>
      </div>
      <div style="padding:16px 20px;text-align:center;font-size:12px;color:#999;border-radius:0 0 12px 12px;background:#f9f9f9;border:1px solid #eee;border-top:none">
        Enviado automaticamente pelo site draanabeatrizodonto.com.br. Guarde este e-mail: ele é o registro do consentimento do paciente.
      </div>
    </div>
  `;

  return {
    subject: `Novo lead: ${oneLine(data.fullName)} — ${oneLine(data.treatmentInterest)}`,
    html,
  };
}

export async function sendLeadNotification(data: LeadEmailData) {
  if (!resend) return { ok: false, reason: "not_configured" };
  const { subject, html } = buildLeadEmail(data);
  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: NOTIFY_EMAIL,
      subject,
      html,
    });
    if (error) {
      // Sem a mensagem completa: pode repetir dados do destinatário/conteúdo.
      console.error("[email] resend error:", error.name);
      return { ok: false, reason: error.name };
    }
    return { ok: true };
  } catch (err) {
    console.error("[email] unexpected error:", err instanceof Error ? err.name : "unknown");
    return { ok: false, reason: "send_failed" };
  }
}
