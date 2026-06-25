import { Smile, Stethoscope, GraduationCap, ArrowRight, MessageCircle } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { TrackedButtonLink } from "@/components/ui/tracked-button-link";
import { whatsappLink, waMessages } from "@/lib/whatsapp";

/**
 * Áreas de atuação em destaque, com a formação que dá lastro a cada uma.
 * Fonte única — usada na home e na página Sobre.
 *
 * Linguagem deliberadamente CFO-segura: descreve cuidado e formação,
 * sem anunciar título de especialista nem prometer resultado.
 *
 * Cada card oferece dois caminhos rastreados:
 *  - "Agendar avaliação" → /agendamento (mantém atribuição gclid/UTM do Google Ads)
 *  - WhatsApp com mensagem contextual por área (lead já chega qualificado)
 */
const areas = [
  {
    icon: Smile,
    title: "Implantodontia",
    description:
      "Reabilitação de dentes perdidos com implantes, devolvendo função, conforto e naturalidade ao sorriso — sempre com planejamento individual.",
    institutions: ["ABO Central", "APCD Central"],
    ctaLocation: "area_implante",
    waTopic: "implante",
  },
  {
    icon: Stethoscope,
    title: "Cirurgia Buco-Maxilo-Facial",
    description:
      "Avaliação e procedimentos na área buco-maxilo-facial, conduzidos com técnica, segurança e acompanhamento próximo em cada etapa.",
    institutions: ["ABO Central", "IOA"],
    ctaLocation: "area_bucomaxilo",
    waTopic: "cirurgia buco-maxilo-facial",
  },
] as const;

export function AreasSection({
  eyebrow = "Áreas de atuação",
  title = "Formação aprofundada em áreas que pedem técnica e planejamento",
  description = "Além do cuidado clínico geral, a Dra. Ana dedica parte da sua trajetória ao implante e à cirurgia buco-maxilo-facial — sempre com avaliação criteriosa antes de qualquer indicação.",
  className = "section-y bg-brand-bone",
}: {
  eyebrow?: string;
  title?: string;
  description?: string;
  className?: string;
}) {
  return (
    <section className={className}>
      <div className="container">
        <div className="max-w-2xl">
          <Reveal>
            <p className="eyebrow flex items-center gap-3">
              <span className="inline-block h-px w-7 bg-brand-gold/70" /> {eyebrow}
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-4 text-display-sm">{title}</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 text-pretty text-lg leading-relaxed text-brand-ink/75">
              {description}
            </p>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {areas.map(
            ({ icon: Icon, title: areaTitle, description: areaDesc, institutions, ctaLocation, waTopic }, i) => (
              <Reveal key={areaTitle} delay={i * 0.08} className="h-full">
                <div className="surface flex h-full flex-col rounded-3xl p-7 shadow-card sm:p-8">
                  <span className="flex size-12 items-center justify-center rounded-full bg-brand-green/[0.07] text-brand-green">
                    <Icon className="size-6" strokeWidth={1.5} />
                  </span>
                  <h3 className="mt-5 font-display text-2xl text-brand-green">{areaTitle}</h3>
                  <p className="mt-3 text-pretty leading-relaxed text-brand-ink/75">{areaDesc}</p>
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
                  <div className="mt-auto flex flex-wrap items-center gap-3 pt-7">
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
                    <TrackedButtonLink
                      href={whatsappLink(waMessages.treatment(waTopic))}
                      variant="secondary"
                      size="md"
                      external
                      event="whatsapp_click"
                      eventParams={{ location: ctaLocation }}
                      aria-label={`Falar no WhatsApp sobre ${areaTitle}`}
                    >
                      <MessageCircle className="size-4" strokeWidth={1.7} />
                      WhatsApp
                    </TrackedButtonLink>
                  </div>
                </div>
              </Reveal>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
