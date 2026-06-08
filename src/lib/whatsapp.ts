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
