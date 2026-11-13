"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { CTA_LIGAR, PhoneCTA } from "@/components/ui/cta";
import { RouteAgendarCTA, RouteWhatsAppCTA, useWaRoute } from "./route-ctas";

/**
 * Barra de ações fixa do celular (< 760px; DESIGN.md 4.3), presente desde o
 * primeiro pixel. WhatsApp dominante (flex 1) + Agendar + Ligar. Fundo osso
 * sólido, fio superior. Só a sombra do botão de WhatsApp (--sombra-botao-fixo).
 * Em /agendamento e /obrigado o botão Agendar é omitido (a pessoa já está no formulário ou acabou de enviá-lo). Em
 * /urgencia-odontologica a segunda ação é "Ligar" com rótulo visível (no lugar do formulário).
 * O WhatsApp leva a mensagem da rota e o formulário leva o slug do tratamento (route-ctas.tsx).
 * Some enquanto um elemento `[data-hide-floating]` está na tela (o fecho da página, o rodapé e o
 * botão de WhatsApp da abertura): lá já existe o mesmo botão, e dois iguais na mesma tela só atrapalham.
 */
export function MobileActionBar() {
  const pathname = usePathname();
  const urgencia = useWaRoute().kind === "urgency";
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const inView = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) inView.add(e.target);
        else inView.delete(e.target);
      }
      setHidden(inView.size > 0);
    });
    document.querySelectorAll("[data-hide-floating]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  return (
    <nav aria-label="Ações rápidas" className="abar" data-hidden={hidden ? "" : undefined}>
      <RouteWhatsAppCTA location="mobile_bar" compactLabel="WhatsApp" className="btn-fixo" />
      {urgencia ? (
        <PhoneCTA location="mobile_bar" label={CTA_LIGAR} className="shrink-0" />
      ) : (
        <>
          {pathname !== "/agendamento" && pathname !== "/obrigado" && (
            <RouteAgendarCTA location="mobile_bar" iconOnly />
          )}
          <PhoneCTA location="mobile_bar" iconOnly />
        </>
      )}
    </nav>
  );
}
