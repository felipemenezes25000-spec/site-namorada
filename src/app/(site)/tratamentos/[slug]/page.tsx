import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { treatments, getTreatment, hasCareNotes, treatmentSlugs } from "@/lib/treatments";
import { siteConfig } from "@/lib/site-config";
import { CONTENT_UPDATED } from "@/lib/content";
import { buildMetadata, breadcrumbSchema, faqSchema, absoluteUrl } from "@/lib/seo";
import { waMessages } from "@/lib/whatsapp";
import { JsonLd } from "@/components/seo/json-ld";
import { FioRail, type RailStop } from "@/components/brand/fio-rail";
import type { SectionTone } from "@/components/ui/section";
import { FAQSection } from "@/components/sections/faq-section";
import { TratamentoFecho } from "@/components/sections/tratamento-fecho";
import { TratamentoAbertura } from "@/components/sections/tratamento-abertura";
import { TratamentoDetalhes, TratamentoPassos } from "@/components/sections/tratamento-conteudo";
import { TratamentoCuidados } from "@/components/sections/tratamento-cuidados";
import { AuthorshipLine } from "@/components/ui/authorship-line";
import { TratamentoValores } from "@/components/sections/tratamento-valores";
import { TratamentoRegiao } from "@/components/sections/tratamento-regiao";
import { TratamentoOutros } from "@/components/sections/tratamento-outros";
import fecho from "@/components/sections/tratamento-fecho.module.css";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return treatmentSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const t = getTreatment(slug);
  if (!t) return buildMetadata({ title: "Tratamento", description: "Tratamento odontológico." });
  // `metaTitle` já traz o bairro e a marca curta (até 60 caracteres): vale exatamente como escrito.
  return buildMetadata({
    absoluteTitle: t.metaTitle,
    description: t.metaDescription,
    path: `/tratamentos/${t.slug}`,
  });
}

/** Frases do schema: cada item termina em ponto e os itens se separam por espaço. */
function frases(itens: string[]): string {
  return itens.map((i) => `${i.trim().replace(/[.;:,]+$/, "")}.`).join(" ");
}

/**
 * /tratamentos/[slug] (DESIGN.md 5.4): abertura de capítulo, o tratamento em três faixas com legenda
 * na margem (com "Limites" depois de "Para quem é indicado", nos tratamentos que o têm), passos,
 * "o que considerar com cuidado" (só os campos que existem), valores e região em faixas compactas,
 * dúvidas, "Leia também" com a autoria e o fecho. O ritmo de tons alterna papel/osso conforme as
 * seções que existem; a única seção escura é o fecho. O trilho vem depois do conteúdo.
 */
export default async function TreatmentPage({ params }: { params: Params }) {
  const { slug } = await params;
  const t = getTreatment(slug);
  if (!t) notFound();

  const index = treatments.findIndex((x) => x.slug === t.slug);
  const message = waMessages.treatment(t.name.toLowerCase());
  const comLimite = t.layout === "limite" && Boolean(t.notFor);
  // com o limite em declaração, `notFor` não se repete em "O que considerar com cuidado"
  const notForNoCuidado = comLimite ? undefined : t.notFor;
  const cuidados =
    hasCareNotes(t) &&
    Boolean(
      notForNoCuidado ||
        t.contraindications?.length ||
        t.preparation?.length ||
        t.aftercare?.length ||
        t.warningSigns?.length,
    );

  // alterna papel / osso a partir da seção logo depois da abertura (osso)
  let flip = 0;
  const tone = (): SectionTone => (flip++ % 2 === 0 ? "papel" : "osso");
  const tDetalhes = tone();
  const tPassos = tone();
  const tCuidados = cuidados ? tone() : undefined;
  const tValores = tone();
  const tRegiao = tone();
  const tDuvidas = tone();
  const tOutros = tone();

  const rail: RailStop[] = [
    { id: "capitulo", label: "Capítulo" },
    { id: "tratamento", label: "O tratamento" },
    ...(comLimite ? [{ id: "limite", label: "Limites" }] : []),
    { id: "passos", label: "Passos" },
    ...(cuidados ? [{ id: "cuidados", label: "Cuidados" }] : []),
    { id: "duvidas", label: "Dúvidas" },
  ];

  const medicalSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: t.name,
    description: t.metaDescription,
    url: absoluteUrl(`/tratamentos/${t.slug}`),
    inLanguage: "pt-BR",
    // mesma data e mesma autoria que a linha visível no fim do conteúdo (<AuthorshipLine />)
    dateModified: CONTENT_UPDATED,
    author: { "@type": "Person", "@id": `${siteConfig.url}/#person`, name: siteConfig.doctorName },
    about: {
      "@type": "MedicalProcedure",
      name: t.name,
      description: t.what,
      bodyLocation: "Cavidade oral",
      howPerformed: frases(t.steps.map((st) => `${st.title}: ${st.description}`)),
      ...(t.preparation?.length ? { preparation: frases(t.preparation) } : {}),
      ...(t.aftercare?.length ? { followup: frases(t.aftercare.map((c) => `${c.title}: ${c.description}`)) } : {}),
    },
    provider: { "@type": "Dentist", name: siteConfig.doctorName, "@id": `${siteConfig.url}/#dentist` },
  };

  return (
    <>
      <JsonLd
        data={[
          medicalSchema,
          // a MESMA lista vai ao <FAQSection> e ao JSON-LD
          faqSchema(t.faqs),
          breadcrumbSchema([
            { name: "Início", path: "/" },
            { name: "Tratamentos", path: "/tratamentos" },
            { name: t.name, path: `/tratamentos/${t.slug}` },
          ]),
        ]}
      />

      <div className="has-rail">
        <TratamentoAbertura
          slug={t.slug}
          name={t.name}
          n={index + 1}
          intro={t.intro}
          duration={t.duration}
          sessions={t.sessions}
          message={message}
        />
        <TratamentoDetalhes
          tone={tDetalhes}
          what={t.what}
          forWhom={t.forWhom}
          benefits={t.benefits}
          colunas={t.layout === "colunas"}
          limite={comLimite ? t.notFor : undefined}
        />
        <TratamentoPassos tone={tPassos} steps={t.steps} message={message} linha={t.layout === "linha"} />
        {cuidados && tCuidados && (
          <TratamentoCuidados
            tone={tCuidados}
            notFor={notForNoCuidado}
            contraindications={t.contraindications}
            preparation={t.preparation}
            aftercare={t.aftercare}
            warningSigns={t.warningSigns}
            message={message}
          />
        )}
        <TratamentoValores tone={tValores} texto={t.valores} />
        <TratamentoRegiao tone={tRegiao} texto={t.onde} />
        <FAQSection
          id="duvidas"
          tone={tDuvidas}
          items={t.faqs}
          eyebrow="Dúvidas sobre o tratamento"
          title={`Perguntas sobre ${t.name.toLowerCase()}`}
          whatsappMessage={message}
        />
        <TratamentoOutros
          tone={tOutros}
          items={t.related.map(({ slug: s, label }) => ({
            slug: s,
            label,
            shortName: getTreatment(s)?.shortName ?? label,
          }))}
        >
          <p className={fecho.aviso}>
            Este conteúdo é informativo e não substitui uma avaliação clínica: indicações e cuidados variam de
            pessoa para pessoa e são definidos após exame presencial.
          </p>
          <AuthorshipLine className={fecho.autoria} />
        </TratamentoOutros>
        <TratamentoFecho slug={t.slug} message={message} />
      </div>
      <FioRail stops={rail} />
    </>
  );
}
