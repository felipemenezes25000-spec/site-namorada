import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import styles from "./apoio-principios.module.css";

export interface ApoioPrincipio {
  title: string;
  description: string;
}

/**
 * Princípios em numerais monumentais (/valores): o numeral itálico domina a linha, o título em
 * display e o texto ficam à direita, fios entre as linhas. Sem cartões, sem ícones. Servidor.
 */
export function ApoioPrincipios({
  items,
  className,
}: {
  items: ApoioPrincipio[];
  className?: string;
}) {
  return (
    <ol data-reveal="" className={cn(styles.list, className)}>
      {items.map((item, i) => (
        <li
          key={item.title}
          className={styles.item}
          style={{ "--i": Math.min(i, 8) } as CSSProperties}
        >
          <span className={cn("fio-h", styles.rule)} aria-hidden="true" />
          <span className={cn("it-sm num num-lg", styles.num)} aria-hidden="true">
            {String(i + 1).padStart(2, "0")}
          </span>
          <h3 className={cn("t-d3 display", styles.title)}>{item.title}</h3>
          <p className={cn("t-body", styles.text)}>{item.description}</p>
        </li>
      ))}
      <li className={styles.end} aria-hidden="true">
        <span
          className="fio-h"
          style={{ "--fio-delay": `${Math.min(items.length, 8) * 40}ms` } as CSSProperties}
        />
      </li>
    </ol>
  );
}
