import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Numeral em Bodoni itálica (DESIGN.md 3.3). `xl` é decorativo (cor ouro,
 * aria-hidden) e nunca carrega informação sozinho.
 */
export function Numeral({
  children,
  size = "md",
  decorative,
  className,
}: {
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  decorative?: boolean;
  className?: string;
}) {
  const deco = decorative ?? size === "xl";
  return (
    <span
      aria-hidden={deco || undefined}
      className={cn(
        "it-sm num block",
        size === "sm" && "num-sm",
        size === "md" && "num-md",
        size === "lg" && "num-lg",
        size === "xl" && "num-xl",
        className,
      )}
    >
      {children}
    </span>
  );
}
