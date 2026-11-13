import { treatments } from "@/lib/treatments";
import { situations } from "@/lib/situations";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { WhatsAppCTA } from "@/components/ui/cta";
import { SituationProvider } from "./situation-context";
import { SituationSelector } from "./situation-selector";
import { TreatmentIndex, type IndexTreatment } from "./treatment-index";
import styles from "./treatments-section.module.css";

/** Dados mínimos (primitivos) para as ilhas cliente: nada de `treatments.ts` inteiro no navegador. */
function indexItems(limit?: number): IndexTreatment[] {
  return (limit ? treatments.slice(0, limit) : treatments).map((t) => ({
    slug: t.slug,
    name: t.name,
    shortName: t.shortName,
    excerpt: t.excerpt,
    duration: t.duration,
    sessions: t.sessions,
  }));
}

/**
 * Momento 2 da home (DESIGN.md 5.1): "Tratamentos" como sumário de revista.
 * Acima, o seletor "O que traz você aqui hoje?"; abaixo, o sumário numerado
 * (cartão noite fixo no desktop). Os dois compartilham a situação escolhida:
 * os tratamentos indicados sobem ao topo do sumário. Sem escolha, nada muda.
 *
 * Sem JavaScript: o seletor vira lista de links e o sumário continua completo.
 */
export function TreatmentsSection({
  id = "tratamentos",
  eyebrow,
  title = "Tratamentos",
  folio = "Sumário",
  className,
}: {
  id?: string;
  eyebrow?: string;
  title?: string;
  folio?: string;
  className?: string;
}) {
  const items = indexItems();
  const titleTodos = "Todos os tratamentos";
  return (
    <Section tone="papel" id={id} aria-labelledby={`${id}-titulo`} className={className}>
      <Container>
        <SectionHeading
          id={`${id}-titulo`}
          eyebrow={eyebrow}
          title={
            <>
              {title}
              {folio && (
                <span className={`t-folio ${styles.folio}`} aria-hidden="true">
                  {folio}
                </span>
              )}
            </>
          }
          className={`max-w-none ${styles.titulo}`}
        />

        <SituationProvider>
          <div className={styles.selector}>
            <SituationSelector
              situations={situations}
              treatments={items.map(({ slug, name, shortName }) => ({ slug, name, shortName }))}
            />
          </div>

          <div className={styles.indice}>
            <span data-reveal="" className={`fio-h ${styles.sep}`} aria-hidden="true" />
            <h3 className={`t-kicker ${styles.todos}`}>{titleTodos}</h3>
            <div className={styles.lista}>
              <TreatmentIndex items={items} collapsibleLabel={`${titleTodos} (${items.length})`} />
            </div>
          </div>
        </SituationProvider>

        <div className={styles.convite}>
          <WhatsAppCTA location="treatments_section" intent="duvidas" variant="contorno" block />
        </div>
      </Container>
    </Section>
  );
}
