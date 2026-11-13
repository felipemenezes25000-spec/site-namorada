"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { track, type TrackEvent } from "@/lib/analytics";

/**
 * Link que mede o clique (DESIGN.md 4.2). É a única ilha cliente dos CTAs e só
 * recebe valores primitivos. Links externos abrem em nova aba e avisam leitores de tela.
 */
export function TrackedLink({
  href,
  event,
  eventParams,
  external,
  className,
  children,
  ...rest
}: {
  href: string;
  event: TrackEvent;
  eventParams?: Record<string, string | number | boolean | undefined>;
  external?: boolean;
  className?: string;
  children: ReactNode;
  "aria-label"?: string;
}) {
  const onClick = () => track(event, eventParams);
  const isHttp = href.startsWith("http");
  if (external || isHttp) {
    // Com aria-label o texto interno é ignorado: o aviso de nova aba precisa entrar no rótulo.
    const label = rest["aria-label"];
    const restExternal = label ? { ...rest, "aria-label": `${label} (abre em nova aba)` } : rest;
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        onClick={onClick}
        {...restExternal}
      >
        {children}
        <span className="sr-only"> (abre em nova aba)</span>
      </a>
    );
  }
  if (href.startsWith("tel:") || href.startsWith("mailto:")) {
    return (
      <a href={href} className={className} onClick={onClick} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className} onClick={onClick} {...rest}>
      {children}
    </Link>
  );
}
