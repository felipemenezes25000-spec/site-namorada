/**
 * Camada de rastreamento leve e à prova de falhas.
 * Dispara eventos para GA4 (gtag), Meta Pixel (fbq) e dataLayer (GTM)
 * SOMENTE se as tags estiverem carregadas. Nunca quebra o site.
 */

type EventParams = Record<string, string | number | boolean | undefined>;

/**
 * ID do contêiner GTM (formato validado). Fica aqui, e não no componente, para o envio de eventos
 * e o carregamento das tags decidirem pelo MESMO valor: com GTM, os eventos vão só ao dataLayer
 * (o GA4 e o Ads são configurados DENTRO do contêiner); sem GTM, só ao gtag. Nunca os dois caminhos,
 * que contariam cada evento duas vezes.
 */
export const GTM_ID = (() => {
  const v = process.env.NEXT_PUBLIC_GTM_ID?.trim();
  return v && /^GTM-[A-Z0-9]{4,12}$/.test(v) ? v : undefined;
})();

/**
 * Conjunto FECHADO de chaves permitidas: onde o evento ocorreu, o alvo, o
 * tratamento (nome do procedimento) e a necessidade escolhida. Sem assinatura
 * de índice: o TypeScript recusa chaves como `full_name` ou `email`.
 * NUNCA dado pessoal. `sanitizeParams` segue como última barreira em execução.
 */
interface BaseParams {
  location?: string;
  target?: string;
  treatment?: string;
  /** Identificador NEUTRO da necessidade (tempo, dor, sorriso, siso, prevenir, urgencia, receio); nunca o rótulo da situação. */
  need?: string;
  href?: string;
}

/**
 * Mapa tipado de eventos -> parâmetros esperados. Acréscimo ao contrato:
 * nenhum nome de evento mudou. `situation_select` (necessidade escolhida no
 * seletor da home) é evento novo e precisa ser registrado no GA4/Ads como
 * evento de interesse, não de conversão. Conversão é só `lead_created` (importar como conversão
 * no GA4 e no Ads; os demais eventos são de interesse).
 */
export interface TrackEventMap {
  whatsapp_click: BaseParams;
  appointment_form_submit: BaseParams;
  treatment_card_click: BaseParams;
  map_click: BaseParams;
  instagram_click: BaseParams;
  phone_click: BaseParams;
  /** Clique em link mailto: (rodapé, contato). Canal medido; o endereço nunca vai no evento. */
  email_click: BaseParams;
  lead_created: BaseParams;
  care_need_click: BaseParams;
  situation_select: BaseParams;
  cta_click: BaseParams;
  form_start: BaseParams;
  scheduling_intent: BaseParams;
}

export type TrackEvent = keyof TrackEventMap;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    dataLayer?: Record<string, unknown>[];
  }
}

/** Chaves que nunca devem chegar a uma ferramenta de medição. */
const PII_KEY =
  /^(full_?name|first_?name|last_?name|nome|e_?mail|email|phone|telefone|tel|whats_?app|cpf|complaint|queixa|message|mensagem)$/i;
const PII_VALUE = /[^\s@]+@[^\s@]+\.[^\s@]+|\d[\d\s().-]{8,}\d/;

/** Remove dado pessoal por chave e por formato (e-mail, telefone). Última barreira. */
export function sanitizeParams(params: EventParams): EventParams {
  const out: EventParams = {};
  for (const [key, value] of Object.entries(params)) {
    if (PII_KEY.test(key)) continue;
    if (typeof value === "string" && PII_VALUE.test(value)) continue;
    out[key] = typeof value === "string" ? value.slice(0, 100) : value;
  }
  return out;
}

/** Parâmetros que NÃO vão ao Meta Pixel: indicam necessidade de saúde do visitante (mesmo neutros). */
const PIXEL_BLOCKED = new Set(["need"]);

function pixelParams(params: EventParams): EventParams {
  const out: EventParams = {};
  for (const [k, v] of Object.entries(params)) if (!PIXEL_BLOCKED.has(k)) out[k] = v;
  return out;
}

export function track<E extends TrackEvent>(
  event: E,
  rawParams: TrackEventMap[E] = {} as TrackEventMap[E],
): void {
  if (typeof window === "undefined") return;
  try {
    const params = sanitizeParams(rawParams as EventParams);
    // Um caminho por modo: com GTM só o dataLayer ({ event, ... }); sem GTM só o gtag.
    if (GTM_ID) {
      window.dataLayer?.push({ event, ...params });
    } else {
      window.gtag?.("event", event, params);
    }
    // Mapeia eventos-chave para eventos padrão do Meta Pixel (sem `need`).
    if (window.fbq) {
      const px = pixelParams(params);
      if (event === "lead_created") {
        window.fbq("track", "Lead", px);
      } else if (event === "scheduling_intent") {
        window.fbq("track", "InitiateCheckout", px);
      } else if (event === "whatsapp_click") {
        window.fbq("track", "Contact", px);
      } else {
        window.fbq("trackCustom", event, px);
      }
    }
  } catch {
    /* rastreamento nunca deve interromper a navegação */
  }
}
