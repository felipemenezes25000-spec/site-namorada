import type { Metadata } from "next";
import { Check, MessageCircle, CalendarDays, HeartHandshake, Activity, ShieldCheck, RotateCcw, CalendarClock, ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { buildMetadata, breadcrumbSchema, faqSchema, localize } from "@/lib/seo";
import { whatsappLink, waMessages } from "@/lib/whatsapp";
import { JsonLd } from "@/components/seo/json-ld";
import { PageHero } from "@/components/sections/page-hero";
import { FAQSection } from "@/components/sections/faq-section";
import { CTASection } from "@/components/sections/cta-section";
import { TrackedButtonLink } from "@/components/ui/tracked-button-link";
import { Reveal } from "@/components/ui/reveal";

const PATH = "/medo-de-dentista";

export const metadata: Metadata = buildMetadata({
  title: "Medo de dentista? Atendimento acolhedor em [Cidade] — Dra. Ana Beatriz",
  description:
    "Sente medo ou ansiedade de ir ao dentista? A Dra. Ana Beatriz oferece um atendimento acolhedor, sem julgamento e no seu ritmo em [Cidade]. Dê o primeiro passo pelo WhatsApp.",
  path: PATH,
  keywords: [
    "medo de dentista [cidade]",
    "dentista para quem tem medo [bairro]",
    "atendimento odontológico humanizado [cidade]",
  ],
});

const feelings = [
  {
    icon: Activity,
    title: "Medo da dor durante o atendimento",
    text: "É um receio comum. Aqui, o controle da dor e o seu conforto são prioridade em cada etapa.",
  },
  {
    icon: ShieldCheck,
    title: "Vergonha do estado atual dos dentes",
    text: "Não existe julgamento. O ponto de partida é sempre onde você está hoje — com acolhimento.",
  },
  {
    icon: RotateCcw,
    title: "Experiências ruins no passado",
    text: "Uma vivência difícil deixa marcas. Aqui, a proposta é construir uma nova relação, com calma.",
  },
  {
    icon: Activity,
    title: "Ansiedade com barulhos, agulhas ou o ambiente",
    text: "Tudo é explicado antes, no seu tempo, para que nada chegue de surpresa e você se sinta segura(o).",
  },
  {
    icon: CalendarClock,
    title: "Receio de ser julgado(a) por ter demorado",
    text: "Retomar os cuidados é sempre bem-vindo. O foco é ajudar, não cobrar pelo tempo que passou.",
  },
];

const care = [
  "Escuta sem julgamento, antes de qualquer procedimento",
  "Explicação de cada passo, em linguagem simples",
  "Controle da dor e anestesia aplicada com cuidado para o seu conforto",
  "Ritmo respeitado — nada é feito com pressa",
  "Você pode pedir uma pausa a qualquer momento",
  "Ambiente calmo e acolhedor, do primeiro contato ao retorno",
];

const faqs = [
  {
    q: "E se eu sentir vergonha do estado dos meus dentes?",
    a: "Você não será julgado(a). A função da consulta é justamente acolher e ajudar, partindo de onde você está hoje. Muita gente chega exatamente assim — e dá o primeiro passo com tranquilidade.",
  },
  {
    q: "Posso pedir para parar se ficar ansioso(a)?",
    a: "Pode, sim, a qualquer momento. O atendimento respeita o seu ritmo e o seu conforto. Combinar sinais e pausas faz parte de um cuidado humanizado.",
  },
  {
    q: "Faz muito tempo que não vou ao dentista. Tem problema?",
    a: "Nenhum. Retomar os cuidados é sempre possível, e a avaliação serve para organizar prioridades com calma, sem cobrança.",
  },
];

export default function MedoDeDentistaPage() {
  const medicalSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: localize("Medo de dentista? Atendimento acolhedor em [Cidade] — Dra. Ana Beatriz"),
    description: localize(
      "Sente medo ou ansiedade de ir ao dentista? A Dra. Ana Beatriz oferece um atendimento acolhedor, sem julgamento e no seu ritmo em [Cidade].",
    ),
    url: `${siteConfig.url}${PATH}`,
    inLanguage: "pt-BR",
  };

  return (
    <>
      <JsonLd
        data={[
          medicalSchema,
          faqSchema(faqs),
          breadcrumbSchema([
            { name: "Início", path: "/" },
            { name: "Medo de dentista", path: PATH },
          ]),
        ]}
      />

      <PageHero
        eyebrow="Acolhimento"
        title="Sente medo de ir ao dentista? Você não está sozinho(a)."
        description="O medo do dentista é mais comum do que parece — e não é motivo de vergonha. Aqui, o atendimento começa pela escuta e segue no seu ritmo, com explicação clara e foco no seu conforto a cada etapa."
        breadcrumbs={[{ name: "Início", href: "/" }, { name: "Medo de dentista" }]}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <TrackedButtonLink
            href="/agendamento"
            variant="primary"
            size="md"
            event="scheduling_intent"
            eventParams={{ location: "fear_hero" }}
          >
            <CalendarDays className="size-4" strokeWidth={1.7} />
            Quero dar o primeiro passo
          </TrackedButtonLink>
          <TrackedButtonLink
            href={whatsappLink(waMessages.firstVisit)}
            external
            variant="whatsapp"
            size="md"
            event="whatsapp_click"
            eventParams={{ location: "fear_hero" }}
          >
            <MessageCircle className="size-4" strokeWidth={1.7} />
            Conversar pelo WhatsApp
          </TrackedButtonLink>
        </div>
      </PageHero>

      {/* Seção 1 — Sentimentos */}
      <section className="section-y bg-brand-bone">
        <div className="container">
          <div className="max-w-2xl">
            <Reveal>
              <p className="eyebrow flex items-center gap-3">
                <span className="inline-block h-px w-7 bg-brand-gold/70" /> Você não está sozinho(a)
              </p>
              <h2 className="mt-4 text-display-sm">Você reconhece algum destes sentimentos?</h2>
              <p className="mt-5 text-pretty text-lg leading-relaxed text-brand-ink/75">
                Se algo aqui soa familiar, saiba que é absolutamente compreensível — e que existe um
                caminho mais leve para cuidar da sua saúde bucal.
              </p>
            </Reveal>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {feelings.map((f, i) => {
              const Icon = f.icon;
              return (
                <Reveal key={f.title} delay={i * 0.06}>
                  <div className="surface h-full p-7">
                    <span className="flex size-12 items-center justify-center rounded-2xl bg-brand-green/[0.07] text-brand-green">
                      <Icon className="size-6" strokeWidth={1.6} />
                    </span>
                    <h3 className="mt-5 font-display text-xl text-brand-green">{f.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-brand-ink/70">{f.text}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Seção 2 — Como tornamos mais leve */}
      <section className="section-y bg-gradient-to-b from-brand-beige/40 to-brand-bone">
        <div className="container grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="eyebrow flex items-center gap-3">
                <span className="inline-block h-px w-7 bg-brand-gold/70" /> Cuidado humanizado
              </p>
              <h2 className="mt-4 text-display-sm">Como tornamos a experiência mais leve</h2>
              <p className="mt-5 text-pretty text-lg leading-relaxed text-brand-ink/75">
                Cada detalhe do atendimento é pensado para devolver a você a sensação de segurança e
                controle. O cuidado é construído junto, no seu tempo.
              </p>
            </Reveal>
          </div>
          <div className="lg:col-span-7">
            <Reveal delay={0.08}>
              <ul className="grid gap-3 sm:grid-cols-2">
                {care.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 rounded-2xl border border-brand-ink/[0.07] bg-white p-4 shadow-sm"
                  >
                    <Check className="mt-0.5 size-5 shrink-0 text-brand-green" strokeWidth={2} />
                    <span className="text-sm leading-relaxed text-brand-ink/75">{item}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Seção 3 — O primeiro passo é só uma conversa */}
      <section className="section-y bg-brand-bone">
        <div className="container">
          <div className="surface relative overflow-hidden p-8 sm:p-12">
            <span
              aria-hidden
              className="pointer-events-none absolute -right-10 -top-10 size-44 rounded-full bg-brand-gold/10 blur-3xl"
            />
            <div className="max-w-2xl">
              <Reveal>
                <p className="eyebrow flex items-center gap-3">
                  <span className="inline-block h-px w-7 bg-brand-gold/70" /> Sem pressão
                </p>
                <h2 className="mt-4 text-display-sm">O primeiro passo é só uma conversa</h2>
                <p className="mt-5 text-pretty text-lg leading-relaxed text-brand-ink/75">
                  A primeira consulta é, antes de tudo, uma conversa. Você não precisa chegar sabendo
                  o que precisa, nem decidir nada na hora — sem pressão para fechar tratamento.
                  É um momento para a Dra. Ana entender a sua história, esclarecer dúvidas e, juntos,
                  pensar nos próximos passos com calma. Em {siteConfig.region}, o cuidado começa pela
                  escuta.
                </p>
              </Reveal>
              <Reveal delay={0.1}>
                <div className="mt-8">
                  <TrackedButtonLink
                    href="/primeira-consulta"
                    variant="secondary"
                    size="md"
                    event="cta_click"
                    eventParams={{ location: "fear_page", target: "primeira_consulta" }}
                  >
                    Saiba como é a primeira consulta
                    <ArrowUpRight className="size-4" strokeWidth={1.7} />
                  </TrackedButtonLink>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <FAQSection
        items={faqs}
        eyebrow="Dúvidas sobre o atendimento"
        title="Perguntas frequentes"
        whatsappMessage={waMessages.firstVisit}
      />

      <CTASection />
    </>
  );
}
