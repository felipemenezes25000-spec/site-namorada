import Image from "next/image";
import { ArrowRight, Quote, HeartHandshake, Check } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

export function AboutPreview() {
  return (
    <section className="section-y overflow-hidden bg-gradient-to-b from-white to-brand-beige/40">
      <div className="container grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
        {/* visual */}
        <Reveal className="lg:col-span-5" y={28}>
          <div className="relative mx-auto max-w-sm lg:max-w-none">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-brand-beige/40 shadow-lift">
              <Image
                src="/dra-ana-cirurgia.webp"
                alt={`${siteConfig.doctorName} — ${siteConfig.title} com formação em cirurgia oral`}
                fill
                sizes="(min-width: 1024px) 32rem, (min-width: 640px) 24rem, 90vw"
                className="object-cover"
              />
            </div>
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
              {siteConfig.doctorName} é {siteConfig.title.toLowerCase()} e
              acredita que cada sorriso carrega uma história. Seu trabalho une
              técnica e sensibilidade: avaliar com calma, explicar com clareza e
              planejar cada etapa junto com o paciente.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-4 max-w-prose2 text-pretty leading-relaxed text-brand-ink/75">
              O foco está na odontologia preventiva, saúde bucal, função, estética
              e atendimento humanizado. Realizando também cirurgias orais de
              pequeno e médio porte. Aqui, cada decisão é tomada com segurança e
              transparência sobre o que cada etapa pode oferecer, considerando os
              seus riscos e benefícios, e respeitando sempre a autonomia do
              paciente.
            </p>
          </Reveal>

          {/* destaques rápidos */}
          <Reveal delay={0.18}>
            <ul className="mt-7 grid gap-3 sm:grid-cols-2">
              {[
                "Avaliação completa e diagnóstico claro",
                "Plano de cuidado individualizado e eficiente",
                "Explicação de cada etapa antes de iniciar o tratamento",
                "Presença e cuidado: acompanhamos você de perto, do início ao fim",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-brand-ink/75">
                  <Check className="mt-0.5 size-4 shrink-0 text-brand-green" strokeWidth={2.2} />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>

          {/* citação institucional */}
          <Reveal delay={0.2}>
            <figure className="mt-8 rounded-2xl border-l-2 border-brand-gold/60 bg-white/70 p-6">
              <Quote className="size-6 text-brand-gold" strokeWidth={1.5} aria-hidden />
              <blockquote className="mt-3 font-display text-xl leading-snug text-brand-green">
                “Cuidar bem é somar o rigor técnico e teórico ao respeito e
                cuidado com cada paciente.”
              </blockquote>
              <figcaption className="mt-4 text-sm font-medium text-brand-gold-ink">
                — Dra. Ana Beatriz
              </figcaption>
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
