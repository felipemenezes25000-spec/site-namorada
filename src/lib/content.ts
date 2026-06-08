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
 * identificar e direciona à avaliação). Conteúdo ético, sem promessa de resultado.
 */
export const careNeeds: { icon: LucideIcon; title: string; description: string }[] = [
  { icon: CalendarClock, title: "Faz tempo desde a última consulta", description: "Retome os cuidados com calma e sem julgamentos, a partir de uma avaliação completa." },
  { icon: Activity, title: "Sente dor, sensibilidade ou incômodo? Sua gengiva sangra?", description: "Vamos entender a causa juntos e definir o melhor caminho, com explicações claras." },
  { icon: Sparkles, title: "Quer um sorriso mais bonito", description: "Estética com saúde: clareamento e ajustes pensados para um resultado natural." },
  { icon: Stethoscope, title: "Precisa avaliar os sisos ou cirurgia oral", description: "Avaliação cuidadosa e orientação segura sobre cirurgia oral, dentro da sua necessidade." },
  { icon: ShieldCheck, title: "Quer manter a saúde bucal em dia", description: "Acompanhamento preventivo e limpezas para evitar problemas antes que apareçam." },
  { icon: Phone, title: "Teve uma urgência odontológica", description: "Fale pelo WhatsApp para receber orientação e o cuidado adequado com agilidade. Consulte nossa disponibilidade de horários especiais." },
];

/** Diferenciais (seção dedicada). */
export const differentials: { icon: LucideIcon; title: string; description: string }[] = [
  { icon: Stethoscope, title: "Atendimento individualizado", description: "Cada consulta tem o tempo que você precisa, com atenção e dedicação exclusivas, do início ao fim." },
  { icon: MessageCircle, title: "Explicação clara antes de tudo", description: "Você entende cada etapa antes de qualquer procedimento, sem termos confusos." },
  { icon: Smile, title: "Odontologia sem dor", description: "Priorizamos o seu bem-estar com técnicas que garantem uma experiência odontológica segura e, acima de tudo, livre de dor. A Dra. Ana preza por uma Odontologia com o mínimo de desconforto, assegurando o seu conforto em cada etapa." },
  { icon: Sparkles, title: "Estética com saúde", description: "Beleza e bem-estar caminham juntos, sempre partindo da saúde bucal." },
  { icon: HeartHandshake, title: "Experiência acolhedora", description: "Um ambiente tranquilo, do primeiro contato ao acompanhamento." },
  { icon: CalendarHeart, title: "Comunicação simples", description: "Dúvidas, agendamentos e retornos resolvidos com facilidade pelo WhatsApp." },
];

/** Passos "Como funciona". */
export const journeySteps = [
  { number: "01", title: "Escolha o melhor canal", description: "Fale pelo WhatsApp ou preencha o formulário — o que for mais confortável para você." },
  { number: "02", title: "Conte o que você precisa", description: "Compartilhe o que te trouxe e suas dúvidas. Tudo no seu tempo, sem pressão." },
  { number: "03", title: "Agende sua avaliação", description: "A Dra. Ana confirma o melhor dia e horário para o seu primeiro encontro." },
  { number: "04", title: "Receba um plano de cuidado", description: "Um caminho personalizado, claro e seguro, construído junto com você." },
];

/**
 * Depoimentos — PLACEHOLDERS editáveis.
 * Substitua por depoimentos REAIS e AUTORIZADOS por escrito.
 * Não use nomes completos sem consentimento. Mantenha o foco na
 * experiência de atendimento, não em promessas de resultado.
 */
export const testimonials: { quote: string; author: string; context: string }[] = [
  {
    quote:
      "Me senti acolhida desde o primeiro contato. A Dra. Ana explicou tudo com calma e nunca me senti pressionada a nada.",
    author: "[Nome], paciente",
    context: "[Bairro]",
  },
  {
    quote:
      "Gostei de entender cada passo antes de começar. O atendimento é atencioso e o ambiente passa muita confiança.",
    author: "[Nome], paciente",
    context: "[Bairro]",
  },
  {
    quote:
      "Voltei a cuidar dos dentes depois de muito tempo e foi tranquilo. Saí com um plano claro e sem aquela sensação de cobrança.",
    author: "[Nome], paciente",
    context: "[Bairro]",
  },
];
