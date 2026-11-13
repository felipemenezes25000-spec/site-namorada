import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Páginas de texto (DESIGN.md 4.1): coluna única de 62ch, h2 em .t-d3 com fio
 * superior, h3 em Hanken 500 20px, listas com losango. `aside` opcional para
 * notas laterais (.t-cap), só a partir de 1100px (colunas 8 a 11).
 */
export function Prose({
  children,
  aside,
  className,
}: {
  children: ReactNode;
  aside?: ReactNode;
  className?: string;
}) {
  if (!aside) return <div className={cn("prose-ed", className)}>{children}</div>;
  return (
    <div className="grid12">
      <div className={cn("prose-ed col-span-full desk:col-span-8", className)}>{children}</div>
      <aside className="t-cap hidden desk:col-span-3 desk:col-start-9 desk:block desk:pt-4">
        {aside}
      </aside>
    </div>
  );
}
