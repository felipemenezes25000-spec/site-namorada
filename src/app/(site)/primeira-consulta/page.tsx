import type { Metadata } from "next";
import { CalendarDays, MessageCircle } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { buildMetadata, breadcrumbSchema, faqSchema } from "@/lib/seo";
import { whatsappLink, waMessages } from "@/lib/whatsapp";
import { JsonLd } from "@/components/seo/json-ld";
import { PageHero } from "@/components/sections/page-hero";
import { FAQSection } from "@/components/sections/faq-section";
import { CTASection } from "@/components/sections/cta-section";
import { TrackedButtonLink } from "@/components/ui/tracked-button-link";
import { Reveal } from "@/components/ui/reveal";

export const metadata: Metadata = buildMetadata({
  title:
    "Como é a primeira consulta odontológica em [Cidade] — Dra. Ana Beatriz",
  description:
    "Entenda como funciona a primeira consulta com a Dra. Ana Beatriz Lemos Souza em [Cidade]: escuta, exame clínico, diagnóstico claro e orçamento transparente. Sem julgamento e no seu tempo.",
  path: "/primeira-consulta",
  keywords: [
    "primeira consulta odontológica [cidade]",
    "avaliação dentista [bairro]",
    "como funciona consulta dentista [cidade]",
  ],
});

const steps = [
  {
    title: "Acolhimento e conversa",
    description:
      "Um momento para entender a sua história, a sua rotina e o que te trouxe até aqui. Você fala no seu tempo, sem pressa.",
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
    q: "Quanto tempo dura?",
    a: "Em média de 40 a 60 minutos.",
  },
  {
    q: "Preciso levar algo?",
    a: "Um documento e, se tiver, radiografias ou exames recentes. Se não tiver, o que for necessário é solicitado na consulta.",
  },
  {
    q: "O orçamento sai no dia?",
    a: "Sim. Após a avaliação, a Dra. Ana apresenta o plano e o orçamento de forma transparente.",
  },
  {
    q: "Quais as formas de pagamento?",
    a: "O atendimento é particular, com pagamento via Pix, cartão de débito e cartão de crédito.",
  },
  {
    q: "Atende crianças?",
    a: "Sim, a partir de 7 anos.",
  },
  {
    q: "Atende convênio?",
    a: "Não. Os atendimentos são exclusivamente particulares.",
  },
];

const faqs = [
  {
    q: "Preciso levar exames antigos?",
    a: "Se você tiver radiografias ou exames recentes, leve — ajudam no diagnóstico. Se não tiver, não tem problema: o que for necessário é solicitado na própria consulta.",
  },
  {
    q: "Já saio com o tratamento feito?",
    a: "A primeira consulta é focada em avaliar e planejar. Procedimentos costumam ser agendados nas consultas seguintes, respeitando o seu tempo e as suas prioridades.",
  },
  {
    q: "Como funciona o orçamento?",
    a: "O orçamento é apresentado após a avaliação, quando já se sabe o que de fato é necessário. Por se tratar de saúde, não é possível dar valores precisos antes de examinar cada caso.",
  },
];

const medicalSchema = {
  "@context": "https://schema.org",
  "@type": "MedicalWebPage",
  name: "Como é a primeira consulta odontológica — Dra. Ana Beatriz Lemos Souza",
  description:
    "Como funciona a primeira consulta com a Dra. Ana Beatriz: escuta, exame clínico, diagnóstico claro e orçamento transparente.",
  url: `${siteConfig.url}/primeira-consulta`,
  inLanguage: "pt-BR",
};

export default function PrimeiraConsultaPage() {
  return (
    <>
      <JsonLd
        data={[
          medicalSchema,
          faqSchema(faqs),
          breadcrumbSchema([
            { name: "Início", path: "/" },
            { name: "Primeira consulta", path: "/primeira-consulta" },
          ]),
        ]}
      />

      <PageHero
        eyebrow="Primeira consulta"
        title="Sua primeira consulta, sem julgamento e no seu tempo"
        description="Você não precisa chegar sabendo qual tratamento precisa — a avaliação existe justamente para isso. A primeira consulta é uma conversa cuidadosa para entender a sua saúde bucal e organizar prioridades com clareza."
        breadcrumbs={[
          { name: "Início", href: "/" },
          { name: "Primeira consulta" },
        ]}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <TrackedButtonLink
            href="/agendamento"
            variant="primary"
            size="md"
            event="scheduling_intent"
            eventParams={{ location: "first_visit_hero" }}
          >
            <CalendarDays className="size-4" strokeWidth={1.7} />
            Agendar minha primeira consulta
          </TrackedButtonLink>
          <TrackedButtonLink
            href={whatsappLink(waMessages.firstVisit)}
            external
            variant="whatsapp"
            size="md"
            event="whatsapp_click"
            eventParams={{ location: "first_visit_hero" }}
          >
            <MessageCircle className="size-4" strokeWidth={1.7} />
            Tirar dúvidas no WhatsApp
          </TrackedButtonLink>
        </div>
      </PageHero>

      {/* O que acontece na primeira consulta */}
      <section className="section-y bg-brand-bone">
        <div className="container">
          <div className="max-w-2xl">
            <Reveal>
              <p className="eyebrow flex items-center gap-3">
                <span className="inline-block h-px w-7 bg-brand-gold/70" /> Passo a passo
              </p>
              <h2 className="mt-4 text-display-sm">O que acontece na primeira consulta</h2>
              <p className="mt-5 text-pretty text-lg leading-relaxed text-brand-ink/75">
                Cada etapa tem um propósito: te acolher, entender o seu caso e
                construir um caminho claro, sempre com o seu consentimento.
              </p>
            </Reveal>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.08}>
                <div className="surface h-full p-6">
                  <span className="flex size-11 items-center justify-center rounded-full border border-brand-gold/40 font-display text-lg text-brand-gold-ink">
                    0{i + 1}
                  </span>
                  <h3 className="mt-4 font-display text-xl text-brand-green">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-brand-ink/70">{step.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Perguntas práticas, respondidas */}
      <section className="section-y bg-gradient-to-b from-brand-beige/40 to-brand-bone">
        <div className="container">
          <div className="max-w-2xl">
            <Reveal>
              <p className="eyebrow flex items-center gap-3">
                <span className="inline-block h-px w-7 bg-brand-gold/70" /> Antes de agendar
              </p>
              <h2 className="mt-4 text-display-sm">Perguntas práticas, respondidas</h2>
              <p className="mt-5 text-pretty text-lg leading-relaxed text-brand-ink/75">
                As dúvidas mais comuns de quem vai marcar a primeira consulta,
                respondidas de forma direta.
              </p>
            </Reveal>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {practicalQuestions.map((item, i) => (
              <Reveal key={item.q} delay={i * 0.06}>
                <div className="rounded-3xl border border-brand-ink/[0.07] bg-white p-6 shadow-card">
                  <p className="font-display text-lg font-semibold text-brand-green">{item.q}</p>
                  <p className="mt-3 text-sm leading-relaxed text-brand-ink/75">{item.a}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Você não precisa chegar com tudo decidido */}
      <section className="section-y bg-brand-bone">
        <div className="container">
          <div className="mx-auto max-w-prose2">
            <Reveal>
              <p className="eyebrow flex items-center gap-3">
                <span className="inline-block h-px w-7 bg-brand-gold/70" /> Sem pressão
              </p>
              <h2 className="mt-4 text-display-sm">Você não precisa chegar com tudo decidido</h2>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="mt-6 space-y-5 text-pretty text-lg leading-relaxed text-brand-ink/75">
                <p>
                  A ideia não é empurrar tratamento, é organizar prioridades. A
                  primeira consulta serve para escutar você, entender o que está
                  acontecendo e mostrar, com honestidade, o que merece atenção
                  primeiro.
                </p>
                <p>
                  Antes de qualquer procedimento, você entende o que foi
                  encontrado, quais caminhos existem e o que faz sentido para o
                  seu caso. As decisões são tomadas em conjunto, no seu tempo e
                  dentro daquilo que é possível para a sua rotina aqui em{" "}
                  {siteConfig.region}.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <FAQSection
        items={faqs}
        eyebrow="Dúvidas sobre a primeira consulta"
        title="Perguntas frequentes"
        whatsappMessage={waMessages.firstVisit}
      />

      <CTASection />
    </>
  );
}
