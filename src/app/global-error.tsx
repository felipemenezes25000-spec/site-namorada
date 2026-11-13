"use client";

import "./globals.css";
import { Button } from "@/components/ui/button";
import { WhatsAppCTA } from "@/components/ui/cta";
import { Monogram } from "@/components/brand/logo";
import { waMessages } from "@/lib/whatsapp";

/**
 * Último recurso: substitui o layout raiz, então traz o próprio <html>/<body>.
 * Sem as fontes do layout (cai nas serifas e sans do sistema), mas com os tokens
 * e a chamada para o WhatsApp.
 */
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <main className="wrap flex min-h-[100svh] flex-col justify-center py-16">
          <Monogram size={56} />
          <h1 className="t-d1i mt-8">Algo não saiu como esperado</h1>
          <p className="t-lead mt-6 max-w-leitura">
            Não conseguimos abrir o site agora. Tente carregar de novo. Se preferir, fale com a Dra.
            Ana pelo WhatsApp.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button variant="primario" onClick={() => reset()}>
              Tentar de novo
            </Button>
            <WhatsAppCTA location="global_error" variant="contorno" message={waMessages.default} />
          </div>
        </main>
      </body>
    </html>
  );
}
