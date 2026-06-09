import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight, Check, MessageCircle } from "lucide-react";
import { treatments } from "@/lib/treatments";
import { siteConfig } from "@/lib/site-config";
import { buildMetadata, breadcrumbSchema, servicesSchema } from "@/lib/seo";
import { whatsappLink, waMessages } from "@/lib/whatsapp";
import { JsonLd } from "@/components/seo/json-ld";
import { PageHero } from "@/components/sections/page-hero";
import { CTASection } from "@/components/sections/cta-section";
import { TreatmentIcon } from "@/components/ui/treatment-icon";
import { Reveal } from "@/components/ui/reveal";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = buildMetadata({
  title: "Tratamentos odontológicos",
  description:
    "Avaliação, limpeza, clareamento, restaurações, prevenção e cirurgia oral em [Cidade]. Conheça os tratamentos da Dra. Ana Beatriz Lemos Souza e agende pelo WhatsApp.",
  path: "/tratamentos",
  keywords: [
    `tratamentos odontológicos em ${siteConfig.city}`,
    `limpeza dental em ${siteConfig.city}`,
    `clareamento dental em ${siteConfig.city}`,
    `cirurgia oral em ${siteConfig.city}`,
  ],
});

export default function TratamentosPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Início", path: "/" },
            { name: "Tratamentos", path: "/tratamentos" },
          ]),
          servicesSchema(
            treatments.map((t) => ({ name: t.name, slug: t.slug, excerpt: t.excerpt })),
          ),
        ]}
      />
      <PageHero
        eyebrow="Tratamentos"
        title="Cuidados completos para a saúde e a estética do seu sorriso"
        description="Cada tratamento é conduzido com técnica, ética e atenção ao seu tempo. Conheça abaixo e escolha por onde começar — a avaliação é sempre o primeiro passo."
        breadcrumbs={[{ name: "Início", href: "/" }, { name: "Tratamentos" }]}
      >
        <ButtonLink href={whatsappLink(waMessages.default)} external variant="primary" size="md">
          <MessageCircle className="size-4" strokeWidth={1.7} />
          Agendar avaliação pelo WhatsApp
        </ButtonLink>
      </PageHero>

      <section className="bg-brand-bone">
        <div className="container divide-y divide-brand-ink/[0.07]">
          {treatments.map((t, i) => {
            const reversed = i % 2 === 1;
            return (
              <div key={t.slug} className="py-16 lg:py-20">
                <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
                  {/* Visual */}
                  <Reveal
                    className={cn("lg:col-span-5", reversed && "lg:order-2")}
                    y={24}
                  >
                    {t.images?.length ? (
                      <div className="relative aspect-[5/4] overflow-hidden rounded-3xl shadow-lift">
                        <Image
                          src={t.images[0].src}
                          alt={t.images[0].alt}
                          fill
                          sizes="(max-width: 1024px) 100vw, 42vw"
                          className="object-cover"
                        />
                        <span className="absolute left-5 top-5 font-display text-5xl text-white/20 drop-shadow-sm">
                          0{i + 1}
                        </span>
                      </div>
                    ) : (
                      <div className="texture-grain relative flex aspect-[5/4] items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-brand-green via-brand-green-dark to-brand-green-deep shadow-lift">
                        <span aria-hidden className="pointer-events-none absolute -right-8 -top-8 size-40 rounded-full bg-brand-gold/15 blur-3xl" />
                        <span className="absolute left-6 top-6 font-display text-6xl text-brand-bone/10">
                          0{i + 1}
                        </span>
                        <span className="flex size-24 items-center justify-center rounded-3xl border border-brand-gold/30 bg-brand-bone/5 text-brand-gold-soft">
                          <TreatmentIcon name={t.icon} className="size-12" />
                        </span>
                      </div>
                    )}
                  </Reveal>

                  {/* Conteúdo */}
                  <div className={cn("lg:col-span-7", reversed && "lg:order-1")}>
                    <Reveal>
                      <p className="eyebrow">{t.shortName}</p>
                      <h2 className="mt-3 text-display-sm">{t.name}</h2>
                      <p className="mt-4 max-w-prose2 text-pretty leading-relaxed text-brand-ink/75">
                        {t.intro}
                      </p>
                    </Reveal>

                    <Reveal delay={0.08}>
                      <div className="mt-6 grid gap-x-8 gap-y-6 sm:grid-cols-2">
                        <div>
                          <h3 className="text-xs font-semibold uppercase tracking-eyebrow text-brand-gold-ink">
                            Benefícios
                          </h3>
                          <ul className="mt-3 space-y-2">
                            {t.benefits.slice(0, 3).map((b) => (
                              <li key={b} className="flex items-start gap-2.5 text-sm text-brand-ink/75">
                                <Check className="mt-0.5 size-4 shrink-0 text-brand-green" strokeWidth={2} />
                                {b}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h3 className="text-xs font-semibold uppercase tracking-eyebrow text-brand-gold-ink">
                            Indicado para
                          </h3>
                          <ul className="mt-3 space-y-2">
                            {t.forWhom.slice(0, 3).map((b) => (
                              <li key={b} className="flex items-start gap-2.5 text-sm text-brand-ink/75">
                                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-gold" />
                                {b}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </Reveal>

                    <Reveal delay={0.12}>
                      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                        <ButtonLink href={`/tratamentos/${t.slug}`} variant="primary" size="md">
                          Ver detalhes do tratamento
                          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.7} />
                        </ButtonLink>
                        <ButtonLink
                          href={whatsappLink(waMessages.treatment(t.name.toLowerCase()))}
                          external
                          variant="secondary"
                          size="md"
                        >
                          <MessageCircle className="size-4" strokeWidth={1.7} />
                          Falar sobre {t.shortName.toLowerCase()}
                        </ButtonLink>
                      </div>
                    </Reveal>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <CTASection />
    </>
  );
}
