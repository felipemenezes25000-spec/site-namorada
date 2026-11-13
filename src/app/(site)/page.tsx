import type { Metadata } from "next";
import { buildMetadata, faqSchema } from "@/lib/seo";
import { homeFaqs } from "@/lib/content";
import { locale, localeTexto } from "@/lib/site-config";
import { JsonLd } from "@/components/seo/json-ld";
import { FioRail } from "@/components/brand/fio-rail";
import { Hero } from "@/components/sections/hero";
import { HeroStatement } from "@/components/sections/hero-statement";
import { TreatmentsSection } from "@/components/sections/treatments-section";
import { DeclarationSection } from "@/components/sections/declaration-section";
import { AboutPreview } from "@/components/sections/about-preview";
import { AreasSection } from "@/components/sections/areas-section";
import { HowItWorks } from "@/components/sections/how-it-works";
import { LocationSection } from "@/components/sections/location-section";
import { FAQSection } from "@/components/sections/faq-section";
import { CTASection } from "@/components/sections/cta-section";

// Título de 58 caracteres com o bairro; `buildMetadata` reconhece a marca ("Dra. Ana Beatriz")
// e não a repete. Sem meta keywords (o Google as ignora). Lugar sempre vem de `locale`.
export const metadata: Metadata = buildMetadata({
  title: `Dentista na ${locale.regiao} (${locale.bairro}) | Dra. Ana Beatriz`,
  description: `Dentista particular na ${locale.bairro}, ${localeTexto("regiaoZona")}. Consulta de 40 a 60 minutos, sem pressão. Agende pelo WhatsApp.`,
  path: "/",
});

/** Pontos do trilho editorial (>= 1100px): um por seção da página (9), na ordem do documento; os ids existem nas seções. */
const RAIL = [
  { id: "capa", label: "Capa" },
  { id: "tratamentos", label: "Tratamentos" },
  { id: "declaracao", label: "Declaração" },
  { id: "a-doutora", label: "A doutora" },
  { id: "implante-e-cirurgia", label: "Implante e cirurgia" },
  { id: "como-funciona", label: "Como funciona" },
  { id: "localizacao", label: "Onde" },
  { id: "faq", label: "Dúvidas" },
  { id: "agendar", label: "Agendar" },
];

/** As mesmas 16 perguntas vão para a página (8 à vista, o resto em "Ver todas") e para o JSON-LD. */
const HOME_FAQS = homeFaqs;

/**
 * Home na ordem do roteiro (DESIGN.md 5.1), ritmo osso / papel / noite / osso / papel /
 * verde / osso / papel / noite: capa + declaração, sumário de tratamentos com o seletor de
 * situação, declaração da Dra., a doutora, implante e cirurgia, como funciona,
 * onde estamos, dúvidas e fecho (noite).
 * O trilho vem DEPOIS do conteúdo no DOM (é fixo; o visual não muda).
 */
export default function HomePage() {
  return (
    <>
      <JsonLd data={faqSchema(HOME_FAQS)} />
      <div className="has-rail">
        <Hero>
          <HeroStatement />
        </Hero>
        <TreatmentsSection />
        <DeclarationSection />
        <AboutPreview />
        {/* textos da seção vêm do próprio AreasSection (nomes neutros, sem nome de especialidade) */}
        <AreasSection id="implante-e-cirurgia" tone="papel" compactMobile />
        <HowItWorks />
        <LocationSection />
        <FAQSection items={HOME_FAQS} />
        <CTASection tone="noite" />
      </div>
      <FioRail stops={RAIL} />
    </>
  );
}
