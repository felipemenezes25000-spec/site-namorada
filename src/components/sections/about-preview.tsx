import { ArrowRight, Quote, HeartHandshake } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { ButtonLink } from "@/components/ui/button";
import { PhotoPlaceholder } from "@/components/ui/photo-placeholder";
import { Reveal } from "@/components/ui/reveal";

export function AboutPreview() {
  return (
    <section className="section-y overflow-hidden bg-gradient-to-b from-white to-brand-beige/40">
      <div className="container grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
        {/* visual */}
        <Reveal className="lg:col-span-5" y={28}>
          <div className="relative mx-auto max-w-sm lg:max-w-none">
            <PhotoPlaceholder
              tone="beige"
              label="Foto da Dra. Ana Beatriz"
              className="aspect-[4/5] shadow-lift"
            />
            <div className="surface absolute -right-3 -top-3 hidden max-w-[12rem] items-center gap-3 rounded-2xl px-4 py-3 sm:flex">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-green/10 text-brand-green">
                <HeartHandshake className="size-5" strokeWidth={1.6} />
              </span>
              <p className="text-xs leading-tight text-brand-ink/70">
                Atendimento sem<br />linha de produção
              </p>
            </div>
          </div>
        </Reveal>

        {/* texto */}
        <div className="lg:col-span-7">
          <Reveal>
            <p className="eyebrow flex items-center gap-3">
              <span className="inline-block h-px w-7 bg-brand-gold/70" />
              Sobre a Dra. Ana
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-5 text-display-md text-balance">
              Uma odontologia que começa pela escuta e se constrói com confiança
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-prose2 text-pretty leading-relaxed text-brand-ink/75">
              {siteConfig.doctorName} é {siteConfig.title.toLowerCase()} ({siteConfig.cro})
              e acredita que cada sorriso carrega uma história. Seu trabalho une
              técnica e sensibilidade: avaliar com calma, explicar com clareza e
              planejar cada etapa junto com o paciente.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-4 max-w-prose2 text-pretty leading-relaxed text-brand-ink/75">
              O foco está em {siteConfig.focus.toLowerCase()} Aqui, cada decisão é
              tomada com segurança e transparência sobre o que cada etapa pode
              oferecer — no seu tempo, sem pressa.
            </p>
          </Reveal>

          {/* citação institucional */}
          <Reveal delay={0.2}>
            <figure className="mt-8 rounded-2xl border-l-2 border-brand-gold/60 bg-white/70 p-6">
              <Quote className="size-6 text-brand-gold" strokeWidth={1.5} aria-hidden />
              <blockquote className="mt-3 font-display text-xl leading-snug text-brand-green">
                “Cuidar bem é, antes de tudo, ouvir com atenção e respeitar o tempo
                de cada pessoa.”
              </blockquote>
            </figure>
          </Reveal>

          <Reveal delay={0.25}>
            <div className="mt-8">
              <ButtonLink href="/sobre" variant="secondary" size="md">
                Conhecer a trajetória da Dra. Ana
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.7} />
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
