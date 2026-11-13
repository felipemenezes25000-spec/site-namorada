import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Contêiner `.wrap` (DESIGN.md 2.3): largura máx. 1480px, margem fluida --pad.
 * Com `bleed="right"`, a imagem dentro (classe `bleed-right`) sangra até a
 * margem direita sem criar rolagem horizontal (o contêiner recorta no eixo X).
 */
export function Container({
  bleed,
  as: Tag = "div",
  className,
  children,
}: {
  bleed?: "right";
  as?: "div" | "header" | "footer" | "nav";
  className?: string;
  children: ReactNode;
}) {
  return <Tag className={cn("wrap", bleed && "clip-x", className)}>{children}</Tag>;
}
