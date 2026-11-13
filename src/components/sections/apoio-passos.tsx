import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import styles from "./apoio-passos.module.css";

export interface ApoioPasso {
  title: string;
  /** Obrigatória no modo "titulos"; no modo "orientacoes" o texto é o próprio `title`. */
  description?: string;
}

/**
 * Passos em linha do tempo horizontal (4 colunas a partir de 1100px, 2 a partir de 760px, 1 abaixo):
 * numeral itálico grande, fio que se desenha, título em display e texto. Sem cartões. Servidor.
 * Use dentro de uma `Section` (os tons vêm das variáveis da seção).
 *
 * `modo` escolhe o que o item é:
 *  - "titulos" (padrão): título curto (h3) e descrição. Para etapas com nome.
 *  - "orientacoes": frases de orientação. Lista numerada, sem h3: cada item é um parágrafo
 *    (`title`), com `description` opcional logo abaixo. Para "o que fazer" e afins.
 */
export function ApoioPassos({
  items,
  modo = "titulos",
  className,
}: {
  items: ApoioPasso[];
  modo?: "titulos" | "orientacoes";
  className?: string;
}) {
  const orient = modo === "orientacoes";
  return (
    <ol data-reveal="" className={cn(styles.list, orient && styles.orient, className)}>
      {items.map((item, i) => (
        <li key={item.title} className={styles.item} style={{ "--i": Math.min(i, 8) } as CSSProperties}>
          <span className={cn("fio-h", styles.rule)} aria-hidden="true" />
          <span className={cn("it-sm num num-lg", styles.num)} aria-hidden="true">
            {String(i + 1).padStart(2, "0")}
          </span>
          {orient ? (
            <p className={cn("t-lead", styles.frase)}>{item.title}</p>
          ) : (
            <h3 className={cn("display", styles.title)}>{item.title}</h3>
          )}
          {item.description && <p className={cn("t-body", styles.text)}>{item.description}</p>}
        </li>
      ))}
    </ol>
  );
}
