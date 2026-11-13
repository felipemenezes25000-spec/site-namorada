/**
 * Textos compartilhados do site (DESIGN.md 6.5): só fatos que já constam no repositório,
 * sem texto-modelo entre colchetes, sem superlativos, sem promessa de resultado.
 * Os títulos de `careNeeds` e de `differentials` são chaves de busca de `situations.ts` e
 * de `hero-statement.tsx`: mudar um título exige mudar quem o procura.
 */

import { locale, localeTexto } from "./site-config";

/* --------------------------- datas e versões --------------------------- */

/**
 * Versão vigente da Política de Privacidade (ISO). É a ÚNICA fonte: a página exibe a data
 * por ela e `api/leads/route.ts` deve gravá-la em `privacy_policy_version` (ver retorno).
 */
export const PRIVACY_POLICY_VERSION = "2026-11-12";

/** Data de vigência dos Termos de Uso (ISO). */
export const TERMS_VERSION = "2026-11-12";

/**
 * Data da última atualização editorial do conteúdo do site (ISO). NÃO é data de revisão clínica.
 * Alimenta o `lastmod` do sitemap, o `dateModified` do JSON-LD e a data visível de
 * `<AuthorshipLine />`. Só mude quando o texto mudar de verdade.
 */
export const CONTENT_UPDATED = "2026-11-12";

const MESES = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

/** "2026-11-12" -> "12 de novembro de 2026" (sem depender de Intl/fuso). */
export function formatDatePtBR(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} de ${MESES[m - 1]} de ${y}`;
}

/* ------------------------- respostas canônicas ------------------------- */

/**
 * Uma só resposta para avaliação, orçamento, pagamento, duração, convênio e idade mínima.
 * Qualquer página que repita o assunto usa estes textos (são os mesmos de `homeFaqs`).
 */
export const respostas = {
  convenio: "Não. O atendimento é particular.",
  /** Resposta canônica sobre o custo da avaliação (sem divulgar valor). Use em TODA página que fale disso. */
  avaliacao: "A avaliação é uma consulta particular; o valor é informado pelo WhatsApp ao agendar.",
  /** O que a avaliação inclui (pergunta "O que inclui a avaliação?"); o custo vem de `avaliacao`. */
  avaliacaoInclui:
    "A avaliação é uma consulta completa, com exame clínico, diagnóstico e plano de cuidado.",
  orcamento:
    "Não. Cada caso precisa ser examinado antes. Depois da avaliação, a Dra. Ana apresenta o plano de tratamento e o orçamento, sem pressão para decidir na hora.",
  /** Única menção a pagamento no site (Código de Ética Odontológica, art. 44, I: sem modalidades em destaque). */
  pagamento: "As formas de pagamento são informadas no atendimento, pelo WhatsApp.",
  duracao:
    "De 40 a 60 minutos, em média. Esse tempo é para o exame, o diagnóstico e a conversa sobre o plano de cuidado, sem pressa.",
  idade: "Sim. O atendimento é para crianças a partir de 7 anos de idade.",
  orientacaoWhatsapp: "A orientação por WhatsApp não substitui o exame.",
} as const;

/* ------------------------------- dúvidas ------------------------------- */

/** Perguntas frequentes da home (as 8 primeiras ficam à vista; as outras em "Ver todas"). */
export const homeFaqs = [
  { q: "Quanto dura a primeira consulta?", a: respostas.duracao },
  { q: "O que inclui a avaliação?", a: `${respostas.avaliacaoInclui} ${respostas.avaliacao}` },
  { q: "É possível receber um orçamento antes da consulta?", a: respostas.orcamento },
  { q: "Quais são as formas de pagamento?", a: respostas.pagamento },
  { q: "A Dra. Ana atende convênios ou planos de saúde?", a: respostas.convenio },
  { q: "A Dra. Ana atende crianças?", a: respostas.idade },
  {
    q: "Preciso levar exames na primeira consulta?",
    a: "Se você tiver radiografias ou exames recentes, leve: ajudam no diagnóstico. Se não tiver, o que for necessário é pedido na própria consulta.",
  },
  {
    q: "A Dra. Ana realiza atendimentos de urgência?",
    a: `Sim, conforme a agenda. Escreva pelo WhatsApp contando o que você está sentindo, para receber orientação e agendar o quanto antes. ${respostas.orientacaoWhatsapp}`,
  },
  {
    q: "Quais são as áreas de atuação da Dra. Ana?",
    a: "Avaliação odontológica, limpeza dental, clareamento dental, restaurações, prevenção, cirurgia oral (incluindo extração de sisos), implante dentário e remoção de dentes inclusos e cirurgias na boca. Há também atendimento de urgência odontológica.",
  },
  {
    q: "Quando devo procurar atendimento de urgência?",
    a: `Em caso de dor intensa ou latejante, dente quebrado ou que saiu do lugar, sangramento que não para, inchaço no rosto ou na gengiva, siso inflamado ou restauração que caiu. Fale pelo WhatsApp. ${respostas.orientacaoWhatsapp}`,
  },
  {
    q: "A consulta tem retorno incluído?",
    a: "Os retornos de acompanhamento fazem parte do plano de tratamento. Depois da avaliação, a Dra. Ana explica quais retornos estão previstos para o seu caso.",
  },
  {
    q: "O clareamento dental causa sensibilidade?",
    a: "Pode haver uma sensibilidade leve e passageira. O protocolo é ajustado ao seu caso, pensando no seu conforto.",
  },
  {
    q: "A limpeza dental incomoda?",
    a: "A limpeza é feita com foco no conforto. Quando há sensibilidade, costuma ser leve e passar em poucas horas. Se precisar de uma pausa, é só avisar.",
  },
  {
    q: "Como é a extração de siso?",
    a: "O procedimento é feito com anestesia local. Depois, pode haver desconforto, que a Dra. Ana orienta a controlar com a medicação indicada.",
  },
  {
    q: "O consultório tem estacionamento?",
    a: `O consultório fica na ${locale.ruaNumero}, na ${locale.bairro}, ${localeTexto("regiaoZona")}, em uma travessa da Av. Edgar Facó. Para ver o trajeto, use o botão "Como chegar" do mapa. Se quiser saber sobre vaga para estacionar, pergunte ao agendar a sua avaliação.`,
  },
];

/* --------------------------- "O que traz você" --------------------------- */

/**
 * Situações do visitante (alimentam `situations.ts`). Cada item leva à página mais útil
 * para aquele momento. Sem promessa de resultado.
 */
export const careNeeds: { title: string; description: string; href: string; cta: string }[] = [
  {
    title: "Faz tempo desde a última consulta",
    description: "Retome os cuidados com calma e sem julgamentos, a partir de uma avaliação completa.",
    href: "/primeira-consulta",
    cta: "Como é a primeira consulta",
  },
  {
    title: "Sente dor, sensibilidade ou incômodo? Sua gengiva sangra?",
    description: "Vamos entender a causa juntos e combinar os próximos passos, com explicações claras.",
    href: "/urgencia-odontologica",
    cta: "Ver atendimento de urgência",
  },
  {
    title: "Quer um sorriso mais bonito",
    description: "Estética com saúde: clareamento e ajustes definidos depois de uma avaliação.",
    href: "/tratamentos/clareamento-dental",
    cta: "Conhecer o clareamento",
  },
  {
    title: "Precisa avaliar os sisos ou cirurgia oral",
    description: "Avaliação cuidadosa e orientação sobre a cirurgia oral, de acordo com a sua necessidade.",
    href: "/tratamentos/cirurgia-oral",
    cta: "Ver cirurgia oral",
  },
  {
    title: "Quer manter a saúde bucal em dia",
    description: "Acompanhamento preventivo e limpezas para cuidar antes que os problemas apareçam.",
    href: "/tratamentos/prevencao",
    cta: "Conhecer a prevenção",
  },
  {
    title: "Teve uma urgência odontológica",
    description: `Receba orientação e o cuidado adequado, conforme a agenda. ${respostas.orientacaoWhatsapp}`,
    href: "/urgencia-odontologica",
    cta: "Falar sobre urgência",
  },
];

/* ------------------------------ diferenciais ------------------------------ */

/** Diferenciais de atendimento (`hero-statement.tsx` procura três destes pelo título). */
export const differentials: { title: string; description: string }[] = [
  {
    title: "Consulta de 40 a 60 minutos",
    description:
      "Cada consulta tem o tempo de que precisa. Do início ao fim, a atenção é sua.",
  },
  {
    title: "Diagnóstico antes de qualquer decisão",
    description:
      "Você entende o que foi encontrado, em linguagem simples, antes de decidir qualquer procedimento.",
  },
  {
    title: "Conforto em cada etapa",
    description:
      "Anestesia e pausas combinadas com você. Você pode pedir uma pausa a qualquer momento e combinar sinais de conforto.",
  },
  {
    title: "Orçamento após avaliação, sem pressão",
    description:
      "O plano de tratamento, com etapas e orçamento, é apresentado depois da avaliação. Você decide no seu tempo, sem pressão para fechar na hora.",
  },
  {
    title: "Atendimento particular, sem convênio",
    description: "O atendimento é particular. Depois da avaliação, você recebe o plano de tratamento e o orçamento.",
  },
  {
    title: "WhatsApp direto com a Dra. Ana",
    description:
      "Dúvidas, agendamentos e retornos resolvidos com facilidade. Urgências avaliadas conforme a agenda.",
  },
];

/* --------------------------------- passos --------------------------------- */

/** Passos de "Como funciona". */
export const journeySteps = [
  {
    number: "01",
    title: "Escolha o canal que preferir",
    description: "Fale pelo WhatsApp ou preencha o formulário, do jeito mais confortável para você.",
  },
  {
    number: "02",
    title: "Conte o que você precisa",
    description: "Compartilhe o que trouxe você até aqui e as suas dúvidas. Tudo no seu tempo, sem pressão.",
  },
  {
    number: "03",
    title: "Agende sua avaliação",
    description: "A Dra. Ana confirma o melhor dia e horário para o seu primeiro encontro.",
  },
  {
    number: "04",
    title: "Receba um plano de cuidado",
    description:
      "Ao final da avaliação, você sai com as prioridades organizadas e o orçamento apresentado com transparência. E decide no seu tempo.",
  },
];
