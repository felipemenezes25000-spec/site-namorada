import type { Metadata } from "next";
import { siteConfig, locale, localeTexto } from "@/lib/site-config";
import { buildMetadata, breadcrumbSchema, personSchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { FioRail } from "@/components/brand/fio-rail";
import { SobreHero } from "@/components/sections/sobre-hero";
import { SobreEnsaio } from "@/components/sections/sobre-ensaio";
import { SobreFormacao } from "@/components/sections/sobre-formacao";
import { AreasSection } from "@/components/sections/areas-section";
import { SobreConsultorio } from "@/components/sections/sobre-consultorio";
import { CTASection } from "@/components/sections/cta-section";

const TITLE = "Sobre a Dra. Ana Beatriz | Dentista na Freguesia do Ó";

// `buildMetadata` acrescenta o sufixo da marca quando o nome completo não está no título;
// aqui o título já é o padrão do DESIGN.md 6.4 (53 caracteres), então ele é fixado por cima.
const base = buildMetadata({
  title: TITLE,
  description: `Conheça a ${siteConfig.doctorName}, cirurgiã-dentista (${siteConfig.cro}). Atendimento na ${localeTexto("bairroRegiao")}, ${locale.zona}.`,
  path: "/sobre",
});

export const metadata: Metadata = {
  ...base,
  title: { absolute: TITLE },
  openGraph: { ...base.openGraph, title: TITLE },
  twitter: { ...base.twitter, title: TITLE },
};

const lattesUrl = "https://lattes.cnpq.br/3767606004982701";

/** Pontos do trilho (>= 1100px): um por seção da página, na ordem do documento. */
const RAIL = [
  { id: "abertura", label: "Abertura" },
  { id: "trajetoria", label: "Trajetória" },
  { id: "formacao", label: "Formação" },
  { id: "consultorio", label: "Consultório" },
  { id: "agendar", label: "Agendar" },
];

/**
 * /sobre (DESIGN.md 5.2): a página que convence pela pessoa. Ritmo de tons
 * osso (abertura) / papel (ensaio) / osso (formação, com um fecho curto) / papel (áreas, em linha) /
 * noite (consultório, endereço e mapa) / osso (fecho). O trilho vem DEPOIS do conteúdo no DOM.
 */
export default function SobrePage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Início", path: "/" },
            { name: "Sobre", path: "/sobre" },
          ]),
          personSchema({
            sameAs: [lattesUrl],
            alumniOf: ["Centro Universitário Estácio de Brasília", "São Leopoldo Mandic"],
          }),
        ]}
      />
      <div className="has-rail">
        <SobreHero />
        <SobreEnsaio />
        <SobreFormacao />
        <AreasSection variant="line" tone="papel" id="areas" />
        <SobreConsultorio />
        <CTASection />
      </div>
      <FioRail stops={RAIL} />
    </>
  );
}
