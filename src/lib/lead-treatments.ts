import { treatments, getTreatment } from "@/lib/treatments";
import { TREATMENT_UNSURE } from "@/lib/lead-options";

/**
 * Lista de tratamentos aceitos no formulário e na API, derivada de treatments.ts (única fonte).
 * Só o servidor importa este arquivo: a página entrega a lista ao formulário por props, para o
 * navegador não carregar o conteúdo inteiro dos tratamentos.
 */
export const treatmentOptions: string[] = [
  "Avaliação odontológica",
  ...treatments.filter((t) => t.slug !== "avaliacao-odontologica").map((t) => t.name),
  TREATMENT_UNSURE,
];

/** Nome da opção do formulário para um slug de tratamento; undefined se o slug não existe. */
export function treatmentNameFromSlug(slug: string | undefined): string | undefined {
  if (!slug) return undefined;
  const name = getTreatment(slug)?.name;
  return name && treatmentOptions.includes(name) ? name : undefined;
}
