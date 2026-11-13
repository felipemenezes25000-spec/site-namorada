import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";
import { treatmentSlugs } from "@/lib/treatments";
import { CONTENT_UPDATED, PRIVACY_POLICY_VERSION, TERMS_VERSION } from "@/lib/content";

/**
 * Sem `changeFrequency` e `priority`: o Google os ignora. O <loc> de cada página sai de
 * `absoluteUrl` (a mesma função do canonical em `buildMetadata`), então os dois são idênticos
 * (a home, sem barra final).
 *
 * `lastmod` só onde a página mostra a data: conteúdo informativo (tratamentos e páginas de apoio,
 * "Atualizado em", `CONTENT_UPDATED`) e documentos legais (versão do texto). Páginas sem data
 * visível (home, sobre, índice de tratamentos, agendamento, contato) vão sem `lastmod`: o Google só
 * confia no campo quando ele bate com a página. Datas fixas: o build é determinístico.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const conteudo = new Date(CONTENT_UPDATED);

  const semData: MetadataRoute.Sitemap = [
    "/",
    "/sobre",
    "/tratamentos",
    "/agendamento",
    "/contato",
  ].map((path) => ({ url: absoluteUrl(path) }));

  const comData: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/urgencia-odontologica"), lastModified: conteudo },
    { url: absoluteUrl("/primeira-consulta"), lastModified: conteudo },
    { url: absoluteUrl("/medo-de-dentista"), lastModified: conteudo },
    { url: absoluteUrl("/valores"), lastModified: conteudo },
    {
      url: absoluteUrl("/politica-de-privacidade"),
      lastModified: new Date(PRIVACY_POLICY_VERSION),
    },
    { url: absoluteUrl("/termos-de-uso"), lastModified: new Date(TERMS_VERSION) },
  ];

  const treatmentRoutes: MetadataRoute.Sitemap = treatmentSlugs.map((slug) => ({
    url: absoluteUrl(`/tratamentos/${slug}`),
    lastModified: conteudo,
  }));

  return [...semData, ...comData, ...treatmentRoutes];
}
