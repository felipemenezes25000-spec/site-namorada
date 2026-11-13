import type { ReactNode } from "react";
import styles from "./tratamento-nome.module.css";

/**
 * Nome do tratamento. O texto continua inteiro, com os hífens, para leitores de tela e rastreadores
 * ("pré-operatório" é lido como escrito). Palavras com hífen não quebram em telas largas; abaixo de
 * 400px a quebra é permitida logo depois do hífen (<wbr>), para nenhuma palavra passar da coluna.
 * O hífen usa Hanken, que se lê melhor que o da Bodoni em tamanho de título. Servidor.
 */
export function NomeTratamento({ name }: { name: string }) {
  const parts: ReactNode[] = [];
  name.split(" ").forEach((word, i) => {
    if (i > 0) parts.push(" ");
    if (!word.includes("-")) {
      parts.push(word);
      return;
    }
    const pieces = word.split("-");
    parts.push(
      <span key={`${word}-${i}`} className={styles.nb}>
        {pieces.map((p, j) => (
          <span key={j}>
            {p}
            {j < pieces.length - 1 && (
              <>
                <span className={styles.hy}>-</span>
                <wbr />
              </>
            )}
          </span>
        ))}
      </span>,
    );
  });
  return <>{parts}</>;
}
