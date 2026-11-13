import type { ReactNode } from "react";

/**
 * Fio do tratamento (DESIGN.md 5.4): um desenho de linha em ouro, próprio de cada tratamento, no
 * mesmo traço de 1,25px do Fio da marca. SVG inline e decorativo (aria-hidden), até 2 kB cada, sem
 * foto e sem imagem gerada. Não mostra procedimento em andamento nem promete resultado: é só o
 * dente e o gesto do cuidado (olhar, polir, clarear, reconstruir, acompanhar, planejar, repor).
 */

/** Dente (coroa e duas raízes) centrado na origem, 80 x 116 unidades. */
const DENTE =
  "M-40 -38C-40 -58-24 -64-12 -60C-6 -58 6 -58 12 -60C24 -64 40 -58 40 -38C40 -18 32 -8 30 12C28 34 26 52 17 52C9 52 8 28 0 28C-8 28-9 52-17 52C-26 52-28 34-30 12C-32 -8-40 -18-40 -38Z";

const ESTRELA = "M0 -9L2 -2L9 0L2 2L0 9L-2 2L-9 0L-2 -2Z";

const figuras: Record<string, ReactNode> = {
  "avaliacao-odontologica": (
    <>
      <path d={DENTE} transform="translate(104 112)" />
      <circle cx="148" cy="146" r="38" />
      <path d="M176 174L206 204" strokeWidth="2.5" />
      <path d="M130 134c6-8 16-12 26-10" />
    </>
  ),
  "limpeza-dental": (
    <>
      <path d={DENTE} transform="translate(120 120)" />
      <path d={ESTRELA} transform="translate(54 62)" />
      <path d={ESTRELA} transform="translate(190 78) scale(.8)" />
      <path d={ESTRELA} transform="translate(178 186) scale(.6)" />
      <path d="M30 214q22-10 44 0t44 0t44 0t44 0" />
    </>
  ),
  "clareamento-dental": (
    <>
      <path d={DENTE} transform="translate(120 132)" />
      <path d="M120 18v20" transform="rotate(-64 120 132)" />
      <path d="M120 18v20" transform="rotate(-32 120 132)" />
      <path d="M120 18v20" />
      <path d="M120 18v20" transform="rotate(32 120 132)" />
      <path d="M120 18v20" transform="rotate(64 120 132)" />
    </>
  ),
  restauracoes: (
    <>
      <path d={DENTE} transform="translate(120 120)" />
      <path d="M92 84q14-16 36-2q8 16-4 28q-16 8-30-6q-6-10-2-20z" strokeDasharray="3 4" />
      <path d="M184 76h24M184 92h16M184 108h24" strokeDasharray="2 5" />
    </>
  ),
  prevencao: (
    <>
      <path d="M40 222V118a80 80 0 0 1 160 0v104" />
      <path d="M22 222h196" />
      <path d={DENTE} transform="translate(120 140) scale(.66)" />
      <path d="M100 52q20-14 40 0" strokeDasharray="2 5" />
    </>
  ),
  "cirurgia-oral": (
    <>
      <path d={DENTE} transform="translate(80 118) scale(.82)" />
      <path d={DENTE} transform="translate(166 118) scale(.82)" strokeDasharray="3 5" />
      <path d="M20 150q30-14 60 0t60 0t60 0t40 -4" />
      <path d="M166 40v-14M158 34l8-8l8 8" />
    </>
  ),
  implante: (
    <>
      <path d="M78 70C78 44 98 38 110 44C116 47 124 47 130 44C142 38 162 44 162 70C162 86 154 96 150 104H90C86 96 78 86 78 70Z" />
      <path d="M104 104h32v12h-32z" />
      <path d="M106 116h28l-6 80l-8 8l-8-8z" />
      <path d="M108 134h24M109 150h22M110 166h20M112 182h16" />
      <path d="M30 128q40 0 70 0M140 128q40 0 70 0" strokeDasharray="2 5" />
    </>
  ),
  "cirurgia-buco-maxilo-facial": (
    <>
      <path d="M16 92Q120 58 224 92" />
      <path d={DENTE} transform="translate(110 168) rotate(-52) scale(.8)" />
      <path d="M16 108Q120 74 224 108" strokeDasharray="2 5" />
      <circle cx="190" cy="176" r="22" strokeDasharray="3 5" />
    </>
  ),
};

export function TratamentoFigura({ slug, className }: { slug: string; className?: string }) {
  const corpo = figuras[slug];
  if (!corpo) return null;
  return (
    <svg
      viewBox="0 0 240 240"
      className={className}
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {corpo}
    </svg>
  );
}
