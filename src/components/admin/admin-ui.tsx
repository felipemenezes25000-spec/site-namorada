/**
 * Primitivos do painel /admin — cópia FIEL das versões antigas de
 * ui/button.tsx (Button), ui/field.tsx (Input, Label) e ui/logo.tsx (BrandSymbol).
 * O /admin mantém o visual legado (tokens `brand-*`); o site público usa o novo
 * sistema de design (DESIGN.md). Não use estes componentes em páginas do site.
 */
import Image from "next/image";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";
import symbol from "../../../public/brand/symbol.png";

/* ---------- Button (legado) ---------- */
type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "group relative inline-flex items-center justify-center gap-2 font-sans font-semibold tracking-wide rounded-full transition-all duration-300 ease-out-expo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/80 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bone disabled:opacity-60 disabled:pointer-events-none select-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-green text-brand-bone shadow-soft hover:bg-brand-green-dark hover:shadow-lift hover:-translate-y-0.5 active:translate-y-0",
  secondary:
    "bg-transparent text-brand-green ring-1 ring-inset ring-brand-green/25 hover:ring-brand-green/60 hover:bg-brand-green/[0.04]",
  ghost: "bg-transparent text-brand-green hover:bg-brand-green/[0.06]",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-5 text-[0.82rem]",
  md: "h-12 px-7 text-sm",
  lg: "h-[3.45rem] px-9 text-[0.95rem]",
};

export function buttonClasses(
  variant: Variant = "primary",
  size: Size = "md",
  className?: string,
) {
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
  "w-full rounded-xl border bg-white px-4 text-base text-brand-ink shadow-sm transition-all duration-200 placeholder:text-brand-ink/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/70 focus:border-brand-gold/60 disabled:opacity-60";

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
      className={cn("mb-2 block text-sm font-semibold text-brand-green", className)}
    >
      {children}
      {required && <span className="ml-0.5 text-brand-gold-ink" aria-hidden>*</span>}
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

