import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type SectionTone = "osso" | "papel" | "noite" | "verde" | "noite-fundo";

/**
 * Seção com tom (DESIGN.md 4.1). Grava `data-tone`, que define as variáveis
 * semânticas (--bg, --head, --fg, --fg-2, --accent, --rule, --focus) em globals.css:
 * nenhum componente interno precisa saber o fundo. Ritmo: nunca dois tons iguais seguidos.
 */
export function Section({
  tone = "osso",
  id,
  spacing = "default",
  as: Tag = "section",
  hideFloating,
  className,
  children,
  ...aria
}: {
  tone?: SectionTone;
  id?: string;
  spacing?: "default" | "compact" | "none";
  as?: "section" | "div";
  /** Esconde o botão flutuante de WhatsApp enquanto esta seção está na tela (fecho). */
  hideFloating?: boolean;
  className?: string;
  children: ReactNode;
  "aria-labelledby"?: string;
  "aria-label"?: string;
}) {
  return (
    <Tag
      id={id}
      data-tone={tone}
      data-hide-floating={hideFloating ? "" : undefined}
      className={cn(
        spacing === "default" && "sec",
        spacing === "compact" && "sec-compact",
        className,
      )}
      {...aria}
    >
      {children}
    </Tag>
  );
}
