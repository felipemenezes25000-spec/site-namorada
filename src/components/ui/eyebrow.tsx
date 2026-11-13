import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Linha-chamada em itálico acima do título (DESIGN.md 4.1). Nunca em caixa-alta. */
export function Eyebrow({
  children,
  rule = false,
  as: Tag = "p",
  className,
}: {
  children: ReactNode;
  /** Fio de 24px à esquerda. */
  rule?: boolean;
  as?: "p" | "span";
  className?: string;
}) {
  return (
    <Tag className={cn("t-kicker", rule && "flex items-center gap-3", className)}>
      {rule && (
        <span aria-hidden="true" className="inline-block h-px w-6 bg-ouro" />
      )}
      {children}
    </Tag>
  );
}
