/**
 * Captura de atribuição de campanha (gclid/UTM) — primeira parte do funil
 * de "conversão offline" do Google Ads: o gclid guardado aqui é enviado junto
 * com o lead e permite, no futuro, importar de volta ao Google Ads quais
 * leads viraram consulta de verdade (otimização por paciente, não por clique).
 *
 * Dados ficam apenas em sessionStorage (primeira parte, expiram ao fechar a
 * aba) e só são transmitidos quando o paciente envia o formulário — que exige
 * o aceite LGPD explícito.
 */

const STORAGE_KEY = "abl_attribution";

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

/** Lê a URL atual e persiste parâmetros de campanha. Chamar uma vez por carga. */
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
    // Novos parâmetros de campanha sobrescrevem a sessão (último clique);
    // sem novos parâmetros, preserva o que já foi capturado.
    if (Object.keys(found).length === 0 && existing) return;

    const data: Attribution = {
      ...(Object.keys(found).length ? found : existing ?? {}),
      landingPage: (existing?.landingPage ?? window.location.pathname + window.location.search).slice(0, 300),
      referrer: (existing?.referrer ?? document.referrer ?? "").slice(0, 300) || undefined,
    };
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* atribuição nunca deve quebrar a navegação */
  }
}

/** Atribuição capturada na sessão atual (ou null). */
export function getAttribution(): Attribution | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Attribution) : null;
  } catch {
    return null;
  }
}
