import type { Metadata } from "next";
import { treatments } from "@/lib/treatments";
import { situations } from "@/lib/situations";
import { siteConfig, locale } from "@/lib/site-config";
import { buildMetadata, breadcrumbSchema, servicesSchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { TratamentoCapa } from "@/components/sections/tratamento-capa";
import { TratamentoSumario } from "@/components/sections/tratamento-sumario";
import { CTASection } from "@/components/sections/cta-section";
import { SituationSelector } from "@/components/sections/situation-selector";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import styles from "@/components/sections/tratamento-indice.module.css";
import fecho from "@/components/sections/tratamento-fecho.module.css";

const TITLE = `Tratamentos odontológicos na ${locale.bairro} | ${siteConfig.doctorFirstName}`;
const DESCRIPTION = `Avaliação, limpeza, clareamento, restaurações, prevenção, cirurgia oral, implante e dentes inclusos na ${locale.bairro} (${locale.regiao}).`;

export function generateMetadata(): Metadata {
  // o título já traz o bairro e a marca curta (até 60 caracteres): vale exatamente como escrito
  return buildMetadata({ absoluteTitle: TITLE, description: DESCRIPTION, path: "/tratamentos" });
}

/** Só primitivos vão para as ilhas cliente. */
const items = treatments.map((t) => ({
  slug: t.slug,
  name: t.name,
  shortName: t.shortName,
  excerpt: t.excerpt,
  duration: t.duration,
  sessions: t.sessions,
}));

/**
 * /tratamentos (DESIGN.md 5.3): capa com o "08" em tamanho de cartaz, o sumário em uma coluna com a
 * frase de cada tratamento à vista (sem cartão e sem foto) e, abaixo, o seletor de situação para
 * quem não sabe por onde começar (ele não reordena a lista, que já está acima). Fecho em noite.
 */
export default function TratamentosPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Início", path: "/" },
            { name: "Tratamentos", path: "/tratamentos" },
          ]),
          servicesSchema(
            treatments.map((t) => ({ name: t.name, slug: t.slug, excerpt: t.excerpt })),
          ),
        ]}
      />

      <TratamentoCapa total={treatments.length} />

      <Section
        tone="papel"
        id="sumario"
        aria-labelledby="sumario-titulo"
        className={styles.sumario}
      >
        <Container>
          <div className={styles.situacaoHead}>
            <Eyebrow>Escolha pelo nome</Eyebrow>
            <h2 id="sumario-titulo" className="t-d2">
              Todos os tratamentos
            </h2>
          </div>
          <TratamentoSumario items={items} />
        </Container>
      </Section>

      <Section tone="osso" id="situacao" aria-label="Não sabe por onde começar?">
        <Container>
          <Eyebrow>Sem pressa</Eyebrow>
          <div className={styles.selector}>
            <SituationSelector
              situations={situations}
              heading="Não sabe por onde começar?"
              treatments={items.map(({ slug, name, shortName }) => ({ slug, name, shortName }))}
            />
          </div>
        </Container>
      </Section>

      <CTASection tone="noite" className={fecho.fecho} />
    </>
  );
}
