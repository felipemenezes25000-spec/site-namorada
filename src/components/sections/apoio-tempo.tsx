import { cn } from "@/lib/utils";
import { FioRule } from "@/components/brand/fio-rule";
import styles from "./apoio-tempo.module.css";

/**
 * Abertura de /primeira-consulta: o tempo da consulta como numeral monumental ("40 a 60").
 * Versão completa (a partir de 760px): numeral, fio e o texto canônico de duração. Versão `mini`
 * (celular, no alto do hero): numeral e unidade numa linha. O numeral é decorativo (aria-hidden);
 * a informação vai em texto. Servidor.
 */
export function ApoioTempo({ legenda, mini = false }: { legenda?: string; mini?: boolean }) {
  const numeral = (
    <p className={cn("it-sm", styles.numeral, mini && styles.mini)} aria-hidden="true">
      <span className={styles.n}>40</span>
      <span className={styles.a}>a</span>
      <span className={styles.n}>60</span>
    </p>
  );
  if (mini) {
    return (
      <div className={styles.miniRoot}>
        {numeral}
        <p className={cn("t-folio", styles.unidade)}>
          <span className="sr-only">40 a 60 </span>minutos, em média
        </p>
      </div>
    );
  }
  return (
    <div className={styles.root}>
      {numeral}
      <FioRule reveal={false} className={styles.fio} />
      <p className={cn("t-body", styles.legenda)}>{legenda}</p>
    </div>
  );
}
