/**
 * Primitivos do painel /admin — cópia FIEL das versões antigas de
 * ui/button.tsx (Button), ui/field.tsx (Input, Label) e ui/logo.tsx (BrandSymbol).
 * O /admin mantém o visual legado (tokens `brand-*`); o site público usa o novo
 * sistema de design (DESIGN.md). Não use estes componentes em páginas do site.
 */
import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";

/* ---------- Button (legado) ---------- */
type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "group relative inline-flex items-center justify-center gap-2 font-sans font-semibold tracking-wide rounded-full transition-all duration-300 ease-toque focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-painel-ouro/80 focus-visible:ring-offset-2 focus-visible:ring-offset-osso disabled:opacity-60 disabled:pointer-events-none select-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-verde text-osso shadow-painel hover:bg-verde-escuro hover:shadow-painel-alto hover:-translate-y-0.5 active:translate-y-0",
  secondary:
    "bg-transparent text-verde ring-1 ring-inset ring-painel-verde/25 hover:ring-painel-verde/60 hover:bg-verde/[0.04]",
  ghost: "bg-transparent text-verde hover:bg-verde/[0.06]",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-5 text-[0.82rem]",
  md: "h-12 px-7 text-sm",
  lg: "h-[3.45rem] px-9 text-[0.95rem]",
};

export function buttonClasses(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, size, className, ...props }, ref) => (
    <button ref={ref} className={buttonClasses(variant, size, className)} {...props} />
  ),
);
Button.displayName = "Button";

/* ---------- Label / Input (legado) ---------- */
const fieldBase =
  "w-full rounded-xl border bg-white px-4 text-base text-tinta shadow-sm transition-all duration-200 placeholder:text-painel-tinta/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-painel-ouro/70 focus:border-painel-ouro/60 disabled:opacity-60";

export function Label({
  children,
  htmlFor,
  required,
  className,
}: {
  children: React.ReactNode;
  htmlFor?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn("mb-2 block text-sm font-semibold text-verde", className)}
    >
      {children}
      {required && (
        <span className="ml-0.5 text-ouro-tinta" aria-hidden>
          *
        </span>
      )}
    </label>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(fieldBase, "h-12", invalid && "border-red-400 focus:ring-red-300", className)}
      aria-invalid={invalid || undefined}
      {...props}
    />
  ),
);
Input.displayName = "Input";

/* ---------- BrandSymbol (legado) ---------- */
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
  // SVG da marca (o PNG antigo tinha 909 kB): proporção do arquivo 863 x 701
  const img = (
    // eslint-disable-next-line @next/next/no-img-element -- SVG estático da marca: next/image não otimiza SVG
    <img
      src="/brand/simbolo.svg"
      alt={`Símbolo da marca ${siteConfig.doctorName}`}
      width={size}
      height={Math.round((size * 701) / 863)}
      loading={priority ? undefined : "lazy"}
      decoding="async"
      className="h-auto w-full object-contain"
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
        "inline-flex items-center justify-center rounded-2xl bg-osso shadow-painel",
        className,
      )}
      style={{ width: size + 16, height: size + 16 }}
    >
      <span style={{ width: size }}>{img}</span>
    </span>
  );
}
