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
  | "aesthetics";

export interface TreatmentFAQ {
  q: string;
  a: string;
}

export interface Treatment {
  slug: string;
  name: string;
  shortName: string;
  icon: TreatmentIcon;
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
    excerpt:
      "Uma conversa cuidadosa e um exame completo para entender a sua saúde bucal antes de qualquer decisão.",
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
      { q: "A avaliação dói?", a: "Não. É um exame tranquilo, sem procedimentos invasivos. Caso algo precise ser feito, isso será conversado e agendado com antecedência." },
      { q: "Preciso levar exames antigos?", a: "Se você tiver radiografias ou exames recentes, leve — eles ajudam. Mas não se preocupe se não tiver; o que for necessário é solicitado na consulta." },
      { q: "Já saio com tudo resolvido?", a: "A avaliação define o plano. Procedimentos costumam ser agendados em consultas seguintes, respeitando o seu tempo e suas prioridades." },
    ],
    metaTitle: "Avaliação odontológica em [Cidade] — Dra. Ana Beatriz Lemos Souza",
    metaDescription:
      "Avaliação odontológica humanizada em [Cidade]. Exame completo, diagnóstico claro e plano de cuidado individual com a Dra. Ana Beatriz Lemos Souza. Agende pelo WhatsApp.",
    keywords: ["avaliação odontológica em [cidade]", "dentista em [cidade]", "consulta odontológica [bairro]"],
  },
  {
    slug: "limpeza-dental",
    name: "Limpeza dental",
    shortName: "Limpeza",
    icon: "cleaning",
    excerpt:
      "Remoção de placa e tártaro com técnica delicada, devolvendo frescor e saúde às gengivas.",
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
      { q: "Com que frequência devo fazer limpeza?", a: "Em geral, a cada seis meses — mas o intervalo ideal é definido na avaliação, de acordo com a sua saúde bucal e seus hábitos." },
      { q: "A limpeza enfraquece os dentes?", a: "Não. A limpeza remove o tártaro, que é prejudicial. O esmalte do dente é preservado durante todo o procedimento." },
      { q: "Vou sentir sensibilidade depois?", a: "Pode haver uma leve sensibilidade temporária, que costuma passar em pouco tempo. A técnica é delicada justamente para minimizar o desconforto." },
    ],
    metaTitle: "Limpeza dental em [Cidade] — Dra. Ana Beatriz Lemos Souza",
    metaDescription:
      "Limpeza dental (profilaxia) delicada em [Cidade]. Remoção de tártaro, polimento e orientação personalizada com a Dra. Ana Beatriz Lemos Souza. Agende pelo WhatsApp.",
    keywords: ["limpeza dental em [cidade]", "profilaxia dental [bairro]", "dentista em [cidade]"],
  },
  {
    slug: "clareamento-dental",
    name: "Clareamento dental",
    shortName: "Clareamento",
    icon: "whitening",
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
      { q: "Clareamento dental dói?", a: "A maioria das pessoas sente, no máximo, uma sensibilidade leve e passageira. O protocolo é ajustado justamente para deixar a experiência confortável." },
      { q: "O resultado é permanente?", a: "O clareamento tem boa durabilidade, mas pode ser influenciado por hábitos como café, chá e cigarro. Manutenções periódicas ajudam a preservar o tom." },
      { q: "Qualquer pessoa pode clarear os dentes?", a: "É necessário avaliar antes. Algumas situações pedem cuidados específicos, e por isso a avaliação é sempre o primeiro passo." },
    ],
    metaTitle: "Clareamento dental em [Cidade] — Dra. Ana Beatriz Lemos Souza",
    metaDescription:
      "Clareamento dental com acompanhamento profissional em [Cidade]. Resultado natural e protocolo ajustado à sua sensibilidade. Agende sua avaliação com a Dra. Ana Beatriz.",
    keywords: ["clareamento dental em [cidade]", "clareamento dental [bairro]", "dentista estética [cidade]"],
  },
  {
    slug: "restauracoes",
    name: "Restaurações",
    shortName: "Restaurações",
    icon: "restoration",
    excerpt:
      "Devolvendo forma, função e estética ao dente com materiais que imitam o natural.",
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
      { q: "A restauração é perceptível?", a: "O objetivo é que não seja. Os materiais atuais permitem reproduzir a cor e o brilho do dente natural, deixando o reparo discreto." },
      { q: "Quanto tempo dura uma restauração?", a: "A durabilidade depende do caso e dos cuidados de higiene. Com acompanhamento e manutenção, as restaurações têm boa longevidade." },
      { q: "Preciso trocar restaurações antigas?", a: "Nem sempre. Na avaliação verificamos se há infiltração, desgaste ou questão estética que justifique a troca." },
    ],
    metaTitle: "Restaurações dentárias em [Cidade] — Dra. Ana Beatriz Lemos Souza",
    metaDescription:
      "Restaurações dentárias estéticas em [Cidade]. Recuperação de forma, função e aparência natural do dente com a Dra. Ana Beatriz Lemos Souza. Agende pelo WhatsApp.",
    keywords: ["restauração dental em [cidade]", "restauração dentária [bairro]", "tratamento de cárie [cidade]"],
  },
  {
    slug: "prevencao",
    name: "Prevenção odontológica",
    shortName: "Prevenção",
    icon: "prevention",
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
      { q: "De quanto em quanto tempo devo retornar?", a: "Costuma ser a cada seis meses, mas o intervalo é individual e definido conforme a sua saúde bucal e seus hábitos." },
      { q: "Prevenção vale a pena mesmo sem dor?", a: "Sim — e principalmente sem dor. Muitas alterações são silenciosas no começo, e o acompanhamento permite agir cedo, de forma simples." },
      { q: "Crianças também precisam de prevenção?", a: "Sim. O acompanhamento desde cedo ajuda a criar bons hábitos e a manter a saúde bucal em todas as fases." },
    ],
    metaTitle: "Prevenção odontológica em [Cidade] — Dra. Ana Beatriz Lemos Souza",
    metaDescription:
      "Prevenção odontológica e acompanhamento de rotina em [Cidade]. Cuide da saúde bucal antes dos problemas com a Dra. Ana Beatriz Lemos Souza. Agende pelo WhatsApp.",
    keywords: ["prevenção odontológica em [cidade]", "dentista preventivo [bairro]", "check-up odontológico [cidade]"],
  },
  {
    slug: "estetica-do-sorriso",
    name: "Estética do sorriso",
    shortName: "Estética",
    icon: "aesthetics",
    excerpt:
      "Harmonia entre saúde e beleza, respeitando as características naturais do seu rosto.",
    intro:
      "Um sorriso bonito é, antes de tudo, um sorriso saudável. A odontologia estética trabalha a harmonia do conjunto — cor, forma e proporção — sempre partindo da saúde e respeitando o que torna o seu sorriso único.",
    what:
      "Reúne procedimentos voltados à aparência do sorriso, como clareamento, ajustes de forma e melhorias em restaurações visíveis. Cada plano é desenhado de maneira individual, com foco em um resultado natural e equilibrado.",
    forWhom: [
      "Quem deseja melhorar a aparência do sorriso com naturalidade",
      "Quem se incomoda com a cor, a forma ou pequenos detalhes dos dentes",
      "Quem busca um planejamento estético seguro, sem exageros",
      "Quem quer harmonizar o sorriso preservando a saúde bucal",
    ],
    benefits: [
      "Planejamento individual, pensado para o seu rosto",
      "Prioridade ao resultado natural e equilibrado",
      "Decisões tomadas com clareza e sem pressão",
      "Integração entre estética e saúde bucal",
    ],
    steps: [
      { title: "Escuta e avaliação", description: "Entendimento do que você gostaria de mudar e da saúde do seu sorriso." },
      { title: "Planejamento", description: "Definição das etapas estéticas mais adequadas ao seu caso." },
      { title: "Execução cuidadosa", description: "Realização dos procedimentos com atenção aos detalhes e à naturalidade." },
      { title: "Acompanhamento", description: "Orientação para manter o resultado bonito e saudável por mais tempo." },
    ],
    faqs: [
      { q: "O resultado fica artificial?", a: "O objetivo é justamente o contrário: valorizar o seu sorriso respeitando suas características naturais, para um resultado harmônico." },
      { q: "Estética e saúde andam juntas?", a: "Sempre. Qualquer planejamento estético parte da saúde bucal — por isso a avaliação vem primeiro." },
      { q: "Preciso fazer vários procedimentos?", a: "Não necessariamente. O plano é individual e pode envolver desde um único ajuste até etapas combinadas, conforme o seu objetivo." },
    ],
    metaTitle: "Estética do sorriso em [Cidade] — Dra. Ana Beatriz Lemos Souza",
    metaDescription:
      "Estética do sorriso com planejamento individual em [Cidade]. Harmonia entre saúde e beleza, com resultado natural, ao lado da Dra. Ana Beatriz Lemos Souza.",
    keywords: ["estética do sorriso em [cidade]", "odontologia estética [bairro]", "harmonização do sorriso [cidade]"],
  },
];

export function getTreatment(slug: string): Treatment | undefined {
  return treatments.find((t) => t.slug === slug);
}

export const treatmentSlugs = treatments.map((t) => t.slug);
