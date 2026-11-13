import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import { siteConfig, themeColor } from "@/lib/site-config";
import { ogImage, ogImageUrl } from "@/lib/seo";
import { Analytics } from "@/components/seo/analytics";
import { CookieConsent } from "@/components/seo/cookie-consent";
import { SkipLink } from "@/components/seo/skip-link";

// Única família display e única sans do site (DESIGN.md 2.2).
// Orçamento: <= 150 kB, 3 arquivos (romano + itálico da Bodoni e a Hanken variável).
const display = Bodoni_Moda({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"], // eixo óptico 6..96; peso variável (omitimos "weight")
  display: "swap",
  variable: "--font-display",
  // Sem "Bodoni 72": o next/font não coloca aspas e o nome com número invalida a declaração inteira.
  fallback: ["Didot", "Georgia", "serif"],
});

const sans = Hanken_Grotesk({
  subsets: ["latin"], // peso variável; usamos 400, 500 e 600
  display: "swap",
  variable: "--font-sans",
  fallback: ["system-ui", "-apple-system", "Segoe UI", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.doctorName} — ${siteConfig.title}`,
    template: `%s | ${siteConfig.doctorName}`,
  },
  description:
    "Odontologia humanizada com foco em saúde bucal, prevenção e cirurgia oral. Avaliação, limpeza, clareamento, restaurações e mais. Agende pelo WhatsApp.",
  applicationName: siteConfig.doctorName,
  authors: [{ name: siteConfig.doctorName }],
  creator: siteConfig.doctorName,
  formatDetection: { telephone: true, address: true, email: true },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: siteConfig.doctorName,
    images: [
      {
        url: ogImageUrl(),
        width: ogImage.width,
        height: ogImage.height,
        alt: ogImage.alt,
        type: ogImage.type,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [ogImageUrl()],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor,
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "light",
};

// Marca o <html> como "com JavaScript" antes da pintura: só então os fios
// começam recolhidos para se desenharem ao entrar na tela (nunca acima da dobra).
// Trava de segurança: se a hidratação não acontecer em 5s, `reveal-off` mostra os fios inteiros.
// Quem já decidiu sobre os cookies ganha `consent-set` aqui mesmo: o aviso, que vem aberto no HTML,
// fica escondido desde a primeira pintura (sem piscar) e a barra do celular aparece (cookie-consent.tsx).
const SCRIPT_JS =
  "var d=document.documentElement;d.classList.add('js');window.__rv=setTimeout(function(){d.classList.add('reveal-off')},5000);try{var c=localStorage.getItem('abl_cookie_consent');if(c==='accepted'||c==='declined')d.classList.add('consent-set')}catch(e){}";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_JS }} />
      </head>
      <body className="min-h-screen">
        <SkipLink />
        {/* Região de cookies: logo depois do link de pular, no DOM (posição visual fixa). */}
        <CookieConsent />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
