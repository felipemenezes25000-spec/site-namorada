import { Quote, Star, User } from "lucide-react";
import { testimonials } from "@/lib/content";
import { siteConfig } from "@/lib/site-config";
import { isPlaceholder } from "@/lib/seo";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

export function Testimonials() {
  return (
    <section className="section-y bg-gradient-to-b from-brand-beige/40 to-brand-bone">
      <div className="container">
        <SectionHeading
          eyebrow="Relatos de pacientes"
          title="O cuidado sentido por quem já foi atendido"
          description="A experiência de cada paciente é única. Estes relatos refletem o tom do atendimento — humano, atento e sem pressa — e são compartilhados com a identidade preservada."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <figure className="surface flex h-full flex-col gap-5 p-7">
                <Quote className="size-9 text-brand-gold/60" strokeWidth={1.3} aria-hidden />
                <blockquote className="flex-1 text-pretty leading-relaxed text-brand-ink/80">
                  “{t.quote}”
                </blockquote>
                <figcaption className="flex items-center gap-3 border-t border-brand-ink/[0.06] pt-4">
                  <span className="flex size-10 items-center justify-center rounded-full bg-brand-green/[0.08] font-display text-lg text-brand-green">
                    {(() => {
                      const initial = t.author.match(/\p{L}/u)?.[0]?.toUpperCase();
                      return initial ? initial : <User className="size-5" strokeWidth={1.6} aria-hidden />;
                    })()}
                  </span>
                  <span className="leading-tight">
                    <span className="block text-sm font-semibold text-brand-green">{t.author}</span>
                    <span className="block text-xs text-brand-ink/65">{t.context}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        {!isPlaceholder(siteConfig.address.reviewUrl) && (
          <Reveal delay={0.1}>
            <div className="mt-12 flex flex-col items-center gap-4 text-center">
              <p className="text-sm text-brand-ink/60">
                Já é paciente da Dra. Ana? Sua avaliação ajuda outras pessoas a
                encontrarem um atendimento de confiança.
              </p>
              <ButtonLink href={siteConfig.address.reviewUrl} external variant="secondary" size="md">
                <Star className="size-4 fill-brand-gold text-brand-gold" />
                Avaliar no Google
              </ButtonLink>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
