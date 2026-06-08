import Image from "next/image";
import { dentistSchema, websiteSchema } from "@/lib/seo";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppFloatingButton } from "@/components/layout/whatsapp-floating-button";
import { JsonLd } from "@/components/seo/json-ld";

/**
 * Layout das páginas públicas (marketing).
 * O painel /admin fica FORA deste grupo e não herda header/rodapé/WhatsApp.
 */
export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-brand-green focus:px-5 focus:py-2 focus:text-sm focus:text-brand-bone"
      >
        Ir para o conteúdo
      </a>
      <JsonLd data={[dentistSchema(), websiteSchema()]} />

      {/* Marca-d'água com o símbolo AB — centralizada na tela, fixa.
          z-30 fica acima das seções mas abaixo do header (z-50) e modais.
          mix-blend-multiply integra com o fundo: escurece sutilmente sobre
          claro, fica quase invisível sobre verde-escuro (footer, HowItWorks).
          Opacity 0.06 com multiply dá presença discreta sem competir com texto.
          pointer-events-none permite cliques atravessarem normalmente.
          Oculta em mobile para não ofuscar conteúdo apertado. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-30 hidden items-center justify-center md:flex"
      >
        <Image
          src="/brand/symbol.png"
          alt=""
          width={800}
          height={800}
          priority={false}
          sizes="55vh"
          className="h-[55vh] w-auto opacity-[0.06] mix-blend-multiply"
        />
      </div>

      <Header />
      <main id="conteudo">{children}</main>
      <Footer />
      <WhatsAppFloatingButton />
    </>
  );
}
