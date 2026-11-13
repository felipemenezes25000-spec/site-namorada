/**
 * Envio do formulário de agendamento, separado da tela (appointment-form.tsx) e testado em
 * use-lead-submit.test.ts: chama POST /api/leads com tempo limite e transforma a resposta num
 * resultado que a tela sabe mostrar. Nenhuma regra visual aqui.
 */
import type { LeadsResponse } from "@/types/lead";

/** Tempo máximo de espera pela API: depois disso o botão volta e a pessoa vê o aviso de conexão. */
export const LEAD_TIMEOUT_MS = 20_000;

/** Campos que aparecem no resumo de erros, na ordem em que estão na tela. */
export const SUMMARY_FIELDS = [
  "fullName",
  "whatsapp",
  "treatmentInterest",
  "email",
  "preferredDate",
  "mainComplaint",
  "healthConsent",
  "lgpdConsent",
] as const;

/** Campos do bloco "conte mais": se um deles falhar, o bloco abre sozinho. */
export const OPTIONAL_FIELDS: readonly string[] = [
  "email",
  "preferredPeriod",
  "preferredDate",
  "hasXray",
  "mainComplaint",
  "healthConsent",
  "source",
];

/** Só estes campos têm onde mostrar uma mensagem de erro do servidor (campo + resumo). */
const SERVER_FIELDS: readonly string[] = SUMMARY_FIELDS;

export type Aviso =
  | { kind: "limite"; minutos?: number }
  | { kind: "servidor" }
  /** `talvezEnviado`: a resposta não chegou no tempo; o lead pode ter sido gravado. */
  | { kind: "rede"; talvezEnviado?: boolean };

export const avisoTexto: Record<Aviso["kind"], { titulo: string; texto: string }> = {
  limite: {
    titulo: "Muitas tentativas em pouco tempo.",
    texto: "Para não esperar, continue pelo WhatsApp.",
  },
  servidor: {
    titulo: "Não conseguimos enviar agora.",
    texto:
      "Seus dados continuam no formulário: tente de novo daqui a pouco ou continue pelo WhatsApp.",
  },
  rede: {
    titulo: "Parece que a conexão caiu.",
    texto:
      "Confira a internet e tente de novo. Seus dados continuam no formulário. Se preferir, continue pelo WhatsApp.",
  },
};

/** Texto extra quando a resposta demorou demais (o envio pode ter chegado). */
export const TEXTO_TALVEZ_ENVIADO =
  "O envio pode ter chegado: para não repetir, o WhatsApp é a alternativa mais segura.";

export type ResultadoEnvio =
  | { tipo: "sucesso"; trap: boolean }
  | { tipo: "validacao"; erros: { campo: string; mensagem: string }[]; abrirOpcionais: boolean }
  | { tipo: "aviso"; aviso: Aviso };

/** Máscara do WhatsApp: (00) 00000-0000, enquanto a pessoa digita. */
export function maskPhone(value: string): string {
  const d = value.replace(/\D/g, "").slice(0, 11);
  const len = d.length;
  if (len === 0) return "";
  if (len < 3) return `(${d}`;
  if (len < 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (len < 11) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

/** Hoje no relógio do aparelho (AAAA-MM-DD), para o `min` do campo de data. Sem fuso, sem UTC. */
export function todayLocal(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Identificador do envio, repetido nas novas tentativas: a API descarta a repetição (sem lead duplicado). */
export function novoSubmissionId(): string {
  try {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function")
      return crypto.randomUUID();
  } catch {
    /* sem crypto.randomUUID (navegador antigo ou página sem HTTPS) */
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

/**
 * Envia o lead e interpreta a resposta:
 *  - 200 -> sucesso (`trap` quando a API descartou um envio automático; `duplicate` conta como sucesso);
 *  - 422 -> erros por campo (os que não têm lugar na tela viram um erro genérico no nome);
 *  - 429 -> aviso de limite, com os minutos de espera;
 *  - 403, 413, 5xx e qualquer outro -> aviso genérico do servidor;
 *  - rede fora -> aviso de conexão; tempo esgotado -> o mesmo aviso, dizendo que o envio pode ter chegado.
 */
export async function enviarLead(
  corpo: Record<string, unknown>,
  opts: { fetchImpl?: typeof fetch; timeoutMs?: number } = {},
): Promise<ResultadoEnvio> {
  const doFetch = opts.fetchImpl ?? fetch;
  const timeoutMs = opts.timeoutMs ?? LEAD_TIMEOUT_MS;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  let res: Response;
  try {
    res = await doFetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(corpo),
      signal: controller.signal,
    });
  } catch {
    return { tipo: "aviso", aviso: { kind: "rede", talvezEnviado: controller.signal.aborted } };
  } finally {
    clearTimeout(timer);
  }

  if (res.status === 422) {
    const body = (await res.json().catch(() => null)) as LeadsResponse | null;
    const fieldErrors = body && !body.ok && body.error === "validation" ? body.fieldErrors : {};
    const erros = Object.entries(fieldErrors).flatMap(([campo, msgs]) =>
      msgs?.[0] && SERVER_FIELDS.includes(campo) ? [{ campo, mensagem: msgs[0] }] : [],
    );
    if (!erros.length) {
      erros.push({
        campo: "fullName",
        mensagem: "Alguns dados não foram aceitos. Revise as informações e tente de novo.",
      });
    }
    return {
      tipo: "validacao",
      erros,
      abrirOpcionais: Object.keys(fieldErrors).some((k) => OPTIONAL_FIELDS.includes(k)),
    };
  }

  if (res.status === 429) {
    const retry = Number(res.headers.get("Retry-After"));
    return {
      tipo: "aviso",
      aviso: {
        kind: "limite",
        minutos: retry > 0 ? Math.max(1, Math.ceil(retry / 60)) : undefined,
      },
    };
  }

  if (!res.ok) return { tipo: "aviso", aviso: { kind: "servidor" } };

  const okBody = (await res.json().catch(() => null)) as LeadsResponse | null;
  return { tipo: "sucesso", trap: Boolean(okBody?.ok && okBody.trap) };
}
