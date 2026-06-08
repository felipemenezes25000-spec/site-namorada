"use client";

import { openCookieSettings } from "./cookie-consent";

/** Link discreto para reabrir o banner de cookies (direito de revogar — LGPD). */
export function ManageCookiesButton({ className }: { className?: string }) {
  return (
    <button type="button" onClick={openCookieSettings} className={className}>
      Gerenciar cookies
    </button>
  );
}
