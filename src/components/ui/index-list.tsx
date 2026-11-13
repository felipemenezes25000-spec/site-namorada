import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface IndexItem {
  /** Numeral ("01"). Em "sumario" e "passos" o padrão é a posição (01, 02...). */
  n?: string;
  title: ReactNode;
  description?: ReactNode;
  /** "sumario": número de página à direita. */
  meta?: string;
  href?: string;
  current?: boolean;
}

/**
 * Linha de uma lista com fios: <li class="idx-item"> + fio superior que se desenha (`--i` escalona,
 * no máximo 8) + o conteúdo. Use dentro de `<ol className="idx" data-reveal>` (com `IndexEnd` no fim)
 * quando o conteúdo da linha for próprio da seção (seletor, sumário); para o resto, use `IndexList`.
 */
export function IndexRow({
  i = 0,
  className,
  style,
  children,
  ...data
}: {
  i?: number;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  [key: `data-${string}`]: string | undefined;
}) {
  return (
    <li {...data} className={cn("idx-item", className)} style={{ ...style, "--i": Math.min(i, 8) } as CSSProperties}>
      <span className="fio-h idx-rule" aria-hidden="true" />
      {children}
    </li>
  );
}

/** Fio final da lista (fecha a última linha). `i` = número de linhas (escalona como as outras). */
export function IndexEnd({ i = 0 }: { i?: number }) {
  return (
    <li className="idx-item idx-end" aria-hidden="true">
      <span className="fio-h" style={{ "--i": Math.min(i, 8) } as CSSProperties} />
    </li>
  );
}

export type IndexVariant = "sumario" | "passos" | "fatos" | "contatos";

/**
 * Título de passo: <h3> só quando é um título (texto curto, sem ponto final). Frase ("Respire fundo e tente
 * manter a calma.") vira <p>: um leitor de tela não deve listar frases como cabeçalhos da página.
 */
function ehTitulo(title: ReactNode): boolean {
  return typeof title !== "string" || (title.length <= 60 && !/[.!?:;]$/.test(title.trim()));
}

const variantClass: Record<IndexVariant, string> = {
  sumario: "idx-sumario",
  passos: "idx-passos",
  fatos: "idx-fatos",
  contatos: "idx-contatos",
};

/**
 * Lista editorial sem cartões (DESIGN.md 4.1). Quatro variantes:
 *  - sumario: numeral itálico + título .t-row + pontilhado + nº de página; a linha é um <a> (>= 56px);
 *  - passos: numeral grande à esquerda, título .t-d3, descrição .t-body;
 *  - fatos: losango vazado + frase;
 *  - contatos: rótulo .t-cap + valor .t-d3 (valor quebra com overflow-wrap: anywhere).
 * As linhas são `.fio-h` que se desenham ao entrar na tela (atraso de 60ms por passo, máx. 8).
 */
export function IndexList({
  items,
  variant,
  as: Tag = variant === "fatos" ? "ul" : "ol",
  size = "row",
  className,
}: {
  items: IndexItem[];
  variant: IndexVariant;
  as?: "ol" | "ul";
  size?: "row" | "d3";
  className?: string;
}) {
  const rules = variant !== "fatos";
  return (
    <Tag data-reveal="" className={cn("idx", variantClass[variant], className)}>
      {items.map((item, i) => {
        const style = { "--i": Math.min(i, 8) } as CSSProperties;
        const num = item.n ?? String(i + 1).padStart(2, "0");
        return (
          <li key={i} className="idx-item" style={style}>
            {rules && <span className="fio-h idx-rule" aria-hidden="true" />}
            {variant === "sumario" && <SumarioLink item={item} num={num} size={size} />}
            {variant === "passos" && (
              <>
                <span className="t-folio idx-num it-sm" aria-hidden="true">
                  {num}
                </span>
                <div className="min-w-0">
                  {ehTitulo(item.title) ? (
                    <h3 className="t-d3 display">{item.title}</h3>
                  ) : (
                    <p className="t-d3 display m-0">{item.title}</p>
                  )}
                </div>
                {item.description && (
                  <div className="t-body idx-sub min-w-0">{item.description}</div>
                )}
              </>
            )}
            {variant === "fatos" && (
              <>
                <span className="idx-dia" aria-hidden="true" />
                <span className={cn("min-w-0", size === "d3" ? "t-d3" : "t-body")}>
                  {item.title}
                  {item.description && <span className="t-cap mt-1 block">{item.description}</span>}
                </span>
              </>
            )}
            {variant === "contatos" && (
              <>
                <span className="t-cap">{item.meta}</span>
                <div className="idx-val t-d3 display">{item.title}</div>
              </>
            )}
          </li>
        );
      })}
      {rules && (
        <li className="idx-item idx-end" aria-hidden="true">
          <span className="fio-h" style={{ "--i": Math.min(items.length, 8) } as CSSProperties} />
        </li>
      )}
    </Tag>
  );
}

function SumarioLink({
  item,
  num,
  size,
}: {
  item: IndexItem;
  num: string;
  size: "row" | "d3";
}) {
  const inner = (
    <>
      <span className="it-sm idx-n" aria-hidden="true">
        {num}
      </span>
      <span className={cn("idx-t min-w-0", size === "d3" ? "t-d3" : "t-row")}>{item.title}</span>
      <span className="idx-dots" aria-hidden="true" />
      <span className="t-folio idx-pg nums" aria-hidden="true">
        {item.meta ?? num}
      </span>
      {item.description && <span className="idx-ind t-body">{item.description}</span>}
    </>
  );
  return item.href ? (
    <Link
      href={item.href}
      className="idx-link"
      aria-current={item.current ? "true" : undefined}
    >
      {inner}
    </Link>
  ) : (
    <div className="idx-link">{inner}</div>
  );
}
