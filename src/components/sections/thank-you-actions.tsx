"use client";

import { useEffect, useState } from "react";
import { CTA_CONTINUAR_WHATSAPP, WhatsAppCTA } from "@/components/ui/cta";
import { waMessages } from "@/lib/whatsapp";
import { track } from "@/lib/analytics";
import { markLeadFired, readLeadHandoff, treatmentForMessage } from "@/lib/agendamento-handoff";

/**
 * Próximo passo de /obrigado: continuar a conversa no WhatsApp.
 *
 * É aqui que `lead_created` dispara, UMA vez por lead: o formulário deixa o lead guardado em
 * sessionStorage com `fired: false`; este efeito dispara o evento e marca `fired: true`. Recarregar a
 * página não repete, e quem chega em /obrigado sem ter enviado o formulário não gera conversão.
 * Sem dado guardado, o botão usa a mensagem padrão do site (SSR e primeira pintura são iguais).
 */
export function ThankYouActions() {
  const [lead, setLead] = useState<{ firstName: string; treatment: string } | null>(null);

  useEffect(() => {
    const stored = readLeadHandoff();
    if (!stored) return;
    setLead({ firstName: stored.firstName, treatment: stored.treatment });
    if (!stored.fired) {
      markLeadFired(); // antes de rastrear: a segunda execução do efeito (modo dev) já encontra `fired`
      track("lead_created", {
        treatment: stored.treatment || undefined,
        location: "thank_you",
      });
    }
  }, []);

  const message = lead?.firstName
    ? waMessages.fromForm(lead.firstName, treatmentForMessage(lead.treatment))
    : waMessages.default;

  return <WhatsAppCTA location="thank_you" message={message} label={CTA_CONTINUAR_WHATSAPP} />;
}
