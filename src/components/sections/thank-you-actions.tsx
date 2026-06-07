"use client";

import { useEffect } from "react";
import { MessageCircle } from "lucide-react";
import { whatsappLink, waMessages } from "@/lib/whatsapp";
import { track } from "@/lib/analytics";
import { ButtonLink } from "@/components/ui/button";

export function ThankYouActions({
  name,
  treatment,
}: {
  name: string;
  treatment: string;
}) {
  // Reforça a conversão para pixel/GA ao chegar na página de obrigado.
  useEffect(() => {
    track("lead_created", { treatment, location: "thank_you" });
  }, [treatment]);

  return (
    <ButtonLink
      href={whatsappLink(waMessages.fromForm(name, treatment))}
      external
      variant="whatsapp"
      size="lg"
      onClick={() => track("whatsapp_click", { location: "thank_you" })}
    >
      <MessageCircle className="size-5" strokeWidth={1.7} />
      Continuar no WhatsApp
    </ButtonLink>
  );
}
