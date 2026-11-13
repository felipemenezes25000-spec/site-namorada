import { cn } from "@/lib/utils";

/**
 * Divisor "O Fio" (DESIGN.md 3.1 uso 5): linha de 1px que se desenha da esquerda
 * para a direita ao entrar na tela, uma vez. O estado-base é VISÍVEL; só com
 * `html.js` e antes de entrar na tela a linha fica recolhida (globals.css).
 * Nada acima da dobra usa `reveal`.
 */
export function FioRule({
  orientation = "h",
  double = false,
  tone = "auto",
  reveal = true,
  delay,
  className,
}: {
  orientation?: "h" | "v";
  /** Fio duplo de masthead (1px + 1px a 5px de distância). */
  double?: boolean;
  /** "auto" lê --rule (tom da seção); "claro" força o fio claro. */
  tone?: "auto" | "claro";
  /** Desenha ao entrar na tela (default). Falso = sempre inteiro (capa). */
  reveal?: boolean;
  /** Atraso em ms. */
  delay?: number;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      data-reveal={reveal ? "" : undefined}
      className={cn(
        orientation === "v" ? "fio-v" : "fio-h",
        double && orientation === "h" && "fio-h--duplo",
        tone === "claro" && "fio-h--claro",
        className,
      )}
      style={delay ? ({ "--fio-delay": `${delay}ms` } as React.CSSProperties) : undefined}
    />
  );
}
