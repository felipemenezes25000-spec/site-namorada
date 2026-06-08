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
      <Header />
      <main id="conteudo">{children}</main>
      <Footer />
      <WhatsAppFloatingButton />
    </>
  );
}
