"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { careNeeds } from "@/lib/content";
import { track } from "@/lib/analytics";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

/**
 * Seção orientada a NECESSIDADES — o visitante se identifica com um cenário
 * e cada card o leva à página mais útil para aquele momento (roteador de
 * conversão). Conteúdo ético, informativo, não promocional.
 */
export function CareNeeds() {
  return (
    <section className="section-y bg-gradient-to-b from-brand-bone to-brand-beige/30">
      <div className="container">
        <SectionHeading
          eyebrow="Por onde começar"
          title="Como podemos cuidar de você"
          description="Cada pessoa chega por um motivo diferente. Identifique-se com um cenário e siga para o caminho mais útil — a avaliação é sempre o primeiro passo."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {careNeeds.map(({ icon: Icon, title, description, href, cta }, i) => (
            <Reveal key={title} delay={(i % 3) * 0.07}>
              <Link
                href={href}
                onClick={() => track("care_need_click", { need: title, href })}
                className="group flex h-full flex-col gap-4 rounded-3xl border border-brand-ink/[0.07] bg-white/80 p-6 shadow-card transition-all duration-500 ease-out-expo hover:-translate-y-1 hover:border-brand-gold/30 hover:shadow-lift sm:p-7"
              >
                <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-brand-green/[0.07] text-brand-green transition-colors duration-500 group-hover:bg-brand-green group-hover:text-brand-bone">
                  <Icon className="size-6" strokeWidth={1.5} aria-hidden />
                </span>
                <div className="flex-1">
                  <h3 className="font-display text-xl leading-tight text-brand-green">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-brand-ink/70">{description}</p>
                </div>
                <span className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-gold-ink">
                  {cta}
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.8} />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-12 flex justify-center">
            <ButtonLink
              href="/agendamento"
              variant="primary"
              size="md"
              onClick={() => track("scheduling_intent", { location: "care_needs" })}
            >
              Quero começar por uma avaliação
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.7} />
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
