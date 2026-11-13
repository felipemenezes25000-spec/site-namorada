/**
 * Catálogo de tratamentos — conteúdo editável.
 * Cada item gera uma linha no sumário da home e de /tratamentos
 * e uma página individual em /tratamentos/[slug] com SEO próprio.
 *
 * Linguagem propositalmente ética (DESIGN.md 6.5): sem promessa de resultado,
 * sem superlativo, sem promessa de ausência de dor, sem título de especialidade, sem preço,
 * sem forma de pagamento. Só fatos que já constavam no repositório. Prazos de recuperação
 * nunca são regra: "varia de pessoa para pessoa". Edite os textos com o mesmo cuidado.
 *
 * Pendente de confirmação da doutora (nada disto foi alterado; são os valores publicados antes do
 * redesenho): `duration` e `sessions` de todos os tratamentos, "a cada seis meses" (limpeza e
 * prevenção) e os cuidados pós-operatórios (repouso, compressa, alimentação) de implante e cirurgias.
 */

import { respostas } from "./content";
import { locale, siteConfig } from "./site-config";

export interface TreatmentFAQ {
  q: string;
  a: string;
}

export interface Treatment {
  slug: string;
  name: string;
  shortName: string;
  /** Frase curta do sumário (home e /tratamentos). */
  excerpt: string;
  /** Abertura humana da página individual (lede). */
  intro: string;
  /** "O que é". */
  what: string;
  /** Para quem é indicado. */
  forWhom: string[];
  /** O que o atendimento inclui (descreve o cuidado, não promete resultado). */
  benefits: string[];
  /** Como funciona (passos). */
  steps: { title: string; description: string }[];
  /** No máximo 8 por página: a mesma lista vai ao <FAQ> e ao JSON-LD. */
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
  /**
   * Momento próprio da página (cada tratamento rompe o molde de um jeito, definido por dado):
   * "limite" = o limite do tratamento sobe como declaração, logo depois de "Para quem é indicado";
   * "linha" = os passos ficam lado a lado, em largura total;
   * "colunas" = "Para quem é indicado" em duas colunas separadas por um fio vertical.
   * Sem o campo, a página usa o arranjo padrão.
   */
  layout?: "limite" | "linha" | "colunas";
  /** Frase própria do bloco "Onde fica" (o endereço é igual para todos; esta frase não). */
  onde: string;
  /** O que pesa no orçamento deste tratamento (sem preço e sem forma de pagamento). */
  valores: string;
  /** Links temáticos no corpo da página (2 a 3), com âncora descritiva de até 6 palavras. */
  related: { slug: string; label: string }[];
  /** SEO: título com no máximo 60 caracteres e o bairro; descrição com no máximo 155. */
  metaTitle: string;
  metaDescription: string;
  /** Título (H2) do bloco "O que é", quando a página precisa de um título próprio para a busca. */
  whatTitle?: string;
}

const marca = siteConfig.doctorFirstName;
/** Forma curta do local (bairro e região) para as descrições, que têm no máximo 155 caracteres. */
const loc = `${locale.bairro} (${locale.regiao})`;

export const treatments: Treatment[] = [
  {
    slug: "avaliacao-odontologica",
    layout: "linha",
    name: "Avaliação odontológica",
    shortName: "Avaliação",
    excerpt:
      "Uma conversa cuidadosa, exame clínico e, quando necessário, exames complementares para entender a sua saúde bucal antes de qualquer decisão.",
    intro:
      "Toda jornada começa por aqui. Na avaliação, a Dra. Ana olha com calma para a sua saúde bucal, ouve o que trouxe você ao consultório e monta, junto com você, um plano que faça sentido para a sua rotina.",
    what: "É um exame clínico detalhado em que a Dra. Ana observa dentes, gengivas, mordida e tecidos da boca, esclarece dúvidas e, quando necessário, solicita exames complementares. Mais do que um check-up, é uma conversa para alinhar expectativas e prioridades.",
    forWhom: [
      "Quem está há algum tempo sem ir ao dentista e quer retomar os cuidados",
      "Quem sente um incômodo, dor ou sensibilidade e precisa entender a causa",
      "Quem deseja iniciar um tratamento estético com planejamento",
      "Quem busca uma segunda opinião, sem pressão para fechar tratamento",
    ],
    benefits: [
      "Diagnóstico explicado em linguagem simples",
      "Plano de cuidado individual, com prioridades definidas",
      "Orçamento apresentado só depois da avaliação",
      "Decisões tomadas com calma, no seu tempo",
    ],
    steps: [
      {
        title: "Acolhimento",
        description:
          "Uma conversa inicial para entender sua história, sua rotina e o que te incomoda.",
      },
      {
        title: "Exame clínico",
        description:
          "Avaliação detalhada de dentes, gengivas e mordida, com registro fotográfico quando indicado.",
      },
      {
        title: "Diagnóstico",
        description: "Explicação clara do que foi observado, sem termos confusos.",
      },
      {
        title: "Plano de cuidado",
        description:
          "Um caminho personalizado, com prioridades e próximos passos definidos junto com você.",
      },
    ],
    faqs: [
      {
        q: "Como é a primeira consulta com a Dra. Ana?",
        a: "Começa com uma conversa para entender o que trouxe você e a sua história. Em seguida, é feito o exame clínico detalhado e, quando indicado, são solicitados exames complementares. Ao final, você recebe um diagnóstico claro e a proposta de plano de tratamento.",
      },
      { q: "Quanto tempo dura a consulta de avaliação?", a: respostas.duracao },
      {
        q: "Preciso levar exames anteriores ou radiografias?",
        a: "Se você já tem radiografias ou exames recentes, leve: eles ajudam no diagnóstico. Se não tiver, o que for necessário é solicitado durante a consulta.",
      },
      { q: "O que inclui a avaliação?", a: respostas.avaliacaoCompleta },
    ],
    onde: "A consulta inteira é reservada para o exame e a conversa, no consultório da Dra. Ana, sem corrida.",
    valores:
      "O valor da avaliação é informado pelo WhatsApp, na hora de agendar. O orçamento de qualquer tratamento só vem depois dela.",
    related: [
      { slug: "limpeza-dental", label: "Limpeza dental de rotina" },
      { slug: "prevencao", label: "Prevenção e retornos periódicos" },
      { slug: "clareamento-dental", label: "Clareamento dental com planejamento" },
    ],
    metaTitle: `Avaliação odontológica na ${locale.regiao} | ${marca}`,
    metaDescription: `Avaliação odontológica na ${loc}: exame clínico, diagnóstico explicado e plano de cuidado. Consulta de 40 a 60 minutos, em média.`,
    duration: "40 a 60 minutos",
    sessions: "1 consulta",
  },
  {
    slug: "limpeza-dental",
    layout: "linha",
    name: "Limpeza dental",
    shortName: "Limpeza",
    excerpt:
      "Limpeza profissional (profilaxia): remoção de placa e tártaro com técnica delicada e atenção ao seu conforto.",
    intro:
      "A limpeza profissional é um cuidado simples e importante para manter a boca saudável. Ela remove o que a escova não alcança e ajuda a prevenir problemas.",
    what: "Também chamada de profilaxia, é a remoção do biofilme e do tártaro acumulados sobre os dentes e na linha da gengiva, seguida de polimento. É um procedimento de rotina que acompanha vários outros cuidados odontológicos.",
    forWhom: [
      "Quem quer manter a saúde bucal em dia com acompanhamento regular",
      "Quem percebe gengivas mais sensíveis ou que sangram ao escovar",
      "Quem nota acúmulo de tártaro ou manchas superficiais",
      "Quem vai iniciar um tratamento estético e precisa preparar a base",
    ],
    benefits: [
      "Remoção da placa e do tártaro que a escovação não alcança",
      "Observação das gengivas a cada limpeza",
      "Orientação de higiene para a sua rotina",
      "Apoio à prevenção de cáries e de doença periodontal",
    ],
    steps: [
      {
        title: "Avaliação da gengiva",
        description: "Observação do estado das gengivas e do acúmulo de tártaro.",
      },
      {
        title: "Remoção do tártaro",
        description: "Limpeza cuidadosa da superfície dos dentes e da linha gengival.",
      },
      {
        title: "Polimento",
        description:
          "Acabamento que deixa a superfície dos dentes lisa, o que dificulta o acúmulo de placa.",
      },
      { title: "Orientação", description: "Dicas práticas de higiene para a sua rotina." },
    ],
    faqs: [
      {
        q: "A limpeza dental incomoda?",
        a: "A limpeza é feita com foco no conforto. Quando há sensibilidade, costuma ser leve e passageira, e o tempo varia de pessoa para pessoa. Se precisar de uma pausa, é só avisar.",
      },
      {
        q: "Quanto tempo dura a limpeza?",
        a: "Em geral, entre 40 minutos e 1 hora, dependendo da quantidade de tártaro acumulado e do estado das gengivas.",
      },
      {
        q: "De quanto em quanto tempo devo fazer a limpeza?",
        a: "A recomendação geral é a cada seis meses, mas o intervalo é definido na consulta, conforme a sua saúde bucal e os seus hábitos.",
      },
      {
        q: "Minha gengiva sangrou na limpeza. Devo me preocupar?",
        a: "O sangramento costuma indicar gengiva inflamada e pode diminuir conforme a higiene orientada. Se persistir, a situação é reavaliada.",
      },
    ],
    onde: "A limpeza é feita numa sessão, no consultório, e o retorno seguinte é combinado conforme o estado das suas gengivas.",
    valores:
      "O orçamento da limpeza depende da quantidade de tártaro e do estado das gengivas, vistos na consulta. A Dra. Ana apresenta o valor depois do exame, sem pressão.",
    related: [
      { slug: "prevencao", label: "Prevenção e retornos periódicos" },
      { slug: "clareamento-dental", label: "Clareamento dental, que começa com limpeza" },
      { slug: "avaliacao-odontologica", label: "Avaliação odontológica completa" },
    ],
    metaTitle: `Limpeza dental na ${locale.regiao} | ${marca}`,
    metaDescription: `Limpeza dental (profilaxia) na ${loc}: remoção de tártaro, polimento e orientação de higiene, com retornos periódicos.`,
    duration: "40 minutos a 1 hora",
    sessions: "1 sessão, com manutenção periódica",
    aftercare: [
      {
        title: "Sensibilidade leve",
        description:
          "Pode haver uma sensibilidade passageira, que tende a diminuir; o tempo varia de pessoa para pessoa.",
      },
      {
        title: "Higiene em dia",
        description:
          "Manter a escovação e o uso do fio dental ajuda a conservar a limpeza por mais tempo.",
      },
    ],
    warningSigns: [
      "Sangramento na gengiva que persiste por vários dias",
      "Dor que aumenta em vez de diminuir",
    ],
  },
  {
    slug: "clareamento-dental",
    layout: "colunas",
    name: "Clareamento dental",
    shortName: "Clareamento",
    excerpt:
      "Clareamento com gel de uso profissional e acompanhamento da Dra. Ana, do planejamento à manutenção.",
    intro:
      "O clareamento é feito depois de uma avaliação, com gel de uso profissional e acompanhamento da Dra. Ana. O tom é combinado com você.",
    what: "É um procedimento que usa géis clareadores de uso profissional para reduzir manchas e clarear os dentes. Pode ser feito em consultório, com técnica supervisionada, ou em casa com moldeiras personalizadas — sempre após avaliação.",
    forWhom: [
      "Quem deseja um tom mais claro dos dentes",
      "Quem percebe escurecimento dos dentes com o passar do tempo",
      "Quem quer um cuidado estético com acompanhamento profissional",
      "Quem já fez avaliação e teve a saúde bucal liberada para o procedimento",
    ],
    benefits: [
      "Acompanhamento profissional em cada etapa",
      "Protocolo ajustado à sua sensibilidade",
      "Técnica escolhida conforme o seu caso e a sua rotina",
      "Orientações para manter o tom por mais tempo",
    ],
    steps: [
      {
        title: "Avaliação prévia",
        description: "Confirmação de que a saúde bucal está pronta para o clareamento.",
      },
      {
        title: "Definição do protocolo",
        description: "Escolha da técnica mais adequada ao seu caso e à sua rotina.",
      },
      {
        title: "Aplicação acompanhada",
        description: "Realização do clareamento com atenção à sua sensibilidade.",
      },
      { title: "Manutenção", description: "Orientações para conservar o tom por mais tempo." },
    ],
    faqs: [
      {
        q: "O clareamento dental causa sensibilidade?",
        a: "Pode haver uma sensibilidade leve e passageira. O protocolo é ajustado ao seu caso, pensando no seu conforto.",
      },
      {
        q: "Qual a diferença entre clareamento em consultório e caseiro?",
        a: "No de consultório, o gel é aplicado pela dentista. No caseiro, você usa moldeiras personalizadas em casa, no seu ritmo. Há também o protocolo combinado, que une os dois. A opção para o seu caso é definida na avaliação.",
      },
      {
        q: "Quanto tempo dura o resultado do clareamento?",
        a: "Varia de pessoa para pessoa e depende de hábitos como o consumo de café, chá, vinho tinto e cigarro. Manutenções periódicas ajudam a conservar o tom.",
      },
      {
        q: "Existe alguma contraindicação?",
        a: "Sim. Gestantes, lactantes, adolescentes com a dentição ainda em formação e quem tem cáries ativas, gengiva inflamada ou sensibilidade acentuada podem precisar de cuidados ou de adiar o procedimento. Por isso a avaliação prévia é indispensável.",
      },
      {
        q: "Posso fazer clareamento se tenho restaurações ou facetas?",
        a: "Sim, mas o clareamento não age sobre restaurações, facetas ou coroas. Em alguns casos, pode ser necessário trocar restaurações visíveis depois do clareamento para harmonizar a cor do sorriso.",
      },
    ],
    onde: "Seja no consultório ou com moldeira em casa, o protocolo é definido e acompanhado aqui, com retornos combinados.",
    valores:
      "O orçamento depende da técnica escolhida (consultório, caseiro ou combinado) e do número de sessões. Ele sai depois da avaliação, e a decisão fica com você.",
    related: [
      { slug: "limpeza-dental", label: "Limpeza dental antes de clarear" },
      { slug: "restauracoes", label: "Restaurações e a cor do sorriso" },
      { slug: "avaliacao-odontologica", label: "Avaliação odontológica prévia" },
    ],
    metaTitle: `Clareamento dental na ${locale.regiao} | ${marca}`,
    metaDescription: `Clareamento dental na ${loc} com gel de uso profissional: consultório, caseiro ou combinado, conforme a avaliação.`,
    duration: "Varia conforme o protocolo",
    sessions: "1 a 3 sessões",
    notFor:
      "O clareamento não age sobre restaurações, facetas, coroas nem sobre manchas de origem interna profunda. Nesses casos, outras abordagens são avaliadas.",
    contraindications: [
      "Gestantes e lactantes",
      "Adolescentes com a dentição ainda em formação",
      "Cáries ativas, gengiva inflamada ou sensibilidade acentuada (tratadas antes)",
    ],
    aftercare: [
      {
        title: "Dieta nas primeiras 48h",
        description:
          "Evitar café, chá, vinho tinto, beterraba e outros alimentos pigmentados ajuda a conservar o tom.",
      },
      {
        title: "Sensibilidade",
        description:
          "Pode haver sensibilidade temporária; o protocolo é ajustado para o seu conforto.",
      },
    ],
  },
  {
    slug: "restauracoes",
    layout: "limite",
    name: "Restaurações",
    shortName: "Restaurações",
    excerpt: "Reconstrução do dente com resina, para recuperar a função e a aparência.",
    intro:
      "Quando um dente é afetado por cárie, desgaste ou uma pequena fratura, a restauração reconstrói o que foi perdido. O cuidado é técnico e estético ao mesmo tempo: recuperar a função e buscar um reparo discreto.",
    what: "É a reconstrução da estrutura do dente com materiais restauradores, como resinas que reproduzem a cor e a translucidez do esmalte. O foco é unir resistência e harmonia com o restante do sorriso.",
    forWhom: [
      "Quem tem cáries que precisam ser tratadas",
      "Quem possui restaurações antigas, escurecidas ou desgastadas",
      "Quem sofreu uma pequena fratura ou lascou um dente",
      "Quem deseja melhorar a aparência de restaurações visíveis",
    ],
    benefits: [
      "Remoção apenas do necessário, preservando o dente saudável",
      "Cor e contorno escolhidos para combinar com o dente",
      "Conferência da mordida e do polimento ao final",
      "Orientação para acompanhar a restauração ao longo do tempo",
    ],
    steps: [
      {
        title: "Diagnóstico",
        description: "Avaliação da extensão da cárie ou do desgaste a ser tratado.",
      },
      {
        title: "Preparo cuidadoso",
        description: "Remoção apenas do necessário, preservando o máximo do dente saudável.",
      },
      {
        title: "Restauração",
        description: "Aplicação do material restaurador com atenção à cor e ao contorno.",
      },
      {
        title: "Ajuste final",
        description: "Conferência da mordida e do polimento para um acabamento confortável.",
      },
    ],
    faqs: [
      {
        q: "A restauração é perceptível depois de pronta?",
        a: "O material é escolhido para se aproximar da cor do dente. O resultado depende de cada caso.",
      },
      {
        q: "Quanto tempo dura uma restauração?",
        a: "Depende do caso, do material utilizado e dos seus cuidados de higiene. O acompanhamento periódico ajuda a identificar desgastes cedo.",
      },
      {
        q: "Posso comer normalmente depois do procedimento?",
        a: "Na maioria dos casos, a alimentação pode ser retomada logo depois. A Dra. Ana orienta cada caso individualmente, conforme o tipo de restauração realizada.",
      },
      {
        q: "A restauração pode cair ou trincar?",
        a: "Como qualquer reparo, pode haver desgaste ao longo do tempo, sobretudo com bruxismo ou hábitos como roer unhas ou gelo. O acompanhamento periódico permite identificar e ajustar cedo.",
      },
    ],
    onde: "A restauração direta é feita no consultório, em geral numa sessão por dente, com ajuste da mordida ao final.",
    valores:
      "O orçamento depende de quantos dentes serão tratados, do tamanho de cada restauração e do material usado. Cada dente é examinado antes de qualquer valor ser apresentado.",
    related: [
      { slug: "clareamento-dental", label: "Clareamento dental e a cor das restaurações" },
      { slug: "prevencao", label: "Prevenção para cuidar do que já foi tratado" },
      { slug: "avaliacao-odontologica", label: "Avaliação para diagnosticar a cárie" },
    ],
    metaTitle: `Restaurações dentárias na ${locale.regiao} | ${marca}`,
    metaDescription: `Restaurações dentárias na ${loc}: reconstrução do dente com resina, atenção à cor, ao contorno e à mordida.`,
    duration: "30 a 60 minutos por dente",
    sessions: "Em geral 1 sessão por restauração",
    notFor:
      "Quando a estrutura do dente está muito comprometida, a restauração direta pode não ser suficiente. Outras opções (coroa, tratamento de canal) são avaliadas na consulta.",
    aftercare: [
      {
        title: "Sensibilidade inicial",
        description:
          "Pode haver leve sensibilidade ao frio ou ao quente, que tende a diminuir; o tempo varia de pessoa para pessoa.",
      },
      {
        title: "Ajuste de mordida",
        description:
          "Se sentir que a restauração está alta ao morder, entre em contato para um ajuste simples.",
      },
    ],
    warningSigns: [
      "Dor que aumenta em vez de diminuir",
      "Sensibilidade persistente por mais de alguns dias",
    ],
  },
  {
    slug: "prevencao",
    layout: "linha",
    name: "Prevenção odontológica",
    shortName: "Prevenção",
    excerpt:
      "Acompanhamento regular e orientação para cuidar da boca antes que os problemas apareçam.",
    intro:
      "Cuidar antes costuma ser mais simples. A prevenção reúne os hábitos e o acompanhamento que ajudam a manter a sua boca saudável ao longo do tempo.",
    what: "É um conjunto de cuidados contínuos: consultas periódicas, limpeza profissional, orientação de higiene e identificação precoce de qualquer alteração. É a base de um acompanhamento tranquilo da sua saúde bucal.",
    forWhom: [
      "Quem quer manter a saúde bucal estável e evitar surpresas",
      "Famílias que buscam acompanhamento odontológico de rotina",
      "Quem teve problemas no passado e quer acompanhar de perto",
      "Quem quer cuidar de tratamentos estéticos já realizados",
    ],
    benefits: [
      "Consultas periódicas para acompanhar a sua saúde bucal",
      "Identificação precoce de pequenas alterações",
      "Hábitos de higiene ajustados à sua rotina",
      "Frequência de retorno definida para o seu caso",
    ],
    steps: [
      {
        title: "Consulta de rotina",
        description: "Avaliação periódica para acompanhar a evolução da saúde bucal.",
      },
      {
        title: "Limpeza profissional",
        description: "Remoção de placa e tártaro como cuidado preventivo regular.",
      },
      {
        title: "Orientação personalizada",
        description: "Recomendações de higiene e hábitos adequados ao seu caso.",
      },
      {
        title: "Acompanhamento",
        description: "Definição da frequência de retorno para manter tudo em ordem.",
      },
    ],
    faqs: [
      {
        q: "Com que frequência devo ir ao dentista para prevenção?",
        a: "Geralmente, a cada seis meses. O intervalo é individual e definido na consulta, conforme a sua saúde bucal e os seus hábitos.",
      },
      {
        q: "Prevenção vale a pena mesmo sem sintomas ou queixa?",
        a: "Sim. Muitas alterações são silenciosas no início, e o acompanhamento regular permite identificá-las cedo.",
      },
      {
        q: "A partir de qual idade as crianças podem fazer acompanhamento?",
        a: "O atendimento é para crianças a partir de 7 anos. O acompanhamento desde cedo ajuda a criar hábitos saudáveis.",
      },
    ],
    onde: "Os retornos de prevenção são consultas no consultório, em geral a cada seis meses, combinadas com você.",
    valores:
      "O orçamento depende de quais cuidados entram no seu acompanhamento e de com que frequência você volta. O valor é apresentado depois da avaliação, sem pressão para fechar.",
    related: [
      { slug: "limpeza-dental", label: "Limpeza dental profissional" },
      { slug: "avaliacao-odontologica", label: "Avaliação odontológica inicial" },
      { slug: "restauracoes", label: "Restaurações, quando há cárie" },
    ],
    metaTitle: `Prevenção odontológica na ${locale.regiao} | ${marca}`,
    metaDescription: `Prevenção odontológica na ${loc}: consultas de rotina, limpeza profissional e orientação de higiene para o seu caso.`,
    duration: "40 a 60 minutos por consulta",
    sessions: "Retornos periódicos (em geral a cada 6 meses)",
  },
  {
    slug: "cirurgia-oral",
    name: "Cirurgia oral",
    shortName: "Cirurgia",
    excerpt:
      "Remoção de sisos e de dentes que não têm como ser restaurados, além de pequenas cirurgias, com anestesia local e retorno combinado.",
    intro:
      "Quando um siso incomoda ou um dente quebrou além do reparo, a conversa começa pelo que será feito, por como é a recuperação e por quando você volta ao consultório.",
    what: "Cirurgia oral reúne os procedimentos feitos com anestesia local no próprio consultório: remover um siso, extrair um dente que não tem mais como ser restaurado e fazer pequenas intervenções na gengiva. A indicação sai do exame clínico e, quando necessário, da radiografia.",
    forWhom: [
      "Quem sente dor, inchaço ou pressão no fundo da boca, na região do siso",
      "Quem quebrou um dente e não há como restaurá-lo",
      "Quem foi orientado por outro profissional a extrair um dente",
      "Quem quer uma segunda opinião antes de decidir pela extração",
    ],
    benefits: [
      "Indicação confirmada no exame, antes de qualquer corte",
      "Anestesia local, com pausas combinadas com você",
      "Orientações para o dia da cirurgia e para os dias seguintes",
      "Retorno marcado para ver a cicatrização",
    ],
    steps: [
      {
        title: "Exame e radiografia",
        description: "Exame da boca e radiografia para confirmar se a extração é mesmo o caminho.",
      },
      {
        title: "Conversa sobre o plano",
        description:
          "Explicação das opções, dos riscos e dos cuidados, para você decidir com calma.",
      },
      {
        title: "A extração",
        description: "Remoção do dente com anestesia local; as pausas são combinadas com você.",
      },
      {
        title: "Cicatrização e retorno",
        description:
          "Orientações para casa e uma consulta para acompanhar como a região está cicatrizando.",
      },
    ],
    faqs: [
      {
        q: "Como é a extração de um siso?",
        a: "É feita com anestesia local, no consultório, e as pausas são combinadas com você. Depois, pode haver algum desconforto, acompanhado com a medicação orientada para o seu caso.",
      },
      {
        q: "Preciso fazer radiografia antes?",
        a: "Na maioria dos casos, sim. A imagem mostra a posição do dente e da raiz e ajuda a planejar a extração. O exame necessário é orientado na avaliação.",
      },
      {
        q: "Como sei se o meu siso está inflamado?",
        a: "Sinais comuns são dor na região do fundo da boca, inchaço, gengiva avermelhada, dificuldade para abrir a boca ou para mastigar e, às vezes, mau gosto. Diante desses sinais, procure avaliação: em casos agudos, é uma urgência.",
      },
      {
        q: "Todo siso precisa ser removido?",
        a: "Nem todo. O siso que nasceu bem e consegue ser higienizado pode ficar. A decisão vem do exame e da radiografia, e as alternativas são conversadas com você.",
      },
      {
        q: "Quanto tempo leva a recuperação?",
        a: "Varia de pessoa para pessoa e conforme a dificuldade da extração. A Dra. Ana orienta o seu caso e marca o retorno para ver a cicatrização.",
      },
    ],
    onde: "A extração é feita no consultório, com anestesia local, e o retorno para ver a cicatrização é marcado no mesmo lugar.",
    valores:
      "O orçamento depende de quantos dentes serão removidos, da dificuldade de cada extração e dos exames pedidos. Ele vem depois do exame, com as opções explicadas.",
    related: [
      { slug: "cirurgia-buco-maxilo-facial", label: "Remoção de dentes inclusos" },
      { slug: "implante", label: "Implante para repor um dente extraído" },
      { slug: "avaliacao-odontologica", label: "Avaliação antes da cirurgia" },
    ],
    // "siso" no título, na descrição e no H2 (whatTitle): esta é a página da busca por extração de siso
    metaTitle: `Extração de siso e cirurgia oral na ${locale.regiao}`,
    whatTitle: "O que é a extração de siso e a cirurgia oral",
    metaDescription: `Extração de siso e de dentes sem conserto na ${loc}, com anestesia local e retorno para acompanhar a cicatrização.`,
    duration: "40 a 60 minutos em média",
    sessions: "Geralmente 1 sessão, com retorno para acompanhar a cicatrização",
    preparation: [
      "Conte, na avaliação, sobre medicamentos de uso contínuo, alergias e condições de saúde",
      "Em geral não é preciso jejum para anestesia local, mas as orientações do seu caso vêm antes da data",
      "Combine o dia com antecedência: em alguns casos é recomendado ir acompanhado",
    ],
    contraindications: [
      "Infecção aguda no local pode pedir tratamento antes da extração",
      "Alguns medicamentos e condições de saúde pedem cuidados específicos, avaliados caso a caso",
      "Como em qualquer cirurgia, há riscos, como sangramento, infecção e dormência temporária; eles e as alternativas à extração são explicados na avaliação",
    ],
    aftercare: [
      {
        title: "Repouso e gelo",
        description:
          "No dia da cirurgia, descanse e aplique compressa fria por fora do rosto, nos intervalos indicados.",
      },
      {
        title: "Alimentação",
        description:
          "Prefira alimentos macios, frios ou mornos nos primeiros dias, mastigando do lado oposto.",
      },
      {
        title: "Higiene e medicação",
        description:
          "Siga as orientações de higiene da região e tome a medicação conforme prescrito.",
      },
    ],
    warningSigns: [
      "Sangramento intenso que não cede com compressão",
      "Inchaço que cresce muito após o terceiro dia",
      "Febre ou dor que aumenta com o passar dos dias",
      "Dificuldade para respirar ou engolir: ligue 192 ou vá a um pronto-socorro",
    ],
  },
  {
    slug: "implante",
    layout: "limite",
    name: "Implante dentário",
    shortName: "Implante",
    excerpt:
      "Reposição de dentes perdidos com implantes, com planejamento individual e avaliação criteriosa.",
    intro:
      "Perder um dente muda mais do que a aparência: afeta a mastigação, a fala e, muitas vezes, a confiança. O implante é uma forma de repor o dente perdido, sempre a partir de um planejamento individual.",
    what: "O implante dentário é um pino de titânio colocado no osso, no lugar da raiz do dente perdido. Sobre ele vai uma coroa, que repõe a parte visível do dente. É uma reabilitação que une cirurgia e prótese, conduzida em etapas e planejada com exames de imagem (radiografias ou tomografia).",
    forWhom: [
      "Quem perdeu um ou mais dentes e deseja recuperar a mastigação",
      "Quem usa prótese removível e busca uma solução mais estável",
      "Quem teve indicação de extração e quer planejar a reposição",
      "Quem busca uma segunda opinião antes de decidir pelo procedimento",
    ],
    benefits: [
      "Planejamento com exames de imagem (radiografias ou tomografia)",
      "Opções explicadas antes de qualquer decisão",
      "Cirurgia e prótese conduzidas em etapas, com acompanhamento",
      "Orientação sobre higiene e manutenção ao longo do tempo",
    ],
    steps: [
      {
        title: "Avaliação e planejamento",
        description:
          "Exame clínico e análise de imagens (radiografias ou tomografia) para avaliar o osso e planejar o implante.",
      },
      {
        title: "Instalação do implante",
        description:
          "Procedimento cirúrgico realizado sob anestesia local, com foco no seu conforto.",
      },
      {
        title: "Osseointegração",
        description:
          "Período em que o implante se integra ao osso. O tempo varia conforme cada caso e é acompanhado de perto.",
      },
      {
        title: "Coroa definitiva",
        description: "Instalação da coroa no lugar do dente perdido, com ajuste da mordida.",
      },
    ],
    faqs: [
      {
        q: "Como é a instalação do implante?",
        a: "O procedimento é feito sob anestesia local, com foco no conforto. No pós-operatório pode haver desconforto, acompanhado com a medicação orientada para o seu caso.",
      },
      {
        q: "Quanto tempo demora o tratamento com implante?",
        a: "Depende de cada caso. Entre a instalação do implante e a coroa definitiva costuma haver um período de cicatrização (osseointegração) de alguns meses. O tempo exato é estimado após a avaliação.",
      },
      {
        q: "Todo mundo pode fazer implante?",
        a: "É preciso avaliar a saúde geral, a qualidade do osso e as condições da gengiva. Algumas situações pedem cuidados ou etapas prévias, definidos na avaliação com exames de imagem.",
      },
      {
        q: "Quanto tempo dura um implante?",
        a: "Depende da higiene, do acompanhamento regular e da manutenção ao longo do tempo. Como qualquer reabilitação, o implante precisa de cuidados para se manter saudável.",
      },
      {
        q: "Preciso fazer tomografia antes?",
        a: "Na maioria dos casos, sim. A tomografia mostra o volume e a qualidade do osso e a posição de estruturas importantes, e permite planejar o implante com mais cuidado. O exame necessário é orientado na avaliação.",
      },
    ],
    onde: "A avaliação com exames de imagem e o acompanhamento das etapas são feitos no consultório.",
    valores:
      "O orçamento depende de quantos implantes o seu caso pede, das etapas prévias necessárias e do tipo de prótese. O plano e o orçamento são apresentados juntos, depois da avaliação.",
    related: [
      { slug: "cirurgia-oral", label: "Cirurgia oral, quando há dente a extrair" },
      { slug: "prevencao", label: "Prevenção e manutenção ao longo do tempo" },
      { slug: "avaliacao-odontologica", label: "Avaliação para planejar o implante" },
    ],
    metaTitle: `Implante dentário na ${locale.regiao} | ${marca}`,
    metaDescription: `Implante dentário na ${loc}: reposição de dentes perdidos em etapas, com planejamento por imagem e avaliação.`,
    duration: "Instalação: cerca de 1 hora (varia por caso)",
    sessions: "Tratamento em etapas, ao longo de alguns meses",
    notFor:
      "O implante não é uma solução única para todos os casos. Quando o osso é insuficiente ou há outras condições, podem ser necessárias etapas prévias (como enxerto) ou alternativas, sempre avaliadas individualmente.",
    contraindications: [
      "Gengiva inflamada ou doença periodontal ativa precisam ser tratadas antes",
      "Algumas condições de saúde e o tabagismo exigem cuidados específicos, avaliados caso a caso",
      "Como em qualquer cirurgia, há riscos, como infecção, falha de integração ao osso ou necessidade de refazer etapas; eles e as alternativas ao implante são explicados na avaliação",
    ],
    preparation: [
      "Informe medicamentos de uso contínuo, alergias e condições de saúde na avaliação",
      "Leve exames de imagem recentes, se tiver (radiografias ou tomografia)",
      "Siga as orientações pré-operatórias passadas para o seu caso",
    ],
    aftercare: [
      {
        title: "Repouso e gelo",
        description:
          "Descanse após a instalação e use compressa fria por fora do rosto, como orientado, para o inchaço.",
      },
      {
        title: "Alimentação",
        description:
          "Prefira alimentos macios, frios ou mornos nos primeiros dias, mastigando do lado oposto ao da cirurgia.",
      },
      {
        title: "Higiene e medicação",
        description:
          "Mantenha a higiene conforme orientado e tome a medicação prescrita nos horários indicados.",
      },
    ],
    warningSigns: [
      "Sangramento intenso que não cede com compressão",
      "Inchaço que aumenta muito após o terceiro dia",
      "Febre ou dor que cresce com o passar dos dias",
      "Dificuldade para respirar ou engolir: ligue 192 ou vá a um pronto-socorro",
    ],
  },
  {
    slug: "cirurgia-buco-maxilo-facial",
    layout: "limite",
    name: "Remoção de dentes inclusos e cirurgias na boca",
    shortName: "Dentes inclusos",
    excerpt:
      "Quando o dente não conseguiu nascer por inteiro ou a cirurgia depende de imagem, o plano vem da radiografia ou da tomografia, antes de qualquer procedimento.",
    intro:
      "Um dente incluso fica retido sob a gengiva ou o osso e nem sempre dá sinal. Por isso o caminho começa pela imagem: só depois de ver o dente e o que há ao redor a Dra. Ana propõe o que fazer.",
    what: "Dente incluso é o que não conseguiu nascer por completo e ficou coberto, em parte ou totalmente, por gengiva ou osso. Pode ser um siso, mas também outros dentes. A remoção é planejada com radiografia ou tomografia, que mostram a posição do dente e a distância até estruturas vizinhas.",
    forWhom: [
      "Quem recebeu uma radiografia indicando dente incluso ou retido",
      "Quem sente dor ou pressão sem causa aparente e quer investigar com imagem",
      "Quem vai fazer um tratamento e foi orientado a avaliar um dente retido",
      "Quem quer uma segunda opinião sobre um dente incluso, com a imagem em mãos",
    ],
    benefits: [
      "A imagem é lida com você, mostrando onde o dente está",
      "Nervos e estruturas vizinhas avaliados antes da indicação",
      "Opções e riscos apresentados antes da decisão",
      "Retornos para acompanhar a cicatrização",
    ],
    steps: [
      {
        title: "Imagem do dente",
        description:
          "Radiografia ou tomografia mostram a posição do dente incluso e o que existe ao redor.",
      },
      {
        title: "Leitura e plano",
        description: "A Dra. Ana explica o que a imagem mostra, as opções e os riscos de cada uma.",
      },
      {
        title: "Remoção",
        description:
          "Procedimento com anestesia local e plano definido antes; o acesso e o tempo variam conforme a posição do dente.",
      },
      {
        title: "Retorno",
        description: "Consulta para ver a cicatrização e esclarecer dúvidas do pós-operatório.",
      },
    ],
    faqs: [
      {
        q: "O que é um dente incluso?",
        a: "É o dente que não conseguiu nascer por completo e ficou coberto, em parte ou totalmente, por gengiva ou osso.",
      },
      {
        q: "Um dente incluso sempre precisa ser removido?",
        a: "Não. A indicação depende da posição do dente, dos sintomas e do risco para os dentes vizinhos. Em alguns casos, acompanhar por imagem é uma alternativa.",
      },
      {
        q: "Preciso de tomografia?",
        a: "Com frequência, sim. A imagem mostra a posição de raízes, nervos e estruturas vizinhas e permite planejar o procedimento. O exame necessário é orientado na avaliação.",
      },
      {
        q: "A remoção é feita no consultório?",
        a: "Procedimentos de pequeno porte podem ser realizados em consultório, sob anestesia local. Casos mais complexos são avaliados individualmente, e o local e a abordagem são definidos no planejamento.",
      },
      {
        q: "Como é a recuperação?",
        a: "Depende da posição do dente e do organismo de cada pessoa. Você recebe orientações de cuidado e retornos para acompanhar a cicatrização.",
      },
    ],
    onde: "Traga a radiografia ou a tomografia que já tiver: a leitura da imagem é feita na avaliação, no consultório.",
    valores:
      "O orçamento depende da posição do dente, do exame de imagem necessário e da complexidade do procedimento. Primeiro vem a imagem; o orçamento, depois da avaliação.",
    related: [
      { slug: "cirurgia-oral", label: "Cirurgia oral: sisos e extrações" },
      { slug: "implante", label: "Implante para repor um dente" },
      { slug: "avaliacao-odontologica", label: "Avaliação odontológica com imagem" },
    ],
    metaTitle: `Dentes inclusos na ${locale.regiao} | ${marca}`,
    metaDescription: `Dente incluso ou retido na ${loc}: diagnóstico por imagem, quando remover e quando acompanhar, com anestesia local.`,
    duration: "Varia conforme o procedimento",
    sessions: "Geralmente 1 sessão, com retornos de acompanhamento",
    notFor:
      "Dente incluso nem sempre precisa ser removido. Quando não há sintoma nem risco, acompanhar por imagem pode ser a escolha, e isso é conversado na avaliação.",
    contraindications: [
      "Infecção ativa na região pode adiar o procedimento até ser tratada",
      "Medicamentos de uso contínuo e algumas condições de saúde mudam o preparo e são avaliados caso a caso",
      "Por depender de imagem e ficar perto de estruturas como os nervos, a cirurgia tem riscos, como dormência temporária, sangramento e infecção; eles e as alternativas são explicados na avaliação",
    ],
    preparation: [
      "Leve a radiografia ou a tomografia que você já tiver, mesmo de outro consultório",
      "Informe medicamentos de uso contínuo, alergias e doenças na avaliação",
      "Se o procedimento for mais longo, pode ser recomendado ir e voltar acompanhado",
    ],
    aftercare: [
      {
        title: "No primeiro dia",
        description: "Descanse e aplique compressa fria por fora do rosto, como orientado.",
      },
      {
        title: "Alimentação",
        description: "Alimentos macios, frios ou mornos enquanto a região estiver sensível.",
      },
      {
        title: "Higiene e medicação",
        description: "Cuide da região conforme as orientações e tome a medicação como prescrito.",
      },
    ],
    warningSigns: [
      "Sangramento que continua mesmo com compressão firme",
      "Inchaço que piora depois do terceiro dia",
      "Febre, ou dor que cresce em vez de diminuir",
      "Formigamento ou dormência que não melhora",
      "Dificuldade para respirar ou engolir: ligue 192 ou vá a um pronto-socorro",
    ],
  },
];

export function getTreatment(slug: string): Treatment | undefined {
  return treatments.find((t) => t.slug === slug);
}

/** Há algo a mostrar em "O que considerar com cuidado"? (só os campos que existem) */
export function hasCareNotes(t: Treatment): boolean {
  return Boolean(
    t.notFor ||
    t.contraindications?.length ||
    t.preparation?.length ||
    t.aftercare?.length ||
    t.warningSigns?.length,
  );
}

export const treatmentSlugs = treatments.map((t) => t.slug);
