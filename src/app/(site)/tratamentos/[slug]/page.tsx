import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Check, MessageCircle, CalendarDays, ArrowUpRight } from "lucide-react";
import { treatments, getTreatment, treatmentSlugs } from "@/lib/treatments";
import { siteConfig } from "@/lib/site-config";
import { buildMetadata, breadcrumbSchema, faqSchema, absoluteUrl, localize } from "@/lib/seo";
import { whatsappLink, waMessages } from "@/lib/whatsapp";
import { JsonLd } from "@/components/seo/json-ld";
import { PageHero } from "@/components/sections/page-hero";
import { FAQSection } from "@/components/sections/faq-section";
import { CTASection } from "@/components/sections/cta-section";
import { TreatmentIcon } from "@/components/ui/treatment-icon";
import { Reveal } from "@/components/ui/reveal";
import { ButtonLink } from "@/components/ui/button";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return treatmentSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const t = getTreatment(slug);
  if (!t) return buildMetadata({ title: "Tratamento", description: "Tratamento odontológico." });
  return buildMetadata({
    title: t.metaTitle,
    description: t.metaDescription,
    path: `/tratamentos/${t.slug}`,
    keywords: t.keywords,
  });
}

export default async function TreatmentPage({ params }: { params: Params }) {
  const { slug } = await params;
  const t = getTreatment(slug);
  if (!t) notFound();

  const related = treatments.filter((x) => x.slug !== t.slug).slice(0, 3);
  const medicalSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: localize(t.metaTitle),
    description: localize(t.metaDescription),
    url: absoluteUrl(`/tratamentos/${t.slug}`),
    inLanguage: "pt-BR",
    lastReviewed: "2026-06-08",
    reviewedBy: { "@type": "Dentist", name: siteConfig.doctorName, "@id": `${siteConfig.url}/#dentist` },
    about: {
      "@type": "MedicalProcedure",
      name: t.name,
      description: t.what,
      bodyLocation: "Cavidade oral",
      howPerformed: t.steps.map((s) => `${s.title}: ${s.description}`).join(" "),
      ...(t.preparation?.length ? { preparation: t.preparation.join(" ") } : {}),
      ...(t.contraindications?.length
        ? { contraindication: t.contraindications.map((c) => ({ "@type": "MedicalContraindication", name: c })) }
        : {}),
    },
    provider: { "@type": "Dentist", name: siteConfig.doctorName, "@id": `${siteConfig.url}/#dentist` },
    areaServed: localize(siteConfig.region),
  };

  return (
    <>
      <JsonLd
        data={[
          medicalSchema,
          faqSchema(t.faqs),
          breadcrumbSchema([
            { name: "Início", path: "/" },
            { name: "Tratamentos", path: "/tratamentos" },
            { name: t.name, path: `/tratamentos/${t.slug}` },
          ]),
        ]}
      />

      <PageHero
        eyebrow={t.shortName}
        title={t.name}
        description={t.intro}
        breadcrumbs={[
          { name: "Início", href: "/" },
          { name: "Tratamentos", href: "/tratamentos" },
          { name: t.name },
        ]}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <ButtonLink
            href={whatsappLink(waMessages.treatment(t.name.toLowerCase()))}
            external
            variant="primary"
            size="md"
          >
            <MessageCircle className="size-4" strokeWidth={1.7} />
            Falar sobre {t.shortName.toLowerCase()}
          </ButtonLink>
          <ButtonLink href="/agendamento" variant="secondary" size="md">
            <CalendarDays className="size-4" strokeWidth={1.7} />
            Agendar avaliação
          </ButtonLink>
        </div>
      </PageHero>

      {/* O que é */}
      <section className="section-y bg-brand-bone">
        <div className="container grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="eyebrow flex items-center gap-3">
                <span className="inline-block h-px w-7 bg-brand-gold/70" /> O que é
              </p>
              <h2 className="mt-4 text-display-sm">Entenda o tratamento</h2>
              <p className="mt-5 text-pretty text-lg leading-relaxed text-brand-ink/75">{t.what}</p>
            </Reveal>

            {/* Benefícios */}
            <Reveal delay={0.08}>
              <div className="mt-10">
                <h3 className="font-display text-2xl text-brand-green">Benefícios</h3>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {t.benefits.map((b) => (
                    <li key={b} className="flex items-start gap-3 rounded-2xl border border-brand-ink/[0.07] bg-white p-4 shadow-sm">
                      <Check className="mt-0.5 size-5 shrink-0 text-brand-green" strokeWidth={2} />
                      <span className="text-sm leading-relaxed text-brand-ink/75">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>

          {/* Aside: indicado para + visual */}
          <aside className="lg:col-span-5 lg:sticky lg:top-28">
            <Reveal y={24}>
              <div className="texture-grain relative mb-6 flex aspect-[5/3] items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-brand-green via-brand-green-dark to-brand-green-deep shadow-lift">
                <span aria-hidden className="pointer-events-none absolute -right-8 -top-8 size-40 rounded-full bg-brand-gold/15 blur-3xl" />
                <span className="flex size-20 items-center justify-center rounded-3xl border border-brand-gold/30 text-brand-gold-soft">
                  <TreatmentIcon name={t.icon} className="size-10" />
                </span>
              </div>
              <div className="surface p-7">
                <h3 className="font-display text-2xl text-brand-green">Indicado para</h3>
                <ul className="mt-4 space-y-3">
                  {t.forWhom.map((b) => (
                    <li key={b} className="flex items-start gap-3 text-sm text-brand-ink/75">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-gold" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </aside>
        </div>
      </section>

      {/* Como funciona */}
      <section className="section-y bg-gradient-to-b from-brand-beige/40 to-brand-bone">
        <div className="container">
          <div className="max-w-2xl">
            <p className="eyebrow flex items-center gap-3">
              <span className="inline-block h-px w-7 bg-brand-gold/70" /> Como funciona
            </p>
            <h2 className="mt-4 text-display-sm">Uma jornada cuidadosa, passo a passo</h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {t.steps.map((step, i) => (
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

      {/* Cuidados e segurança — profundidade clínica + E-E-A-T */}
      {(t.notFor || t.contraindications?.length || t.preparation?.length || t.aftercare?.length || t.warningSigns?.length) && (
        <section className="section-y bg-brand-bone">
          <div className="container max-w-3xl">
            <p className="eyebrow flex items-center gap-3">
              <span className="inline-block h-px w-7 bg-brand-gold/70" /> Cuidados e segurança
            </p>
            <h2 className="mt-4 text-display-sm">O que considerar com cuidado</h2>

            {t.notFor && (
              <p className="mt-6 rounded-2xl border-l-2 border-brand-gold/60 bg-brand-beige/30 p-5 text-pretty leading-relaxed text-brand-ink/75">
                {t.notFor}
              </p>
            )}

            {t.contraindications?.length ? (
              <div className="mt-8">
                <h3 className="font-display text-xl text-brand-green">Quando é preciso atenção</h3>
                <ul className="mt-3 space-y-2">
                  {t.contraindications.map((c) => (
                    <li key={c} className="flex items-start gap-3 text-sm text-brand-ink/75">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-gold" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {t.preparation?.length ? (
              <div className="mt-8">
                <h3 className="font-display text-xl text-brand-green">Antes do procedimento</h3>
                <ul className="mt-3 space-y-2">
                  {t.preparation.map((c) => (
                    <li key={c} className="flex items-start gap-3 text-sm text-brand-ink/75">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-gold" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {t.aftercare?.length ? (
              <div className="mt-8">
                <h3 className="font-display text-xl text-brand-green">Depois do procedimento</h3>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {t.aftercare.map((a) => (
                    <div key={a.title} className="rounded-2xl border border-brand-ink/[0.07] bg-white p-4 shadow-sm">
                      <p className="font-display text-base text-brand-green">{a.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-brand-ink/70">{a.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {t.warningSigns?.length ? (
              <div className="mt-8 rounded-2xl border border-brand-gold/30 bg-brand-beige/40 p-6">
                <h3 className="font-display text-xl text-brand-green">Quando procurar a Dra. Ana</h3>
                <ul className="mt-3 space-y-2">
                  {t.warningSigns.map((c) => (
                    <li key={c} className="flex items-start gap-3 text-sm text-brand-ink/75">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-gold" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </section>
      )}

      {/* Investimento — transparência sem cotar valores (ética CFO) */}
      <section className="section-y bg-brand-bone">
        <div className="container">
          <div className="mx-auto max-w-3xl rounded-3xl border border-brand-ink/[0.07] bg-white p-8 shadow-card sm:p-10">
            <p className="eyebrow flex items-center gap-3">
              <span className="inline-block h-px w-7 bg-brand-gold/70" /> Investimento
            </p>
            <h2 className="mt-4 text-display-sm">Transparência sobre valores</h2>

            {(t.duration || t.sessions) && (
              <dl className="mt-6 flex flex-wrap gap-x-10 gap-y-4">
                {t.duration && (
                  <div>
                    <dt className="text-xs uppercase tracking-eyebrow text-brand-ink/50">Duração média</dt>
                    <dd className="mt-1 font-display text-lg text-brand-green">{t.duration}</dd>
                  </div>
                )}
                {t.sessions && (
                  <div>
                    <dt className="text-xs uppercase tracking-eyebrow text-brand-ink/50">Sessões</dt>
                    <dd className="mt-1 font-display text-lg text-brand-green">{t.sessions}</dd>
                  </div>
                )}
              </dl>
            )}
            <p className="mt-5 text-pretty leading-relaxed text-brand-ink/75">
              O atendimento é particular. Como cada caso é único, o valor exato só é
              definido após a avaliação — quando já se sabe, com clareza, o que de
              fato é necessário. Por se tratar de saúde, não passamos orçamentos sem
              antes examinar.
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                "Orçamento apresentado após a avaliação, sem surpresas",
                "Pagamento via Pix, cartão de débito e cartão de crédito",
                "Plano com prioridades, no seu tempo",
                "Sem pressão para fechar tratamento na hora",
              ].map((b) => (
                <li key={b} className="flex items-start gap-3 text-sm text-brand-ink/75">
                  <Check className="mt-0.5 size-5 shrink-0 text-brand-green" strokeWidth={2} />
                  {b}
                </li>
              ))}
            </ul>
          </div>

          {/* Links de apoio — reduz fricção e cria jornada por intenção */}
          <div className="mx-auto mt-8 grid max-w-3xl gap-4 sm:grid-cols-2">
            <Link
              href="/primeira-consulta"
              className="group flex items-center justify-between gap-4 rounded-2xl border border-brand-ink/[0.07] bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-brand-gold/40 hover:shadow-card"
            >
              <span className="font-display text-lg text-brand-green">Como é a primeira consulta</span>
              <ArrowUpRight className="size-5 shrink-0 text-brand-gold transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link
              href="/medo-de-dentista"
              className="group flex items-center justify-between gap-4 rounded-2xl border border-brand-ink/[0.07] bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-brand-gold/40 hover:shadow-card"
            >
              <span className="font-display text-lg text-brand-green">Sente medo de dentista?</span>
              <ArrowUpRight className="size-5 shrink-0 text-brand-gold transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>

          <div className="mx-auto mt-8 max-w-3xl">
            <p className="text-xs leading-relaxed text-brand-ink/50">
              As informações desta página têm caráter educativo e não substituem uma
              avaliação clínica individual. Indicações, resultados e cuidados variam
              de pessoa para pessoa e são definidos após exame presencial. Conteúdo
              sob responsabilidade técnica da {siteConfig.doctorName} ({siteConfig.cro}).
            </p>
          </div>
        </div>
      </section>

      <FAQSection
        items={t.faqs}
        eyebrow="Dúvidas sobre o tratamento"
        title={`Perguntas frequentes — ${t.shortName}`}
        whatsappMessage={waMessages.treatment(t.name.toLowerCase())}
      />

      {/* Relacionados */}
      <section className="bg-brand-bone pb-20">
        <div className="container">
          <h2 className="text-display-sm">Outros tratamentos</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/tratamentos/${r.slug}`}
                className="group flex items-center justify-between gap-4 rounded-2xl border border-brand-ink/[0.07] bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-brand-gold/40 hover:shadow-card"
              >
                <span className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-brand-green/[0.07] text-brand-green">
                    <TreatmentIcon name={r.icon} className="size-5" />
                  </span>
                  <span className="font-display text-lg text-brand-green">{r.name}</span>
                </span>
                <ArrowUpRight className="size-5 text-brand-gold transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
