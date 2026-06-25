import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import { buildMetadata, faqSchema } from "@/lib/seo";
import { homeFaqs } from "@/lib/content";
import { JsonLd } from "@/components/seo/json-ld";
import { Hero } from "@/components/sections/hero";
import { CareNeeds } from "@/components/sections/care-needs";
import { TreatmentsSection } from "@/components/sections/treatments-section";
import { AboutPreview } from "@/components/sections/about-preview";
import { AreasSection } from "@/components/sections/areas-section";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Differentials } from "@/components/sections/differentials";
import { Testimonials } from "@/components/sections/testimonials";
import { LocationSection } from "@/components/sections/location-section";
import { FAQSection } from "@/components/sections/faq-section";
import { CTASection } from "@/components/sections/cta-section";

export const metadata: Metadata = buildMetadata({
  title: `${siteConfig.doctorName} — ${siteConfig.title} em ${siteConfig.city}`,
  description:
    "Odontologia humanizada em [Cidade]: avaliação, limpeza, clareamento, restaurações, prevenção e cirurgia oral. Atendimento acolhedor e planejamento individual. Agende pelo WhatsApp.",
  path: "/",
  keywords: [
    `dentista em ${siteConfig.city}`,
    `clínica odontológica em ${siteConfig.city}`,
    `dentista em ${siteConfig.neighborhood}`,
    "estética do sorriso",
    "odontologia humanizada",
  ],
});

export default function HomePage() {
  return (
    <>
      <JsonLd data={faqSchema(homeFaqs)} />
      <Hero />
      <CareNeeds />
      <TreatmentsSection limit={6} />
      <AboutPreview />
      <AreasSection
        eyebrow="Implante e buco-maxilo"
        title="Tratamentos que pedem técnica e um olhar individual"
        description="Reposição de dentes perdidos e cirurgia buco-maxilo-facial, conduzidas com planejamento, segurança e acompanhamento próximo. Conheça cada uma e dê o primeiro passo."
        className="section-y bg-gradient-to-b from-brand-beige/40 to-brand-bone"
      />
      <HowItWorks />
      <Differentials />
      <Testimonials />
      <LocationSection />
      <FAQSection items={homeFaqs} />
      <CTASection />
    </>
  );
}
