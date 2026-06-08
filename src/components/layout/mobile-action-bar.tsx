"use client";

import { MessageCircle, CalendarDays, Navigation } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { whatsappLink, waMessages } from "@/lib/whatsapp";
import { track } from "@/lib/analytics";

/**
 * Barra de ação fixa no rodapé — SOMENTE em telas pequenas (md:hidden).
 * Cobre as 3 intenções de maior conversão num consultório: falar agora
 * (WhatsApp), agendar (formulário) e como chegar (mapa). A maior parte do
 * tráfego de clínica é mobile, então estes atalhos ficam sempre na mão.
 *
 * O botão flutuante de WhatsApp fica restrito ao desktop (max-md:hidden)
 * para não duplicar o WhatsApp aqui.
 */
export function MobileActionBar() {
  return (
    <nav
      aria-label="Ações rápidas"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-brand-ink/[0.08] bg-brand-bone/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
    >
      <div className="grid grid-cols-3">
        <a
          href={whatsappLink(waMessages.default)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("whatsapp_click", { location: "mobile_bar" })}
          className="flex flex-col items-center justify-center gap-1 py-2.5 text-[0.68rem] font-semibold text-[#1F8C4D]"
        >
          <MessageCircle className="size-5" strokeWidth={1.8} />
          WhatsApp
        </a>
        <a
          href="/agendamento"
          onClick={() => track("scheduling_intent", { location: "mobile_bar" })}
          className="flex flex-col items-center justify-center gap-1 border-x border-brand-ink/[0.08] py-2.5 text-[0.68rem] font-semibold text-brand-green"
        >
          <CalendarDays className="size-5" strokeWidth={1.8} />
          Agendar
        </a>
        <a
          href={siteConfig.address.mapsDirectionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("map_click", { location: "mobile_bar" })}
          className="flex flex-col items-center justify-center gap-1 py-2.5 text-[0.68rem] font-semibold text-brand-gold-ink"
        >
          <Navigation className="size-5" strokeWidth={1.8} />
          Como chegar
        </a>
      </div>
    </nav>
  );
}
