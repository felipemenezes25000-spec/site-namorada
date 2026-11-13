import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

/**
 * /obrigado fica FORA do Disallow de propósito: o robots.txt impede o rastreio, mas não a
 * indexação por link externo, e um Disallow esconde do Google o `noindex` da própria página.
 * A página já responde com `noindex`, que é o que de fato a tira do índice.
 * Sem a diretiva `Host`: é do Yandex, o Google a ignora.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/"],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
