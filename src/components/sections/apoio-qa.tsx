import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import styles from "./apoio-qa.module.css";

/**
 * Perguntas práticas respondidas à vista (sem acordeão): a pergunta curta à esquerda, em Hanken 500,
 * e a resposta ao lado, em duas colunas a partir de 760px. Lista de definição com fios. Servidor.
 */
export function ApoioQA({ items, className }: { items: { q: string; a: string }[]; className?: string }) {
  return (
    <dl data-reveal="" className={cn(styles.list, className)}>
      {items.map((item, i) => (
        <div key={item.q} className={styles.row} style={{ "--i": Math.min(i, 8) } as CSSProperties}>
          <span className={cn("fio-h", styles.rule)} aria-hidden="true" />
          <dt className={styles.q}>{item.q}</dt>
          <dd className={cn("t-body", styles.a)}>{item.a}</dd>
        </div>
      ))}
      <div className={styles.end} aria-hidden="true">
        <span className="fio-h" style={{ "--fio-delay": `${Math.min(items.length, 8) * 40}ms` } as CSSProperties} />
      </div>
    </dl>
  );
}
