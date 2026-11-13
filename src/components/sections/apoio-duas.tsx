import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import styles from "./apoio-duas.module.css";

/**
 * Duas colunas das páginas de apoio (5/7 a partir de 760px, uma coluna abaixo): a cabeça à esquerda,
 * presa ao rolar a lista (só a partir de 1100px), e o conteúdo à direita. Servidor.
 */
export function ApoioDuas({
  esquerda,
  direita,
  larga = false,
}: {
  esquerda: ReactNode;
  direita: ReactNode;
  /** Colunas 6/6 em vez de 5/7 (títulos mais compridos). */
  larga?: boolean;
}) {
  return (
    <div className={cn("grid12", styles.root, larga && styles.larga)}>
      <div className={styles.esq}>{esquerda}</div>
      <div className={styles.dir}>{direita}</div>
    </div>
  );
}
