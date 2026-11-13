import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * O tailwind-merge não conhece as classes de tamanho `text-display-*` e as
 * tratava como COR de texto: `cn("text-display-md", "text-brand-bone")` descartava
 * o tamanho (bug do H2 de "Como funciona"). Registramos os tamanhos no grupo
 * `font-size` para que tamanho e cor convivam.
 * (As classes novas `.t-*` de globals.css não são utilitários do Tailwind: o
 * merge não as toca, nem deve.)
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: ["display-xl", "display-lg", "display-md", "display-sm"] }],
    },
  },
});

/** Merge Tailwind classes with conflict resolution. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Smoothly format a Brazilian phone for display from digits. */
export function formatPhone(digits: string): string {
  const d = digits.replace(/\D/g, "").replace(/^55/, "");
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return digits;
}
