import { CalendarDays } from "lucide-react";
import { TrackedButtonLink } from "@/components/ui/tracked-button-link";
import { Reveal } from "@/components/ui/reveal";

export function CTASection({
  title = "Seu sorriso merece um cuidado planejado, seguro e acolhedor.",
  description = "Dê o primeiro passo hoje. A avaliação é uma conversa tranquila para entender o que você precisa.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <section className="bg-brand-bone pb-20 pt-8 sm:pb-24 sm:pt-12 lg:pt-16">
      <div className="container">
        <div className="texture-grain relative overflow-hidden rounded-[2rem] bg-brand-green px-6 py-16 text-center text-brand-bone sm:px-12 lg:px-16 lg:py-20">
          {/* ornamentos */}
          <div aria-hidden className="pointer-events-none absolute -left-16 -top-16 size-64 rounded-full bg-brand-gold/10 blur-3xl" />
          <div aria-hidden className="pointer-events-none absolute -bottom-20 -right-10 size-72 rounded-full bg-brand-mint/10 blur-3xl" />
          <svg
            aria-hidden
            viewBox="0 0 400 120"
            className="pointer-events-none absolute inset-x-0 bottom-0 mx-auto h-24 w-full max-w-xl text-brand-gold/20"
          >
            <path d="M20 30 C 20 110, 380 110, 380 30" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </svg>

          <Reveal>
            <p className="eyebrow justify-center text-brand-gold-bright">Vamos cuidar do seu sorriso</p>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="mx-auto mt-4 max-w-2xl text-balance text-display-md text-brand-bone">
              {title}
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mx-auto mt-5 max-w-xl text-pretty leading-relaxed text-brand-bone/75">
              {description}
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <div className="mt-9 flex items-center justify-center">
              <TrackedButtonLink
                href="/agendamento"
                variant="light"
                size="lg"
                event="scheduling_intent"
                eventParams={{ location: "cta_section" }}
              >
                <CalendarDays className="size-5" strokeWidth={1.7} />
                Agendar minha avaliação
              </TrackedButtonLink>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
