import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Arco de sorriso sob o botão final (DESIGN.md 3.1 uso 4). Uma vez por página, no fecho.
 * O arco é uma meia-elipse de borda de 1,5px (CSS puro, sem SVG medido): acompanha a largura
 * do botão em qualquer tela, com 20px de folga de cada lado, e a espessura nunca se deforma.
 * Desenha ao entrar na tela (varredura da esquerda para a direita, 1,6s, uma vez). Sem o fio,
 * o botão continua sozinho.
 */
export function FioSmile({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div data-reveal="" className={cn("smile", className)}>
      <div className="relative z-10">{children}</div>
      <span className="smile-arc" aria-hidden="true" />
    </div>
  );
}
