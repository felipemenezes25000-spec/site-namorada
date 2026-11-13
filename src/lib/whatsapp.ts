import { siteConfig } from "./site-config";

/**
 * Constrói um link wa.me com mensagem pré-preenchida.
 * Centraliza toda a lógica de WhatsApp do site para manter
 * as mensagens consistentes e fáceis de editar.
 */
export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${siteConfig.whatsapp}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

export const waMessages = {
  /** CTA padrão do site. */
  default:
    "Olá, Dra. Ana! Vim pelo site e gostaria de agendar uma consulta odontológica.",

  /** Mensagem contextual por tratamento. */
  treatment: (treatment: string) =>
    `Olá, Dra. Ana! Vim pelo site e gostaria de saber mais sobre ${treatment}.`,

  /**
   * Situação escolhida em "O que traz você aqui hoje?" (sem mensagem própria).
   * As demais situações reaproveitam as mensagens acima (ver src/lib/situations.ts).
   */
  situation: (label: string) =>
    `Olá, Dra. Ana! Vim pelo site e gostaria de conversar sobre uma situação: ${label}`,

  /** Mensagem gerada após o envio do formulário de agendamento. */
  fromForm: (name: string, treatment: string) =>
    `Olá, Dra. Ana! Vim pelo site e gostaria de agendar uma consulta odontológica. Meu nome é ${name} e tenho interesse em ${treatment}.`,

  /** Dúvidas gerais sobre atendimento. */
  questions:
    "Olá, Dra. Ana! Vim pelo site e gostaria de tirar algumas dúvidas sobre o atendimento.",

  /** Atendimento de urgência. */
  urgency:
    "Olá, Dra. Ana! Estou com uma urgência odontológica e gostaria de receber orientação e atendimento o quanto antes.",

  /** Primeira consulta / quem está há tempos sem ir ao dentista. */
  firstVisit:
    "Olá, Dra. Ana! Faz um tempo que não vou ao dentista e gostaria de agendar uma primeira consulta com tranquilidade.",

  /** Paciente com medo/ansiedade de dentista. */
  fear:
    "Olá, Dra. Ana! Tenho um pouco de receio de ir ao dentista e gostaria de conversar antes de marcar uma consulta.",

  /** Clareamento dental específico. */
  whitening:
    "Olá, Dra. Ana! Tenho interesse em clareamento dental e gostaria de saber como funciona a avaliação.",

  /** Localização / como chegar. */
  location:
    "Olá, Dra. Ana! Vim pelo site e gostaria de confirmar o endereço do consultório.",
} as const;

/* ------------------------- mensagem conforme a rota ------------------------- */

/** Contexto da rota para os botões fixos (barra, cabeçalho, menu). */
export interface WaRouteContext {
  /** Tipo de página, para medição e testes. */
  kind: "urgency" | "fear" | "firstVisit" | "treatment" | "default";
  /** Mensagem pré-preenchida do wa.me. */
  message: string;
  /** Slug do tratamento quando a rota é /tratamentos/[slug] com slug conhecido. */
  treatmentSlug?: string;
}

/**
 * Mapa rota -> mensagem do WhatsApp (B-06). Sem importar o catálogo de tratamentos (que é
 * grande e não deve entrar no pacote do cliente): quem chama passa `treatmentNames`
 * (slug -> nome visível), montado no servidor em site-shell.tsx.
 *  - /urgencia-odontologica -> waMessages.urgency
 *  - /medo-de-dentista -> waMessages.fear
 *  - /primeira-consulta -> waMessages.firstVisit
 *  - /tratamentos/<slug conhecido> -> waMessages.treatment(nome em minúsculas)
 *  - qualquer outra -> waMessages.default
 */
export function waContextForPath(
  pathname: string | null | undefined,
  treatmentNames: Readonly<Record<string, string>> = {},
): WaRouteContext {
  const path = (pathname ?? "/").split(/[?#]/)[0].replace(/\/+$/, "") || "/";
  if (path === "/urgencia-odontologica") return { kind: "urgency", message: waMessages.urgency };
  if (path === "/medo-de-dentista") return { kind: "fear", message: waMessages.fear };
  if (path === "/primeira-consulta") return { kind: "firstVisit", message: waMessages.firstVisit };
  const m = /^\/tratamentos\/([^/]+)$/.exec(path);
  if (m && Object.prototype.hasOwnProperty.call(treatmentNames, m[1])) {
    const nome = treatmentNames[m[1]];
    return {
      kind: "treatment",
      message: waMessages.treatment(nome.charAt(0).toLowerCase() + nome.slice(1)),
      treatmentSlug: m[1],
    };
  }
  return { kind: "default", message: waMessages.default };
}
