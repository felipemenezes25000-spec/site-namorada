import type { Metadata } from "next";
import {
  MessageCircle,
  Phone,
  AlertCircle,
  Activity,
  HeartPulse,
} from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { buildMetadata, breadcrumbSchema, faqSchema, localize } from "@/lib/seo";
import { whatsappLink, waMessages } from "@/lib/whatsapp";
import { JsonLd } from "@/components/seo/json-ld";
import { PageHero } from "@/components/sections/page-hero";
import { FAQSection } from "@/components/sections/faq-section";
import { CTASection } from "@/components/sections/cta-section";
import { TrackedButtonLink } from "@/components/ui/tracked-button-link";
import { Reveal } from "@/components/ui/reveal";

const PATH = "/urgencia-odontologica";

export const metadata: Metadata = buildMetadata({
  title: "Urgência odontológica em [Cidade] — Dra. Ana Beatriz Lemos Souza",
  description:
    "Está com dor, dente quebrado, sangramento ou siso inflamado em [Cidade]? Fale pelo WhatsApp e receba orientação e atendimento de urgência com a Dra. Ana Beatriz Lemos Souza.",
  path: PATH,
  keywords: [
    "urgência odontológica em [cidade]",
    "dentista de urgência [bairro]",
    "dor de dente [cidade]",
    "dentista agora em [cidade]",
  ],
});

const whenToSeek = [
  "Dor de dente intensa ou latejante",
  "Dente quebrado, trincado ou avulsionado (batida ou trauma)",
  "Sangramento na gengiva que não para",
  "Inchaço ou abscesso (pus) na gengiva ou no rosto",
  "Siso inflamado, dolorido ou com dificuldade para abrir a boca",
  "Sensibilidade intensa e súbita",
  "Restauração, faceta ou coroa que caiu ou quebrou",
];

const whatToDo = [
  "Mantenha a calma e evite o pânico — a maioria dos casos tem solução.",
  "Para inchaço, use compressa fria por fora do rosto (nunca calor).",
  "Evite alimentos muito quentes, gelados ou duros do lado afetado.",
  "Se um dente inteiro saiu, guarde-o em soro fisiológico ou leite e leve o quanto antes.",
  "Não coloque aspirina ou outros comprimidos diretamente sobre a gengiva.",
  "Analgésicos só conforme orientação — evite se automedicar.",
];

const steps = [
  { title: "Fale pelo WhatsApp", description: "Descreva o que você está sentindo e o que aconteceu — com calma, no seu tempo." },
  { title: "Receba orientação", description: "A Dra. Ana orienta os primeiros cuidados para aliviar o desconforto até o atendimento." },
  { title: "Combinamos o horário", description: "Definimos um horário de atendimento, com prioridade para urgências." },
  { title: "Você é atendido(a)", description: "Com foco em alívio, conforto e controle da dor, num ambiente acolhedor." },
];

const faqs = [
  {
    q: "Vocês atendem urgência no mesmo dia?",
    a: "Sempre que possível, sim. Ao falar pelo WhatsApp e descrever o caso, a Dra. Ana avalia a prioridade e combina o horário mais rápido disponível, inclusive em horários especiais para urgências.",
  },
  {
    q: "Dor de dente é sempre urgência?",
    a: "Nem sempre, mas dor não deve ser ignorada. Mesmo uma dor leve que vai e volta pode indicar algo que merece avaliação. Fale com a gente para entender o melhor momento de ser atendido(a).",
  },
  {
    q: "Como funciona o valor de um atendimento de urgência?",
    a: "O atendimento é particular. O foco inicial é aliviar a dor e estabilizar a situação; depois, a Dra. Ana explica com transparência os próximos passos e o orçamento, sem compromisso de fechar tratamento na hora.",
  },
];

const medicalSchema = {
  "@context": "https://schema.org",
  "@type": "MedicalWebPage",
  name: localize("Urgência odontológica em [Cidade] — Dra. Ana Beatriz Lemos Souza"),
  description: localize(
    "Está com dor, dente quebrado, sangramento ou siso inflamado em [Cidade]? Fale pelo WhatsApp e receba orientação e atendimento de urgência com a Dra. Ana Beatriz Lemos Souza.",
  ),
  url: `${siteConfig.url}${PATH}`,
  inLanguage: "pt-BR",
};

export default function UrgenciaOdontologicaPage() {
  return (
    <>
      <JsonLd
        data={[
          medicalSchema,
          faqSchema(faqs),
          breadcrumbSchema([
            { name: "Início", path: "/" },
            { name: "Urgência odontológica", path: PATH },
          ]),
        ]}
      />

      <PageHero
        eyebrow="Urgência odontológica"
        title="Está com dor ou um problema que não pode esperar?"
        description="Se você está com dor, um dente quebrou, a gengiva inchou ou um siso inflamou, fale com a Dra. Ana pelo WhatsApp. Você recebe orientação inicial e a gente combina o atendimento o quanto antes."
        breadcrumbs={[{ name: "Início", href: "/" }, { name: "Urgência odontológica" }]}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <TrackedButtonLink
            href={whatsappLink(waMessages.urgency)}
            external
            variant="whatsapp"
            size="md"
            event="whatsapp_click"
            eventParams={{ location: "urgency_hero" }}
          >
            <MessageCircle className="size-4" strokeWidth={1.7} />
            Falar agora pelo WhatsApp
          </TrackedButtonLink>
          <TrackedButtonLink
            href={`tel:+${siteConfig.phone}`}
            variant="secondary"
            size="md"
            event="phone_click"
            eventParams={{ location: "urgency_hero" }}
          >
            <Phone className="size-4" strokeWidth={1.7} />
            Ligar para o consultório
          </TrackedButtonLink>
        </div>
      </PageHero>

      {/* Quando procurar atendimento de urgência */}
      <section className="section-y bg-brand-bone">
        <div className="container">
          <div className="max-w-2xl">
            <Reveal>
              <p className="eyebrow flex items-center gap-3">
                <span className="inline-block h-px w-7 bg-brand-gold/70" /> Sinais de alerta
              </p>
              <h2 className="mt-4 text-display-sm">Quando procurar atendimento de urgência</h2>
              <p className="mt-5 text-pretty text-lg leading-relaxed text-brand-ink/75">
                Alguns sinais pedem cuidado o quanto antes. Se você se identificar com qualquer um deles, fale com a gente.
              </p>
            </Reveal>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {whenToSeek.map((item, i) => (
              <Reveal key={item} delay={i * 0.05}>
                <div className="surface flex h-full items-start gap-4 p-6">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-green/[0.07] text-brand-green">
                    {i % 2 === 0 ? (
                      <AlertCircle className="size-5" strokeWidth={1.7} />
                    ) : (
                      <Activity className="size-5" strokeWidth={1.7} />
                    )}
                  </span>
                  <p className="text-sm leading-relaxed text-brand-ink/75">{item}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* O que fazer enquanto a gente se fala */}
      <section className="section-y bg-gradient-to-b from-brand-beige/40 to-brand-bone">
        <div className="container grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="eyebrow flex items-center gap-3">
                <span className="inline-block h-px w-7 bg-brand-gold/70" /> Primeiros cuidados
              </p>
              <h2 className="mt-4 text-display-sm">O que fazer enquanto a gente se fala</h2>
              <p className="mt-5 text-pretty text-lg leading-relaxed text-brand-ink/75">
                Estas orientações simples ajudam a reduzir o desconforto até o atendimento. Vá com calma — estamos com você.
              </p>
            </Reveal>
          </div>
          <div className="lg:col-span-7">
            <Reveal delay={0.08}>
              <ul className="space-y-4">
                {whatToDo.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-4 rounded-2xl border border-brand-ink/[0.07] bg-white p-5 shadow-sm"
                  >
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-gold" />
                    <span className="text-sm leading-relaxed text-brand-ink/75">{item}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.16}>
              <div className="mt-6 flex items-start gap-4 rounded-2xl border border-brand-gold/30 bg-brand-gold/[0.06] p-5">
                <HeartPulse className="mt-0.5 size-5 shrink-0 text-brand-gold-ink" strokeWidth={1.7} />
                <p className="text-sm leading-relaxed text-brand-ink/75">
                  Estas orientações são gerais e não substituem uma avaliação profissional. Em caso de dor intensa,
                  dificuldade para respirar ou engolir, ou inchaço que cresce rápido, procure um pronto-socorro.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Como funciona o atendimento de urgência */}
      <section className="section-y bg-brand-bone">
        <div className="container">
          <div className="max-w-2xl">
            <p className="eyebrow flex items-center gap-3">
              <span className="inline-block h-px w-7 bg-brand-gold/70" /> Passo a passo
            </p>
            <h2 className="mt-4 text-display-sm">Como funciona o atendimento de urgência</h2>
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

      {/* Reforço de CTA no meio da página longa */}
      <section className="bg-brand-bone pb-4">
        <div className="container">
          <div className="texture-grain relative overflow-hidden rounded-[2rem] bg-brand-green px-6 py-12 text-center text-brand-bone sm:px-12">
            <div aria-hidden className="pointer-events-none absolute -right-10 -top-10 size-56 rounded-full bg-brand-gold/10 blur-3xl" />
            <div className="relative">
              <h2 className="text-display-sm text-brand-bone">Está com dor agora? Não espere.</h2>
              <p className="mx-auto mt-3 max-w-xl text-brand-bone/75">
                Fale com a Dra. Ana pelo WhatsApp e receba orientação para aliviar o desconforto até o atendimento.
              </p>
              <div className="mt-7 flex justify-center">
                <TrackedButtonLink
                  href={whatsappLink(waMessages.urgency)}
                  external
                  variant="gold"
                  size="lg"
                  event="whatsapp_click"
                  eventParams={{ location: "urgency_midpage" }}
                >
                  <MessageCircle className="size-5" strokeWidth={1.7} />
                  Falar agora pelo WhatsApp
                </TrackedButtonLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FAQSection
        items={faqs}
        eyebrow="Dúvidas sobre urgência"
        title="Perguntas frequentes — Urgência"
        whatsappMessage={waMessages.urgency}
      />

      <CTASection />
    </>
  );
}
