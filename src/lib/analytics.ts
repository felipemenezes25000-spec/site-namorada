/**
 * Camada de rastreamento leve e à prova de falhas.
 * Dispara eventos para GA4 (gtag), Meta Pixel (fbq) e dataLayer (GTM)
 * SOMENTE se as tags estiverem carregadas. Nunca quebra o site.
 */

type EventParams = Record<string, string | number | boolean | undefined>;

export type TrackEvent =
  | "whatsapp_click"
  | "appointment_form_submit"
  | "treatment_card_click"
  | "map_click"
  | "instagram_click"
  | "phone_click"
  | "lead_created"
  | "care_need_click"
  | "cta_click"
  | "form_start"
  | "scheduling_intent";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    dataLayer?: Record<string, unknown>[];
  }
}

export function track(event: TrackEvent, params: EventParams = {}): void {
  if (typeof window === "undefined") return;
  try {
    window.gtag?.("event", event, params);
    window.dataLayer?.push({ event, ...params });
    // Mapeia eventos-chave para eventos padrão do Meta Pixel.
    if (window.fbq) {
      if (event === "lead_created" || event === "appointment_form_submit") {
        window.fbq("track", "Lead", params);
      } else if (event === "scheduling_intent") {
        window.fbq("track", "InitiateCheckout", params);
      } else if (event === "whatsapp_click") {
        window.fbq("track", "Contact", params);
      } else {
        window.fbq("trackCustom", event, params);
      }
    }
  } catch {
    /* rastreamento nunca deve interromper a navegação */
  }
}
