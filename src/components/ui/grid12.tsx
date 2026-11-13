import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Divisões da grade de 12 colunas a partir de 760px (abaixo disso é uma coluna só). */
export type Grid12Split = "livre" | "7-5" | "5-7" | "8-4" | "3-9";

// Nomes escritos por extenso: o Tailwind só mantém as classes que enxerga no código.
const splitClass: Record<Grid12Split, string> = {
  livre: "",
  "7-5": "grid12--7-5",
  "5-7": "grid12--5-7",
  "8-4": "grid12--8-4",
  "3-9": "grid12--3-9",
};

/**
 * Grade de 12 colunas do site (`.grid12`, DESIGN.md 2.3), sem nada centralizado. Com `split`, os DOIS
 * filhos diretos ocupam as colunas indicadas (7/5, 5/7, 8/4, 3/9); em `livre` cada filho escolhe a
 * própria faixa (use um módulo CSS). Nunca centralize o miolo com `mx-auto`: o gutter da esquerda é
 * o mesmo do cabeçalho (--pad + --rail).
 */
export function Grid12({
  split = "livre",
  className,
  children,
}: {
  split?: Grid12Split;
  className?: string;
  children: ReactNode;
}) {
  return <div className={cn("grid12", splitClass[split], className)}>{children}</div>;
}
