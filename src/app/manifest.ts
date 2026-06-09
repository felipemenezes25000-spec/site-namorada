import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.doctorName} — ${siteConfig.title}`,
    short_name: "Dra. Ana Beatriz",
    description:
      "Odontologia humanizada: avaliação, limpeza, clareamento, prevenção, restaurações e cirurgia oral.",
    start_url: "/",
    display: "standalone",
    background_color: "#FCFCFC",
    theme_color: "#22513A",
    lang: "pt-BR",
    icons: [
      { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/brand/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
