import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";
import { treatmentSlugs } from "@/lib/treatments";
import { CONTENT_UPDATED, PRIVACY_POLICY_VERSION, TERMS_VERSION } from "@/lib/content";

/**
 * Sem `changeFrequency` e `priority`: o Google os ignora. O <loc> de cada página sai de
 * `absoluteUrl` (a mesma função do canonical em `buildMetadata`), então os dois são idênticos
 * (a home, sem barra final). `lastmod` = data de atualização editorial (content.ts) ou a versão
 * do documento legal. Datas fixas: o build é determinístico. Só mude a constante quando o texto
 * mudar de verdade.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(CONTENT_UPDATED);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified },
    { url: absoluteUrl("/sobre"), lastModified },
    { url: absoluteUrl("/tratamentos"), lastModified },
    { url: absoluteUrl("/urgencia-odontologica"), lastModified },
    { url: absoluteUrl("/primeira-consulta"), lastModified },
    { url: absoluteUrl("/medo-de-dentista"), lastModified },
    { url: absoluteUrl("/agendamento"), lastModified },
    { url: absoluteUrl("/valores"), lastModified },
    { url: absoluteUrl("/contato"), lastModified },
    { url: absoluteUrl("/politica-de-privacidade"), lastModified: new Date(PRIVACY_POLICY_VERSION) },
    { url: absoluteUrl("/termos-de-uso"), lastModified: new Date(TERMS_VERSION) },
  ];

  const treatmentRoutes: MetadataRoute.Sitemap = treatmentSlugs.map((slug) => ({
    url: absoluteUrl(`/tratamentos/${slug}`),
    lastModified,
  }));

  return [...staticRoutes, ...treatmentRoutes];
}
