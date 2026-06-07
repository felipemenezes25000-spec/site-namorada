import Image from "next/image";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";
import symbol from "../../../public/brand/symbol.png";

/** Símbolo AB + mandíbula. Em fundos escuros, usa um selo claro para manter legibilidade. */
export function BrandSymbol({
  size = 44,
  badge = false,
  className,
  priority = false,
}: {
  size?: number;
  badge?: boolean;
  className?: string;
  priority?: boolean;
}) {
  const img = (
    <Image
      src={symbol}
      alt={`Símbolo da marca ${siteConfig.doctorName}`}
      width={size}
      height={size}
      priority={priority}
      className="h-auto w-full object-contain"
      sizes={`${size}px`}
    />
  );
  if (!badge) {
    return (
      <span className={cn("inline-block", className)} style={{ width: size }}>
        {img}
      </span>
    );
  }
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-2xl bg-brand-bone shadow-soft",
        className,
      )}
      style={{ width: size + 16, height: size + 16 }}
    >
      <span style={{ width: size }}>{img}</span>
    </span>
  );
}

/** Lockup completo: símbolo + nome em serifada. */
export function BrandLockup({
  tone = "dark",
  showTitle = true,
  symbolSize = 42,
  className,
  priority = false,
}: {
  tone?: "dark" | "light";
  showTitle?: boolean;
  symbolSize?: number;
  className?: string;
  priority?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <BrandSymbol size={symbolSize} badge={tone === "light"} priority={priority} />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-[1.06rem] font-medium tracking-tight sm:text-[1.18rem]",
            tone === "light" ? "text-brand-bone" : "text-brand-green",
          )}
        >
          {siteConfig.doctorName}
        </span>
        {showTitle && (
          <span
            className={cn(
              "mt-1 text-[0.58rem] font-semibold uppercase tracking-eyebrow",
              tone === "light" ? "text-brand-gold-bright" : "text-brand-gold-ink",
            )}
          >
            {siteConfig.title}
          </span>
        )}
      </span>
    </span>
  );
}
