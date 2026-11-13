/**
 * Captura de atribuição de campanha (gclid/UTM) — primeira parte do funil
 * de "conversão offline" do Google Ads: o gclid guardado aqui é enviado junto
 * com o lead e permite, no futuro, importar de volta ao Google Ads quais
 * leads viraram consulta de verdade (otimização por paciente, não por clique).
 *
 * Persistência:
 *  - Sem aceite de cookies: somente sessionStorage (expira ao fechar a aba).
 *  - Com aceite: também localStorage, por 90 dias (cobre quem volta outro dia
 *    para agendar). Ao recusar ou revogar, a cópia persistente é apagada.
 * Os dados só saem do aparelho quando o paciente envia o formulário, que exige
 * o aceite LGPD explícito.
 */

import { getConsent } from "@/components/seo/cookie-consent";

const STORAGE_KEY = "abl_attribution";
const PERSIST_DAYS = 90;

type Stored = Attribution & { savedAt?: number };

export interface Attribution {
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  landingPage?: string;
  referrer?: string;
}

const PARAM_MAP: Record<string, keyof Attribution> = {
  gclid: "gclid",
  gbraid: "gbraid",
  wbraid: "wbraid",
  utm_source: "utmSource",
  utm_medium: "utmMedium",
  utm_campaign: "utmCampaign",
  utm_term: "utmTerm",
  utm_content: "utmContent",
};

function readSession(): Attribution | null {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Attribution) : null;
  } catch {
    return null;
  }
}

function readPersisted(): Attribution | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const { savedAt, ...data } = JSON.parse(raw) as Stored;
    if (!savedAt || Date.now() - savedAt > PERSIST_DAYS * 86_400_000) {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

function writePersisted(data: Attribution): void {
  try {
    const value: Stored = { ...data, savedAt: Date.now() };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    /* armazenamento indisponível: segue só com a sessão */
  }
}

function clearPersisted(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* nada a fazer */
  }
}

/** Atribuição capturada (sessão atual ou, com aceite de cookies, visita anterior). */
export function getAttribution(): Attribution | null {
  if (typeof window === "undefined") return null;
  const session = readSession();
  if (session) return session;
  if (!consented()) {
    clearPersisted();
    return null;
  }
  return readPersisted();
}

/** Lê a URL atual e guarda parâmetros de campanha. Chamar uma vez por carga. */
export function captureAttribution(): void {
  if (typeof window === "undefined") return;
  try {
    const params = new URLSearchParams(window.location.search);
    const found: Attribution = {};
    for (const [param, key] of Object.entries(PARAM_MAP)) {
      const v = params.get(param);
      if (v) found[key] = v.slice(0, 200);
    }

    const existing = getAttribution();
    // Novos parâmetros de campanha sobrescrevem o anterior (último clique);
    // sem novos parâmetros, preserva o que já foi capturado.
    if (Object.keys(found).length === 0 && existing) {
      if (!readSession()) window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
      return;
    }

    const data: Attribution = {
      ...(Object.keys(found).length ? found : existing ?? {}),
      landingPage: (existing?.landingPage ?? window.location.pathname + window.location.search).slice(0, 300),
      referrer: (existing?.referrer ?? document.referrer ?? "").slice(0, 300) || undefined,
    };
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    if (consented()) writePersisted(data);
  } catch {
    /* atribuição nunca deve quebrar a navegação */
  }
}

/** Chamar quando a decisão de cookies muda: aceite persiste a sessão; recusa apaga a cópia persistente. */
export function syncAttributionConsent(accepted: boolean): void {
  if (typeof window === "undefined") return;
  if (!accepted) {
    clearPersisted();
    return;
  }
  const session = readSession();
  if (session && Object.keys(session).length) writePersisted(session);
}

/** Aceite de cookies, tolerante a armazenamento bloqueado. */
function consented(): boolean {
  try {
    return getConsent() === "accepted";
  } catch {
    return false;
  }
}
