import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Monogram } from "@/components/brand/logo";
import styles from "./editorial.module.css";

/**
 * Declaração (DESIGN.md 5.1, momento 3b): a segunda cena de impacto da home. Uma frase da
 * Dra. em serifa itálica monumental sobre verde-noite, com o monograma AB em marca d'água.
 * O texto é a citação institucional que já existia no site. Servidor, sem JavaScript.
 */
export function DeclarationSection({ id = "declaracao" }: { id?: string }) {
  return (
    <Section
      tone="noite"
      id={id}
      aria-label="Declaração da Dra. Ana"
      className={styles.decl}
    >
      <Container>
        <figure className={`m-0 ${styles.declInner}`}>
          <blockquote className={`m-0 ${styles.quote}`}>
            “Cuidar bem é somar o rigor técnico e teórico ao respeito e cuidado com cada
            paciente.”
          </blockquote>
          <figcaption className={styles.quoteBy}>
            <span className={styles.rule} aria-hidden="true" />
            <span className="t-folio">Dra. Ana Beatriz</span>
          </figcaption>
        </figure>
      </Container>
      <Monogram tone="claro" size={420} className={styles.declMark} />
    </Section>
  );
}
