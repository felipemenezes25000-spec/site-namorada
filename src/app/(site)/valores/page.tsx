import type { Metadata } from "next";
import { locale, localeTexto } from "@/lib/site-config";
import {
  breadcrumbSchema,
  buildMetadata,
  exclusiveFaqs,
  faqSchema,
  medicalWebPageSchema,
} from "@/lib/seo";
import { waMessages } from "@/lib/whatsapp";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { AgendarCTA, WhatsAppCTA } from "@/components/ui/cta";
import { FAQSection } from "@/components/sections/faq-section";
import { CTASection } from "@/components/sections/cta-section";
import { ApoioCabeca } from "@/components/sections/apoio-cabeca";
import { ApoioCinco } from "@/components/sections/apoio-cinco";
import { ApoioDuas } from "@/components/sections/apoio-duas";
import { ApoioHero } from "@/components/sections/apoio-hero";
import { ApoioPrincipios } from "@/components/sections/apoio-principios";
import { ApoioLinha } from "@/components/sections/apoio-linha";
import { ApoioDeclaracao } from "@/components/sections/apoio-declaracao";
import { ApoioAutoria } from "@/components/sections/apoio-autoria";

const PATH = "/valores";
const TITLE = "Como funcionam valores e orçamento na Freguesia do Ó";

export const metadata: Metadata = buildMetadata({
  absoluteTitle: TITLE,
  description: `Atendimento particular, ${localeTexto("regiaoZona")}. O valor da avaliação é informado ao agendar; o orçamento, só depois do exame.`,
  path: PATH,
});

const principles = [
  {
    title: "Atendimento exclusivamente particular",
    description: `Atendimento particular no consultório da ${locale.bairro}, ${locale.zona}, sem convênios ou planos de saúde. Cada consulta tem o tempo que o seu caso pede.`,
  },
  {
    title: "Orçamento só após avaliação clínica",
    description:
      "Cada caso é único: é o diagnóstico que define o que precisa ser feito. Depois da avaliação, você recebe o plano completo, com etapas e orçamento. O valor da consulta de avaliação é informado pelo WhatsApp ao agendar.",
  },
  {
    title: "Sem pressão para fechar na hora",
    description:
      "Você recebe o plano, leva para casa se quiser, pensa com calma e decide no seu tempo. Não existe venda na consulta.",
  },
  {
    title: "Transparência em cada etapa",
    description:
      "Antes de qualquer procedimento, você sabe o que será feito, por que está sendo indicado e quanto custa. Sem surpresas no final.",
  },
];

const PRINCIPIOS_N = principles.length;

const budgetSteps = [
  {
    title: "Você agenda a avaliação",
    description: "Pelo WhatsApp ou pelo formulário, em um horário que combine com a sua rotina.",
  },
  {
    title: "Exame e diagnóstico",
    description:
      "Na consulta, a Dra. Ana faz o exame clínico, explica o diagnóstico e monta o plano de cuidado.",
  },
  {
    title: "Plano e orçamento",
    description: "Você recebe o plano com etapas, prioridades e orçamento, e decide no seu tempo.",
  },
];

/** A mesma lista vai ao <FAQ> (via FAQSection) e ao JSON-LD; nenhuma pergunta repete a da home. */
const faqs = [
  {
    q: "O atendimento é particular?",
    a: "Sim. O atendimento é particular, sem convênios ou planos de saúde.",
  },
  {
    q: "Por que o orçamento do tratamento não é passado por WhatsApp?",
    a: "Porque o tratamento depende do exame clínico, e um valor dado sem examinar poderia criar expectativas incorretas. O orçamento é apresentado depois da avaliação. Já o valor da consulta de avaliação é informado pelo WhatsApp ao agendar.",
  },
  {
    q: "Posso levar o orçamento para pensar?",
    a: "Pode, sim. Você recebe o plano por etapas, leva para casa se quiser e responde quando se sentir seguro. Não existe venda na consulta.",
  },
];

const pageSchema = medicalWebPageSchema({
  path: PATH,
  name: TITLE,
  description:
    "Como funcionam os valores no atendimento da Dra. Ana Beatriz: atendimento particular e orçamento apresentado após a avaliação clínica.",
});

/**
 * /valores (DESIGN.md 5.8): osso (abertura com o numeral 4) · papel (quatro princípios em numerais
 * monumentais) · osso (como o orçamento é apresentado, em fio com losangos) · noite (declaração) ·
 * papel (dúvidas) · osso (fecho). Sem preço, desconto ou comparação.
 */
export default function ValoresPage() {
  return (
    <>
      <JsonLd
        data={[
          pageSchema,
          faqSchema(exclusiveFaqs(faqs)),
          breadcrumbSchema([
            { name: "Início", path: "/" },
            { name: "Como funcionam os valores", path: PATH },
          ]),
        ]}
      />

      <ApoioHero
        kicker="Valores"
        title="Como funcionam os valores"
        lede="Transparência é a base de qualquer relação de confiança. Veja como funciona o atendimento e por que o orçamento só vem depois da avaliação."
        breadcrumbs={[{ name: "Início", href: "/" }, { name: "Como funcionam os valores" }]}
        actions={
          <>
            <WhatsAppCTA location="valores_hero" message={waMessages.questions} />
            <AgendarCTA location="valores_hero" />
          </>
        }
        mobileMark={<ApoioCinco n={PRINCIPIOS_N} mini />}
        aside={
          <ApoioCinco
            n={PRINCIPIOS_N}
            legenda="Não publicamos tabela de preços porque cada caso depende de avaliação clínica. Mas você merece clareza sobre como funciona."
          />
        }
      />

      <Section tone="papel" id="principios" aria-labelledby="principios-titulo">
        <Container>
          <ApoioCabeca
            id="principios-titulo"
            kicker="Transparência"
            title="O que você precisa saber antes de agendar"
          >
            Quatro princípios que valem para toda consulta.
          </ApoioCabeca>
          <div className="mt-12">
            <ApoioPrincipios items={principles} />
          </div>
        </Container>
      </Section>

      <Section tone="osso" id="orcamento" aria-labelledby="orcamento-titulo">
        <Container>
          <ApoioDuas
            larga
            esquerda={
              <ApoioCabeca
                id="orcamento-titulo"
                kicker="Na prática"
                title="Como o orçamento é apresentado"
              />
            }
            direita={<ApoioLinha items={budgetSteps} />}
          />
        </Container>
      </Section>

      <ApoioDeclaracao
        id="avaliacao-clinica"
        tone="noite"
        size="grande"
        marca
        title="Não é possível passar orçamento sem avaliação clínica."
      >
        <p>
          Cada caso precisa ser examinado antes. Depois da avaliação, a Dra. Ana apresenta o plano
          de tratamento e o orçamento, sem pressão para decidir na hora.
        </p>
      </ApoioDeclaracao>

      <FAQSection
        items={faqs}
        tone="papel"
        eyebrow="Dúvidas sobre valores"
        title="Perguntas frequentes"
        whatsappMessage={waMessages.questions}
      />

      <CTASection tone="osso" />

      <ApoioAutoria tone="papel" />
    </>
  );
}
