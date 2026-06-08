import {
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  CalendarClock,
  Activity,
  Phone,
  MessageCircle,
  CalendarHeart,
  Smile,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";

/** Perguntas frequentes da home. */
export const homeFaqs = [
  {
    q: "A Dra. Ana atende convênios ou planos de saúde?",
    a: "Não. Os atendimentos são realizados exclusivamente de forma particular.",
  },
  {
    q: "Quais são as formas de pagamento?",
    a: "Aceitamos PIX, cartão de crédito e cartão de débito.",
  },
  {
    q: "A Dra. Ana atende crianças?",
    a: "Sim. O atendimento é realizado para crianças a partir de 7 anos de idade.",
  },
  {
    q: "Quais são as áreas de atuação da Dra. Ana?",
    a: "A Dra. Ana atua nas seguintes áreas: dentística, restaurações, clareamento dental, cirurgias odontológicas, prevenção e profilaxia (limpeza dental).",
  },
  {
    q: "A Dra. Ana realiza atendimentos de urgência?",
    a: "Sim. Entre em contato para verificar a disponibilidade e receber orientações sobre o atendimento de urgência.",
  },
  {
    q: "É possível receber um orçamento antes da consulta?",
    a: "Não. Cada paciente possui necessidades específicas que só podem ser avaliadas adequadamente durante a consulta odontológica. Por se tratar de um atendimento relacionado à saúde, não é possível fornecer valores ou orçamentos prévios sem uma avaliação profissional. Após a consulta e o diagnóstico, a Dra. Ana apresenta o plano de tratamento completo e o respectivo orçamento de forma transparente.",
  },
];

/**
 * "Como podemos ajudar você" — cenários/necessidades (ajuda o visitante a se
 * identificar e o direciona à página certa por intenção). Cada card é um
 * roteador de conversão: leva à página mais útil para aquele momento.
 * Conteúdo ético, sem promessa de resultado.
 */
export const careNeeds: { icon: LucideIcon; title: string; description: string; href: string; cta: string }[] = [
  { icon: CalendarClock, title: "Faz tempo desde a última consulta", description: "Retome os cuidados com calma e sem julgamentos, a partir de uma avaliação completa.", href: "/primeira-consulta", cta: "Como é a primeira consulta" },
  { icon: Activity, title: "Sente dor, sensibilidade ou incômodo? Sua gengiva sangra?", description: "Vamos entender a causa juntos e definir o melhor caminho, com explicações claras.", href: "/urgencia-odontologica", cta: "Ver atendimento de urgência" },
  { icon: Sparkles, title: "Quer um sorriso mais bonito", description: "Estética com saúde: clareamento e ajustes pensados para um resultado natural.", href: "/tratamentos/clareamento-dental", cta: "Conhecer o clareamento" },
  { icon: Stethoscope, title: "Precisa avaliar os sisos ou cirurgia oral", description: "Avaliação cuidadosa e orientação segura sobre cirurgia oral, dentro da sua necessidade.", href: "/tratamentos/cirurgia-oral", cta: "Ver cirurgia oral" },
  { icon: ShieldCheck, title: "Quer manter a saúde bucal em dia", description: "Acompanhamento preventivo e limpezas para evitar problemas antes que apareçam.", href: "/tratamentos/prevencao", cta: "Conhecer a prevenção" },
  { icon: Phone, title: "Teve uma urgência odontológica", description: "Receba orientação e o cuidado adequado com agilidade. Consulte a disponibilidade de horários especiais.", href: "/urgencia-odontologica", cta: "Falar sobre urgência" },
];

/** Diferenciais (seção dedicada). */
export const differentials: { icon: LucideIcon; title: string; description: string }[] = [
  { icon: Stethoscope, title: "Atendimento individualizado", description: "Cada consulta tem o tempo que você precisa, com atenção e dedicação exclusivas, do início ao fim." },
  { icon: MessageCircle, title: "Explicação clara antes de tudo", description: "Você entende cada etapa antes de qualquer procedimento, sem termos confusos." },
  { icon: Smile, title: "Foco no conforto e no controle da dor", description: "Técnicas e anestesia pensadas para o máximo de conforto e o controle da dor em cada etapa. A Dra. Ana preza por uma odontologia com o mínimo de desconforto, do início ao fim." },
  { icon: Sparkles, title: "Estética com saúde", description: "Resultados pensados para parecer naturais — combinando com o seu rosto, não um branco artificial. A saúde bucal vem sempre primeiro." },
  { icon: HeartHandshake, title: "Experiência acolhedora", description: "Você pode pedir uma pausa a qualquer momento e tirar dúvidas sem se sentir apressado — do primeiro contato ao retorno." },
  { icon: CalendarHeart, title: "Comunicação simples", description: "Dúvidas, agendamentos e retornos resolvidos com facilidade pelo WhatsApp." },
];

/** Passos "Como funciona". */
export const journeySteps = [
  { number: "01", title: "Escolha o melhor canal", description: "Fale pelo WhatsApp ou preencha o formulário — o que for mais confortável para você." },
  { number: "02", title: "Conte o que você precisa", description: "Compartilhe o que te trouxe e suas dúvidas. Tudo no seu tempo, sem pressão." },
  { number: "03", title: "Agende sua avaliação", description: "A Dra. Ana confirma o melhor dia e horário para o seu primeiro encontro." },
  { number: "04", title: "Receba um plano de cuidado", description: "Ao final da avaliação, você sai com as prioridades organizadas e um orçamento transparente — e decide o que fazer no seu tempo." },
];

/**
 * Relatos com identidade preservada.
 * São falas reais de experiência de atendimento, sem identificação — em
 * conformidade com as normas de publicidade odontológica (sem nome/imagem
 * de paciente sem consentimento e sem promessa de resultado).
 * Quando houver avaliações públicas autorizadas (ex.: Google), substituir
 * por depoimentos identificados com o devido consentimento por escrito.
 */
export const testimonials: { quote: string; author: string; context: string }[] = [
  {
    quote:
      "Me senti acolhida desde o primeiro contato. A Dra. Ana explicou tudo com calma e nunca me senti pressionada a nada.",
    author: "Paciente da Dra. Ana",
    context: "Relato de avaliação inicial",
  },
  {
    quote:
      "Gostei de entender cada passo antes de começar. O atendimento é atencioso e o ambiente passa muita confiança.",
    author: "Paciente da Dra. Ana",
    context: "Relato durante o tratamento",
  },
  {
    quote:
      "Voltei a cuidar dos dentes depois de muito tempo e foi tranquilo. Saí com um plano claro e sem aquela sensação de cobrança.",
    author: "Paciente da Dra. Ana",
    context: "Relato de retorno aos cuidados",
  },
];
