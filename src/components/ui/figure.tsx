import Image, { type StaticImageData } from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface FigureProps {
  src: string | StaticImageData;
  /** Obrigatório. Decorativa: alt="" e sem legenda. */
  alt: string;
  width: number;
  height: number;
  /** Gera "Fig. n". Só use quando houver mais de uma figura referida pelo número; sem ele, só a legenda. */
  n?: number;
  /** Legenda factual (só o que é verdade). */
  caption?: ReactNode;
  ratio?: "4/5" | "1/1" | "16/10" | "natural";
  /**
   * Moldura: "filete" (retângulo com filete dourado deslocado 14px atrás), "arco" (topo em arco com o
   * mesmo filete, igual ao retrato da capa) ou "none". Todas as fotos usam o mesmo fundo papel e o
   * mesmo grading de cor (--foto-grade).
   */
  frame?: "filete" | "arco" | "none";
  /**
   * Enquadramento do recorte: ponto de foco (object-position, em %) e ampliação. Permite que a mesma foto
   * apareça em duas páginas, ou duas vezes na mesma, com um corte diferente (ex.: rosto fechado).
   */
  focus?: { x?: number; y?: number; zoom?: number };
  /** Duotone verde que volta à cor ao passar o ponteiro (só hover:hover). */
  duotone?: boolean;
  priority?: boolean;
  /** Repassado ao next/image. Padrão: "high" quando `priority`, nada nos demais casos. */
  fetchPriority?: "high" | "low" | "auto";
  /** Repassado ao next/image. Ignorado quando `priority`. Padrão: "lazy" sem `priority`. */
  loading?: "lazy" | "eager";
  sizes?: string;
  className?: string;
}

const ratioClass = {
  "4/5": "aspect-[4/5]",
  "1/1": "aspect-square",
  "16/10": "aspect-[16/10]",
  natural: "",
} as const;

/** <figure> editorial (DESIGN.md 4.1): sem raio, sem sombra; legenda "Fig. N". */
export function Figure({
  src,
  alt,
  width,
  height,
  n,
  caption,
  ratio = "4/5",
  frame = "filete",
  focus,
  duotone = false,
  priority = false,
  fetchPriority,
  loading,
  sizes = "(min-width:1100px) 480px, (min-width:760px) 44vw, 92vw",
  className,
}: FigureProps) {
  const showCap = alt !== "" && (n !== undefined || caption);
  return (
    <figure className={cn("fig", className)}>
      <div
        className={cn(
          "fig-frame",
          frame === "filete" && "fig-frame--filete",
          frame === "arco" && "fig-frame--arco",
        )}
      >
        <div
          className={cn(
            "fig-media",
            ratioClass[ratio],
            ratio === "natural" && "fig-media--natural",
            duotone && "fig-duotone",
          )}
        >
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            sizes={sizes}
            priority={priority}
            fetchPriority={fetchPriority ?? (priority ? "high" : undefined)}
            loading={priority ? undefined : (loading ?? "lazy")}
            quality={72}
            style={
              focus
                ? {
                    objectPosition: `${focus.x ?? 50}% ${focus.y ?? 50}%`,
                    transform: focus.zoom && focus.zoom !== 1 ? `scale(${focus.zoom})` : undefined,
                    transformOrigin: `${focus.x ?? 50}% ${focus.y ?? 50}%`,
                  }
                : undefined
            }
          />
        </div>
      </div>
      {showCap && (
        <figcaption className="fig-cap">
          {n !== undefined && <span className="t-folio">Fig. {n}</span>}
          {caption && <span className="t-cap">{caption}</span>}
        </figcaption>
      )}
    </figure>
  );
}
