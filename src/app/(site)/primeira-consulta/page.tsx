import type { Metadata } from "next";
import { locale, localeTexto } from "@/lib/site-config";
import {
  breadcrumbSchema,
  buildMetadata,
  exclusiveFaqs,
  faqSchema,
  medicalWebPageSchema,
} from "@/lib/seo";
import { respostas } from "@/lib/content";
import { waMessages } from "@/lib/whatsapp";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { AgendarCTA, WhatsAppCTA } from "@/components/ui/cta";
import { FAQSection } from "@/components/sections/faq-section";
import { CTASection } from "@/components/sections/cta-section";
import { ApoioCabeca } from "@/components/sections/apoio-cabeca";
import { ApoioHero } from "@/components/sections/apoio-hero";
import { ApoioTempo } from "@/components/sections/apoio-tempo";
import { ApoioPassos } from "@/components/sections/apoio-passos";
import { ApoioQA } from "@/components/sections/apoio-qa";
import { ApoioDeclaracao } from "@/components/sections/apoio-declaracao";
import { ApoioAutoria } from "@/components/sections/apoio-autoria";

const PATH = "/primeira-consulta";
const TITLE = `Primeira consulta no dentista na ${locale.regiao} | Dra. Ana`;

export const metadata: Metadata = buildMetadata({
  absoluteTitle: TITLE,
  description: `Como é a primeira consulta com a Dra. Ana Beatriz, na ${localeTexto("regiaoZona")}: conversa, exame, diagnóstico e plano de cuidado.`,
  path: PATH,
});

const steps = [
  {
    title: "Acolhimento e conversa",
    description: `No consultório da ${locale.bairro}, ${locale.zona}: um momento para entender a sua história, a sua rotina e o que trouxe você até aqui. Você fala sem pressa.`,
  },
  {
    title: "Exame clínico detalhado",
    description:
      "Avaliação dos dentes, das gengivas e da mordida, com registro fotográfico ou radiografia quando indicado.",
  },
  {
    title: "Diagnóstico explicado",
    description:
      "A Dra. Ana mostra o que foi encontrado em linguagem simples, para que você entenda cada detalhe.",
  },
  {
    title: "Plano de tratamento",
    description:
      "Prioridades organizadas, próximos passos e um orçamento transparente, sem surpresas.",
  },
];

const practicalQuestions = [
  {
    q: "Preciso levar algo?",
    a: "Um documento e, se tiver, radiografias ou exames recentes. Se não tiver, o que for necessário é pedido na própria consulta.",
  },
  { q: "Atende crianças?", a: respostas.idade },
  { q: "Atende convênio?", a: respostas.convenio },
];

/** A mesma lista vai ao <FAQ> (via FAQSection) e ao JSON-LD; nenhuma pergunta repete a da home. */
const faqs = [
  {
    q: "Já saio com o tratamento feito?",
    a: "A primeira consulta é focada em avaliar e planejar. Procedimentos costumam ser agendados nas consultas seguintes, respeitando o seu tempo e as suas prioridades.",
  },
  {
    q: "Por que não dá para saber o valor antes?",
    a: "O orçamento é apresentado após a avaliação, quando já se sabe o que de fato é necessário. Por se tratar de saúde, não é possível dar valores precisos antes de examinar cada caso.",
  },
  {
    q: "O que a Dra. Ana examina?",
    a: "Os dentes, as gengivas e a mordida, com registro fotográfico ou radiografia quando indicado. Depois, ela explica o que encontrou em linguagem simples.",
  },
  {
    q: "E se eu estiver com medo?",
    a: "Conte isso logo no início. A primeira consulta pode ser apenas uma conversa e avaliação, e nada é feito sem a sua autorização e sem que você esteja confortável.",
  },
  {
    q: "Posso conversar antes de marcar?",
    a: `Sim. Você pode falar pelo WhatsApp para tirar dúvidas e entender como funciona antes de agendar, sem compromisso. ${respostas.orientacaoWhatsapp}`,
  },
];

const medicalSchema = medicalWebPageSchema({
  path: PATH,
  name: TITLE,
  description:
    "Como funciona a primeira consulta com a Dra. Ana Beatriz: conversa, exame clínico, diagnóstico explicado e plano de tratamento.",
});

/**
 * /primeira-consulta (DESIGN.md 5.7): osso (abertura com o tempo da consulta) · verde (4 passos em
 * linha do tempo) · osso (perguntas práticas em duas colunas) · papel (declaração) · osso (dúvidas) ·
 * papel (fecho com waMessages.firstVisit).
 */
export default function PrimeiraConsultaPage() {
  return (
    <>
      <JsonLd
        data={[
          medicalSchema,
          faqSchema(exclusiveFaqs(faqs)),
          breadcrumbSchema([
            { name: "Início", path: "/" },
            { name: "Primeira consulta", path: PATH },
          ]),
        ]}
      />

      <ApoioHero
        kicker="Primeira consulta"
        title="Sua primeira consulta, sem julgamento e no seu tempo"
        lede="Você não precisa chegar sabendo qual tratamento precisa. A avaliação existe justamente para isso: uma conversa cuidadosa para entender a sua saúde bucal e organizar as prioridades com clareza."
        breadcrumbs={[{ name: "Início", href: "/" }, { name: "Primeira consulta" }]}
        actions={
          <>
            <WhatsAppCTA location="first_visit_hero" message={waMessages.firstVisit} />
            <AgendarCTA location="first_visit_hero" />
          </>
        }
        mobileMark={<ApoioTempo mini />}
        aside={<ApoioTempo legenda={respostas.duracao} />}
      />

      <Section tone="verde" id="passo-a-passo" aria-labelledby="passo-a-passo-titulo">
        <Container>
          <ApoioCabeca
            id="passo-a-passo-titulo"
            kicker="Passo a passo"
            title="O que acontece na primeira consulta"
          >
            Cada etapa tem um propósito: acolher você, entender o seu caso e construir um caminho
            claro, sempre com o seu consentimento.
          </ApoioCabeca>
          <div className="mt-12">
            <ApoioPassos items={steps} />
          </div>
        </Container>
      </Section>

      <Section tone="osso" id="perguntas-praticas" aria-labelledby="perguntas-praticas-titulo">
        <Container>
          <ApoioCabeca
            id="perguntas-praticas-titulo"
            kicker="Antes de agendar"
            title="Perguntas práticas, respondidas"
          />
          <div className="mt-12">
            <ApoioQA items={practicalQuestions} />
          </div>
        </Container>
      </Section>

      <ApoioDeclaracao
        id="sem-pressa"
        tone="papel"
        kicker="Sem pressão"
        title="Você não precisa chegar com tudo decidido"
      >
        <p>
          A ideia não é empurrar tratamento, é organizar prioridades. A primeira consulta serve para
          escutar você, entender o que está acontecendo e mostrar, com honestidade, o que merece
          atenção primeiro.
        </p>
        <p>
          Antes de qualquer procedimento, você entende o que foi encontrado, quais caminhos existem
          e o que faz sentido para o seu caso. As decisões são tomadas em conjunto, no seu tempo.
        </p>
      </ApoioDeclaracao>

      <FAQSection
        items={faqs}
        tone="osso"
        eyebrow="Dúvidas sobre a primeira consulta"
        title="Perguntas frequentes"
        whatsappMessage={waMessages.questions}
      />

      <CTASection tone="papel" message={waMessages.firstVisit} />

      <ApoioAutoria tone="osso" />
    </>
  );
}
