"use client";

import { useState, useId } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQItem {
  q: string;
  a: string;
}

export function FAQAccordion({
  items,
  className,
}: {
  items: FAQItem[];
  className?: string;
}) {
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId();

  return (
    <div className={cn("divide-y divide-brand-ink/[0.08] overflow-hidden rounded-3xl border border-brand-ink/[0.08] bg-white shadow-card", className)}>
      {items.map((item, i) => {
        const isOpen = open === i;
        const btnId = `${baseId}-btn-${i}`;
        const panelId = `${baseId}-panel-${i}`;
        return (
          <div key={i}>
            <h3 className="m-0">
              <button
                id={btnId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-brand-green/[0.02] sm:px-8"
              >
                <span className="font-display text-lg leading-snug text-brand-green sm:text-xl">
                  {item.q}
                </span>
                <span
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-full border border-brand-ink/10 text-brand-green transition-all duration-300",
                    isOpen ? "rotate-45 border-brand-gold/50 bg-brand-gold/10 text-brand-gold" : "",
                  )}
                >
                  <Plus className="size-4" strokeWidth={1.8} aria-hidden />
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={btnId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <p className="px-6 pb-6 text-pretty leading-relaxed text-brand-ink/70 sm:px-8">
                    {item.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
