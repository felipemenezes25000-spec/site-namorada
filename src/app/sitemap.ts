import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { treatmentSlugs } from "@/lib/treatments";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  // Data fixa para build determinístico — atualize manualmente se desejar.
  const lastModified = new Date("2026-06-08");

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/sobre`, lastModified, changeFrequency: "yearly", priority: 0.8 },
    { url: `${base}/tratamentos`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/agendamento`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/contato`, lastModified, changeFrequency: "yearly", priority: 0.7 },
    { url: `${base}/politica-de-privacidade`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/termos-de-uso`, lastModified, changeFrequency: "yearly", priority: 0.3 },
  ];

  const treatmentRoutes: MetadataRoute.Sitemap = treatmentSlugs.map((slug) => ({
    url: `${base}/tratamentos/${slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...treatmentRoutes];
}
