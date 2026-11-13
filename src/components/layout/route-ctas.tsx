"use client";

import { createContext, useContext, type ComponentProps, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { waContextForPath, type WaRouteContext } from "@/lib/whatsapp";
import { AgendarCTA, WhatsAppCTA } from "@/components/ui/cta";

/**
 * CTAs que se adaptam à rota (B-06): o WhatsApp da barra, do cabeçalho e do menu leva a mensagem
 * da página (urgência, receio, primeira consulta, tratamento) e o "Preencher formulário" leva o
 * slug do tratamento em /tratamentos/[slug]. O servidor (site-shell.tsx) entrega o mapa
 * slug -> nome pelo provider; os componentes leem a rota com usePathname(), então o HTML já sai
 * com o href certo. Nomes de evento e `location` não mudam.
 */
const NomesCtx = createContext<Readonly<Record<string, string>>>({});

export function RouteCtaProvider({
  treatmentNames,
  children,
}: {
  treatmentNames: Readonly<Record<string, string>>;
  children: ReactNode;
}) {
  return <NomesCtx.Provider value={treatmentNames}>{children}</NomesCtx.Provider>;
}

/** Contexto de WhatsApp da rota atual. */
export function useWaRoute(): WaRouteContext {
  const pathname = usePathname();
  const nomes = useContext(NomesCtx);
  return waContextForPath(pathname, nomes);
}

/** WhatsAppCTA com a intenção e a mensagem da rota (o rótulo sai delas). Aceita as mesmas props, menos `message` e `intent`. */
export function RouteWhatsAppCTA(
  props: Omit<ComponentProps<typeof WhatsAppCTA>, "message" | "intent" | "label">,
) {
  const { intent, message } = useWaRoute();
  return <WhatsAppCTA {...props} intent={intent} message={message} />;
}

/** AgendarCTA com o slug do tratamento quando a rota é /tratamentos/[slug]. */
export function RouteAgendarCTA(props: Omit<ComponentProps<typeof AgendarCTA>, "treatment">) {
  const { treatmentSlug } = useWaRoute();
  return <AgendarCTA {...props} treatment={treatmentSlug} />;
}
