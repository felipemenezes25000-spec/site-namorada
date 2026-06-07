import type { Metadata } from "next";
import { Award, GraduationCap, HeartHandshake, Stethoscope, ArrowRight, MessageCircle } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";
import { whatsappLink, waMessages } from "@/lib/whatsapp";
import { JsonLd } from "@/components/seo/json-ld";
import { PageHero } from "@/components/sections/page-hero";
import { Differentials } from "@/components/sections/differentials";
import { CTASection } from "@/components/sections/cta-section";
import { PhotoPlaceholder } from "@/components/ui/photo-placeholder";
import { Reveal } from "@/components/ui/reveal";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = buildMetadata({
  title: `Sobre a ${siteConfig.doctorName}`,
  description: `Conheça a ${siteConfig.doctorName}, ${siteConfig.title.toLowerCase()} (${siteConfig.cro}). Atendimento humanizado, planejamento individual e foco em naturalidade em ${siteConfig.region}.`,
  path: "/sobre",
  keywords: [`dentista em ${siteConfig.city}`, `cirurgiã-dentista ${siteConfig.neighborhood}`],
});

/** Credenciais — PLACEHOLDERS editáveis. Não invente títulos: edite com os reais. */
const credentials = [
  { icon: GraduationCap, label: "[Graduação em Odontologia — Instituição]" },
  { icon: Award, label: "[Pós-graduação / Especialização — Área]" },
  { icon: Stethoscope, label: "[Cursos e atualizações relevantes]" },
  { icon: HeartHandshake, label: `Registro profissional ativo — ${siteConfig.cro}` },
];

const philosophy = [
  {
    title: "Escuta antes de tudo",
    text: "Cada atendimento começa por entender a sua história, sua rotina e o que te trouxe até aqui.",
  },
  {
    title: "Clareza em cada etapa",
    text: "Você entende o que será feito e por quê, sempre em linguagem simples e sem termos confusos.",
  },
  {
    title: "Decisões sem pressa",
    text: "Nada é decidido no impulso. O plano respeita o seu tempo, suas prioridades e o seu conforto.",
  },
];

export default function SobrePage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Início", path: "/" },
          { name: "Sobre", path: "/sobre" },
        ])}
      />
      <PageHero
        eyebrow="Sobre a Dra. Ana"
        title={
          <>
            Uma odontologia construída com{" "}
            <span className="italic text-brand-gold-ink">cuidado</span> e confiança
          </>
        }
        description="Por trás de cada sorriso existe uma pessoa, uma história e um tempo próprio. É a partir disso que a Dra. Ana conduz o seu trabalho."
        breadcrumbs={[{ name: "Início", href: "/" }, { name: "Sobre" }]}
      />

      {/* História */}
      <section className="section-y bg-brand-bone">
        <div className="container grid items-start gap-14 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5" y={28}>
            <div className="relative mx-auto max-w-sm lg:sticky lg:top-28 lg:max-w-none">
              <PhotoPlaceholder tone="green" label="Foto da Dra. Ana Beatriz" className="aspect-[4/5] shadow-lift" />
              <div className="surface mt-4 flex items-center gap-4 rounded-2xl p-5">
                <span className="flex size-12 items-center justify-center rounded-full bg-brand-green/10 text-brand-green">
                  <Stethoscope className="size-6" strokeWidth={1.5} />
                </span>
                <div>
                  <p className="font-display text-lg text-brand-green">{siteConfig.doctorName}</p>
                  <p className="text-sm text-brand-ink/60">{siteConfig.title} · {siteConfig.cro}</p>
                </div>
              </div>
            </div>
          </Reveal>

          <div className="lg:col-span-7">
            <Reveal>
              <p className="eyebrow flex items-center gap-3">
                <span className="inline-block h-px w-7 bg-brand-gold/70" /> Trajetória
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-5 text-display-md text-balance">
                Dedicação à saúde bucal, com olhar humano
              </h2>
            </Reveal>
            <div className="mt-6 space-y-5 text-pretty leading-relaxed text-brand-ink/75">
              <Reveal delay={0.1}>
                <p>
                  {siteConfig.doctorName} é {siteConfig.title.toLowerCase()} ({siteConfig.cro})
                  e dedica sua atuação a uma odontologia próxima, segura e centrada
                  na pessoa. Para ela, tratar bem vai muito além da técnica: passa
                  por acolher, explicar e construir confiança.
                </p>
              </Reveal>
              <Reveal delay={0.15}>
                <p>
                  Seu foco está em {siteConfig.focus.toLowerCase()} Cada plano de
                  tratamento nasce de uma escuta atenta e de uma avaliação cuidadosa,
                  para que as decisões sejam tomadas com clareza e no tempo de cada
                  paciente.
                </p>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="rounded-2xl border-l-2 border-brand-gold/60 bg-brand-beige/30 p-5 font-display text-xl leading-snug text-brand-green">
                  “Quando o paciente entende e participa do próprio cuidado, o
                  resultado é mais natural — e a relação, mais duradoura.”
                </p>
              </Reveal>
            </div>

            {/* Credenciais */}
            <Reveal delay={0.1}>
              <div className="mt-10">
                <h3 className="font-display text-2xl text-brand-green">Formação e credenciais</h3>
                <p className="mt-1 text-sm text-brand-ink/55">
                  As informações abaixo são editáveis — substitua pelos dados reais.
                </p>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {credentials.map(({ icon: Icon, label }) => (
                    <li key={label} className="flex items-start gap-3 rounded-2xl border border-brand-ink/[0.07] bg-white p-4 shadow-sm">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-green/[0.07] text-brand-green">
                        <Icon className="size-5" strokeWidth={1.6} />
                      </span>
                      <span className="text-sm leading-relaxed text-brand-ink/75">{label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Filosofia */}
      <section className="section-y bg-gradient-to-b from-brand-beige/40 to-brand-bone">
        <div className="container">
          <div className="max-w-2xl">
            <p className="eyebrow flex items-center gap-3">
              <span className="inline-block h-px w-7 bg-brand-gold/70" /> Filosofia de atendimento
            </p>
            <h2 className="mt-5 text-display-md text-balance">
              Três princípios que guiam cada consulta
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {philosophy.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08}>
                <div className="surface h-full p-7">
                  <span className="font-display text-4xl text-brand-gold/70">0{i + 1}</span>
                  <h3 className="mt-3 font-display text-2xl text-brand-green">{p.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-brand-ink/70">{p.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Compromisso */}
      <section className="bg-brand-bone pb-4">
        <div className="container">
          <div className="texture-grain relative overflow-hidden rounded-[2rem] bg-brand-green px-6 py-14 text-brand-bone sm:px-12 lg:px-16">
            <div aria-hidden className="pointer-events-none absolute -right-10 -top-10 size-56 rounded-full bg-brand-gold/10 blur-3xl" />
            <div className="relative grid items-center gap-8 lg:grid-cols-12">
              <div className="lg:col-span-8">
                <p className="eyebrow text-brand-gold-bright">Compromisso com você</p>
                <h2 className="mt-4 text-display-sm text-brand-bone">
                  Um cuidado ético, transparente e sem promessas que a odontologia
                  séria não pode fazer
                </h2>
                <p className="mt-4 max-w-xl leading-relaxed text-brand-bone/75">
                  Aqui, você recebe informação clara, estimativas transparentes e
                  respeito em cada decisão. Sem pressão, sem exageros — apenas o
                  cuidado que o seu sorriso merece.
                </p>
              </div>
              <div className="lg:col-span-4 lg:justify-self-end">
                <ButtonLink href="/agendamento" variant="gold" size="lg">
                  Quero agendar minha avaliação
                  <ArrowRight className="size-4" strokeWidth={1.7} />
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Differentials />

      <CTASection />
    </>
  );
}
