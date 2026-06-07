import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.doctorName} — ${siteConfig.title}`,
    short_name: "Dra. Ana Beatriz",
    description:
      "Odontologia humanizada: avaliação, limpeza, clareamento, prevenção e estética do sorriso.",
    start_url: "/",
    display: "standalone",
    background_color: "#FCFCFC",
    theme_color: "#22513A",
    lang: "pt-BR",
    icons: [
      { src: "/icon", sizes: "64x64", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
      { src: "/brand/symbol.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}
