import { Container } from "@/components/ui/container";
import { Section, type SectionTone } from "@/components/ui/section";
import { AuthorshipLine } from "@/components/ui/authorship-line";
import styles from "./apoio-autoria.module.css";

/**
 * Faixa de autoria no fim das páginas de apoio: "Conteúdo elaborado pela Dra. ... Atualizado em ...".
 * A data é a mesma do `dateModified` do JSON-LD (ambos vêm de `CONTENT_UPDATED`). Escolha um `tone`
 * diferente do da seção anterior. Servidor.
 */
export function ApoioAutoria({ tone }: { tone: SectionTone }) {
  return (
    <Section tone={tone} spacing="none" className={styles.faixa} aria-label="Autoria e data de atualização">
      <Container>
        <AuthorshipLine />
      </Container>
    </Section>
  );
}
