import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/site-config";
import { Analytics } from "@/components/seo/analytics";
import { CookieConsent } from "@/components/seo/cookie-consent";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.doctorName} — ${siteConfig.title} em ${siteConfig.city}`,
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
        url: `${siteConfig.url}/opengraph-image.png`,
        width: 1200,
        height: 630,
        alt: `${siteConfig.doctorName} — ${siteConfig.title}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [`${siteConfig.url}/opengraph-image.png`],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#22513A",
  width: "device-width",
  initialScale: 1,
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${cormorant.variable} ${montserrat.variable}`}>
      <body className="min-h-screen bg-brand-bone font-sans text-brand-ink antialiased">
        {children}
        <CookieConsent />
        <Analytics />
      </body>
    </html>
  );
}
