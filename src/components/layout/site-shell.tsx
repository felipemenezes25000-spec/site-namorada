import type { ReactNode } from "react";
import { Header } from "./header";
import { Footer } from "./footer";
import { MobileActionBar } from "./mobile-action-bar";
import { RevealObserver } from "@/components/motion/reveal-observer";
import { RouteCtaProvider } from "./route-ctas";
import { treatments } from "@/lib/treatments";

/** slug -> nome visível, para a mensagem de WhatsApp da rota (sem levar o catálogo ao cliente). */
const treatmentNames = Object.fromEntries(treatments.map((t) => [t.slug, t.name]));

/**
 * Moldura das páginas públicas (cabeçalho, conteúdo, rodapé, barra do celular,
 * botão flutuante). Usada por (site)/layout.tsx e pelo 404. O /admin fica fora.
 *
 * Camadas e alturas vêm das variáveis de globals.css (--h-header, --h-bar, --h-cookie, z-*).
 * O link "Ir para o conteúdo" fica no layout raiz (<SkipLink />, antes da região de cookies) e leva o foco ao <main>
 * (tabIndex -1: recebe foco por script e por âncora, nunca entra na ordem de Tab).
 */
export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <RouteCtaProvider treatmentNames={treatmentNames}>
      <Header />
      <div className="site-shell">
        <main id="conteudo" tabIndex={-1}>
          {children}
        </main>
        <Footer />
      </div>
      <MobileActionBar />
      <RevealObserver />
    </RouteCtaProvider>
  );
}
