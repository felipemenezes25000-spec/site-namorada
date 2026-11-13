import { dentistSchema, websiteSchema } from "@/lib/seo";
import { SiteShell } from "@/components/layout/site-shell";
import { JsonLd } from "@/components/seo/json-ld";

/**
 * Layout das páginas públicas (marketing).
 * O painel /admin fica FORA deste grupo e não herda header/rodapé/WhatsApp.
 * A moldura (cabeçalho, rodapé, barra do celular...) está em SiteShell.
 */
export default function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <JsonLd data={[dentistSchema(), websiteSchema()]} />
      <SiteShell>{children}</SiteShell>
    </>
  );
}
