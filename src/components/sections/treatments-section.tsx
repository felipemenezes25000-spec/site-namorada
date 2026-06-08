import { treatments } from "@/lib/treatments";
import { SectionHeading } from "@/components/ui/section-heading";
import { RevealGroup } from "@/components/ui/reveal";
import { TreatmentCard } from "./treatment-card";

export function TreatmentsSection({
  limit,
  eyebrow = "Tratamentos",
}: {
  limit?: number;
  eyebrow?: string;
}) {
  const list = limit ? treatments.slice(0, limit) : treatments;
  return (
    <section id="tratamentos" className="section-y bg-brand-bone">
      <div className="container">
        <SectionHeading
          eyebrow={eyebrow}
          title="Cuidados pensados para cada etapa do seu sorriso"
          description="Da primeira avaliação à estética — e o que cada um resolve, explicado sem jargão, para você escolher por onde começar."
        />
        <RevealGroup className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
          {list.map((t) => (
            <TreatmentCard key={t.slug} treatment={t} />
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
