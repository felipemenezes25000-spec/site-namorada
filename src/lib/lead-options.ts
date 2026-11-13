/**
 * Opções do formulário de agendamento que não dependem do conteúdo dos tratamentos.
 * Arquivo leve de propósito: o navegador importa daqui sem carregar zod nem treatments.ts.
 */
export const periods = ["Manhã", "Tarde", "Noite", "Tanto faz"] as const;

export const sources = [
  "Instagram",
  "Google",
  "Indicação de amigo ou familiar",
  "Já sou paciente",
  "Anúncio",
  "Outro",
] as const;

/** Opção de quem ainda não sabe o que precisa. */
export const TREATMENT_UNSURE = "Ainda não tenho certeza";
