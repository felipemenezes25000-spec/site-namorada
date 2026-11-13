"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const CONSENT_KEY = "abl_cookie_consent";
const CONSENT_EVENT = "abl-consent-changed";
const OPEN_EVENT = "abl-open-consent";
/**
 * Classe do <html> que diz "a pessoa já decidiu": o script inline do <head> (layout.tsx) a põe antes
 * da primeira pintura quando há decisão guardada, e o CSS esconde o aviso (que vem aberto no HTML do
 * servidor) e libera a barra de ações do celular. Sem ela, o aviso aparece e a barra fica recolhida.
 */
export const CONSENT_SET_CLASS = "consent-set";

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

export function setConsent(state: "accepted" | "declined") {
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

/**
 * Aviso de cookies. Vem ABERTO no HTML do servidor (assim aparece na primeira pintura, junto com o
 * resto da página, e não vira o maior elemento tardio da tela); quem já decidiu não o vê porque o
 * <html> chega com `consent-set` antes da pintura. Sem JavaScript ele não aparece (botões mortos).
 */
export function CookieConsent() {
  const [open, setOpen] = useState(true);
  const [status, setStatus] = useState("");
  const pathname = usePathname();
  const noAdmin = !(pathname === "/admin" || pathname?.startsWith("/admin/"));
  const ref = useRef<HTMLDivElement>(null);
  /** Elemento que reabriu o aviso ("Gerenciar cookies"), para devolver o foco a ele depois da decisão. */
  const opener = useRef<HTMLElement | null>(null);
  const focusOnOpen = useRef(false);

  useEffect(() => {
    const pending = getConsent() === "pending";
    setOpen(pending);
    document.documentElement.classList.toggle(CONSENT_SET_CLASS, !pending);
    const reopen = () => {
      const active = document.activeElement;
      opener.current = active instanceof HTMLElement && active !== document.body ? active : null;
      focusOnOpen.current = true;
      setStatus("");
      document.documentElement.classList.remove(CONSENT_SET_CLASS);
      setOpen(true);
    };
    window.addEventListener(OPEN_EVENT, reopen);
    return () => window.removeEventListener(OPEN_EVENT, reopen);
  }, []);

  // Reaberto por "Gerenciar cookies": o foco entra no aviso (senão quem usa teclado não o encontra).
  useEffect(() => {
    if (open && focusOnOpen.current) {
      focusOnOpen.current = false;
      ref.current?.focus({ preventScroll: true });
    }
  }, [open]);

  // Grava a altura real do aviso em --h-cookie enquanto aberto (o scroll-padding-bottom e o espaço
  // reservado no fim da página se ajustam) e zera ao fechar.
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
      raf = requestAnimationFrame(() =>
        root.style.setProperty("--h-cookie", `${el.offsetHeight}px`),
      );
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

  if (!noAdmin) return null;

  function decide(v: "accepted" | "declined") {
    const focusInside = ref.current?.contains(document.activeElement) ?? false;
    setConsent(v);
    document.documentElement.classList.add(CONSENT_SET_CLASS);
    setOpen(false);
    setStatus("Preferências de cookies salvas.");
    // O botão clicado some com o aviso: o foco volta a quem abriu ou ao <main>, nunca ao <body>.
    if (focusInside) {
      const back = opener.current;
      opener.current = null;
      if (back && back.isConnected) back.focus({ preventScroll: true });
      else document.getElementById("conteudo")?.focus({ preventScroll: true });
    }
  }

  /*
   * Apresentação (DESIGN.md 4.3): faixa compacta, NÃO modal (sem role="dialog",
   * sem focus trap), logo depois do link de pular. No celular a barra de ações fica recolhida
   * enquanto o aviso está aberto. "Recusar" e "Aceitar" são idênticos em tamanho, fonte e peso visual.
   */
  return (
    <>
      <p role="status" className="sr-only">
        {status}
      </p>
      {open && (
        <div
          ref={ref}
          role="region"
          aria-label="Consentimento de cookies"
          className="ck"
          tabIndex={-1}
        >
          <p className="ck-txt m-0">
            Cookies de medição e de campanha só com a sua autorização.{" "}
            <Link href="/politica-de-privacidade" prefetch={false}>
              Política de Privacidade
            </Link>
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
      )}
    </>
  );
}
