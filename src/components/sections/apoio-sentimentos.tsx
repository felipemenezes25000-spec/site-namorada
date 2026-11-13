import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";
import styles from "./apoio-sentimentos.module.css";

export interface ApoioSentimento {
  title: string;
  text: string;
}

/**
 * Sentimentos de quem tem medo de dentista (/medo-de-dentista): um mural de frases em display,
 * em duas colunas, cada uma sob um fio, com o texto de acolhimento logo abaixo. A última célula
 * (`fecho`) é uma frase em itálico, sem título. Sem cartões, sem ícones. Servidor.
 */
export function ApoioSentimentos({
  items,
  fecho,
  className,
}: {
  items: ApoioSentimento[];
  fecho?: ReactNode;
  className?: string;
}) {
  return (
    <ul data-reveal="" className={cn(styles.list, className)}>
      {items.map((item, i) => (
        <li
          key={item.title}
          className={styles.cell}
          style={{ "--i": Math.min(i, 8) } as CSSProperties}
        >
          <span className={cn("fio-h", styles.rule)} aria-hidden="true" />
          <span className={styles.dia} aria-hidden="true" />
          <h3 className={cn("t-d3 display", styles.title)}>{item.title}</h3>
          <p className={cn("t-body", styles.text)}>{item.text}</p>
        </li>
      ))}
      {fecho && (
        <li
          className={cn(styles.cell, styles.fecho)}
          style={{ "--i": Math.min(items.length, 8) } as CSSProperties}
        >
          <span className={cn("fio-h", styles.rule)} aria-hidden="true" />
          <p className={styles.fechoTexto}>{fecho}</p>
        </li>
      )}
    </ul>
  );
}
