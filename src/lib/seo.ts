import type { Metadata } from "next";
import { siteConfig, locale, localeTexto } from "./site-config";
import { treatments } from "./treatments";
import { CONTENT_UPDATED, homeFaqs } from "./content";

export function absoluteUrl(path = ""): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.url}${clean === "/" ? "" : clean}`;
}

/** Detecta valores ainda em placeholder (entre colchetes). */
export function isPlaceholder(value?: string): boolean {
  return !value || /\[.*\]/.test(value);
}

/** Rede de segurança: nenhum colchete de texto-modelo chega ao HTML. Os textos já nascem sem marcador. */
export function localize(text: string): string {
  return text.replace(/\s*\[[^\]]*\]/g, "");
}

/* ------------------------- imagem de compartilhamento ------------------------- */

/**
 * Imagem Open Graph/Twitter: UM só arquivo (`src/app/opengraph-image.jpg`, 1200x630), citado aqui
 * e só aqui (o layout raiz e `buildMetadata` leem esta constante). O texto alternativo do arquivo
 * (`opengraph-image.alt.txt`) repete `alt`.
 */
export const ogImage = {
  path: "/opengraph-image.jpg",
  width: 1200,
  height: 630,
  alt: `${siteConfig.doctorName}, ${siteConfig.title.toLowerCase()} (${siteConfig.cro}). Dentista particular na ${localeTexto("bairroRegiaoCidade")}.`,
} as const;

/** Foto da Dra. exibida em /sobre (menos de 300 kB): imagem do Person e do Dentist no JSON-LD. */
const FOTO_DRA = "/dra-ana-trajetoria.jpg";
/** Logo leve (512 px, menos de 100 kB) para o JSON-LD. */
const LOGO = "/brand/logo-512.png";

/* ------------------------------- metadados ------------------------------- */

type MetaBase = {
  description: string;
  path?: string;
  /** Obsoleto: o Google ignora meta keywords. Aceito até as páginas pararem de passar; NÃO é emitido. */
  keywords?: string[];
  noindex?: boolean;
};

/**
 * Título: ou `title` (a marca curta é acrescentada quando o título não a cita) ou `absoluteTitle`
 * (vale exatamente como escrito, sem acréscimo). Em qualquer caso `<title>`, `og:title` e
 * `twitter:title` são o MESMO texto.
 */
type MetaInput = MetaBase &
  (
    | { title: string; absoluteTitle?: string }
    | { absoluteTitle: string; title?: string }
  );

/** Marca curta no fim do título (o nome completo estoura os 60 caracteres). */
const brandSuffix = siteConfig.doctorFirstName;

/** O título já cita a marca? Evita "… | Dra. Ana Beatriz | Dra. Ana Beatriz Lemos Souza". */
function hasBrand(title: string): boolean {
  return title.includes(siteConfig.doctorName) || title.includes(siteConfig.doctorFirstName);
}

export function buildMetadata({
  title,
  absoluteTitle,
  description,
  path = "/",
  noindex = false,
}: MetaInput): Metadata {
  const url = absoluteUrl(path);
  const locDescription = localize(description);
  let fullTitle: string;
  if (absoluteTitle) {
    fullTitle = localize(absoluteTitle);
  } else {
    const locTitle = localize(title ?? "");
    fullTitle = hasBrand(locTitle) ? locTitle : `${locTitle} | ${brandSuffix}`;
  }
  const imageUrl = absoluteUrl(ogImage.path);

  return {
    // `absolute` evita que o template do layout raiz duplique a marca no título.
    title: { absolute: fullTitle },
    description: locDescription,
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
      // Declarada explicitamente: a convenção de arquivo (src/app/opengraph-image.jpg)
      // não injeta a meta tag no HTML em produção quando openGraph é sobrescrito por página.
      images: [{ url: imageUrl, width: ogImage.width, height: ogImage.height, alt: ogImage.alt }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: locDescription,
      images: [imageUrl],
    },
  };
}

/* ----------------------------- JSON-LD ----------------------------- */

// Horário de atendimento e avaliações: não são emitidos no schema (não há dado real em siteConfig).
// Pagamento: também não (Código de Ética Odontológica, art. 44, I).

const ID = {
  dentist: `${siteConfig.url}/#dentist`,
  person: `${siteConfig.url}/#person`,
  website: `${siteConfig.url}/#website`,
};

/** Assuntos da profissional, só o que o site já apresenta. */
const KNOWS_ABOUT = [
  "Odontologia",
  "Saúde bucal",
  "Prevenção odontológica",
  "Clareamento dental",
  "Estética do sorriso",
  "Cirurgia oral",
  "Implante dentário",
];

/** Schema principal: Dentist + LocalBusiness. Sem preço e sem aggregateRating (não há avaliações reais). */
export function dentistSchema() {
  const { address } = siteConfig;
  const lat = Number.parseFloat(address.geo.lat);
  const lng = Number.parseFloat(address.geo.lng);
  const geo =
    Number.isFinite(lat) && Number.isFinite(lng)
      ? { geo: { "@type": "GeoCoordinates", latitude: lat, longitude: lng } }
      : {};

  // Só localidades que já constam no site (endereço e SEO local).
  const areaServed = [locale.bairro, locale.regiao, "Zona Norte"].map((name) => ({
    "@type": "AdministrativeArea",
    name: `${name}, ${locale.cidade}`,
  }));

  const hasPhone = !isPlaceholder(siteConfig.phoneDisplay);

  return {
    "@context": "https://schema.org",
    "@type": "Dentist",
    "@id": ID.dentist,
    name: siteConfig.doctorName,
    description: localize(
      `${siteConfig.title} com consultório na ${locale.bairro}, ${localeTexto("regiaoZona")}, em atendimento particular. ${siteConfig.focus}`,
    ),
    url: siteConfig.url,
    image: absoluteUrl(FOTO_DRA),
    logo: absoluteUrl(LOGO),
    ...(hasPhone ? { telephone: `+${siteConfig.phone}` } : {}),
    ...(isPlaceholder(siteConfig.email) ? {} : { email: siteConfig.email }),
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
    areaServed,
    ...(hasPhone
      ? {
          contactPoint: {
            "@type": "ContactPoint",
            telephone: `+${siteConfig.phone}`,
            contactType: "reservations",
            availableLanguage: "pt-BR",
          },
        }
      : {}),
    potentialAction: {
      "@type": "ReserveAction",
      name: "Agendar avaliação odontológica",
      target: {
        "@type": "EntryPoint",
        urlTemplate: absoluteUrl("/agendamento"),
        inLanguage: "pt-BR",
        actionPlatform: [
          "https://schema.org/DesktopWebPlatform",
          "https://schema.org/MobileWebPlatform",
        ],
      },
    },
    founder: { "@id": ID.person },
    employee: { "@id": ID.person },
    knowsAbout: KNOWS_ABOUT,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Tratamentos odontológicos",
      itemListElement: treatments.map((t) => ({
        "@type": "Service",
        name: t.name,
        url: absoluteUrl(`/tratamentos/${t.slug}`),
      })),
    },
    sameAs: [siteConfig.instagramUrl].filter((u) => !isPlaceholder(u)),
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

/**
 * Perguntas que NÃO se repetem em `homeFaqs`. O Google pede FAQPage só com conteúdo exclusivo da
 * página; a página decide: `const ex = exclusiveFaqs(faqs); ex.length > 0 && faqSchema(ex)`.
 * A lista visível continua inteira; só o JSON-LD usa o recorte.
 */
export function exclusiveFaqs<T extends { q: string }>(items: readonly T[]): T[] {
  const shared = new Set(homeFaqs.map((f) => f.q));
  return items.filter((i) => !shared.has(i.q));
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

/**
 * Página de conteúdo informativo (tratamentos e páginas de apoio). `dateModified` é a MESMA data
 * da linha visível `<AuthorshipLine updatedAt />` (padrão `CONTENT_UPDATED`): passe a mesma aos dois.
 * `author` aponta para o `@id` do Person e leva o nome, porque o Person completo só está em /sobre.
 * Sem `reviewedBy`: o texto visível diz "elaborado pela", nunca "revisado clinicamente".
 */
export function medicalWebPageSchema({
  path,
  name,
  description,
  updatedAt = CONTENT_UPDATED,
}: {
  path: string;
  name: string;
  description: string;
  updatedAt?: string;
}) {
  const url = absoluteUrl(path);
  return {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "@id": `${url}#webpage`,
    url,
    name: localize(name),
    description: localize(description),
    inLanguage: "pt-BR",
    dateModified: updatedAt,
    isPartOf: { "@id": ID.website },
    publisher: { "@id": ID.dentist },
    author: {
      "@type": "Person",
      "@id": ID.person,
      name: siteConfig.doctorName,
      url: absoluteUrl("/sobre"),
    },
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": ID.website,
    name: siteConfig.doctorName,
    url: siteConfig.url,
    inLanguage: "pt-BR",
    publisher: { "@id": ID.dentist },
  };
}

/** Schema da profissional (Person) — autoridade E-E-A-T para o Google. */
export function personSchema(opts?: { sameAs?: string[]; alumniOf?: string[] }) {
  const sameAs = [siteConfig.instagramUrl, siteConfig.lattesUrl, ...(opts?.sameAs ?? [])].filter(
    (u, i, all) => !isPlaceholder(u) && all.indexOf(u) === i,
  );
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": ID.person,
    name: siteConfig.doctorName,
    jobTitle: siteConfig.title,
    description: localize(
      `${siteConfig.title} (${siteConfig.cro}) com consultório na ${locale.bairro}, ${localeTexto("regiaoZona")}.`,
    ),
    image: absoluteUrl(FOTO_DRA),
    url: absoluteUrl("/sobre"),
    worksFor: { "@id": ID.dentist },
    knowsAbout: KNOWS_ABOUT,
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
        provider: { "@id": ID.dentist },
      },
    })),
  };
}
