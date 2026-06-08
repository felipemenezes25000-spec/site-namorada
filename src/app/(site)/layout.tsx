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

      {/* Marca-d'água com o símbolo AB — sutil, fixa no canto direito.
          z-30 fica abaixo do header (z-50) e modais, mas acima do conteúdo,
          com pointer-events-none para não interferir em cliques.
          Oculta em telas pequenas para não competir com conteúdo. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-y-0 -right-[12%] z-30 hidden items-center md:flex"
      >
        <Image
          src="/brand/symbol.png"
          alt=""
          width={800}
          height={800}
          priority={false}
          sizes="60vh"
          className="h-auto w-[55vh] max-w-[640px] opacity-[0.04]"
        />
      </div>

      <Header />
      <main id="conteudo">{children}</main>
      <Footer />
      <WhatsAppFloatingButton />
    </>
  );
}
