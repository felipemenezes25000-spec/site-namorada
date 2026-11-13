import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";
import { Prose } from "@/components/ui/prose";
import { Section } from "@/components/ui/section";
import styles from "./legal-shell.module.css";

export interface LegalSection {
  /** `id` do `<h2>` correspondente no texto. */
  id: string;
  title: string;
}

/**
 * Título de seção gerado a partir de `sections` (uma única fonte para sumário, `id` e numeração).
 * O numeral fica em ouro, em coluna própria a partir de 960px.
 */
export function LegalHeading({ id, sections }: { id: string; sections: LegalSection[] }) {
  const i = sections.findIndex((s) => s.id === id);
  if (i < 0) return null;
  return (
    <h2 id={id} className={styles.h2}>
      <span className={styles.n}>{i + 1}.</span>
      <span>{sections[i].title}</span>
    </h2>
  );
}

/**
 * Corpo dos documentos legais (DESIGN.md 5.12): seção `papel` (a capa é `osso`), coluna de
 * leitura `Prose` (62ch) e, a partir de 960px, notas laterais com o sumário preso à tela.
 * Abaixo de 960px o sumário vira uma lista recolhível no começo do texto. Sem seção escura,
 * sem CTA, sem fecho: depois do texto vem só o rodapé. Servidor.
 */
/**
 * Link numa linha própria (e-mail do canal de privacidade, ANPD): alvo de toque de 44px.
 * Use fora de parágrafo corrido; dentro do texto o link segue a linha normal.
 */
export function LegalLinkLine({ children }: { children: ReactNode }) {
  return <p className={styles.linkLine}>{children}</p>;
}

export function LegalShell({
  sections,
  notes,
  children,
}: {
  sections: LegalSection[];
  /** Notas curtas da margem (>= 960px). */
  notes?: ReactNode;
  children: ReactNode;
}) {
  const toc = (
    <ol className={styles.tocList}>
      {sections.map((s) => (
        <li key={s.id}>
          <a href={`#${s.id}`}>{s.title}</a>
        </li>
      ))}
    </ol>
  );

  return (
    <Section tone="papel" spacing="none" className={styles.sec}>
      <Container>
        <div className={styles.grid}>
          <div className={styles.main}>
            <details className={styles.tocMobile}>
              <summary className={styles.summary}>Nesta página</summary>
              {toc}
            </details>
            {notes && <div className={styles.notesInline}>{notes}</div>}
            <Prose className={styles.prose}>{children}</Prose>
          </div>

          <aside className={styles.aside} aria-label="Notas e sumário">
            <div className={styles.sticky}>
              <nav aria-labelledby="legal-sumario">
                <p id="legal-sumario" className="t-kicker">
                  Nesta página
                </p>
                {toc}
              </nav>
              {notes && <div className={styles.notes}>{notes}</div>}
            </div>
          </aside>
        </div>
      </Container>
    </Section>
  );
}
