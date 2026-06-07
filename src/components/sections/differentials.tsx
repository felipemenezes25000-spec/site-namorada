import { differentials } from "@/lib/content";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";

export function Differentials() {
  return (
    <section className="section-y bg-brand-bone">
      <div className="container">
        <SectionHeading
          align="left"
          eyebrow="Por que a Dra. Ana"
          title="Um atendimento que se nota nos detalhes"
          description="Pequenas escolhas que transformam a ida ao dentista em uma experiência tranquila e confiável."
          className="max-w-3xl"
        />

        <div className="mt-14 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {differentials.map(({ icon: Icon, title, description }, i) => (
            <Reveal key={title} delay={(i % 3) * 0.07}>
              <div className="group flex gap-5">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-brand-green/[0.07] text-brand-green transition-colors duration-300 group-hover:bg-brand-gold/15 group-hover:text-brand-gold">
                  <Icon className="size-6" strokeWidth={1.5} />
                </span>
                <div>
                  <h3 className="font-display text-xl leading-tight text-brand-green">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-brand-ink/65">{description}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
