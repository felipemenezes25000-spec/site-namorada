"use client";

import Link from "next/link";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type FocusEvent,
} from "react";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { buttonClasses } from "@/components/ui/button";
import { WhatsAppCTA } from "@/components/ui/cta";
import { ArrowIcon } from "@/components/ui/icons";
import { IndexEnd, IndexRow } from "@/components/ui/index-list";
import { TrackedLink } from "@/components/ui/tracked-link";
import { useSituation } from "./situation-context";
import styles from "./situation-selector.module.css";

/**
 * "Respirar comigo" só aparece quando o <BreathingGuide id="respirar"> existe na página de
 * destino (/medo-de-dentista). Enquanto a página não o monta, o botão fica escondido para não
 * levar a uma âncora que não existe. Ligue ao montar o guia.
 */
const GUIA_RESPIRAR_NA_PAGINA = true;

/** Altura fixa de cada linha no desktop: a geometria do fio sai só de índices. */
const ROW = 68;
/** Largura fixa do conector (SVG) entre a lista e os tratamentos indicados. */
const GAP = 120;

export interface SelectorSituation {
  id: string;
  label: string;
  answer: string;
  href: string;
  cta: string;
  treatments: string[];
  waMessage: string;
}
export interface SelectorTreatment {
  slug: string;
  name: string;
  shortName: string;
}

/**
 * "O que traz você aqui hoje?" (DESIGN.md 4.5). Escolher uma situação:
 *  - troca o painel de resposta (só textos que já existem no site);
 *  - liga a situação, com o Fio, aos tratamentos indicados (desktop);
 *  - sobe os tratamentos indicados ao topo do sumário (via SituationProvider);
 *  - prepara a mensagem de WhatsApp daquela situação.
 *
 * Analytics (B-21): `need` leva o id neutro da situação (tempo, dor, receio…), nunca o rótulo, que
 * descreve a condição de saúde da pessoa e iria parar no Meta Pixel.
 *
 * Sem escolha, tudo continua útil (o sumário segue na ordem original). Teclado:
 * rádios nativos (setas movem e escolhem; Tab sai do grupo). Sem JavaScript, o bloco
 * vira uma lista de links (a lista de rádios só aparece com `html.js`).
 * O desenho do Fio usa só índices (linha de 68px, conector de 120px), nunca medição do DOM.
 */
export function SituationSelector({
  situations,
  treatments,
  heading = "O que traz você aqui hoje?",
  lede = "Escolha uma situação e mostramos o caminho mais útil.",
  className,
}: {
  situations: SelectorSituation[];
  treatments: SelectorTreatment[];
  heading?: string;
  lede?: string;
  className?: string;
}) {
  const { situationId, set } = useSituation();
  // Fora do provider (/tratamentos compacto) o contexto não guarda nada: estado local.
  const [local, setLocal] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  // Painel de resposta: no desktop fica na coluna da direita (sem empurrar nada) e abre na hora;
  // no celular ele abre DENTRO da lista, então só abre com toque/clique, Enter ou ao sair do grupo.
  // As setas só marcam a opção (a lista não pula a cada tecla).
  const [open, setOpen] = useState(false);
  const chosenId = situationId ?? local;
  const index = situations.findIndex((s) => s.id === chosenId);
  const chosen = index >= 0 ? situations[index] : null;
  const headId = useId();
  const answerId = `${headId}-resposta`;
  const firstRadio = useRef<HTMLInputElement>(null);
  const answerRef = useRef<HTMLDivElement>(null);

  const trackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // `viaPointer`: o painel só rola para a vista quando a escolha veio de toque ou clique.
  // Setas do teclado escolhem a cada tecla: nada de pular a página nem de inflar a medição.
  const choose = (s: SelectorSituation, viaPointer: boolean) => {
    setLocal(s.id);
    setTouched(viaPointer);
    setOpen(viaPointer || window.matchMedia("(min-width: 1100px)").matches);
    set(s.id, s.treatments);
    // situation_select com debounce de 600ms: só a escolha em que a pessoa parou conta.
    if (trackTimer.current) clearTimeout(trackTimer.current);
    trackTimer.current = setTimeout(() => track("situation_select", { need: s.id }), 600);
  };
  const clear = () => {
    setLocal(null);
    setOpen(false);
    set(null, []);
    firstRadio.current?.focus();
  };

  // Com JavaScript pronto, a lista de links dá lugar aos rádios (antes disso, links que funcionam).
  useEffect(() => {
    document.documentElement.classList.add("sel-ready");
    return () => document.documentElement.classList.remove("sel-ready");
  }, []);

  // Celular: o painel abre sob a linha escolhida; garante que ele apareça inteiro.
  useEffect(() => {
    if (!touched || !open || !chosen || !answerRef.current) return;
    if (!window.matchMedia("(max-width: 1099px)").matches) return;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    answerRef.current.scrollIntoView({ block: "nearest", behavior: calm ? "auto" : "smooth" });
  }, [chosen?.id, touched, open]); // eslint-disable-line react-hooks/exhaustive-deps

  const onRadioKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && chosen) {
      e.preventDefault();
      setOpen(true);
    }
  };
  const onGroupBlur = (e: FocusEvent<HTMLFieldSetElement>) => {
    if (chosen && !e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen(true);
  };

  const bySlug = new Map(treatments.map((t) => [t.slug, t]));
  const total = situations.length;

  return (
    <div className={cn(styles.root, className)}>
      <h3 id={headId} className={cn("t-d3 display", styles.heading)}>
        {heading}
      </h3>

      {/* Sem JavaScript: lista de links (as respostas já existem no site). */}
      <ul className={cn("idx", styles.links)}>
        {situations.map((s) => (
          <li key={s.id} className={cn("idx-item", styles.linkItem)}>
            <span className="fio-h idx-rule" aria-hidden="true" />
            <Link href={s.href} className={styles.linkAnchor}>
              <span className={styles.linkLabel}>{s.label}</span>
              <span className={cn("t-body", styles.linkText)}>{s.answer}</span>
            </Link>
          </li>
        ))}
      </ul>

      <fieldset className={styles.group} onBlur={onGroupBlur} aria-labelledby={headId}>
        <div className={styles.stage}>
          <p className={styles.lede} data-hidden={chosen ? "" : undefined}>
            {lede}
          </p>
          {/* desktop, sem escolha: a coluna da direita não fica vazia (cartão noite com o convite) */}
          <div className={styles.vazio} data-tone="noite" data-hidden={chosen ? "" : undefined}>
            {/* eslint-disable-next-line @next/next/no-img-element -- SVG estático da marca: next/image não otimiza SVG */}
            <img
              src="/brand/monograma-claro.svg"
              alt=""
              width={446}
              height={450}
              loading="lazy"
              decoding="async"
              className={styles.vazioMarca}
            />
            <p className={cn("t-d3 display", styles.vazioTxt)}>{lede}</p>
          </div>
          <ul
            data-reveal=""
            className={cn("idx", styles.list)}
            style={{ "--row": `${ROW}px`, "--gap-col": `${GAP}px`, "--n": total } as CSSProperties}
          >
            {situations.map((s, i) => {
              const on = s.id === chosenId;
              return (
                <IndexRow
                  key={s.id}
                  i={i}
                  className={styles.row}
                  data-on={on ? "" : undefined}
                  style={{ "--idx": i } as CSSProperties}
                >
                  <label className={styles.label}>
                    <input
                      ref={i === 0 ? firstRadio : undefined}
                      type="radio"
                      name="situacao"
                      value={s.id}
                      checked={on}
                      onChange={(e) => choose(s, (e.nativeEvent as MouseEvent).detail > 0)}
                      onKeyDown={onRadioKey}
                      aria-controls={on && open ? answerId : undefined}
                      className={styles.radio}
                    />
                    <span className={styles.ring} aria-hidden="true" />
                    <span className={cn("it-sm", styles.n)} aria-hidden="true">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className={styles.text}>{s.label}</span>
                    <span className={styles.dot} aria-hidden="true" />
                  </label>

                  {on && open && (
                    <div
                      ref={answerRef}
                      id={answerId}
                      role="region"
                      aria-label={`Resposta: ${s.label}`}
                      className={styles.answer}
                    >
                      <div className={styles.panel}>
                        <p className="t-lead">{s.answer}</p>
                        <div className={styles.actions}>
                          <WhatsAppCTA
                            location="situation"
                            message={s.waMessage}
                            className={styles.wa}
                          />
                          {GUIA_RESPIRAR_NA_PAGINA && s.id === "receio" && (
                            <TrackedLink
                              href="/medo-de-dentista#respirar"
                              event="cta_click"
                              eventParams={{ location: "situation", target: "breathing_guide" }}
                              className={buttonClasses("contorno", "md", styles.wa)}
                            >
                              Exercício de respiração
                            </TrackedLink>
                          )}
                        </div>
                        <div className={styles.more}>
                          <TrackedLink
                            href={s.href}
                            event="care_need_click"
                            eventParams={{ need: s.id, href: s.href }}
                            className="link t-label inline-flex min-h-[44px] items-center gap-2"
                          >
                            {s.cta}
                            <ArrowIcon size={18} />
                          </TrackedLink>
                          <button
                            type="button"
                            onClick={clear}
                            className={cn("link t-label", styles.clear)}
                          >
                            Limpar escolha
                          </button>
                        </div>
                      </div>
                      <ul className={cn(styles.picks)} aria-label="Tratamentos indicados">
                        {s.treatments.map((slug) => {
                          const t = bySlug.get(slug);
                          if (!t) return null;
                          return (
                            <li key={slug} className={styles.pick}>
                              <Link
                                href={`/tratamentos/${slug}`}
                                className={styles.pickLink}
                                onClick={() =>
                                  track("treatment_card_click", { treatment: t.shortName })
                                }
                              >
                                <span className={cn("t-row", styles.pickName)}>{t.name}</span>
                                <ArrowIcon size={20} className={styles.pickArrow} />
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </IndexRow>
              );
            })}
            <IndexEnd i={total} />
          </ul>

          {/* O Fio: da situação escolhida a cada tratamento indicado (só desktop). */}
          {chosen && (
            <svg
              key={chosen.id}
              className={styles.thread}
              viewBox={`0 0 ${GAP + 6} ${total * ROW}`}
              width={GAP + 6}
              height={total * ROW}
              aria-hidden="true"
              focusable="false"
            >
              {chosen.treatments.map((slug, j) => {
                const y0 = index * ROW + ROW / 2;
                const y1 = j * ROW + ROW / 2;
                return (
                  <path
                    key={slug}
                    pathLength={1}
                    d={`M0 ${y0} C ${GAP / 2 + 3} ${y0}, ${GAP / 2 + 3} ${y1}, ${GAP + 5} ${y1}`}
                    style={{ animationDelay: `${j * 90}ms` }}
                  />
                );
              })}
            </svg>
          )}
        </div>

        {/* Anúncio para leitores de tela: o rótulo, a contagem e onde está a resposta. */}
        <p className="sr-only" role="status">
          {chosen
            ? `Situação escolhida: ${chosen.label}. ${chosen.treatments.length} ${
                chosen.treatments.length === 1 ? "tratamento indicado" : "tratamentos indicados"
              } no sumário.${open ? " A resposta está logo após a opção." : " Pressione Enter ou saia da lista para abrir a resposta."}`
            : ""}
        </p>
      </fieldset>
    </div>
  );
}
