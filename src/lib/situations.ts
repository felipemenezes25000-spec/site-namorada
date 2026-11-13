import { careNeeds } from "./content";
import { waMessages } from "./whatsapp";

/**
 * Situações de "O que traz você aqui hoje?" (DESIGN.md 4.5).
 * Sem frase nova de conteúdo: rótulo, resposta e chamada vêm de `careNeeds`
 * (content.ts); só o item "receio" usa frases já existentes da página
 * /medo-de-dentista. Os dados são primitivos para passar a componentes cliente.
 */
export interface Situation {
  /** Identificador neutro (tempo, dor, sorriso, siso, prevenir, urgencia, receio): é o valor de `need` nos eventos. */
  id: string;
  /** Rótulo na lista. O evento de medição leva `id` (neutro) em `need`, nunca este rótulo. */
  label: string;
  /** Resposta curta, mostrada no painel. */
  answer: string;
  /** Página mais útil para aquele momento. */
  href: string;
  /** Texto do link para `href`. */
  cta: string;
  /** Slugs de tratamento indicados, na ordem. */
  treatments: string[];
  /** Mensagem pré-preenchida do WhatsApp para a situação. */
  waMessage: string;
}

const byTitle = (title: string) => {
  const found = careNeeds.find((n) => n.title === title);
  if (!found) throw new Error(`Situação sem texto em content.ts: ${title}`);
  return found;
};

function fromCare(id: string, title: string, treatments: string[], waMessage: string): Situation {
  const n = byTitle(title);
  return {
    id,
    label: n.title,
    answer: n.description,
    href: n.href,
    cta: n.cta,
    treatments,
    waMessage,
  };
}

export const situations: Situation[] = [
  fromCare(
    "tempo",
    "Faz tempo desde a última consulta",
    ["avaliacao-odontologica", "limpeza-dental", "prevencao"],
    waMessages.firstVisit,
  ),
  fromCare(
    "dor",
    "Sente dor, sensibilidade ou incômodo? Sua gengiva sangra?",
    ["avaliacao-odontologica", "restauracoes", "limpeza-dental"],
    waMessages.situation("sinto dor, sensibilidade ou incômodo, ou minha gengiva sangra."),
  ),
  fromCare(
    "sorriso",
    "Quer um sorriso mais bonito",
    ["clareamento-dental", "restauracoes", "avaliacao-odontologica"],
    waMessages.whitening,
  ),
  fromCare(
    "siso",
    "Precisa avaliar os sisos ou cirurgia oral",
    ["cirurgia-oral", "avaliacao-odontologica"],
    waMessages.treatment("cirurgia oral"),
  ),
  fromCare(
    "prevenir",
    "Quer manter a saúde bucal em dia",
    ["prevencao", "limpeza-dental", "avaliacao-odontologica"],
    waMessages.treatment("prevenção"),
  ),
  fromCare(
    "urgencia",
    "Teve uma urgência odontológica",
    ["avaliacao-odontologica"],
    waMessages.urgency,
  ),
  {
    id: "receio",
    label: "Tenho receio de dentista",
    // Frases já existentes na página /medo-de-dentista.
    answer:
      "Escuta sem julgamento, antes de qualquer procedimento. O ritmo é respeitado, nada é feito com pressa, e você pode pedir uma pausa ou combinar um sinal a qualquer momento.",
    href: "/medo-de-dentista",
    cta: "Ler sobre o atendimento a quem tem receio",
    treatments: ["avaliacao-odontologica", "limpeza-dental"],
    waMessage: waMessages.fear,
  },
];

export function getSituation(id: string | null | undefined): Situation | undefined {
  return id ? situations.find((s) => s.id === id) : undefined;
}
