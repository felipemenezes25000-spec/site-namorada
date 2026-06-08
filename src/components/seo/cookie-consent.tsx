"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";

const CONSENT_KEY = "abl_cookie_consent";
const CONSENT_EVENT = "abl-consent-changed";
const OPEN_EVENT = "abl-open-consent";

export type ConsentState = "accepted" | "declined" | "pending";

/** Lê a decisão atual do usuário. SSR-safe (retorna "pending" no servidor). */
export function getConsent(): ConsentState {
  if (typeof window === "undefined") return "pending";
  const v = window.localStorage.getItem(CONSENT_KEY);
  if (v === "accepted" || v === "declined") return v;
  return "pending";
}

/** Reabre o banner para o usuário rever/revogar a decisão (direito LGPD). */
export function openCookieSettings() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(OPEN_EVENT));
}

function setConsent(state: "accepted" | "declined") {
  window.localStorage.setItem(CONSENT_KEY, state);
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

  useEffect(() => {
    setOpen(getConsent() === "pending");
    const reopen = () => setOpen(true);
    window.addEventListener(OPEN_EVENT, reopen);
    return () => window.removeEventListener(OPEN_EVENT, reopen);
  }, []);

  if (!open) return null;

  function decide(v: "accepted" | "declined") {
    setConsent(v);
    setOpen(false);
  }

  return (
    <div
      role="dialog"
      aria-label="Consentimento de cookies"
      className="fixed inset-x-0 bottom-0 z-[60] px-4 pb-4 sm:bottom-4 sm:px-6"
    >
      <div className="surface mx-auto flex max-w-5xl flex-col gap-4 p-5 shadow-lift sm:flex-row sm:items-center sm:gap-6 sm:p-6">
        <div className="flex flex-1 items-start gap-3">
          <span className="hidden size-10 shrink-0 items-center justify-center rounded-full bg-brand-gold/15 text-brand-gold-ink sm:flex">
            <Cookie className="size-5" strokeWidth={1.6} aria-hidden />
          </span>
          <p className="text-sm leading-relaxed text-brand-ink/75">
            Usamos cookies para entender como o site é utilizado e melhorar a sua
            experiência. Cookies essenciais são sempre ativos; cookies de medição
            (analytics) só com a sua autorização. Saiba mais na{" "}
            <Link
              href="/politica-de-privacidade"
              className="font-semibold text-brand-green underline decoration-brand-gold/50 underline-offset-2 hover:decoration-brand-gold"
            >
              Política de Privacidade
            </Link>
            .
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:shrink-0 sm:gap-3">
          <button
            type="button"
            onClick={() => decide("declined")}
            className="rounded-full px-5 py-2.5 text-sm font-medium text-brand-ink/75 ring-1 ring-inset ring-brand-ink/15 transition hover:bg-brand-green/[0.05] hover:text-brand-green"
          >
            Recusar
          </button>
          <button
            type="button"
            onClick={() => decide("accepted")}
            className="rounded-full bg-brand-green px-5 py-2.5 text-sm font-semibold text-brand-bone transition hover:bg-brand-green-dark"
          >
            Aceitar
          </button>
        </div>
      </div>
    </div>
  );
}
