import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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

/** Espaço inseparável (não vira quebra de linha). */
const NBSP = " ";

/**
 * Títulos: "Dra." nunca termina linha (o nome vem junto) e "do Ó" nunca fica sozinho. Troca os
 * espaços por espaço inseparável só nesses pontos. Uso: textos de título e de chamada.
 */
export function semQuebraNome(texto: string): string {
  return texto
    .replace(/\bDra\. /g, `Dra.${NBSP}`)
    .replace(/ do Ó(?![\p{L}])/gu, `${NBSP}do${NBSP}Ó`);
}
