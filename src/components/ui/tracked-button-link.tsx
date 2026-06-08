"use client";

import { ButtonLink } from "./button";
import { track, type TrackEvent } from "@/lib/analytics";

type Variant = "primary" | "secondary" | "gold" | "whatsapp" | "ghost" | "light";
type Size = "sm" | "md" | "lg";

/**
 * Wrapper client de ButtonLink que dispara um evento de analytics no clique.
 * Permite rastrear CTAs em páginas Server Component (que não podem passar
 * onClick diretamente).
 */
export function TrackedButtonLink({
  event,
  eventParams,
  ...props
}: {
  href: string;
  variant?: Variant;
  size?: Size;
  external?: boolean;
  className?: string;
  children: React.ReactNode;
  "aria-label"?: string;
  event: TrackEvent;
  eventParams?: Record<string, string | number | boolean | undefined>;
}) {
  return <ButtonLink {...props} onClick={() => track(event, eventParams)} />;
}
