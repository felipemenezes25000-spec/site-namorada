"use client";

import { useEffect, useRef } from "react";

/**
 * Fio de progresso sob o cabeçalho (celular e tablet, < 1100px; DESIGN.md 3.1 uso 2).
 * Com `animation-timeline: scroll()` o CSS faz tudo (sem JS). Sem suporte, um
 * listener passivo + requestAnimationFrame grava --p = rolagem / rolagem total.
 * A ilha não monta nada quando o CSS suporta.
 */
export function FioProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof CSS !== "undefined" && CSS.supports?.("animation-timeline: scroll()")) return;
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const paint = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      el.style.setProperty("--p", String(p));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };
    paint();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className="fio-prog" aria-hidden="true">
      <i />
    </div>
  );
}
