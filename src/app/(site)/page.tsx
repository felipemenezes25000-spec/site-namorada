import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import { buildMetadata, faqSchema } from "@/lib/seo";
import { homeFaqs } from "@/lib/content";
import { JsonLd } from "@/components/seo/json-ld";
import { Hero } from "@/components/sections/hero";
import { TrustBar } from "@/components/sections/trust-bar";
import { TreatmentsSection } from "@/components/sections/treatments-section";
import { AboutPreview } from "@/components/sections/about-preview";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Differentials } from "@/components/sections/differentials";
import { Testimonials } from "@/components/sections/testimonials";
import { LocationSection } from "@/components/sections/location-section";
import { FAQSection } from "@/components/sections/faq-section";
import { CTASection } from "@/components/sections/cta-section";

export const metadata: Metadata = buildMetadata({
  title: `${siteConfig.doctorName} — ${siteConfig.title} em ${siteConfig.city}`,
  description:
    "Odontologia humanizada em [Cidade]: avaliação, limpeza, clareamento, restaurações, prevenção e estética do sorriso. Atendimento acolhedor e planejamento individual. Agende pelo WhatsApp.",
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
      <TrustBar />
      <TreatmentsSection />
      <AboutPreview />
      <HowItWorks />
      <Differentials />
      <Testimonials />
      <LocationSection />
      <FAQSection items={homeFaqs} />
      <CTASection />
    </>
  );
}
