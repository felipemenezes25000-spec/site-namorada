import Link from "next/link";
import { forwardRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Botões (DESIGN.md 4.2). Variante pelo tom da seção:
 *  - fundo claro: primario (WhatsApp, ação principal), contorno, texto;
 *  - dentro de noite/verde: ouro e contorno-claro.
 */
export type ButtonVariant =
  | "primario"
  | "contorno"
  | "ouro"
  | "contorno-claro"
  | "texto";
export type ButtonSize = "md" | "sm";

const variantClass = {
  primario: "btn-primario",
  contorno: "btn-contorno",
  ouro: "btn-ouro",
  "contorno-claro": "btn-contorno-claro",
  texto: "btn-texto",
} as const;

export function buttonClasses(
  variant: ButtonVariant = "primario",
  size: ButtonSize = "md",
  className?: string,
) {
  return cn("btn", variantClass[variant], size === "sm" && "btn-sm", className);
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
}

/**
 * Use `disabled` quando o botão some do fluxo de vez. Use `aria-disabled="true"` (ou `aria-disabled`)
 * quando ele precisa MANTER O FOCO e continuar anunciado, como o "Enviar" durante o envio: o visual
 * é o mesmo do `disabled` (.btn[aria-disabled]), mas o clique e o Enter são ignorados aqui, sem tirar
 * o botão da ordem de Tab.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, size, className, iconLeft, iconRight, children, onClick, ...props }, ref) => {
    const soft = props["aria-disabled"] === true || props["aria-disabled"] === "true";
    return (
      <button
        ref={ref}
        className={buttonClasses(variant, size, className)}
        onClick={
          soft
            ? (e) => {
                e.preventDefault();
              }
            : onClick
        }
        {...props}
      >
        {iconLeft}
        {children}
        {iconRight}
      </button>
    );
  },
);
Button.displayName = "Button";

interface ButtonLinkProps {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  external?: boolean;
  className?: string;
  children: ReactNode;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
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
  iconLeft,
  iconRight,
  onClick,
  prefetch,
  ...rest
}: ButtonLinkProps) {
  const classes = buttonClasses(variant, size, className);
  const isHttp = href.startsWith("http");
  if (external || isHttp || href.startsWith("tel:") || href.startsWith("mailto:")) {
    return (
      <a
        href={href}
        target={isHttp ? "_blank" : undefined}
        rel={isHttp ? "noopener noreferrer" : undefined}
        className={classes}
        onClick={onClick}
        {...rest}
      >
        {iconLeft}
        {children}
        {iconRight}
        {isHttp && <span className="sr-only"> (abre em nova aba)</span>}
      </a>
    );
  }
  return (
    <Link href={href} className={classes} onClick={onClick} prefetch={prefetch} {...rest}>
      {iconLeft}
      {children}
      {iconRight}
    </Link>
  );
}
