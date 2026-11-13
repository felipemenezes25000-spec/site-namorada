import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Retrato em arco com o Fio (DESIGN.md 3.1 uso 1). SERVIDOR, só CSS.
 * Geometria fixa em uma viewBox 0 0 1072 1100; o contêiner tem aspect-ratio
 * 1072/1100 (a altura vem da largura, sem medir nada). Ordem: fundo (areia),
 * SVG do fio, retrato recortado: a cabeça passa NA FRENTE do fio.
 * O arco já está inteiro no HTML; o desenho de 2,4s é só enfeite (movimento
 * permitido) e nunca esconde conteúdo. Só uma vez por página (a capa da home).
 */
export function ArchPortrait({
  caption,
  fig,
  priority = true,
  fetchPriority,
  loading,
  sizes = "(min-width:1100px) 480px, (min-width:760px) 44vw, 92vw",
  className,
}: {
  /** Texto da legenda; omita para a legenda padrão (verdadeira e já existente). */
  caption?: ReactNode;
  /** Número da figura ("Fig. n"). Só numere quando a página tiver outras figuras que se refiram a este número; sem ele, a legenda vem sem numeração. */
  fig?: number;
  priority?: boolean;
  /** Repassado ao next/image. Padrão: "high" quando `priority`, nada nos demais casos. */
  fetchPriority?: "high" | "low" | "auto";
  /** Repassado ao next/image. Ignorado quando `priority` (o next/image não aceita os dois). */
  loading?: "lazy" | "eager";
  sizes?: string;
  className?: string;
}) {
  return (
    <figure className={cn("m-0", className)}>
      <div className="arch-wrap">
        <div className="arch">
          <div className="arch-bg" />
          <svg
            className="arch-svg"
            viewBox="0 0 1072 1100"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
            focusable="false"
          >
            <path pathLength={1} d="M1.5 1100V536A534.5 534.5 0 0 1 1070.5 536V1100" />
          </svg>
          <Image
            className="arch-img"
            src="/dra-ana-recorte.webp"
            width={1014}
            height={1184}
            alt="Retrato da Dra. Ana Beatriz Lemos Souza, sorrindo, de jaleco branco"
            priority={priority}
            fetchPriority={fetchPriority ?? (priority ? "high" : undefined)}
            loading={priority ? undefined : loading}
            quality={72}
            sizes={sizes}
          />
        </div>
      </div>
      <figcaption className="fig-cap">
        {fig !== undefined && <span className="t-folio">Fig. {fig}</span>}
        <span className="t-cap">
          {caption ??
            "Dra. Ana Beatriz Lemos Souza, cirurgiã-dentista. Atendimento particular, sem convênios."}
        </span>
      </figcaption>
    </figure>
  );
}
