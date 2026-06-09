/**
 * Catálogo de tratamentos — conteúdo editável.
 * Cada item gera um card na home, uma entrada na página /tratamentos
 * e uma página individual em /tratamentos/[slug] com SEO próprio.
 *
 * Linguagem propositalmente ética: sem promessas de resultado,
 * sem sensacionalismo. Edite os textos à vontade.
 */

export type TreatmentIcon =
  | "evaluation"
  | "cleaning"
  | "whitening"
  | "restoration"
  | "prevention"
  | "surgery";

export interface TreatmentFAQ {
  q: string;
  a: string;
}

export interface Treatment {
  slug: string;
  name: string;
  shortName: string;
  icon: TreatmentIcon;
  /** Imagem(ns) real(is) do tratamento (caminho relativo a /public). */
  images?: { src: string; alt: string }[];
  /** Frase curta para o card. */
  excerpt: string;
  /** Abertura humana da página individual. */
  intro: string;
  /** "O que é". */
  what: string;
  /** Para quem é indicado. */
  forWhom: string[];
  /** Benefícios. */
  benefits: string[];
  /** Como funciona (passos). */
  steps: { title: string; description: string }[];
  faqs: TreatmentFAQ[];
  /** Duração média de uma sessão (ex.: "40 a 60 minutos"). */
  duration?: string;
  /** Número típico de sessões. */
  sessions?: string;
  /** Quando não é indicado / o que não resolve (gestão de expectativa). */
  notFor?: string;
  /** Situações que pedem atenção/cuidado antes do procedimento. */
  contraindications?: string[];
  /** Preparo antes do procedimento. */
  preparation?: string[];
  /** Cuidados após o procedimento. */
  aftercare?: { title: string; description: string }[];
  /** Sinais para procurar a Dra. depois do procedimento. */
  warningSigns?: string[];
  /** SEO. */
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
}

export const treatments: Treatment[] = [
  {
    slug: "avaliacao-odontologica",
    name: "Avaliação odontológica",
    shortName: "Avaliação",
    icon: "evaluation",
    images: [
      { src: "/tratamentos/avaliacao-1.jpg", alt: "Radiografia periapical sendo analisada — exame complementar utilizado na avaliação odontológica" },
      { src: "/tratamentos/avaliacao-2.jpg", alt: "Análise de radiografia dental no negatoscópio — diagnóstico por imagem no consultório" },
    ],
    excerpt:
      "Uma conversa cuidadosa e com exames complementares para entender as suas necessidades e avaliar sua saúde bucal antes de qualquer decisão.",
    intro:
      "Toda jornada começa por aqui. A avaliação é o momento de olhar com calma para a sua saúde bucal, ouvir o que te trouxe até o consultório e construir, junto com você, um plano que faça sentido para a sua vida — sem pressa e sem etapas desnecessárias.",
    what:
      "É um exame clínico detalhado em que a Dra. Ana observa dentes, gengivas, mordida e tecidos da boca, esclarece dúvidas e, quando necessário, solicita exames complementares. Mais do que um check-up, é uma conversa para alinhar expectativas e prioridades.",
    forWhom: [
      "Quem está há algum tempo sem ir ao dentista e quer retomar os cuidados",
      "Quem sente um incômodo, dor ou sensibilidade e precisa entender a causa",
      "Quem deseja iniciar um tratamento estético com segurança e planejamento",
      "Quem busca uma segunda opinião tranquila e sem compromisso de venda",
    ],
    benefits: [
      "Diagnóstico claro, explicado em linguagem simples",
      "Plano de cuidado individual, com prioridades bem definidas",
      "Estimativa transparente de etapas e investimento",
      "Decisões tomadas com calma, no seu tempo",
    ],
    steps: [
      { title: "Acolhimento", description: "Uma conversa inicial para entender sua história, sua rotina e o que te incomoda." },
      { title: "Exame clínico", description: "Avaliação detalhada de dentes, gengivas e mordida, com registro fotográfico quando indicado." },
      { title: "Diagnóstico", description: "Explicação clara do que foi observado, sem termos confusos." },
      { title: "Plano de cuidado", description: "Um caminho personalizado, com prioridades e próximos passos definidos junto com você." },
    ],
    faqs: [
      { q: "Como é a primeira consulta com a Dra. Ana?", a: "Começa com uma conversa para entender o que te trouxe e a sua história. Em seguida, é feito o exame clínico detalhado e, quando indicado, são solicitados exames complementares. Ao final, você recebe um diagnóstico claro e a proposta de plano de tratamento." },
      { q: "Quanto tempo dura a consulta de avaliação?", a: "Em média de 40 a 60 minutos. O tempo é dedicado para que tudo seja avaliado com calma e para que você consiga esclarecer todas as dúvidas antes de qualquer decisão." },
      { q: "Preciso levar exames anteriores ou radiografias?", a: "Se você já tem radiografias ou exames recentes, leve — eles ajudam no diagnóstico. Mas não se preocupe se não tiver: o que for necessário é solicitado durante a consulta." },
      { q: "A avaliação tem algum custo?", a: "O atendimento é particular; o valor da avaliação e de eventuais exames é informado de forma transparente antes de qualquer procedimento." },
    ],
    metaTitle: "Avaliação odontológica em [Cidade] — Dra. Ana Beatriz Lemos Souza",
    metaDescription:
      "Avaliação odontológica humanizada em [Cidade]. Exame completo, diagnóstico claro e plano de cuidado individual com a Dra. Ana Beatriz Lemos Souza. Agende pelo WhatsApp.",
    keywords: ["avaliação odontológica em [cidade]", "dentista em [cidade]", "consulta odontológica [bairro]"],
    duration: "40 a 60 minutos",
    sessions: "1 consulta",
  },
  {
    slug: "limpeza-dental",
    name: "Limpeza dental",
    shortName: "Limpeza",
    icon: "cleaning",
    images: [
      { src: "/tratamentos/limpeza.jpg", alt: "Procedimento de limpeza dental realizado pela Dra. Ana Beatriz — evidenciação de placa bacteriana para higiene orientada" },
    ],
    excerpt:
      "A limpeza profissional (profilaxia): remoção de placa e cálculo dental com técnica delicada, focada no seu conforto durante todo o procedimento.",
    intro:
      "A limpeza profissional é um dos cuidados mais simples e, ao mesmo tempo, mais importantes para manter a boca saudável. Feita com técnica e gentileza, ela remove o que a escova não alcança e ajuda a prevenir problemas antes que eles apareçam.",
    what:
      "Também chamada de profilaxia, é a remoção do biofilme e do tártaro acumulados sobre os dentes e na linha da gengiva, seguida de polimento. É um procedimento de rotina que sustenta praticamente todos os outros cuidados odontológicos.",
    forWhom: [
      "Quem quer manter a saúde bucal em dia com acompanhamento regular",
      "Quem percebe gengivas mais sensíveis ou que sangram ao escovar",
      "Quem nota acúmulo de tártaro ou manchas superficiais",
      "Quem vai iniciar um tratamento estético e precisa preparar a base",
    ],
    benefits: [
      "Gengivas mais saudáveis e menos propensas a inflamação",
      "Sensação imediata de boca limpa e leve",
      "Prevenção de cáries e doença periodontal",
      "Hálito mais fresco no dia a dia",
    ],
    steps: [
      { title: "Avaliação da gengiva", description: "Observação do estado das gengivas e do acúmulo de tártaro." },
      { title: "Remoção do tártaro", description: "Limpeza cuidadosa da superfície dos dentes e da linha gengival." },
      { title: "Polimento", description: "Acabamento que deixa os dentes lisos e mais resistentes ao acúmulo de placa." },
      { title: "Orientação", description: "Dicas práticas de higiene personalizadas para a sua rotina." },
    ],
    faqs: [
      { q: "A limpeza dental dói?", a: "O objetivo é que seja confortável. A técnica utilizada prioriza o seu conforto e, quando há sensibilidade, ela costuma ser leve e passageira. Após a limpeza, pode haver uma sensibilidade temporária, que tende a passar em poucas horas." },
      { q: "Quanto tempo dura a limpeza?", a: "Em geral, entre 40 minutos e 1 hora, dependendo da quantidade de cálculo dental acumulado e do estado das gengivas." },
      { q: "De quanto em quanto tempo devo fazer a limpeza?", a: "A recomendação geral é a cada seis meses, mas o intervalo ideal é definido durante a consulta, conforme a sua saúde bucal e os seus hábitos." },
      { q: "Minha gengiva sangrou na limpeza, devo me preocupar?", a: "O sangramento costuma indicar gengiva inflamada e tende a reduzir conforme a saúde gengival melhora com a higiene orientada. Se persistir, a situação é reavaliada." },
    ],
    metaTitle: "Limpeza dental em [Cidade] — Dra. Ana Beatriz Lemos Souza",
    metaDescription:
      "Limpeza dental (profilaxia) delicada em [Cidade]. Remoção de tártaro, polimento e orientação personalizada com a Dra. Ana Beatriz Lemos Souza. Agende pelo WhatsApp.",
    keywords: ["limpeza dental em [cidade]", "profilaxia dental [bairro]", "dentista em [cidade]"],
    duration: "40 minutos a 1 hora",
    sessions: "1 sessão, com manutenção periódica",
    aftercare: [
      { title: "Sensibilidade leve", description: "Pode haver uma sensibilidade passageira nas primeiras horas, que tende a diminuir." },
      { title: "Higiene em dia", description: "Manter a escovação e o uso do fio dental preserva o resultado por mais tempo." },
    ],
    warningSigns: ["Sangramento na gengiva que persiste por vários dias", "Dor que aumenta em vez de diminuir"],
  },
  {
    slug: "clareamento-dental",
    name: "Clareamento dental",
    shortName: "Clareamento",
    icon: "whitening",
    images: [
      { src: "/tratamentos/clareamento.png", alt: "Moldeira de clareamento dental — tratamento estético com acompanhamento profissional" },
    ],
    excerpt:
      "Um tom mais claro e natural para o seu sorriso, com acompanhamento profissional do início ao fim.",
    intro:
      "O clareamento é uma forma segura de iluminar o sorriso quando feito com planejamento e supervisão. O objetivo não é um branco artificial, mas um tom mais claro que continue parecendo natural e combine com você.",
    what:
      "É um procedimento que utiliza géis clareadores de uso profissional para reduzir manchas e devolver luminosidade aos dentes. Pode ser feito em consultório, com técnica supervisionada, ou em casa com moldeiras personalizadas — sempre após avaliação.",
    forWhom: [
      "Quem deseja um sorriso mais claro mantendo a naturalidade",
      "Quem percebe escurecimento dos dentes com o passar do tempo",
      "Quem quer um cuidado estético com acompanhamento profissional",
      "Quem já fez avaliação e teve a saúde bucal liberada para o procedimento",
    ],
    benefits: [
      "Resultado pensado para parecer natural, não artificial",
      "Acompanhamento profissional em cada etapa",
      "Protocolo ajustado à sua sensibilidade",
      "Orientação para prolongar o resultado",
    ],
    steps: [
      { title: "Avaliação prévia", description: "Confirmação de que a saúde bucal está pronta para o clareamento." },
      { title: "Definição do protocolo", description: "Escolha da técnica mais adequada ao seu caso e à sua rotina." },
      { title: "Aplicação acompanhada", description: "Realização do clareamento com controle de sensibilidade." },
      { title: "Manutenção", description: "Orientações para preservar o resultado por mais tempo." },
    ],
    faqs: [
      { q: "Clareamento dental dói?", a: "A maioria dos pacientes não sente dor. Pode haver uma sensibilidade leve e passageira, e o protocolo é sempre ajustado individualmente para o seu conforto." },
      { q: "Qual a diferença entre clareamento em consultório e caseiro?", a: "No de consultório, o gel é aplicado pela dentista, com resultado mais rápido. No caseiro, você usa moldeiras personalizadas em casa, no seu ritmo. Há também o protocolo combinado, que une os dois. A melhor opção para o seu caso é definida na avaliação." },
      { q: "Quanto tempo dura o resultado do clareamento?", a: "O resultado tem boa durabilidade, geralmente de um a três anos, mas pode variar conforme hábitos como consumo de café, chá, vinho tinto e cigarro. Manutenções periódicas ajudam a preservar o tom." },
      { q: "Existe alguma contraindicação?", a: "Sim. Gestantes, menores de certa idade e quem tem cáries ativas, gengiva inflamada ou sensibilidade acentuada podem precisar de cuidados ou de adiar o procedimento. Por isso a avaliação prévia é indispensável." },
      { q: "Posso fazer clareamento se tenho restaurações ou facetas?", a: "Sim, mas o clareamento não age sobre restaurações, facetas ou coroas. Por isso, em alguns casos pode ser necessário trocar restaurações visíveis após o clareamento para harmonizar a cor do sorriso." },
    ],
    metaTitle: "Clareamento dental em [Cidade] — Dra. Ana Beatriz Lemos Souza",
    metaDescription:
      "Clareamento dental com acompanhamento profissional em [Cidade]. Resultado natural e protocolo ajustado à sua sensibilidade. Agende sua avaliação com a Dra. Ana Beatriz.",
    keywords: ["clareamento dental em [cidade]", "clareamento dental [bairro]", "dentista estética [cidade]"],
    duration: "1 a 3 sessões, conforme o protocolo",
    sessions: "Consultório, caseiro ou combinado",
    notFor: "O clareamento não age sobre restaurações, facetas, coroas nem sobre manchas de origem interna profunda — nesses casos, outras abordagens são avaliadas.",
    contraindications: [
      "Gestantes e lactantes",
      "Adolescentes com a dentição ainda em formação",
      "Cáries ativas, gengiva inflamada ou sensibilidade acentuada (tratadas antes)",
    ],
    aftercare: [
      { title: "Dieta nas primeiras 48h", description: "Evitar café, chá, vinho tinto, beterraba e outros alimentos pigmentados ajuda a fixar o resultado." },
      { title: "Sensibilidade", description: "Pode haver sensibilidade temporária; o protocolo é ajustado para o seu conforto." },
    ],
  },
  {
    slug: "restauracoes",
    name: "Restaurações",
    shortName: "Restaurações",
    icon: "restoration",
    images: [
      { src: "/tratamentos/restauracao-1.jpg", alt: "Antes e depois de restauração dental — recuperação estética e funcional dos dentes anteriores" },
      { src: "/tratamentos/restauracao-2.jpg", alt: "Procedimento de restauração com isolamento absoluto — técnica que garante qualidade e durabilidade" },
    ],
    excerpt:
      "Devolvendo estética e função ao dente com materiais de alta qualidade que preservam a naturalidade do seu sorriso.",
    intro:
      "Quando um dente é afetado por cárie, desgaste ou uma pequena fratura, a restauração devolve o que foi perdido. O cuidado aqui é técnico e estético ao mesmo tempo: recuperar a função sem que o reparo se note.",
    what:
      "É a reconstrução da estrutura do dente com materiais restauradores modernos, como resinas que reproduzem a cor e a translucidez do esmalte natural. O foco é unir resistência e harmonia com o restante do sorriso.",
    forWhom: [
      "Quem tem cáries que precisam ser tratadas",
      "Quem possui restaurações antigas, escurecidas ou desgastadas",
      "Quem sofreu uma pequena fratura ou lascou um dente",
      "Quem deseja melhorar a aparência de restaurações visíveis",
    ],
    benefits: [
      "Recuperação da função mastigatória",
      "Aparência natural, com cor próxima à do dente",
      "Proteção da estrutura dental remanescente",
      "Conforto restabelecido no dia a dia",
    ],
    steps: [
      { title: "Diagnóstico", description: "Avaliação da extensão da cárie ou do desgaste a ser tratado." },
      { title: "Preparo cuidadoso", description: "Remoção apenas do necessário, preservando o máximo do dente saudável." },
      { title: "Restauração", description: "Aplicação do material restaurador com atenção à cor e ao contorno." },
      { title: "Ajuste final", description: "Conferência da mordida e do polimento para um acabamento confortável." },
    ],
    faqs: [
      { q: "A restauração é perceptível depois de pronta?", a: "O objetivo é justamente o contrário: os materiais atuais permitem reproduzir a cor e o brilho do dente natural, deixando o reparo discreto e harmonioso." },
      { q: "Quanto tempo dura uma restauração?", a: "A durabilidade depende do caso, do material utilizado e dos seus cuidados de higiene. Com acompanhamento e manutenção, as restaurações têm boa longevidade." },
      { q: "Posso comer normalmente depois do procedimento?", a: "Sim, na maioria dos casos a alimentação pode ser retomada logo após o procedimento. A Dra. Ana orienta cada caso individualmente, conforme o tipo de restauração realizada." },
      { q: "A restauração pode cair ou trincar?", a: "Como qualquer reparo, pode haver desgaste ao longo do tempo, sobretudo com bruxismo ou hábitos como roer unhas ou gelo. O acompanhamento periódico permite identificar e ajustar precocemente." },
    ],
    metaTitle: "Restaurações dentárias em [Cidade] — Dra. Ana Beatriz Lemos Souza",
    metaDescription:
      "Restaurações dentárias estéticas em [Cidade]. Recuperação de forma, função e aparência natural do dente com a Dra. Ana Beatriz Lemos Souza. Agende pelo WhatsApp.",
    keywords: ["restauração dental em [cidade]", "restauração dentária [bairro]", "tratamento de cárie [cidade]"],
    duration: "30 a 60 minutos por dente",
    sessions: "Em geral 1 sessão por restauração",
    notFor: "Quando a estrutura do dente está muito comprometida, a restauração direta pode não ser suficiente, e outras opções (coroa, tratamento de canal) são avaliadas na consulta.",
    aftercare: [
      { title: "Sensibilidade inicial", description: "Pode haver leve sensibilidade ao frio ou ao quente nas primeiras horas ou dias, que tende a diminuir." },
      { title: "Ajuste de mordida", description: "Se sentir que a restauração está alta ao morder, entre em contato para um ajuste simples." },
    ],
    warningSigns: ["Dor que aumenta em vez de diminuir", "Sensibilidade persistente por mais de alguns dias"],
  },
  {
    slug: "prevencao",
    name: "Prevenção odontológica",
    shortName: "Prevenção",
    icon: "prevention",
    images: [
      { src: "/tratamentos/prevencao.png", alt: "Atendimento preventivo infantil no consultório da Dra. Ana Beatriz — criança sorridente durante consulta odontológica" },
    ],
    excerpt:
      "Acompanhamento regular e orientação para evitar problemas antes que eles comecem.",
    intro:
      "Cuidar antes é sempre mais simples — e mais leve. A prevenção reúne os hábitos e o acompanhamento que mantêm a sua boca saudável ao longo do tempo, reduzindo a necessidade de tratamentos mais complexos no futuro.",
    what:
      "É um conjunto de cuidados contínuos: consultas periódicas, limpeza profissional, orientação de higiene e identificação precoce de qualquer alteração. A prevenção é a base de uma relação tranquila e duradoura com a sua saúde bucal.",
    forWhom: [
      "Quem quer manter a saúde bucal estável e evitar surpresas",
      "Famílias que buscam acompanhamento odontológico de rotina",
      "Quem teve problemas no passado e quer evitar recorrências",
      "Quem deseja proteger investimentos estéticos já realizados",
    ],
    benefits: [
      "Menos tratamentos complexos ao longo do tempo",
      "Diagnóstico precoce de pequenas alterações",
      "Hábitos de higiene ajustados à sua rotina",
      "Tranquilidade de saber que está tudo acompanhado",
    ],
    steps: [
      { title: "Consulta de rotina", description: "Avaliação periódica para acompanhar a evolução da saúde bucal." },
      { title: "Limpeza profissional", description: "Remoção de placa e tártaro como cuidado preventivo regular." },
      { title: "Orientação personalizada", description: "Recomendações de higiene e hábitos adequados ao seu caso." },
      { title: "Acompanhamento", description: "Definição da melhor frequência de retorno para manter tudo em ordem." },
    ],
    faqs: [
      { q: "Com que frequência devo ir ao dentista para prevenção?", a: "Geralmente, a cada seis meses. O intervalo ideal é individual e definido conforme a sua saúde bucal e os seus hábitos durante a consulta." },
      { q: "Prevenção vale a pena mesmo sem dor ou queixa?", a: "Sim, principalmente sem dor. Muitas alterações são silenciosas no início, e o acompanhamento regular permite identificar e tratar pequenos problemas antes que se tornem maiores." },
      { q: "A partir de qual idade as crianças podem fazer acompanhamento?", a: "A Dra. Ana atende crianças a partir de 7 anos. O acompanhamento desde cedo ajuda a criar hábitos saudáveis e a prevenir problemas ao longo da vida." },
    ],
    metaTitle: "Prevenção odontológica em [Cidade] — Dra. Ana Beatriz Lemos Souza",
    metaDescription:
      "Prevenção odontológica e acompanhamento de rotina em [Cidade]. Cuide da saúde bucal antes dos problemas com a Dra. Ana Beatriz Lemos Souza. Agende pelo WhatsApp.",
    keywords: ["prevenção odontológica em [cidade]", "dentista preventivo [bairro]", "check-up odontológico [cidade]"],
    duration: "40 a 60 minutos por consulta",
    sessions: "Retornos periódicos (em geral a cada 6 meses)",
  },
  {
    slug: "cirurgia-oral",
    name: "Cirurgia oral",
    shortName: "Cirurgia",
    icon: "surgery",
    excerpt:
      "Procedimentos cirúrgicos como a remoção de dentes, realizados com técnica, planejamento cuidadoso e atenção a cada etapa da sua recuperação.",
    intro:
      "Procedimentos cirúrgicos pedem técnica, planejamento e cuidado em cada detalhe. Aqui, a cirurgia oral é conduzida com calma, com informação clara sobre o que será feito e com atenção integral à sua experiência — antes, durante e depois.",
    what:
      "Reúne procedimentos cirúrgicos de pequeno e médio porte realizados em consultório, como remoção de dentes (inclusive sisos) e outras intervenções nos tecidos da boca. O foco é unir segurança, precisão técnica e conforto, sempre a partir de uma avaliação criteriosa para confirmar a indicação correta.",
    forWhom: [
      "Quem precisa avaliar a indicação de extração dos sisos",
      "Quem tem um dente comprometido e precisa de remoção segura",
      "Quem foi orientado por outro profissional a realizar uma cirurgia oral",
      "Quem busca uma segunda opinião antes de decidir pelo procedimento",
    ],
    benefits: [
      "Avaliação criteriosa antes de qualquer indicação cirúrgica",
      "Técnica e anestesia focadas no conforto e no controle da dor durante o procedimento",
      "Orientação completa sobre cuidados pré e pós-operatórios",
      "Acompanhamento próximo durante toda a recuperação",
    ],
    steps: [
      { title: "Avaliação clínica", description: "Exame detalhado e análise de imagens (radiografias ou tomografias) para confirmar a indicação cirúrgica." },
      { title: "Planejamento", description: "Explicação clara do procedimento, das opções, dos riscos e dos benefícios — para decidirmos juntos, com sua autonomia preservada." },
      { title: "Cirurgia com segurança", description: "Procedimento realizado com técnica precisa e protocolo de anestesia ajustado ao seu conforto." },
      { title: "Pós-operatório", description: "Orientações claras de cuidado, retornos para acompanhar a cicatrização e canal aberto para qualquer dúvida." },
    ],
    faqs: [
      { q: "A cirurgia oral dói?", a: "Durante o procedimento, a cirurgia é realizada sob anestesia local, com foco no seu conforto. No pós-operatório pode haver algum desconforto, controlado com a medicação orientada para o seu caso e acompanhamento próximo." },
      { q: "Preciso fazer radiografia ou tomografia antes?", a: "Quase sempre, sim. As imagens mostram a posição da raiz, dos nervos e das estruturas vizinhas, permitindo planejar a cirurgia com segurança. O exame necessário é orientado na avaliação." },
      { q: "Como sei se o meu siso está inflamado?", a: "Sinais comuns são dor na região do fundo da boca, inchaço, gengiva avermelhada, dificuldade para abrir a boca ou para mastigar e, às vezes, mau gosto. Diante desses sinais, procure avaliação — em casos agudos, é uma urgência." },
      { q: "Quanto tempo leva a recuperação?", a: "Depende do procedimento e do organismo de cada pessoa. A maioria dos pacientes retoma a rotina em poucos dias. A recuperação completa é acompanhada até o final, com retornos para avaliar a cicatrização." },
      { q: "Como saber se realmente preciso da cirurgia?", a: "A indicação é definida após o exame clínico e a análise das imagens (radiografias ou tomografias). Quando existem alternativas, elas são apresentadas, e a decisão é tomada junto com você, considerando riscos, benefícios e os seus objetivos." },
    ],
    metaTitle: "Cirurgia oral em [Cidade] — Dra. Ana Beatriz Lemos Souza",
    metaDescription:
      "Cirurgia oral de pequeno e médio porte em [Cidade]: remoção de sisos e outros procedimentos com avaliação criteriosa, técnica precisa e acompanhamento próximo, com a Dra. Ana Beatriz Lemos Souza.",
    keywords: ["cirurgia oral em [cidade]", "extração de siso [bairro]", "dentista cirurgião em [cidade]"],
    duration: "40 a 60 minutos em média",
    sessions: "Geralmente 1 sessão, com retorno para acompanhar a cicatrização",
    preparation: [
      "Avise sobre medicamentos de uso contínuo, alergias e condições de saúde na avaliação",
      "Em geral não é necessário jejum para anestesia local, mas as orientações do seu caso são passadas antes",
      "Para alguns procedimentos, pode ser recomendado ter um acompanhante na volta para casa",
    ],
    contraindications: [
      "Infecção aguda no local pode pedir tratamento antes da cirurgia",
      "Algumas condições de saúde e medicamentos exigem cuidados específicos, avaliados caso a caso",
    ],
    aftercare: [
      { title: "Repouso e gelo", description: "Repouse nas primeiras horas e use compressa fria por fora do rosto para reduzir o inchaço." },
      { title: "Alimentação", description: "Prefira alimentos frios ou mornos e macios nos primeiros dias, mastigando do lado oposto." },
      { title: "Higiene e medicação", description: "Siga as orientações de higiene da região e tome a medicação conforme prescrito." },
    ],
    warningSigns: [
      "Sangramento intenso que não cede com compressão",
      "Inchaço que cresce muito após o terceiro dia",
      "Febre ou dor que aumenta com o passar dos dias",
    ],
  },
];

export function getTreatment(slug: string): Treatment | undefined {
  return treatments.find((t) => t.slug === slug);
}

export const treatmentSlugs = treatments.map((t) => t.slug);
