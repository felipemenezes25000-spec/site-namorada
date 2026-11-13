import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { PlusIcon } from "./icons";

/** Máximo de perguntas por LISTA (DESIGN.md 4.4); a home mostra 8 e recolhe o resto. A PÁGINA escolhe as perguntas. */
export const FAQ_MAX = 16;

/**
 * Perguntas frequentes (DESIGN.md 4.4). <details> nativo: vários abertos ao
 * mesmo tempo, funciona sem JS, a busca da página abre sozinha. No máximo FAQ_MAX
 * itens por página: o componente NÃO corta nada em silêncio; a página passa a mesma
 * lista ao <FAQ> e ao `faqSchema` (JSON-LD com exatamente as mesmas perguntas).
 * `columns=2` só vale a partir de 1100px (itens divididos em duas pilhas).
 */
export function FAQ({
  items,
  columns = 1,
  className,
}: {
  items: { q: string; a: string }[];
  columns?: 1 | 2;
  className?: string;
}) {
  if (process.env.NODE_ENV !== "production" && items.length > FAQ_MAX) {
    console.warn(`FAQ: ${items.length} perguntas (máximo recomendado: ${FAQ_MAX}).`);
  }
  const shown = items;
  const half = Math.ceil(shown.length / 2);
  const stacks = columns === 2 ? [shown.slice(0, half), shown.slice(half)] : [shown];
  return (
    <div
      className={cn(columns === 2 && "grid desk:grid-cols-2 desk:gap-x-[var(--gap)]", className)}
    >
      {stacks.map((stack, s) => (
        <div key={s} data-reveal="">
          {stack.map((item, i) => (
            <details
              key={item.q}
              className="faq-item"
              style={{ "--i": Math.min(i, 8) } as CSSProperties}
            >
              <span
                className="fio-h"
                aria-hidden="true"
                style={{ "--fio-delay": `${Math.min(i, 8) * 60}ms` } as CSSProperties}
              />
              <summary className="faq-q">
                <span>{item.q}</span>
                <PlusIcon size={22} />
              </summary>
              <p className="faq-a t-body">{item.a}</p>
            </details>
          ))}
          <span className="fio-h" aria-hidden="true" />
        </div>
      ))}
    </div>
  );
}
