"use client";

import { useEffect } from "react";

/**
 * Observa todo `[data-reveal]` e marca `.in` UMA vez ao entrar na tela
 * (DESIGN.md 3.1 uso 5). Só os fios dependem disso (estado-base visível;
 * recolhido só com html.js). Montado uma vez, no layout do site. Sem UI.
 */
export function RevealObserver() {
  useEffect(() => {
    // hidratou: cancela a trava de segurança do script do <head> (layout.tsx)
    const w = window as Window & { __rv?: ReturnType<typeof setTimeout> };
    if (w.__rv) clearTimeout(w.__rv);
    const mark = (el: Element) => el.classList.add("in");
    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll("[data-reveal]").forEach(mark);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            mark(e.target);
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.01 },
    );
    const seen = new WeakSet<Element>();
    const scan = () => {
      document.querySelectorAll("[data-reveal]:not(.in)").forEach((el) => {
        if (!seen.has(el)) {
          seen.add(el);
          io.observe(el);
        }
      });
    };
    scan();
    // páginas navegam sem recarregar: reobserva o que entrar depois
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      mo.disconnect();
      io.disconnect();
    };
  }, []);
  return null;
}
