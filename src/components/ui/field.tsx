import { forwardRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { CheckIcon } from "./icons";

/**
 * Campos de formulário (DESIGN.md 4.4). SEM caixa: só a linha inferior de 1px
 * (cor `linha`, 3:1), fundo transparente, raio 0, altura >= 52px, texto de 17px
 * (evita o zoom do iOS). Rótulo em Bodoni itálica 18px. Neutro (sem estado):
 * pode ser usado dentro de componentes cliente.
 * As versões antigas (visual de caixa) foram para src/components/admin/admin-ui.tsx.
 */
export function Label({
  children,
  htmlFor,
  required,
  className,
}: {
  children: ReactNode;
  htmlFor?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <label htmlFor={htmlFor} className={cn("fld-label", className)}>
      {children}
      {required && <span aria-hidden="true"> *</span>}
    </label>
  );
}

/** Ajuda persistente (.t-cap), ligada ao campo por aria-describedby. */
export function Hint({
  children,
  id,
  className,
}: {
  children: ReactNode;
  id?: string;
  className?: string;
}) {
  return (
    <span id={id} className={cn("fld-hint", className)}>
      {children}
    </span>
  );
}

/**
 * Erro do campo: prefixo "Atenção:" (não depende só de cor) e role="alert", para o leitor de tela
 * anunciar o erro assim que ele aparece (também quando o campo perde o foco, sem novo envio).
 */
export function FieldError({ message, id }: { message?: string; id?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="fld-erro">
      <strong>Atenção:</strong> {message}
    </p>
  );
}

/** Resumo de erros no topo do formulário: recebe foco ao enviar com erro. */
export function ErrorSummary({
  errors,
  id = "resumo-erros",
  title = "Revise os campos abaixo:",
}: {
  errors: { id: string; message: string }[];
  id?: string;
  title?: string;
}) {
  if (!errors.length) return null;
  return (
    <div id={id} role="alert" tabIndex={-1} className="fld-resumo">
      <p className="m-0 font-medium">{title}</p>
      <ul className="m-0 mt-2 list-none p-0">
        {errors.map((e) => (
          <li key={e.id} className="t-sm">
            <a href={`#${e.id}`} className="link">
              {e.message}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid, ...props }, ref) => (
    <input
      ref={ref}
      className={cn("fld", className)}
      aria-invalid={invalid || undefined}
      {...props}
    />
  ),
);
Input.displayName = "Input";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, invalid, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn("fld", className)}
      aria-invalid={invalid || undefined}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean;
}
/** Select nativo com seta própria (background-image). */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, invalid, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn("fld", className)}
      aria-invalid={invalid || undefined}
      {...props}
    >
      {children}
    </select>
  ),
);
Select.displayName = "Select";

interface ChoiceProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: ReactNode;
}

/** Opção em pílula, dentro de <fieldset><legend>. Marcada = fundo verde, texto osso. */
export const ChipRadio = forwardRef<HTMLInputElement, ChoiceProps>(
  ({ label, className, ...props }, ref) => (
    <label className={cn("chip", className)}>
      <input ref={ref} type="radio" {...props} />
      <span>{label}</span>
    </label>
  ),
);
ChipRadio.displayName = "ChipRadio";

/** Caixa de seleção 24x24 com área clicável de 44px. */
export const Checkbox = forwardRef<HTMLInputElement, ChoiceProps>(
  ({ label, className, ...props }, ref) => (
    <label className={cn("chk", className)}>
      <input ref={ref} type="checkbox" {...props} />
      <span className="chk-box" aria-hidden="true">
        <CheckIcon size={16} strokeWidth={2.2} />
      </span>
      <span className="chk-txt">{label}</span>
    </label>
  ),
);
Checkbox.displayName = "Checkbox";
