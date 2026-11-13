import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Section, type SectionTone } from "@/components/ui/section";
import { Monogram } from "@/components/brand/logo";
import styles from "./apoio-declaracao.module.css";

/**
 * Declaração em display (as cenas de fala das páginas de apoio). O título é a frase; o texto e as
 * ações ficam ao lado. `grande` troca o título por uma citação monumental em itálico (para tom
 * noite), com o monograma AB em marca d'água. Servidor.
 */
export function ApoioDeclaracao({
  id,
  tone,
  kicker,
  title,
  size = "d2",
  children,
  actions,
  marca = false,
  hideFloating = false,
}: {
  id: string;
  tone: SectionTone;
  kicker?: string;
  title: ReactNode;
  /** "d2" (40 a 64px), "d3" (28 a 44px) ou "grande" (itálico até 96px). */
  size?: "d2" | "d3" | "grande";
  children?: ReactNode;
  actions?: ReactNode;
  /** Monograma claro em marca d'água (só em tom escuro). */
  marca?: boolean;
  /** Esconde a barra do celular enquanto a seção está na tela (faixa de ação). */
  hideFloating?: boolean;
}) {
  const grande = size === "grande";
  return (
    <Section tone={tone} id={id} aria-labelledby={`${id}-titulo`}
      hideFloating={hideFloating}
      className={styles.root}
    >
      <Container>
        <div className={cn("grid12", styles.grid, grande && styles.gridGrande)}>
          <div className={styles.head}>
            {kicker && <Eyebrow>{kicker}</Eyebrow>}
            <h2
              id={`${id}-titulo`}
              className={cn(
                grande ? styles.grande : size === "d3" ? "t-d3 display" : "t-d2",
                styles.title,
                !grande && kicker && "mt-5",
              )}
            >
              {title}
            </h2>
          </div>
          {(children || actions) && (
            <div className={styles.body}>
              {children && <div className={cn("t-body", styles.text)}>{children}</div>}
              {actions && <div className={styles.actions}>{actions}</div>}
            </div>
          )}
        </div>
      </Container>
      {marca && <Monogram tone="claro" size={420} className={styles.marca} />}
    </Section>
  );
}
