import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type DisplaySize = "d1" | "d1i" | "d2" | "d3" | "d4" | "row";

// Nomes escritos por extenso: o Tailwind só mantém as classes que enxerga no código.
const sizeClass: Record<DisplaySize, string> = {
  d1: "t-d1",
  d1i: "t-d1i",
  d2: "t-d2",
  d3: "t-d3",
  d4: "t-d4",
  row: "t-row",
};

/**
 * Título de display (DESIGN.md 4.1). A serifa só aparece grande (>= 28px).
 * `luz`: o brilho que atravessa o título uma única vez (só CSS; padrão no H1).
 * `kicker`: renderiza a linha-chamada DENTRO do mesmo heading (H1 da capa),
 * para o leitor de tela ler uma frase só.
 */
export function DisplayHeading({
  level,
  size,
  luz,
  kicker,
  className,
  id,
  children,
}: {
  level: 1 | 2 | 3 | 4;
  size: DisplaySize;
  luz?: boolean;
  kicker?: ReactNode;
  className?: string;
  id?: string;
  children: ReactNode;
}) {
  const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4";
  const withLuz = luz ?? level === 1;
  return (
    <Tag id={id} className={cn(sizeClass[size], withLuz && "luz", className)}>
      {kicker && (
        <>
          <span className="t-kicker mb-[10px] block">{kicker}</span>
          {/* o texto do título continua uma frase só para leitores de tela e para o <title> */}
          <span className="sr-only">. </span>
        </>
      )}
      {children}
    </Tag>
  );
}
