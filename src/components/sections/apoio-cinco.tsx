import { cn } from "@/lib/utils";
import { FioRule } from "@/components/brand/fio-rule";
import styles from "./apoio-cinco.module.css";

/**
 * Abertura de /valores: o numeral dos princípios (`n`, hoje 4) em tamanho monumental, com a frase de
 * transparência por baixo. Versão `mini` no celular (numeral e unidade numa linha). O numeral é
 * decorativo (aria-hidden); a informação está no texto. Servidor.
 */
const POR_EXTENSO = ["", "Um", "Dois", "Três", "Quatro", "Cinco", "Seis", "Sete"];

export function ApoioCinco({
  n = 5,
  legenda,
  mini = false,
}: {
  /** Quantos princípios a página lista (o numeral e o texto para leitor de tela saem daqui). */
  n?: number;
  legenda?: string;
  mini?: boolean;
}) {
  const numeral = (
    <p className={cn("it-sm", styles.numeral, mini && styles.mini)} aria-hidden="true">
      {n}
    </p>
  );
  const unidade = (
    <p className={cn("t-folio", styles.unidade)}>
      <span className="sr-only">{POR_EXTENSO[n] ?? n} </span>princípios
    </p>
  );
  if (mini) {
    return (
      <div className={styles.miniRoot}>
        {numeral}
        {unidade}
      </div>
    );
  }
  return (
    <div className={styles.root}>
      {numeral}
      {unidade}
      <FioRule reveal={false} className={styles.fio} />
      <p className={cn("t-body", styles.legenda)}>{legenda}</p>
    </div>
  );
}
