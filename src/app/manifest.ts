import type { MetadataRoute } from "next";
import { siteConfig, themeColor, localeTexto } from "@/lib/site-config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.doctorName} — ${siteConfig.title}`,
    short_name: "Dra. Ana Beatriz",
    description: `Dentista particular na ${localeTexto("bairroRegiaoCidade")}. Agende pelo WhatsApp.`,
    start_url: "/",
    display: "standalone",
    // Mesma cor do `viewport.themeColor` (layout raiz): uma constante só, em site-config.ts.
    background_color: themeColor,
    theme_color: themeColor,
    lang: "pt-BR",
    icons: [
      { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/brand/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
