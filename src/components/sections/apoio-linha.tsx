import { cn } from "@/lib/utils";
import styles from "./apoio-linha.module.css";

export interface ApoioLinhaItem {
  title: string;
  description: string;
}

/**
 * Etapas ao longo de um fio vertical de ouro com um losango por etapa (o Fio como caminho).
 * Geometria só de CSS (o fio de cada etapa desce do seu losango até o seguinte).
 * Sem medir o DOM. Servidor.
 */
export function ApoioLinha({ items }: { items: ApoioLinhaItem[] }) {
  return (
    <ol className={styles.list}>
      {items.map((item) => (
        <li key={item.title} className={styles.item}>
          <span className={styles.dot} aria-hidden="true" />
          <h3 className={cn("display", styles.title)}>{item.title}</h3>
          <p className={cn("t-body", styles.text)}>{item.description}</p>
        </li>
      ))}
    </ol>
  );
}
