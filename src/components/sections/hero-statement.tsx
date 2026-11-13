import { differentials } from "@/lib/content";
import { cn } from "@/lib/utils";
import type { CSSProperties } from "react";
import styles from "./hero-statement.module.css";

/**
 * Declaração + três colunas (DESIGN.md 5.1, ainda dentro do momento da capa).
 * Equivale a "o que você precisa" e "diferenciais" do site antigo: uma frase em
 * serifa grande e três colunas separadas por fios (títulos em Hanken 500).
 * Títulos e descrições vêm de `differentials` (content.ts): nada de texto novo.
 * Sem animação além dos fios que se desenham ao entrar na tela.
 */
const COLUMNS = ["Consulta de 40 a 60 minutos", "Orçamento após avaliação, sem pressão", "WhatsApp direto com a Dra. Ana"];

export function HeroStatement({ className }: { className?: string }) {
  const cols = COLUMNS.map((title) => differentials.find((d) => d.title === title)).filter(
    (d): d is NonNullable<typeof d> => Boolean(d),
  );
  return (
    <div className={cn(styles.root, className)}>
      <div className="grid12">
        <div className={styles.statement}>
          <p className={cn("t-kicker", styles.cap)}>Diagnóstico antes de qualquer decisão</p>
          <p className={cn("t-d3 display", styles.line)}>
            Você entende o que foi encontrado, em linguagem simples, antes de decidir qualquer
            procedimento.
          </p>
        </div>
      </div>

      {/* O fio superior de cada coluna é ::before (CSS): dentro de <dl> só cabem <dt> e <dd>. */}
      <dl data-reveal="" className={styles.cols}>
        {cols.map((c, i) => (
          <div key={c.title} className={styles.col} style={{ "--i": i } as CSSProperties}>
            <dt className={styles.dt}>{c.title}</dt>
            <dd className={cn("t-body", styles.dd)}>{c.description}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
