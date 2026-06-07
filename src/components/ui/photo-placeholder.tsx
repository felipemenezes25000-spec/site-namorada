import { Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import { BrandSymbol } from "./logo";

/**
 * Painel de marca usado onde entrará uma FOTO REAL.
 * É desenhado para parecer intencional (não um "quadrado vazio"):
 * funciona como arte de marca até a foto definitiva ser adicionada.
 *
 * Para trocar pela foto: substitua <PhotoPlaceholder/> por
 * <Image src="/foto.jpg" .../> mantendo o mesmo wrapper de aspecto.
 */
export function PhotoPlaceholder({
  label = "Espaço reservado para foto",
  className,
  tone = "green",
}: {
  label?: string;
  className?: string;
  tone?: "green" | "beige";
}) {
  return (
    <div
      className={cn(
        "relative isolate flex flex-col items-center justify-center overflow-hidden rounded-3xl",
        tone === "green"
          ? "bg-gradient-to-br from-brand-green via-brand-green-dark to-brand-green-deep"
          : "bg-gradient-to-br from-brand-beige via-[#e7ddcb] to-brand-mint",
        className,
      )}
    >
      {/* textura e brilho */}
      <div aria-hidden className="texture-grain absolute inset-0" />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 size-48 rounded-full bg-brand-gold/15 blur-3xl"
      />
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-3 rounded-[1.4rem] border",
          tone === "green" ? "border-brand-bone/15" : "border-brand-green/15",
        )}
      />
      <div className="relative z-10 flex flex-col items-center gap-4 px-6 py-12 text-center">
        <BrandSymbol size={72} badge={tone === "green"} />
        <div
          className={cn(
            "flex items-center gap-2 text-[0.7rem] font-medium uppercase tracking-eyebrow",
            tone === "green" ? "text-brand-bone/55" : "text-brand-green/50",
          )}
        >
          <Camera className="size-3.5" strokeWidth={1.6} aria-hidden />
          {label}
        </div>
      </div>
    </div>
  );
}
