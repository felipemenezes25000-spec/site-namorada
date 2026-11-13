import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Eyebrow } from "@/components/ui/eyebrow";
import styles from "./apoio-cabeca.module.css";

/**
 * Cabeça de seção das páginas de apoio: kicker e H2 à esquerda (7 colunas) e, se houver, um texto
 * curto à direita, alinhado pela base (a partir de 760px). Sempre à esquerda, nada centralizado.
 * `sticky` prende o bloco enquanto a lista ao lado corre (só a partir de 1100px). Servidor.
 */
export function ApoioCabeca({
  id,
  kicker,
  title,
  empilhar = false,
  children,
}: {
  id: string;
  kicker: string;
  title: ReactNode;
  /** Texto abaixo do título (em vez de ao lado): para colunas estreitas. */
  empilhar?: boolean;
  children?: ReactNode;
}) {
  return (
    <div className={cn(styles.root, (!children || empilhar) && styles.solo)}>
      <div className={styles.titulo}>
        <Eyebrow>{kicker}</Eyebrow>
        <h2 id={id} className={cn("t-d2", styles.h2)}>
          {title}
        </h2>
      </div>
      {children && <div className={cn("t-body", styles.texto)}>{children}</div>}
    </div>
  );
}
