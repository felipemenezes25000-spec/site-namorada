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

      {/* Marca-d'água do símbolo AB — centralizada na tela, fixa, MUITO sutil.
          Sem mix-blend-mode (causava artefatos visuais "moldura" em fundos
          escuros). Opacity baixíssima (0.035) para presença discreta sem
          competir com texto. pointer-events-none permite cliques atravessarem.
          Oculta em mobile para não competir com conteúdo apertado. */}
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
          sizes="45vh"
          className="h-[45vh] w-auto opacity-[0.035]"
        />
      </div>

      <Header />
      <main id="conteudo">{children}</main>
      <Footer />
      <WhatsAppFloatingButton />
    </>
  );
}
