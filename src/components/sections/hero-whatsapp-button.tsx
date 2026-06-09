"use client";

import { MessageCircle } from "lucide-react";
import { whatsappLink, waMessages } from "@/lib/whatsapp";
import { track } from "@/lib/analytics";
import { ButtonLink } from "@/components/ui/button";

/** CTA de WhatsApp do hero — client mínimo só para o evento de conversão. */
export function HeroWhatsAppButton() {
  return (
    <ButtonLink
      href={whatsappLink(waMessages.default)}
      external
      variant="primary"
      size="lg"
      onClick={() => track("whatsapp_click", { location: "hero" })}
    >
      <MessageCircle className="size-5" strokeWidth={1.7} />
      Agendar consulta no WhatsApp
    </ButtonLink>
  );
}
