"use client";

import { motion } from "framer-motion";
import { trustBadges } from "@/lib/content";
import { RevealGroup, revealItem } from "@/components/ui/reveal";

export function TrustBar() {
  return (
    <section className="border-y border-brand-ink/[0.06] bg-white/60">
      <div className="container py-10 lg:py-12">
        <RevealGroup
          className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-5"
          stagger={0.07}
        >
          {trustBadges.map(({ icon: Icon, title, description }) => (
            <motion.div
              key={title}
              variants={revealItem}
              className="flex flex-col items-center gap-3 text-center"
            >
              <span className="flex size-12 items-center justify-center rounded-full bg-brand-green/[0.07] text-brand-green">
                <Icon className="size-5" strokeWidth={1.6} />
              </span>
              <div>
                <p className="font-display text-lg leading-tight text-brand-green">{title}</p>
                <p className="mt-1 text-xs leading-relaxed text-brand-ink/65">{description}</p>
              </div>
            </motion.div>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
