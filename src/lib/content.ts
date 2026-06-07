import {
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  Leaf,
  MessageCircle,
  CalendarHeart,
  ClipboardList,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";

/** Perguntas frequentes da home. */
export const homeFaqs = [
  {
    q: "Como agendo uma avaliação?",
    a: "Pelo WhatsApp, em poucos toques, ou pelo formulário de agendamento aqui no site. A Dra. Ana confirma com você o melhor dia e horário.",
  },
  {
    q: "O atendimento é particular?",
    a: "Sim, o atendimento é particular. Na avaliação você recebe uma estimativa transparente das etapas e do investimento, sem surpresas.",
  },
  {
    q: "Posso tirar dúvidas pelo WhatsApp antes de marcar?",
    a: "Pode, sim. O WhatsApp está disponível para esclarecer dúvidas com tranquilidade, no seu tempo, antes de qualquer decisão.",
  },
  {
    q: "Clareamento dental dói?",
    a: "A maioria das pessoas sente, no máximo, uma sensibilidade leve e passageira. O protocolo é sempre ajustado para deixar a experiência confortável.",
  },
  {
    q: "Com que frequência devo fazer limpeza?",
    a: "Em geral, a cada seis meses — mas o intervalo ideal é definido na avaliação, conforme a sua saúde bucal e seus hábitos.",
  },
  {
    q: "O que acontece na primeira avaliação?",
    a: "Uma conversa para entender o que te trouxe, um exame clínico completo e um plano de cuidado individual, explicado em linguagem simples.",
  },
  {
    q: "Quais formas de pagamento são aceitas?",
    a: "As condições e formas de pagamento são apresentadas de forma transparente durante a avaliação, conforme o seu plano de tratamento. Fale com a recepção pelo WhatsApp para conhecer as opções disponíveis.",
  },
];

/** Selos de confiança imediata (logo abaixo do hero). */
export const trustBadges: { icon: LucideIcon; title: string; description: string }[] = [
  { icon: HeartHandshake, title: "Atendimento humanizado", description: "Tempo, escuta e cuidado em cada etapa." },
  { icon: ClipboardList, title: "Planejamento individual", description: "Um plano feito para a sua história." },
  { icon: Leaf, title: "Foco em naturalidade", description: "Resultados que respeitam o seu sorriso." },
  { icon: ShieldCheck, title: "Segurança clínica", description: "Protocolos e cuidado em primeiro lugar." },
  { icon: Sparkles, title: "Ambiente acolhedor", description: "Um espaço pensado para o seu conforto." },
];

/** Diferenciais (seção dedicada). */
export const differentials: { icon: LucideIcon; title: string; description: string }[] = [
  { icon: Stethoscope, title: "Atendimento sem pressa", description: "Cada consulta tem o tempo que você precisa — sem linha de produção." },
  { icon: MessageCircle, title: "Explicação clara antes de tudo", description: "Você entende cada etapa antes de qualquer procedimento, sem termos confusos." },
  { icon: ClipboardList, title: "Planejamento individualizado", description: "Nada de pacotes prontos: o plano nasce da sua realidade e das suas prioridades." },
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
