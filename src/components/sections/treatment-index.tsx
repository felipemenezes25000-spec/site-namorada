"use client";

import Link from "next/link";
import { Fragment, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { ArrowIcon } from "@/components/ui/icons";
import { IndexEnd, IndexRow } from "@/components/ui/index-list";
import { Numeral } from "@/components/ui/numeral";
import { useSituation } from "./situation-context";
import styles from "./treatment-index.module.css";

/** Dados mínimos de cada tratamento (o servidor passa só primitivos). */
export interface IndexTreatment {
  slug: string;
  name: string;
  shortName: string;
  excerpt: string;
  duration?: string;
  sessions?: string;
}

/**
 * Palavras com hífen não quebram no hífen a partir de 400px (ficam inteiras na linha); abaixo disso
 * (ou com a fonte ampliada) o `<wbr>` permite a quebra, para a palavra nunca passar da largura.
 * O hífen é desenhado em Hanken, que se lê melhor que o da Bodoni em tamanho de título.
 */
function nameWithHyphens(name: string) {
  return name.split(" ").flatMap((word, i) => {
    const sep = i > 0 ? " " : "";
    if (!word.includes("-")) return [sep + word];
    const pieces = word.split("-");
    return [
      sep,
      <span key={`${word}-${i}`} className={styles.nb}>
        {pieces.map((piece, j) => (
          <Fragment key={j}>
            {piece}
            {j < pieces.length - 1 && (
              <>
                <span className={styles.hy}>-</span>
                <wbr />
              </>
            )}
          </Fragment>
        ))}
      </span>,
    ];
  });
}

/**
 * Sumário editorial de tratamentos (DESIGN.md 4.5): numerado, sem cartões e sem fotos.
 * Cada linha é um link real, então sem JavaScript a lista funciona igual. O nome acessível do
 * link é só o nome do tratamento (a frase vive no cartão visual, escondido dos leitores de tela).
 *
 *  - Desktop (>= 1100px) com `card`: o cartão noite fixo à direita troca ao passar o
 *    ponteiro ou focar uma linha (fade de 600ms).
 *  - Celular: sem cartão; a linha inteira é o alvo do dedo (>= 64px).
 *  - Dentro de `SituationProvider`, os tratamentos indicados para a situação escolhida
 *    sobem ao topo (reordenação real no DOM, com transição FLIP em WAAPI).
 *  - `showExcerpts` (página /tratamentos): a frase de cada tratamento fica visível
 *    na própria linha, em duas colunas no desktop, e o cartão não aparece.
 *  - `collapsibleLabel`: no celular (< 760px) a lista vem recolhida num <details> com esse rótulo
 *    (o conteúdo continua no HTML; sem JavaScript fica aberta; escolher uma situação abre).
 */
export function TreatmentIndex({
  items,
  card = true,
  showExcerpts = false,
  collapsibleLabel,
  className,
}: {
  items: IndexTreatment[];
  /** Cartão fixo à direita no desktop. */
  card?: boolean;
  /** Mostra a frase (excerpt) de cada linha e, se houver, duração e sessões. */
  showExcerpts?: boolean;
  /** Rótulo do resumo que recolhe a lista no celular; sem ele a lista é sempre aberta. */
  collapsibleLabel?: string;
  className?: string;
}) {
  const { indicated } = useSituation();
  const withCard = card && !showExcerpts;

  // Ordem: indicados (na ordem da situação) e depois os demais, na ordem original.
  const order = useMemo(() => {
    const all = items.map((t, i) => ({ t, n: i + 1 }));
    const bySlug = new Map(all.map((x) => [x.t.slug, x]));
    const first = indicated.map((s) => bySlug.get(s)).filter(Boolean) as typeof all;
    const firstSet = new Set(first.map((x) => x.t.slug));
    return [...first, ...all.filter((x) => !firstSet.has(x.t.slug))];
  }, [items, indicated]);
  const indicatedSet = useMemo(() => new Set(indicated), [indicated]);
  const orderKey = order.map((x) => x.t.slug).join("|");

  const [hovered, setHovered] = useState<string | null>(null);
  const active = hovered && order.some((x) => x.t.slug === hovered) ? hovered : order[0]?.t.slug;

  // Celular: recolhe depois de hidratar (o HTML do servidor vem aberto) e reabre ao passar de 760px.
  const detailsRef = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    if (!collapsibleLabel || typeof window.matchMedia !== "function") return;
    const mq = window.matchMedia("(max-width: 759px)");
    const sync = () => {
      if (detailsRef.current) detailsRef.current.open = !mq.matches;
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [collapsibleLabel]);
  // Escolher uma situação sobe os indicados ao topo: a lista abre para mostrar o resultado.
  useEffect(() => {
    if (indicated.length && detailsRef.current) detailsRef.current.open = true;
  }, [indicated]);

  // Reordenação suave (FLIP): guarda o topo de cada linha e anima só a diferença.
  // Nada é medido na montagem: a primeira referência vem do ResizeObserver (depois do layout),
  // e a leitura de offsetTop numa troca de ordem só acontece por ação do visitante.
  const listRef = useRef<HTMLOListElement>(null);
  const tops = useRef<Map<string, number>>(new Map());
  const lastKey = useRef(orderKey);
  const snapshot = () => {
    const next = new Map<string, number>();
    const list = listRef.current;
    // lista recolhida (display: none): nenhuma medida vale
    if (!list || list.offsetParent === null || detailsRef.current?.open === false) return next;
    list.querySelectorAll<HTMLElement>("[data-slug]").forEach((li) => {
      next.set(li.dataset.slug as string, li.offsetTop);
    });
    return next;
  };
  useLayoutEffect(() => {
    if (lastKey.current === orderKey) return;
    lastKey.current = orderKey;
    const next = snapshot();
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!calm && tops.current.size && next.size && listRef.current) {
      next.forEach((top, slug) => {
        const before = tops.current.get(slug);
        if (before == null || before === top) return;
        const li = listRef.current?.querySelector<HTMLElement>(`[data-slug="${slug}"]`);
        li?.getAnimations().forEach((a) => a.cancel());
        li?.animate(
          [{ transform: `translateY(${before - top}px)` }, { transform: "translateY(0)" }],
          { duration: 520, easing: "cubic-bezier(.16, 1, .3, 1)" },
        );
      });
    }
    tops.current = next;
  }, [orderKey]);
  // Larguras novas (e a primeira medida) mudam as alturas: atualiza a referência sem animar.
  useEffect(() => {
    const el = listRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => {
      tops.current = snapshot();
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const list = (
    <div className={cn(styles.root, withCard && styles.withCard, className)}>
      <ol
        ref={listRef}
        data-reveal=""
        className={cn("idx idx-sumario", styles.list, showExcerpts && styles.completo)}
      >
        {order.map(({ t, n }, pos) => {
          const isIndicated = indicatedSet.has(t.slug);
          const meta = [t.duration, t.sessions].filter(Boolean).join(" · ");
          return (
            <IndexRow
              key={t.slug}
              i={pos}
              data-slug={t.slug}
              data-indicated={isIndicated ? "" : undefined}
              className={styles.item}
            >
              <Link
                href={`/tratamentos/${t.slug}`}
                className={cn("idx-link", styles.link)}
                onClick={() => track("treatment_card_click", { treatment: t.shortName })}
                onFocus={() => setHovered(t.slug)}
                onPointerEnter={(e) => {
                  if (e.pointerType === "mouse") setHovered(t.slug);
                }}
              >
                <span className="it-sm idx-n" aria-hidden="true">
                  {String(n).padStart(2, "0")}
                </span>
                <span className="idx-t t-row min-w-0">
                  {nameWithHyphens(t.name)}
                </span>
                <span className={cn("idx-dots", styles.dots)} aria-hidden="true" />
                <ArrowIcon className={styles.arrow} size={22} />
                {isIndicated && (
                  <span className={cn("idx-ind t-cap", styles.indicado)}>
                    <i aria-hidden="true" />
                    Indicado para você
                  </span>
                )}
                {/* fora de /tratamentos o cartão noite é só visual: o link fica com o nome curto */}
                {showExcerpts && (
                  <span className={cn("idx-ind t-body", styles.excerpt)}>
                    {t.excerpt}
                    {meta && <span className="t-cap mt-2 block">{meta}</span>}
                  </span>
                )}
              </Link>
            </IndexRow>
          );
        })}
        <IndexEnd i={order.length} />
      </ol>

      {withCard && (
        <aside className={styles.card} data-tone="noite" aria-hidden="true">
          {items.map((t, i) => (
            <div key={t.slug} className={styles.panel} data-on={t.slug === active ? "" : undefined}>
              <Numeral size="xl">{String(i + 1).padStart(2, "0")}</Numeral>
              <p className={cn("t-d3 display", styles.panelTitle)}>{t.name}</p>
              <p className={cn("t-body", styles.panelText)}>{t.excerpt}</p>
            </div>
          ))}
          <img
            src="/brand/monograma-claro.svg"
            alt=""
            width={446}
            height={450}
            loading="lazy"
            decoding="async"
            className={styles.marca}
          />
        </aside>
      )}
    </div>
  );

  if (!collapsibleLabel) return list;
  return (
    <details ref={detailsRef} open className={styles.recolher}>
      <summary className={styles.resumo}>
        <span className={cn("t-kicker", styles.resumoTxt)}>{collapsibleLabel}</span>
        <span className={styles.chevron} aria-hidden="true" />
      </summary>
      {list}
    </details>
  );
}
