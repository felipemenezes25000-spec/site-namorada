"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const CONSENT_KEY = "abl_cookie_consent";
const CONSENT_EVENT = "abl-consent-changed";
const OPEN_EVENT = "abl-open-consent";

export type ConsentState = "accepted" | "declined" | "pending";

/**
 * Decisão desta visita guardada em memória: vale quando o armazenamento do navegador está
 * bloqueado (modo restrito, navegadores embutidos), onde ler ou gravar lança SecurityError.
 */
let memoryConsent: ConsentState = "pending";

/** Lê a decisão atual do usuário. SSR-safe (retorna "pending" no servidor) e tolerante a armazenamento bloqueado. */
export function getConsent(): ConsentState {
  if (typeof window === "undefined") return "pending";
  try {
    const v = window.localStorage.getItem(CONSENT_KEY);
    if (v === "accepted" || v === "declined") return v;
  } catch {
    /* armazenamento bloqueado: vale a decisão em memória */
  }
  return memoryConsent;
}

/** Reabre o banner para o usuário rever/revogar a decisão (direito LGPD). */
export function openCookieSettings() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(OPEN_EVENT));
}

function setConsent(state: "accepted" | "declined") {
  memoryConsent = state;
  try {
    window.localStorage.setItem(CONSENT_KEY, state);
  } catch {
    /* armazenamento bloqueado: a decisão segue só em memória e o evento abaixo avisa quem depende dela */
  }
  window.dispatchEvent(new CustomEvent<ConsentState>(CONSENT_EVENT, { detail: state }));
}

/** Permite que outros componentes (Analytics) reajam à decisão. */
export function subscribeConsent(cb: (state: ConsentState) => void): () => void {
  function listener(e: Event) {
    cb((e as CustomEvent<ConsentState>).detail);
  }
  window.addEventListener(CONSENT_EVENT, listener);
  return () => window.removeEventListener(CONSENT_EVENT, listener);
}

export function CookieConsent() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const noAdmin = !(pathname === "/admin" || pathname?.startsWith("/admin/"));
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOpen(getConsent() === "pending");
    const reopen = () => setOpen(true);
    window.addEventListener(OPEN_EVENT, reopen);
    return () => window.removeEventListener(OPEN_EVENT, reopen);
  }, []);

  // Grava a altura real do aviso em --h-cookie enquanto aberto (o botão flutuante
  // e o scroll-padding-bottom se ajustam) e zera ao fechar.
  useEffect(() => {
    const root = document.documentElement;
    const el = ref.current;
    if (!open || !el || !noAdmin) {
      root.style.setProperty("--h-cookie", "0px");
      return;
    }
    // A medida (offsetHeight) fica para o próximo quadro: lê-la dentro do efeito força um reflow
    // síncrono durante a hidratação.
    let raf = 0;
    const paint = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => root.style.setProperty("--h-cookie", `${el.offsetHeight}px`));
    };
    paint();
    const ro = typeof ResizeObserver === "undefined" ? undefined : new ResizeObserver(paint);
    ro?.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      ro?.disconnect();
      root.style.setProperty("--h-cookie", "0px");
    };
  }, [open, noAdmin]);

  if (!open || !noAdmin) return null;

  function decide(v: "accepted" | "declined") {
    setConsent(v);
    setOpen(false);
  }

  /*
   * Apresentação (DESIGN.md 4.3): faixa compacta, NÃO modal (sem role="dialog",
   * sem focus trap), primeiro elemento do <body>. No celular fica ACIMA da barra de
   * ações. "Recusar" e "Aceitar" são idênticos em tamanho, fonte e peso visual.
   */
  return (
    <div ref={ref} role="region" aria-label="Consentimento de cookies" className="ck">
      <p className="ck-txt m-0">
        Cookies essenciais sempre ativos; os de medição só com a sua autorização. Veja a{" "}
        <Link href="/politica-de-privacidade" prefetch={false}>
          Política de Privacidade
        </Link>.
      </p>
      <div className="ck-acoes">
        <button type="button" className="ck-btn" onClick={() => decide("declined")}>
          Recusar
        </button>
        <button type="button" className="ck-btn" onClick={() => decide("accepted")}>
          Aceitar
        </button>
      </div>
    </div>
  );
}
