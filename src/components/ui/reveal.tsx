"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Revela um elemento de forma CONFIÁVEL:
 *  - dispara quando o topo do elemento entra (ou já passou) pela viewport;
 *  - IntersectionObserver + fallback de scroll → nem rolagem rápida deixa
 *    uma seção "presa" invisível;
 *  - `immediate` (ex.: prefers-reduced-motion) mostra na hora, sem observar.
 */
function useReveal(immediate = false) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(immediate);

  useEffect(() => {
    if (immediate) {
      setShown(true);
      return;
    }
    const el = ref.current;
    if (!el) return;

    // Lenient: revela assim que o topo entra pela borda inferior — garante que
    // nem a última seção (logo acima do rodapé) fique presa invisível.
    const inViewNow = () => el.getBoundingClientRect().top < window.innerHeight;
    if (inViewNow()) {
      setShown(true);
      return;
    }
    const onScroll = () => {
      if (inViewNow()) {
        setShown(true);
        cleanup();
      }
    };
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          cleanup();
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    function cleanup() {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    }
    io.observe(el);
    window.addEventListener("scroll", onScroll, { passive: true });
    return cleanup;
  }, [immediate]);

  return { ref, shown };
}

interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "section" | "article" | "span";
  once?: boolean;
}

export function Reveal({ children, delay = 0, y = 18, className, as = "div" }: RevealProps) {
  const reduce = useReducedMotion();
  const { ref, shown } = useReveal(!!reduce);
  const MotionTag = motion[as] as typeof motion.div;

  const variants: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : y },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0 : 0.7, ease, delay: reduce ? 0 : delay },
    },
  };

  return (
    <MotionTag
      ref={ref}
      className={className}
      variants={variants}
      initial={reduce ? false : "hidden"}
      animate={shown ? "show" : "hidden"}
    >
      {children}
    </MotionTag>
  );
}

/** Container que aplica stagger aos filhos (use <motion.* variants={revealItem}>). */
export function RevealGroup({
  children,
  className,
  stagger = 0.09,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  as?: "div" | "ul" | "section";
}) {
  const reduce = useReducedMotion();
  const { ref, shown } = useReveal(!!reduce);
  const MotionTag = motion[as] as typeof motion.div;
  return (
    <MotionTag
      ref={ref}
      className={className}
      initial={reduce ? false : "hidden"}
      animate={shown ? "show" : "hidden"}
      variants={{ hidden: {}, show: { transition: { staggerChildren: reduce ? 0 : stagger } } }}
    >
      {children}
    </MotionTag>
  );
}

export const revealItem: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};
