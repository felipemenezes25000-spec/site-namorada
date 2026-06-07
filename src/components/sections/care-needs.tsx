import { ArrowRight, MessageCircle } from "lucide-react";
import { careNeeds } from "@/lib/content";
import { whatsappLink, waMessages } from "@/lib/whatsapp";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

/**
 * Seção orientada a NECESSIDADES — o visitante se identifica com um cenário
 * e é direcionado à avaliação. Aumenta a densidade de conteúdo da home com
 * informação útil (não promocional).
 */
export function CareNeeds() {
  return (
    <section className="section-y bg-gradient-to-b from-brand-bone to-brand-beige/30">
      <div className="container">
        <SectionHeading
          eyebrow="Por onde começar"
          title="Como podemos cuidar de você"
          description="Cada pessoa chega por um motivo diferente. Veja onde a Dra. Ana pode ajudar — a avaliação é sempre o primeiro passo, sem compromisso."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {careNeeds.map(({ icon: Icon, title, description }, i) => (
            <Reveal key={title} delay={(i % 3) * 0.07}>
              <div className="group flex h-full gap-5 rounded-3xl border border-brand-ink/[0.07] bg-white/80 p-6 shadow-card transition-all duration-500 ease-out-expo hover:-translate-y-1 hover:border-brand-gold/30 hover:shadow-lift sm:p-7">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-brand-green/[0.07] text-brand-green transition-colors duration-500 group-hover:bg-brand-green group-hover:text-brand-bone">
                  <Icon className="size-6" strokeWidth={1.5} aria-hidden />
                </span>
                <div>
                  <h3 className="font-display text-xl leading-tight text-brand-green">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-brand-ink/70">{description}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ButtonLink href="/agendamento" variant="primary" size="md">
              Quero agendar minha avaliação
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.7} />
            </ButtonLink>
            <ButtonLink href={whatsappLink(waMessages.questions)} external variant="secondary" size="md">
              <MessageCircle className="size-4" strokeWidth={1.7} />
              Tirar dúvidas no WhatsApp
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
