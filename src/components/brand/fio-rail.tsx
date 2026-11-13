"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/lib/site-config";

export interface RailStop {
  /** id da seção na página (âncora). */
  id: string;
  /** Nome curto, mostrado ao passar o mouse ou focar. */
  label: string;
}

/**
 * Trilho editorial (>= 1100px; DESIGN.md 3.1 uso 2). Só é ativado (observadores e rolagem) quando a
 * janela tem 1100px ou mais (matchMedia): no celular ele não custa nada. É decorativo: o nav fica
 * aria-hidden (sem rótulo de landmark), as paradas não entram na ordem de Tab e quem navega por
 * teclado ou leitor de tela usa os títulos e o link "Ir para o conteúdo". O numeral grande só existe
 * na home; nas páginas internas o trilho tem só os losangos. Os pontos são EQUIDISTANTES
 * (nada de medir a página inteira): um IntersectionObserver descobre a seção
 * atual e, a cada frame de rolagem, só ela é medida (getBoundingClientRect).
 * O tom (osso, papel, noite, verde) é calculado POR PEÇA (numeral, cada losango e o texto
 * vertical "CRO-SP"): cada uma lê a seção que está sob o seu próprio centro (`data-t`), então
 * nenhuma peça fica dourado-sobre-bege nem claro-sobre-verde quando o trilho cruza duas faixas.
 * Um losango por seção (o numeral sempre bate com o losango cheio).
 * O trilho some quando o rodapé entra na tela. Sem JS ele não existe (a página não
 * depende dele). A página envolve o conteúdo em <div className="has-rail"> NO SERVIDOR
 * para reservar os 56px e monta o <FioRail> DEPOIS do conteúdo (menos paradas de teclado
 * antes do H1 e do botão da capa; como é `position: fixed`, o visual não muda).
 */
/* Teclado: as paradas ficam fora da ordem de Tab (tabIndex -1): o trilho é atalho de mouse e toque;
   quem navega por teclado já tem título e landmark em cada seção e o link "Ir para o conteúdo". */
export function FioRail({ stops }: { stops: RailStop[] }) {
  const items = stops;
  const n = items.length;
  const [current, setCurrent] = useState(0);
  const [hidden, setHidden] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const currentRef = useRef(0);
  const pathname = usePathname();
  const comNumeral = pathname === "/";
  const [wide, setWide] = useState(false);

  // só liga o trilho a partir de 1100px (e acompanha o redimensionamento)
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1100px) and (min-height: 521px)");
    const sync = () => setWide(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (n < 2 || !wide) return;
    const els = items.map((s) => {
      const el = document.getElementById(s.id);
      if (!el && process.env.NODE_ENV !== "production") {
        console.warn(
          `FioRail: não existe elemento com id="${s.id}" (ponto "${s.label}" ignorado).`,
        );
      }
      return el;
    });
    const visible = new Map<number, boolean>();

    const pick = (i: number) => {
      currentRef.current = i;
      setCurrent(i);
    };

    const band = { rootMargin: "-40% 0px -55% 0px" };
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        const i = els.indexOf(e.target as HTMLElement);
        if (i >= 0) visible.set(i, e.isIntersecting);
      }
      // a seção atual é a última visível na faixa de observação
      let last = -1;
      visible.forEach((v, i) => {
        if (v && i > last) last = i;
      });
      if (last >= 0) pick(last);
    }, band);
    els.forEach((el) => el && io.observe(el));

    // Rodapé: o trilho some quando ele entra na tela.
    const footer = document.querySelector("footer");
    const footIo = new IntersectionObserver(([e]) => setHidden(e.isIntersecting), {
      rootMargin: "0px 0px -12% 0px",
    });
    if (footer) footIo.observe(footer);

    let raf = 0;
    const paint = () => {
      raf = 0;
      const i = currentRef.current;
      const el = els[i];
      let p = 0;
      if (el) {
        const r = el.getBoundingClientRect();
        p = Math.min(1, Math.max(0, (window.innerHeight * 0.4 - r.top) / Math.max(1, r.height)));
      }
      fillRef.current?.style.setProperty("--rail-p", String(Math.min(1, (i + p) / (n - 1))));

      // tom por peça: a seção sob o centro de cada elemento do trilho
      const nav = navRef.current;
      if (nav) {
        const secs = document.querySelectorAll<HTMLElement>(
          "section[data-tone], footer[data-tone]",
        );
        const rects = Array.from(secs, (el) => ({ el, r: el.getBoundingClientRect() }));
        nav.querySelectorAll<HTMLElement>("[data-rail-piece]").forEach((piece) => {
          const pr = piece.getBoundingClientRect();
          const y = pr.top + pr.height / 2;
          const hit = rects.find(({ r }) => y >= r.top && y < r.bottom);
          const t = hit?.el.getAttribute("data-tone");
          const next = t === "noite" || t === "verde" || t === "papel" ? t : "osso";
          if (piece.dataset.t !== next) piece.dataset.t = next;
        });
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };
    paint();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      io.disconnect();
      footIo.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n, wide]);

  if (n < 2 || !wide) return null;
  if (n > 9 && process.env.NODE_ENV !== "production") {
    console.warn(`FioRail: ${n} pontos (máximo recomendado: 9; um por seção).`);
  }

  return (
    <nav
      ref={navRef}
      className="rail"
      aria-hidden="true"
      data-rail-hidden={hidden ? "" : undefined}
    >
      {comNumeral && (
        <span className="rail-num" data-rail-piece="" aria-hidden="true">
          {String(current + 1).padStart(2, "0")}
        </span>
      )}
      <div className="rail-track">
        <span className="rail-line" aria-hidden="true" />
        <span ref={fillRef} className="rail-fill" aria-hidden="true" />
        {items.map((s, i) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="rail-stop"
            data-rail-piece=""
            style={{ top: `${(i / (n - 1)) * 100}%` }}
            aria-label={i === current ? `${s.label} (seção atual)` : `Ir para ${s.label}`}
            aria-current={i === current ? "true" : undefined}
            tabIndex={-1}
          >
            <span className="rail-dia" aria-hidden="true" />
            <span className="rail-label" aria-hidden="true">
              {s.label}
            </span>
          </a>
        ))}
      </div>
      <span className="rail-cro" data-rail-piece="" aria-hidden="true">
        {siteConfig.cro}
      </span>
    </nav>
  );
}
