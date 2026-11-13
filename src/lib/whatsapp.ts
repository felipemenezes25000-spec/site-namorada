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
  default: "Olá, Dra. Ana! Vim pelo site e gostaria de agendar uma consulta odontológica.",

  /** Dúvida sobre um tratamento (botões "Tirar dúvidas" das páginas de tratamento). */
  treatment: (treatment: string) =>
    `Olá, Dra. Ana! Vim pelo site e gostaria de saber mais sobre ${treatment}.`,

  /** Agendar a avaliação de um tratamento (abertura, fecho, barra e cabeçalho da página do tratamento). */
  treatmentBooking: (treatment: string) =>
    `Olá, Dra. Ana! Vim pelo site e gostaria de agendar uma avaliação para ${treatment}.`,

  /**
   * Situação escolhida em "O que traz você aqui hoje?" (sem mensagem própria).
   * As demais situações reaproveitam as mensagens acima (ver src/lib/situations.ts).
   */
  situation: (label: string) =>
    `Olá, Dra. Ana! Vim pelo site e gostaria de conversar sobre uma situação: ${label}`,

  /** Mensagem gerada após o envio do formulário de agendamento. */
  fromForm: (name: string, treatment: string) =>
    `Olá, Dra. Ana! Vim pelo site e gostaria de agendar uma consulta odontológica. Meu nome é ${name} e tenho interesse em ${treatment}.`,

  /** Depois do envio do formulário, sem os dados (cabeçalho, barra e menu de /obrigado). */
  afterForm:
    "Olá, Dra. Ana! Acabei de enviar o formulário de agendamento pelo site e gostaria de continuar a conversa por aqui.",

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
  fear: "Olá, Dra. Ana! Tenho um pouco de receio de ir ao dentista e gostaria de conversar antes de marcar uma consulta.",

  /** Clareamento dental específico. */
  whitening:
    "Olá, Dra. Ana! Tenho interesse em clareamento dental e gostaria de saber como funciona a avaliação.",

  /** Localização / como chegar. */
  location: "Olá, Dra. Ana! Vim pelo site e gostaria de confirmar o endereço do consultório.",
} as const;

/* ------------------------- intenção do botão ------------------------- */

/**
 * O que o botão de WhatsApp propõe. O rótulo visível e a mensagem pré-preenchida vêm da mesma
 * intenção, para nunca haver "Tirar dúvidas" que abre "gostaria de agendar" (ux-conversao-201):
 *  - agendar   -> "Agendar pelo WhatsApp" + mensagem que pede para agendar;
 *  - duvidas   -> "Tirar dúvidas no WhatsApp" + mensagem de dúvida, conversa ou endereço;
 *  - urgencia  -> "Falar agora pelo WhatsApp" + mensagem de urgência;
 *  - continuar -> "Continuar no WhatsApp", só depois do envio do formulário.
 */
export type WaIntent = "agendar" | "duvidas" | "urgencia" | "continuar";

/** Mensagem padrão de cada intenção (quando o botão não traz uma mensagem própria). */
export const waMessageForIntent: Readonly<Record<WaIntent, string>> = {
  agendar: waMessages.default,
  duvidas: waMessages.questions,
  urgencia: waMessages.urgency,
  continuar: waMessages.afterForm,
};

/** Deduz a intenção pela mensagem: pedir para agendar, urgência ou, no resto, conversa e dúvida. */
export function waIntentForMessage(message: string): WaIntent {
  if (message === waMessages.urgency) return "urgencia";
  if (message === waMessages.afterForm) return "continuar";
  if (/gostaria de agendar/i.test(message)) return "agendar";
  return "duvidas";
}

/* ------------------------- mensagem conforme a rota ------------------------- */

/** Contexto da rota para os botões fixos (barra, cabeçalho, menu). */
export interface WaRouteContext {
  /** Tipo de página, para medição e testes. */
  kind: "urgency" | "fear" | "firstVisit" | "treatment" | "questions" | "afterForm" | "default";
  /** Intenção dos botões fixos nesta rota (define o rótulo). */
  intent: WaIntent;
  /** Mensagem pré-preenchida do wa.me. */
  message: string;
  /** Slug do tratamento quando a rota é /tratamentos/[slug] com slug conhecido. */
  treatmentSlug?: string;
}

/**
 * Mapa rota -> intenção e mensagem do WhatsApp. Sem importar o catálogo de tratamentos (que é
 * grande e não deve entrar no pacote do cliente): quem chama passa `treatmentNames`
 * (slug -> nome visível), montado no servidor em site-shell.tsx.
 *  - /urgencia-odontologica -> urgência ("Falar agora pelo WhatsApp");
 *  - /medo-de-dentista -> dúvida com a mensagem de receio;
 *  - /valores e /contato -> dúvida (waMessages.questions);
 *  - /primeira-consulta -> agendar a primeira consulta;
 *  - /tratamentos/<slug conhecido> -> agendar a avaliação daquele tratamento;
 *  - /obrigado -> continuar a conversa depois do formulário;
 *  - qualquer outra -> agendar (waMessages.default).
 */
export function waContextForPath(
  pathname: string | null | undefined,
  treatmentNames: Readonly<Record<string, string>> = {},
): WaRouteContext {
  const path = (pathname ?? "/").split(/[?#]/)[0].replace(/\/+$/, "") || "/";
  if (path === "/urgencia-odontologica")
    return { kind: "urgency", intent: "urgencia", message: waMessages.urgency };
  if (path === "/medo-de-dentista")
    return { kind: "fear", intent: "duvidas", message: waMessages.fear };
  if (path === "/valores" || path === "/contato")
    return { kind: "questions", intent: "duvidas", message: waMessages.questions };
  if (path === "/primeira-consulta")
    return { kind: "firstVisit", intent: "agendar", message: waMessages.firstVisit };
  if (path === "/obrigado")
    return { kind: "afterForm", intent: "continuar", message: waMessages.afterForm };
  const m = /^\/tratamentos\/([^/]+)$/.exec(path);
  if (m && Object.prototype.hasOwnProperty.call(treatmentNames, m[1])) {
    const nome = treatmentNames[m[1]];
    return {
      kind: "treatment",
      intent: "agendar",
      message: waMessages.treatmentBooking(nome.charAt(0).toLowerCase() + nome.slice(1)),
      treatmentSlug: m[1],
    };
  }
  return { kind: "default", intent: "agendar", message: waMessages.default };
}
