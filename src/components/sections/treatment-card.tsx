"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import type { Treatment } from "@/lib/treatments";
import { TreatmentIcon } from "@/components/ui/treatment-icon";
import { track } from "@/lib/analytics";
import { revealItem } from "@/components/ui/reveal";

export function TreatmentCard({ treatment }: { treatment: Treatment }) {
  return (
    <motion.article variants={revealItem} className="h-full">
      <Link
        href={`/tratamentos/${treatment.slug}`}
        onClick={() => track("treatment_card_click", { treatment: treatment.shortName })}
        className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-brand-ink/[0.07] bg-white p-7 shadow-card transition-all duration-500 ease-out-expo hover:-translate-y-1.5 hover:border-brand-gold/40 hover:shadow-lift sm:p-8"
      >
        {/* brilho no hover */}
        <span
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 size-32 rounded-full bg-brand-mint/0 blur-2xl transition-all duration-500 group-hover:bg-brand-mint/60"
        />
        <span className="relative flex size-14 items-center justify-center rounded-2xl bg-brand-green/[0.07] text-brand-green transition-colors duration-500 group-hover:bg-brand-green group-hover:text-brand-bone">
          <TreatmentIcon name={treatment.icon} className="size-7" />
        </span>

        <h3 className="relative mt-6 text-display-sm">{treatment.name}</h3>
        <p className="relative mt-3 flex-1 text-pretty text-[0.95rem] leading-relaxed text-brand-ink/70">
          {treatment.excerpt}
        </p>

        <span className="relative mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-green">
          Ver tratamento
          <ArrowUpRight className="size-4 text-brand-gold transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={1.8} />
        </span>
      </Link>
    </motion.article>
  );
}
