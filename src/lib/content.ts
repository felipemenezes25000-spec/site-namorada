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
    a: "Pix, cartão de crédito e cartão de débito. O parcelamento no crédito está disponível conforme as condições da operadora do cartão.",
  },
  {
    q: "A Dra. Ana atende crianças?",
    a: "Sim. O atendimento é realizado para crianças a partir de 7 anos de idade.",
  },
  {
    q: "Quais são as áreas de atuação da Dra. Ana?",
    a: "Dentística, restaurações, clareamento dental, cirurgia oral (incluindo extração de sisos), prevenção e profilaxia (limpeza dental) e atendimento de urgências odontológicas.",
  },
  {
    q: "A Dra. Ana realiza atendimentos de urgência?",
    a: "Sim, conforme disponibilidade de agenda. Entre em contato pelo WhatsApp descrevendo o que você está sentindo para receber orientação e agendar o atendimento o quanto antes.",
  },
  {
    q: "É possível receber um orçamento antes da consulta?",
    a: "Não é possível passar orçamento sem avaliação clínica, porque cada caso precisa ser examinado individualmente. Após a consulta, a Dra. Ana apresenta o plano de tratamento completo e o respectivo orçamento de forma transparente, sem pressão para fechar na hora.",
  },
  {
    q: "Quanto dura a primeira consulta?",
    a: "De 40 a 60 minutos, em média. O tempo é dedicado para avaliação completa, diagnóstico claro e apresentação do plano de cuidado — sem pressa.",
  },
  {
    q: "Preciso levar exames na primeira consulta?",
    a: "Se você tiver radiografias ou exames recentes, leve — ajudam no diagnóstico. Se não tiver, o que for necessário é solicitado na própria consulta.",
  },
  {
    q: "O consultório tem estacionamento?",
    a: "O consultório fica na R. Itapeva, 286 — Bela Vista, próximo à Av. Paulista. Há estacionamentos conveniados e rotativos na região. Consulte a página de localização para mais detalhes sobre como chegar.",
  },
  {
    q: "O consultório é acessível para pessoas com mobilidade reduzida?",
    a: "Sim. O consultório conta com acesso adequado. Se você tiver alguma necessidade específica, entre em contato pelo WhatsApp para que possamos orientá-lo(a).",
  },
  {
    q: "A consulta tem retorno incluído?",
    a: "Os retornos de acompanhamento fazem parte do plano de tratamento. Após a avaliação, a Dra. Ana explica quais retornos estão previstos para o seu caso.",
  },
  {
    q: "Posso parcelar o tratamento?",
    a: "O pagamento pode ser feito via Pix, débito ou crédito. No cartão de crédito, o parcelamento segue as condições da operadora do seu cartão.",
  },
  {
    q: "O clareamento dental causa sensibilidade?",
    a: "A maioria dos pacientes não sente dor. Pode haver uma sensibilidade leve e passageira, e o protocolo é sempre ajustado individualmente para o seu conforto.",
  },
  {
    q: "Limpeza dental dói?",
    a: "O objetivo é que seja confortável. A técnica prioriza o conforto e, quando há sensibilidade, costuma ser leve e passageira, diminuindo em poucas horas.",
  },
  {
    q: "Extração de siso dói?",
    a: "O procedimento é realizado com anestesia local, com foco no conforto. No pós-operatório pode haver desconforto, controlado com a medicação orientada e acompanhamento próximo da Dra. Ana.",
  },
  {
    q: "Quando devo procurar atendimento de urgência?",
    a: "Dor intensa ou latejante, dente quebrado ou avulsionado, sangramento que não para, inchaço no rosto ou na gengiva, siso inflamado ou restauração que caiu. Fale pelo WhatsApp para orientação imediata.",
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
  { icon: Stethoscope, title: "Consulta de 40 a 60 minutos", description: "Cada consulta tem o tempo que precisa — sem atendimento em linha de produção. Atenção e dedicação exclusivas, do início ao fim." },
  { icon: MessageCircle, title: "Diagnóstico antes de qualquer decisão", description: "Você entende o que foi encontrado, em linguagem simples, antes de decidir qualquer procedimento. Sem termos confusos." },
  { icon: Smile, title: "Controle da dor em cada etapa", description: "Anestesia aplicada com técnica e cuidado. Você pode pedir uma pausa a qualquer momento e combinar sinais de conforto." },
  { icon: Sparkles, title: "Orçamento após avaliação, sem pressão", description: "Plano de tratamento com etapas e investimento apresentados de forma transparente. Você decide no seu tempo, sem pressão para fechar na hora." },
  { icon: HeartHandshake, title: "Atendimento particular com Pix, débito e crédito", description: "Sem convênio. O valor reflete o tempo e a dedicação de cada consulta. Pagamento via Pix, débito ou crédito." },
  { icon: CalendarHeart, title: "WhatsApp direto com a Dra. Ana", description: "Dúvidas, agendamentos e retornos resolvidos com facilidade. Urgências avaliadas conforme disponibilidade." },
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
