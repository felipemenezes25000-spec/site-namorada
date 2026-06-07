import Link from "next/link";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "gold" | "whatsapp" | "ghost" | "light";
type Size = "sm" | "md" | "lg";

const base =
  "group relative inline-flex items-center justify-center gap-2 font-sans font-semibold tracking-wide rounded-full transition-all duration-300 ease-out-expo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/80 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bone disabled:opacity-60 disabled:pointer-events-none select-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-green text-brand-bone shadow-soft hover:bg-brand-green-dark hover:shadow-lift hover:-translate-y-0.5 active:translate-y-0",
  secondary:
    "bg-transparent text-brand-green ring-1 ring-inset ring-brand-green/25 hover:ring-brand-green/60 hover:bg-brand-green/[0.04]",
  gold:
    "bg-brand-gold text-white shadow-gold hover:brightness-[1.04] hover:-translate-y-0.5 active:translate-y-0",
  whatsapp:
    "bg-[#1F8C4D] text-white shadow-soft hover:bg-[#19743f] hover:shadow-lift hover:-translate-y-0.5 active:translate-y-0",
  ghost: "bg-transparent text-brand-green hover:bg-brand-green/[0.06]",
  light:
    "bg-brand-bone text-brand-green shadow-soft hover:bg-white hover:-translate-y-0.5",
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

interface ButtonLinkProps {
  href: string;
  variant?: Variant;
  size?: Size;
  external?: boolean;
  className?: string;
  children: React.ReactNode;
  "aria-label"?: string;
  onClick?: () => void;
  prefetch?: boolean;
}

export function ButtonLink({
  href,
  variant,
  size,
  external,
  className,
  children,
  onClick,
  prefetch,
  ...rest
}: ButtonLinkProps) {
  const classes = buttonClasses(variant, size, className);
  if (external || href.startsWith("http") || href.startsWith("tel:")) {
    return (
      <a
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        className={classes}
        onClick={onClick}
        {...rest}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes} onClick={onClick} prefetch={prefetch} {...rest}>
      {children}
    </Link>
  );
}
