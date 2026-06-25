import type { Metadata } from "next";
import Image from "next/image";
import { Award, GraduationCap, HeartHandshake, Stethoscope, Smile, ArrowRight, MessageCircle } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { buildMetadata, breadcrumbSchema, personSchema } from "@/lib/seo";
import { whatsappLink, waMessages } from "@/lib/whatsapp";
import { JsonLd } from "@/components/seo/json-ld";
import { PageHero } from "@/components/sections/page-hero";
import { CTASection } from "@/components/sections/cta-section";
import { Reveal } from "@/components/ui/reveal";
import { ButtonLink } from "@/components/ui/button";
import { TrackedButtonLink } from "@/components/ui/tracked-button-link";

export const metadata: Metadata = buildMetadata({
  title: `Sobre a ${siteConfig.doctorName}`,
  description: `Conheça a ${siteConfig.doctorName}, ${siteConfig.title.toLowerCase()} (${siteConfig.cro}). Atendimento humanizado, planejamento individual e foco em naturalidade em ${siteConfig.region}.`,
  path: "/sobre",
  keywords: [`dentista em ${siteConfig.city}`, `cirurgiã-dentista ${siteConfig.neighborhood}`],
});

/** Credenciais reais da Dra. Ana Beatriz. */
const credentials = [
  { icon: GraduationCap, label: "Graduação em Odontologia — Centro Universitário Estácio de Brasília" },
  { icon: Award, label: "Aperfeiçoamento em Cirurgia Oral Menor — São Leopoldo Mandic" },
  { icon: Stethoscope, label: "Curso “Rumo à Residência” em CTBMF (Cirurgia e Traumatologia Buco-Maxilo-Facial)" },
  { icon: Smile, label: "Formação em Implantodontia — ABO Central e APCD Central" },
  { icon: Award, label: "Formação em Cirurgia Buco-Maxilo-Facial — ABO Central e IOA" },
  { icon: HeartHandshake, label: `Registro profissional ativo — ${siteConfig.cro}` },
];

/**
 * Áreas de atuação em destaque, com a formação que dá lastro a cada uma.
 * Linguagem deliberadamente CFO-segura: descreve cuidado e formação,
 * sem anunciar título de especialista nem prometer resultado.
 */
const areas = [
  {
    icon: Smile,
    title: "Implantodontia",
    description:
      "Reabilitação de dentes perdidos com implantes, devolvendo função, conforto e naturalidade ao sorriso — sempre com planejamento individual.",
    institutions: ["ABO Central", "APCD Central"],
    ctaLocation: "area_implante",
  },
  {
    icon: Stethoscope,
    title: "Cirurgia Buco-Maxilo-Facial",
    description:
      "Avaliação e procedimentos na área buco-maxilo-facial, conduzidos com técnica, segurança e acompanhamento próximo em cada etapa.",
    institutions: ["ABO Central", "IOA"],
    ctaLocation: "area_bucomaxilo",
  },
] as const;

const lattesUrl = "https://lattes.cnpq.br/3767606004982701";

export default function SobrePage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Início", path: "/" },
            { name: "Sobre", path: "/sobre" },
          ]),
          personSchema({
            sameAs: [lattesUrl],
            alumniOf: [
              "Centro Universitário Estácio de Brasília",
              "São Leopoldo Mandic",
            ],
          }),
        ]}
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
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-brand-green/5 shadow-lift">
                <Image
                  src="/dra-ana-trajetoria.jpg"
                  alt={`${siteConfig.doctorName} durante sua jornada na Odontologia`}
                  fill
                  sizes="(min-width: 1024px) 28rem, (min-width: 640px) 22rem, 90vw"
                  className="object-cover object-center"
                />
              </div>
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
                Conheça a {siteConfig.doctorName}
              </h2>
            </Reveal>
            <div className="mt-6 space-y-5 text-pretty leading-relaxed text-brand-ink/75">
              <Reveal delay={0.1}>
                <p>
                  A vocação da {siteConfig.doctorName} para a área da saúde nunca
                  foi uma escolha ao acaso; foi um destino traçado pelo seu
                  propósito genuíno de cuidar do próximo. Sempre atenta ao
                  bem-estar coletivo, ela encontrou na Odontologia a junção
                  perfeita entre o rigor da prática clínica e a profundidade do
                  cuidado humano.
                </p>
              </Reveal>
              <Reveal delay={0.15}>
                <p>
                  Para a Dra. Ana Beatriz, a Odontologia vai muito além do dente:
                  ela trata a identidade, restabelece a função e devolve a
                  confiança, reconectando a pessoa consigo mesma. Querendo ou
                  não, o nosso sorriso está presente em todas as esferas da
                  vida — desde o ato vital de se alimentar e falar com clareza,
                  até o resgate da autoestima e da estética. Cuidar do sorriso
                  é, essencialmente, cuidar da engrenagem que move o seu
                  bem-estar todos os dias.
                </p>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="rounded-2xl border-l-2 border-brand-gold/60 bg-brand-beige/30 p-5 font-display text-xl leading-snug text-brand-green">
                  O grande objetivo da doutora é fazer com que seus pacientes
                  alcancem uma longevidade de vida próspera, saudável e feliz.
                </p>
              </Reveal>
            </div>

            {/* Credenciais */}
            <Reveal delay={0.1}>
              <div className="mt-10">
                <h3 className="font-display text-2xl text-brand-green">Formação e credenciais</h3>
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
                <a
                  href={lattesUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-brand-green underline decoration-brand-gold/50 underline-offset-4 transition hover:decoration-brand-gold"
                >
                  Conheça o currículo completo da Dra. no Lattes
                  <ArrowRight className="size-4" strokeWidth={1.7} aria-hidden />
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Áreas de atuação */}
      <section className="section-y bg-brand-bone">
        <div className="container">
          <div className="max-w-2xl">
            <Reveal>
              <p className="eyebrow flex items-center gap-3">
                <span className="inline-block h-px w-7 bg-brand-gold/70" /> Áreas de atuação
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-4 text-display-sm">
                Formação aprofundada em áreas que pedem técnica e planejamento
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-5 text-pretty text-lg leading-relaxed text-brand-ink/75">
                Além do cuidado clínico geral, a Dra. Ana dedica parte da sua
                trajetória ao implante e à cirurgia buco-maxilo-facial — sempre
                com avaliação criteriosa antes de qualquer indicação.
              </p>
            </Reveal>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {areas.map(({ icon: Icon, title, description, institutions, ctaLocation }, i) => (
              <Reveal key={title} delay={i * 0.08} className="h-full">
                <div className="surface flex h-full flex-col rounded-3xl p-7 shadow-card sm:p-8">
                  <span className="flex size-12 items-center justify-center rounded-full bg-brand-green/[0.07] text-brand-green">
                    <Icon className="size-6" strokeWidth={1.5} />
                  </span>
                  <h3 className="mt-5 font-display text-2xl text-brand-green">{title}</h3>
                  <p className="mt-3 text-pretty leading-relaxed text-brand-ink/75">
                    {description}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {institutions.map((inst) => (
                      <span
                        key={inst}
                        className="inline-flex items-center gap-1.5 rounded-full border border-brand-gold/30 bg-brand-gold/[0.06] px-3 py-1 text-xs font-medium text-brand-gold-ink"
                      >
                        <GraduationCap className="size-3.5" strokeWidth={1.7} aria-hidden />
                        {inst}
                      </span>
                    ))}
                  </div>
                  <div className="mt-auto pt-7">
                    <TrackedButtonLink
                      href="/agendamento"
                      variant="primary"
                      size="md"
                      event="scheduling_intent"
                      eventParams={{ location: ctaLocation }}
                    >
                      Agendar avaliação
                      <ArrowRight className="size-4" strokeWidth={1.7} />
                    </TrackedButtonLink>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Consultório */}
      <section className="section-y bg-gradient-to-b from-brand-beige/40 to-brand-bone">
        <div className="container">
          <div className="max-w-2xl">
            <Reveal>
              <p className="eyebrow flex items-center gap-3">
                <span className="inline-block h-px w-7 bg-brand-gold/70" /> O consultório
              </p>
              <h2 className="mt-4 text-display-sm">
                Um espaço pensado para o seu conforto
              </h2>
              <p className="mt-5 text-pretty text-lg leading-relaxed text-brand-ink/75">
                Ambiente moderno, com luz natural e vista panorâmica, na região
                da Bela Vista em São Paulo. Aqui, cada detalhe foi planejado para
                que você se sinta acolhido(a) desde o primeiro momento.
              </p>
            </Reveal>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                src: "/consultorio-1.png",
                alt: "Consultório da Dra. Ana Beatriz — mesa de atendimento com cadeira odontológica e vista para a cidade de São Paulo",
              },
              {
                src: "/consultorio-2.png",
                alt: "Vista ampla do consultório — equipamento odontológico moderno, marcenaria em madeira e janelas com luz natural",
              },
              {
                src: "/consultorio-3.png",
                alt: "Ambiente do consultório da Dra. Ana Beatriz na Bela Vista, São Paulo — espaço moderno e acolhedor",
              },
              {
                src: "/consultorio-4.jpg",
                alt: "Dra. Ana Beatriz realizando procedimento cirúrgico com paramentação completa — dedicação e precisão clínica",
              },
            ].map((img, i) => (
              <Reveal key={img.src} delay={i * 0.08}>
                <div className="relative aspect-[3/4] overflow-hidden rounded-3xl bg-brand-green/5 shadow-card">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                    loading="lazy"
                  />
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
                  Quero agendar minha consulta
                  <ArrowRight className="size-4" strokeWidth={1.7} />
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
