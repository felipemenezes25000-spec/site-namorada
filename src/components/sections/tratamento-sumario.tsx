import { ArrowIcon } from "@/components/ui/icons";
import { IndexEnd, IndexRow } from "@/components/ui/index-list";
import { TrackedLink } from "@/components/ui/tracked-link";
import { NomeTratamento } from "./tratamento-nome";
import styles from "./tratamento-indice.module.css";

export interface SumarioItem {
  slug: string;
  name: string;
  shortName: string;
  excerpt: string;
  duration?: string;
  sessions?: string;
}

/**
 * Sumário de /tratamentos (DESIGN.md 5.3): uma coluna só, na ordem de leitura 01 a 08. O texto do link
 * é o nome do tratamento (a âncora para /tratamentos/* nunca é uma frase); a linha inteira continua
 * clicável (o link se estende por cima dela). Ao lado vêm a frase do tratamento (coluna 7 da grade) e,
 * abaixo dela, duração e sessões. Sem cartão, sem foto, sem JavaScript além do rastreio do clique.
 * Servidor.
 */
export function TratamentoSumario({ items }: { items: SumarioItem[] }) {
  return (
    <ol data-reveal="" className={`idx ${styles.lista}`}>
      {items.map((t, i) => {
        const meta = [t.duration, t.sessions].filter(Boolean).join(" · ");
        return (
          <IndexRow key={t.slug} i={i} className={styles.item}>
            <span className={`it-sm ${styles.n}`} aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className={`t-row ${styles.nome}`}>
              <TrackedLink
                href={`/tratamentos/${t.slug}`}
                event="treatment_card_click"
                eventParams={{ treatment: t.shortName, location: "treatments_index" }}
                className={styles.link}
              >
                <NomeTratamento name={t.name} />
              </TrackedLink>
            </span>
            <ArrowIcon size={22} className={styles.arrow} />
            <p className={`t-body ${styles.txt}`}>
              {t.excerpt}
              {meta && <span className={styles.meta}>{meta}</span>}
            </p>
          </IndexRow>
        );
      })}
      <IndexEnd i={items.length} />
    </ol>
  );
}
