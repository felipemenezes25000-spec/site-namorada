import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const isDev = process.env.NODE_ENV !== "production";
// Na Vercel, só o ambiente de produção redireciona os endereços *.vercel.app para o domínio oficial;
// deploys de preview ficam acessíveis para teste (a Vercel já os marca como noindex).
const isVercelProduction = process.env.VERCEL_ENV === "production";

// Domínio oficial: em produção, qualquer outro host (o apex, por exemplo) recebe noindex.
const CANONICAL_HOST = "www.draanabeatrizodonto.com.br";

// CSP pronta para as tags de medição: os domínios do Google (GTM, GA4, Ads) e da Meta
// já estão liberados, mas nada é carregado enquanto o ID da tag não existir no ambiente
// (ver src/components/seo/analytics.tsx). Só entra domínio que o site usa de fato; a lista
// e o motivo de cada um estão no DESIGN.md (seção de cabeçalhos de segurança).
//
// 'unsafe-inline' em script-src: o Next injeta scripts em linha (dados de hidratação) e o site
// tem JSON-LD e o bootstrap do Consent Mode em linha. Removê-lo exige nonce por requisição
// (middleware), o que torna todas as páginas dinâmicas e desliga o cache estático. Fica assim
// de propósito; tags de terceiros e o mapa só carregam depois do aceite ou do clique.
const GOOGLE_TAGS = [
  "https://www.googletagmanager.com",
  "https://www.google-analytics.com",
  "https://*.google-analytics.com",
  "https://analytics.google.com",
  "https://www.googleadservices.com",
  "https://googleads.g.doubleclick.net",
  "https://*.doubleclick.net",
  "https://www.google.com",
];
const META_TAGS = ["https://connect.facebook.net", "https://www.facebook.com"];

const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "form-action 'self'",
  // 'unsafe-eval' só em desenvolvimento: o recarregamento do React (Fast Refresh) depende de eval.
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} ${[
    "https://www.googletagmanager.com",
    "https://www.google-analytics.com",
    "https://www.googleadservices.com",
    "https://googleads.g.doubleclick.net",
    "https://connect.facebook.net",
  ].join(" ")}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: ${[...GOOGLE_TAGS, ...META_TAGS].join(" ")}`,
  "font-src 'self' data:",
  `connect-src 'self' ${[...GOOGLE_TAGS, ...META_TAGS].join(" ")}`,
  `frame-src https://www.google.com https://maps.google.com https://www.googletagmanager.com https://td.doubleclick.net https://bid.g.doubleclick.net`,
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  // Isola a janela do site sem quebrar links que abrem em nova aba/popup (WhatsApp, mapa).
  { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
  { key: "Content-Security-Policy", value: csp },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Sem o "N" do Next sobre o canto da barra de ações durante o desenvolvimento e nas capturas.
  devIndicators: false,
  outputFileTracingRoot: __dirname,
  images: {
    formats: ["image/avif", "image/webp"],
    // Qualidades usadas pelos <Image> do site (lista exigida a partir do Next 16).
    qualities: [72, 75],
    // Variantes otimizadas ficam 30 dias no cache da plataforma.
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  async redirects() {
    if (!isVercelProduction) return [];
    return [
      {
        // Aliases .vercel.app (projeto, git-main, deploys) servem o mesmo conteúdo
        // do domínio oficial — redirect 308 evita conteúdo duplicado no Google.
        source: "/:path*",
        has: [{ type: "host", value: "site-namorada(.*)\\.vercel\\.app" }],
        destination: "https://www.draanabeatrizodonto.com.br/:path*",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        // Painel e rotas de API: nunca indexar nem guardar em cache.
        source: "/admin/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
      {
        // Imagens estáticas de public/ (os nomes não levam hash): 1 dia + 7 dias servindo a cópia antiga
        // enquanto revalida. Trocar um arquivo de mesmo nome chega ao visitante em até 1 dia.
        // Inclui /brand: os nomes não levam hash, então nada ali é imutável.
        source: "/:path((?!_next/).*\\.(?:png|jpe?g|webp|avif|svg|ico))",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" },
        ],
      },
      ...(isVercelProduction
        ? [
            {
              // Qualquer host que não seja o oficial (apex, aliases) não deve ser indexado.
              source: "/:path*",
              missing: [{ type: "host", value: CANONICAL_HOST.replaceAll(".", "\\.") }],
              headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
            },
          ]
        : []),
    ];
  },
};

export default nextConfig;
