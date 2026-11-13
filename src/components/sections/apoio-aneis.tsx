import { Monogram } from "@/components/brand/logo";
import styles from "./apoio-aneis.module.css";

/**
 * Três anéis concêntricos de 1px (eco do anel do guia de respiração) em volta do monograma.
 * Só CSS, parado e decorativo (aria-hidden). Aparece na abertura de /medo-de-dentista. Servidor.
 */
export function ApoioAneis({ mini = false }: { mini?: boolean }) {
  return (
    <div className={mini ? styles.mini : styles.root} aria-hidden="true">
      <span className={styles.a1} />
      <span className={styles.a2} />
      <span className={styles.a3} />
      <Monogram size={mini ? 36 : 96} className={styles.mono} />
    </div>
  );
}
