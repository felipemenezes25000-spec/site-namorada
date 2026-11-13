import type { Metadata } from "next";
import { locale, localeTexto } from "@/lib/site-config";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { ContatoHero } from "@/components/sections/contato-hero";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { ContactMethods } from "@/components/sections/contact-methods";
import { ContatoMapa } from "@/components/sections/contato-mapa";
import { ContatoFecho } from "@/components/sections/contato-fecho";

const TITLE = "Contato da Dra. Ana Beatriz | Dentista na Freguesia do Ó";

// O título fixado segue o DESIGN.md 6.4 (56 caracteres, com o nome da doutora). title, og:title e
// twitter:title são o mesmo texto: `buildMetadata` ainda não aceita `absoluteTitle`, então os três
// são fixados aqui.
const base = buildMetadata({
  title: TITLE,
  description: `Fale com a Dra. Ana Beatriz por WhatsApp, telefone, e-mail ou Instagram. Consultório na ${localeTexto("bairroRegiao")}, ${locale.zona}.`,
  path: "/contato",
});

export const metadata: Metadata = {
  ...base,
  title: { absolute: TITLE },
  openGraph: { ...base.openGraph, title: TITLE },
  twitter: { ...base.twitter, title: TITLE },
};

/**
 * /contato (DESIGN.md 5.6). Ritmo osso (abertura) / papel (canais) / noite (como chegar) /
 * osso (fecho curto, só o formulário). Sem FAQ: não há fato confirmado sobre estacionamento ou
 * acessibilidade (pendência do dono).
 */
export default function ContatoPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Início", path: "/" },
          { name: "Contato", path: "/contato" },
        ])}
      />
      <ContatoHero />

      <Section
        tone="papel"
        id="canais"
        hideFloating
        aria-labelledby="canais-titulo"
        spacing="compact"
      >
        <Container>
          <h2 id="canais-titulo" className="sr-only">
            Formas de contato
          </h2>
          <ContactMethods />
        </Container>
      </Section>

      <ContatoMapa />

      <ContatoFecho />
    </>
  );
}
