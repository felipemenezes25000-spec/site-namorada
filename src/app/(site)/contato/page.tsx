import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { PageHero } from "@/components/sections/page-hero";
import { ContactMethods } from "@/components/sections/contact-methods";
import { LocationSection } from "@/components/sections/location-section";
import { CTASection } from "@/components/sections/cta-section";

export const metadata: Metadata = buildMetadata({
  title: "Contato",
  description:
    "Fale com a Dra. Ana Beatriz Lemos Souza por WhatsApp, telefone, e-mail ou Instagram. Endereço, horários e localização do consultório em [Cidade].",
  path: "/contato",
  keywords: [`contato dentista ${siteConfig.city}`, `dentista ${siteConfig.neighborhood}`],
});

export default function ContatoPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Início", path: "/" },
          { name: "Contato", path: "/contato" },
        ])}
      />
      <PageHero
        eyebrow="Contato"
        title="Estamos por perto para o que você precisar"
        description="Escolha o canal mais confortável para você. O atendimento é acolhedor desde a primeira mensagem."
        breadcrumbs={[{ name: "Início", href: "/" }, { name: "Contato" }]}
      />

      <section className="pt-14 pb-4 bg-brand-bone sm:pt-16">
        <div className="container">
          <ContactMethods />
        </div>
      </section>

      <LocationSection />

      <CTASection />
    </>
  );
}
