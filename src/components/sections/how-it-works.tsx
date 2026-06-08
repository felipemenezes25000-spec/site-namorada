"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { journeySteps } from "@/lib/content";
import { whatsappLink, waMessages } from "@/lib/whatsapp";
import { track } from "@/lib/analytics";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button";
import { Reveal, RevealGroup, revealItem } from "@/components/ui/reveal";

export function HowItWorks() {
  return (
    <section className="texture-grain relative section-y overflow-hidden bg-brand-green text-brand-bone">
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-brand-gold/10 blur-3xl"
      />
      <div className="container relative">
        <SectionHeading
          light
          eyebrow="Como funciona"
          title="Do primeiro contato à sua consulta, em passos simples"
          description="Você não precisa chegar sabendo o que precisa. Sem burocracia e sem etapas desnecessárias — um caminho claro, no seu ritmo, até o cuidado que você procura."
        />

        <RevealGroup className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4" stagger={0.1}>
          {journeySteps.map((step, i) => (
            <motion.div key={step.number} variants={revealItem} className="relative">
              {/* linha conectora (desktop) */}
              {i < journeySteps.length - 1 && (
                <span
                  aria-hidden
                  className="absolute left-12 top-6 hidden h-px w-[calc(100%-2rem)] bg-gradient-to-r from-brand-gold/40 to-transparent lg:block"
                />
              )}
              <span className="relative flex size-12 items-center justify-center rounded-full border border-brand-gold/40 bg-brand-green-dark font-display text-lg text-brand-gold-soft">
                {step.number}
              </span>
              <h3 className="mt-5 font-display text-xl text-brand-bone">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-bone/70">
                {step.description}
              </p>
            </motion.div>
          ))}
        </RevealGroup>

        <Reveal delay={0.1}>
          <div className="mt-14 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ButtonLink
              href={whatsappLink(waMessages.default)}
              external
              variant="gold"
              size="lg"
              onClick={() => track("whatsapp_click", { location: "how_it_works" })}
            >
              <MessageCircle className="size-5" strokeWidth={1.7} />
              Começar pelo WhatsApp
            </ButtonLink>
            <ButtonLink
              href="/primeira-consulta"
              variant="light"
              size="lg"
              onClick={() => track("cta_click", { location: "how_it_works", target: "primeira_consulta" })}
            >
              Ver como é a primeira consulta
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
