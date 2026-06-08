import type { Metadata } from "next";
import { siteConfig } from "./site-config";

export function absoluteUrl(path = ""): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.url}${clean === "/" ? "" : clean}`;
}

/** Detecta valores ainda em placeholder (entre colchetes). */
export function isPlaceholder(value?: string): boolean {
  return !value || /\[.*\]/.test(value);
}

/**
 * Substitui marcadores de cidade/bairro pelos valores reais do site-config.
 * Mantém os textos prontos para SEO local sem precisar editar arquivo a arquivo.
 */
export function localize(text: string): string {
  const city = isPlaceholder(siteConfig.city) ? null : siteConfig.city;
  const hood = isPlaceholder(siteConfig.neighborhood) ? null : siteConfig.neighborhood;
  let out = text;
  if (city) out = out.replaceAll("[Cidade]", city).replaceAll("[cidade]", city.toLowerCase());
  if (hood) out = out.replaceAll("[Bairro]", hood).replaceAll("[bairro]", hood.toLowerCase());
  return out;
}

interface MetaInput {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  noindex?: boolean;
}

const brandSuffix = siteConfig.doctorName;

export function buildMetadata({
  title,
  description,
  path = "/",
  keywords = [],
  noindex = false,
}: MetaInput): Metadata {
  const url = absoluteUrl(path);
  const locTitle = localize(title);
  const locDescription = localize(description);
  const fullTitle = locTitle.includes(siteConfig.doctorName)
    ? locTitle
    : `${locTitle} | ${brandSuffix}`;

  return {
    // `absolute` evita que o template do layout raiz duplique a marca no título.
    title: { absolute: fullTitle },
    description: locDescription,
    keywords: keywords.length ? keywords.map(localize) : undefined,
    alternates: { canonical: url },
    robots: noindex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      url,
      siteName: siteConfig.doctorName,
      title: fullTitle,
      description: locDescription,
      // A imagem é injetada automaticamente por src/app/opengraph-image.tsx
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: locDescription,
    },
  };
}

/* ----------------------------- JSON-LD ----------------------------- */

/** Schema principal: Dentist + LocalBusiness. */
export function dentistSchema() {
  const { address } = siteConfig;
  const geo =
    address.geo.lat && address.geo.lng
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: address.geo.lat,
            longitude: address.geo.lng,
          },
        }
      : {};

  return {
    "@context": "https://schema.org",
    "@type": "Dentist",
    "@id": `${siteConfig.url}/#dentist`,
    name: siteConfig.doctorName,
    description: localize(siteConfig.focus),
    url: siteConfig.url,
    image: absoluteUrl("/brand/logo-vertical-bg.png"),
    logo: absoluteUrl("/brand/symbol.png"),
    ...(isPlaceholder(siteConfig.phoneDisplay) ? {} : { telephone: `+${siteConfig.phone}` }),
    ...(isPlaceholder(siteConfig.email) ? {} : { email: siteConfig.email }),
    priceRange: "$$",
    medicalSpecialty: "Dentistry",
    address: {
      "@type": "PostalAddress",
      streetAddress: address.street,
      addressLocality: address.city,
      addressRegion: siteConfig.state,
      postalCode: address.zip,
      addressCountry: "BR",
    },
    ...geo,
    hasMap: address.mapsDirectionsUrl,
    areaServed: localize(siteConfig.region),
    sameAs: [siteConfig.instagramUrl].filter((u) => !isPlaceholder(u)),
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "19:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday"],
        opens: "09:00",
        closes: "13:00",
      },
    ],
  };
}

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: localize(i.a) },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    name: siteConfig.doctorName,
    url: siteConfig.url,
    inLanguage: "pt-BR",
    publisher: { "@id": `${siteConfig.url}/#dentist` },
  };
}

/** Schema da profissional (Person) — autoridade E-E-A-T para o Google. */
export function personSchema(opts?: { sameAs?: string[]; alumniOf?: string[] }) {
  const sameAs = [siteConfig.instagramUrl, ...(opts?.sameAs ?? [])].filter(
    (u) => !isPlaceholder(u),
  );
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteConfig.url}/#person`,
    name: siteConfig.doctorName,
    jobTitle: siteConfig.title,
    description: localize(siteConfig.focus),
    image: absoluteUrl("/dra-ana.webp"),
    url: absoluteUrl("/sobre"),
    worksFor: { "@id": `${siteConfig.url}/#dentist` },
    knowsAbout: [
      "Odontologia",
      "Cirurgia oral",
      "Clareamento dental",
      "Prevenção odontológica",
      "Estética do sorriso",
    ],
    ...(opts?.alumniOf?.length
      ? { alumniOf: opts.alumniOf.map((name) => ({ "@type": "EducationalOrganization", name })) }
      : {}),
    ...(sameAs.length ? { sameAs } : {}),
    hasCredential: {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "Registro profissional",
      name: siteConfig.cro,
    },
  };
}

/** Catálogo de serviços/procedimentos — ajuda o Google a entender a oferta. */
export function servicesSchema(items: { name: string; slug: string; excerpt: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Tratamentos odontológicos — ${siteConfig.doctorName}`,
    itemListElement: items.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "MedicalProcedure",
        name: t.name,
        description: localize(t.excerpt),
        url: absoluteUrl(`/tratamentos/${t.slug}`),
        provider: { "@id": `${siteConfig.url}/#dentist` },
      },
    })),
  };
}
