import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Eyebrow } from "./eyebrow";

/**
 * Cabeçalho de seção (DESIGN.md 4.1): eyebrow em itálico, título de display,
 * folio à direita (desktop) ou abaixo (celular) e abertura `.t-lead`. Sempre à esquerda.
 * */
interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  /** Itálico à direita do título: "Sumário", "A doutora". */
  folio?: string;
  lede?: ReactNode;
  level?: 2 | 3;
  size?: "d2" | "d3";
  className?: string;
  id?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  folio,
  lede,
  level,
  size = "d2",
  className,
  id,
}: SectionHeadingProps) {
  const Title = level === 3 ? "h3" : "h2";
  return (
    <div className={cn("max-w-3xl", className)}>
      {eyebrow && <Eyebrow className="mb-3">{eyebrow}</Eyebrow>}
      <div className="flex flex-col gap-3 tab:flex-row tab:items-baseline tab:justify-between tab:gap-8">
        <Title id={id} className={size === "d3" ? "t-d3" : "t-d2"}>
          {title}
        </Title>
        {folio && <span className="t-folio hidden shrink-0 tab:block">{folio}</span>}
      </div>
      {lede && <p className="t-lead mt-6 max-w-leitura">{lede}</p>}
    </div>
  );
}
