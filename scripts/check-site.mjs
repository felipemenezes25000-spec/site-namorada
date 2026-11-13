#!/usr/bin/env node
/**
 * Verificação de conteúdo e SEO dos HTML pré-renderizados (Node puro, sem dependências).
 *
 * Uso:
 *   next build && node scripts/check-site.mjs            # lê .next/server/app
 *   node scripts/check-site.mjs --dir <pasta com .html>  # lê outra pasta (ex.: páginas baixadas com curl)
 *
 * Falha (exit 1) quando encontra, em qualquer página:
 *   - "[" ou "]" no <title>, na description, no H1 ou em valores de texto do JSON-LD;
 *   - <title> com mais de 60 caracteres ou description com mais de 155;
 *   - mais de um <h1>;
 *   - <img> sem atributo alt;
 *   - link canonical ausente (páginas com noindex ficam de fora);
 *   - "[...]" no texto visível, em alt ou em aria-label;
 *   - pergunta do FAQPage (JSON-LD) que não aparece no texto visível;
 *   - JSON-LD que não é JSON válido;
 *   - qualquer termo proibido (DESIGN.md 6.5 e 8) no texto visível, em alt, title, description ou JSON-LD;
 *   - nome de especialidade, forma de pagamento ou endereço antigo no texto visível;
 *   - <html> sem lang="pt-BR" ou página sem meta viewport;
 *   - link interno (href="/...") ou imagem (src, srcset, /_next/image?url=...) que não existe nas
 *     páginas geradas nem em public/;
 *   - sitemap com URL que não é uma página gerada, ou robots sem a linha Sitemap (quando os arquivos existem);
 *   - JavaScript de carregamento inicial acima do orçamento (gzip), lendo .next/static (a variável
 *     JS_BUDGET_KB muda o limite; só vale ao ler .next/server/app).
 */
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join, relative, resolve, sep } from "node:path";
import { gzipSync } from "node:zlib";

/* ------------------------------- opções ------------------------------- */

const args = process.argv.slice(2);
const dirIdx = args.indexOf("--dir");
const root = resolve(dirIdx >= 0 ? (args[dirIdx + 1] ?? "") : ".next/server/app");
const quiet = args.includes("--quiet");

const PUBLIC_DIR = resolve("public");
// Em .next/server/app a pasta de build fica dois níveis acima; com --dir não há JS para medir.
const BUILD_DIR = dirIdx >= 0 ? null : resolve(root, "..", "..");
const JS_BUDGET_KB = Number(process.env.JS_BUDGET_KB ?? 230);

const MAX_TITLE = 60;
const MAX_DESCRIPTION = 155;

// Só texto que o visitante lê (corpo, alt, aria-label, title, description): a URL do slug de cirurgia
// e o JSON-LD ficam de fora. Comparação sem acento e em minúsculas.
const FORBIDDEN_VISIBLE = [/implantodontia/, /buco-?maxilo/, /\bpix\b/, /\bdebito\b/, /cartao de credito/];

const FORBIDDEN = [
  "sem dor",
  "indolor",
  "R. Itapeva",
  "Bela Vista",
  "Av. Paulista",
  "Responsável Técnica",
  "vista panorâmica",
  "luz natural",
  "especialista",
  "garantia",
  "promoção",
  "R$",
  // "desconto" fica de fora: os Termos o citam para dizer que o site NÃO o usa.
];

/* ------------------------------ utilidades ------------------------------ */

const NAMED = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", shy: "" };

function decode(s) {
  return s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
    .replace(/&([a-z]+);/gi, (m, n) => (n.toLowerCase() in NAMED ? NAMED[n.toLowerCase()] : m));
}

/** Minúsculas, sem acento, espaços colapsados: para comparar termos proibidos. */
function fold(s) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[\s ]+/g, " ")
    .toLowerCase();
}

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) out.push(...walk(full));
    else if (name.endsWith(".html")) out.push(full);
  }
  return out;
}

/** Valores de texto de um JSON-LD (chaves de estrutura como "@type" ficam de fora dos colchetes). */
function jsonStrings(node, acc = []) {
  if (typeof node === "string") acc.push(node);
  else if (Array.isArray(node)) node.forEach((n) => jsonStrings(n, acc));
  else if (node && typeof node === "object") Object.values(node).forEach((n) => jsonStrings(n, acc));
  return acc;
}

function attr(tag, name) {
  const m = tag.match(new RegExp(`\\s${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, "i"));
  return m ? (m[2] ?? m[3] ?? m[4] ?? "") : null;
}

const hasBracket = (s) => /[\[\]]/.test(s);

/* ------------------------------ verificação ------------------------------ */

function checkPage(html, name = "") {
  // A 404 é noindex e, de propósito, não herda a descrição da home (ver src/app/not-found.tsx).
  const semDescricao = name === "_not-found.html";
  const errors = [];

  // <title>
  const titleM = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleM ? decode(titleM[1]).trim() : "";
  if (!title) errors.push("sem <title>");
  if (hasBracket(title)) errors.push(`"[" ou "]" no título: ${title}`);
  if (title.length > MAX_TITLE) errors.push(`título com ${title.length} caracteres (máx. ${MAX_TITLE}): ${title}`);

  // meta description
  const metas = html.match(/<meta\b[^>]*>/gi) ?? [];
  const descTag = metas.find((m) => (attr(m, "name") ?? "").toLowerCase() === "description");
  const description = descTag ? decode(attr(descTag, "content") ?? "").trim() : "";
  if (!descTag && !semDescricao) errors.push("sem meta description");
  if (hasBracket(description)) errors.push(`"[" ou "]" na description: ${description}`);
  if (description.length > MAX_DESCRIPTION)
    errors.push(`description com ${description.length} caracteres (máx. ${MAX_DESCRIPTION}): ${description}`);

  // H1
  const h1s = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) =>
    decode(m[1].replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim(),
  );
  if (h1s.length > 1) errors.push(`${h1s.length} elementos <h1>: ${h1s.map((h) => `"${h}"`).join(", ")}`);
  for (const h of h1s) if (hasBracket(h)) errors.push(`"[" ou "]" no H1: ${h}`);

  // imagens sem alt
  for (const tag of html.match(/<img\b[^>]*>/gi) ?? []) {
    if (attr(tag, "alt") === null) errors.push(`<img> sem alt: ${tag.slice(0, 120)}`);
  }

  // canonical (páginas noindex ficam de fora)
  const noindex = metas.some(
    (m) => (attr(m, "name") ?? "").toLowerCase() === "robots" && /noindex/i.test(attr(m, "content") ?? ""),
  );
  const links = html.match(/<link\b[^>]*>/gi) ?? [];
  const canonical = links.find((l) => (attr(l, "rel") ?? "").toLowerCase() === "canonical");
  if (!canonical && !noindex) errors.push("sem link canonical");

  // JSON-LD
  const ldTexts = [];
  const faqNames = [];
  for (const m of html.matchAll(/<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    let data;
    try {
      data = JSON.parse(m[1]);
    } catch (e) {
      errors.push(`JSON-LD inválido: ${e.message}`);
      continue;
    }
    for (const node of Array.isArray(data) ? data : [data]) {
      if (node && node["@type"] === "FAQPage") {
        for (const q of node.mainEntity ?? []) if (typeof q?.name === "string") faqNames.push(q.name);
      }
    }
    for (const s of jsonStrings(data)) {
      ldTexts.push(s);
      if (hasBracket(s)) errors.push(`"[" ou "]" no JSON-LD: ${s.slice(0, 120)}`);
    }
  }

  // texto verificado contra os termos proibidos: visível + alt + title + description + JSON-LD
  const visible = html
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ");
  const alts = [...(visible.match(/<img\b[^>]*>/gi) ?? [])].map((t) => attr(t, "alt") ?? "");
  const labels = [...(visible.match(/\saria-label\s*=\s*"[^"]*"/gi) ?? [])];
  const body = decode(visible.replace(/<[^>]+>/g, " "));
  const visibleAll = [body, ...alts, ...labels.map(decode)].join(" | ");
  const marker = visibleAll.match(/\[[^\]]{0,40}\]/);
  if (marker) errors.push(`marcador entre colchetes no texto visível, alt ou aria-label: ${marker[0]}`);
  const bodyFolded = fold(body);
  for (const q of faqNames) {
    if (!bodyFolded.includes(fold(q))) errors.push(`pergunta do FAQPage ausente do texto visível: ${q.slice(0, 80)}`);
  }
  const haystack = fold([body, title, description, ...alts, ...labels.map(decode), ...ldTexts].join(" \n "));
  for (const term of FORBIDDEN) {
    const needle = fold(term);
    if (haystack.includes(needle)) errors.push(`termo proibido: "${term}"`);
  }
  const readable = fold([body, title, description, ...alts, ...labels.map(decode)].join(" \n "));
  for (const re of FORBIDDEN_VISIBLE) {
    const hit = readable.match(re);
    if (hit) errors.push(`termo proibido no texto visível: "${hit[0]}"`);
  }

  return { errors, title, description, h1: h1s[0] ?? "" };
}

/* ------------------- links, imagens, lang, viewport, JS ------------------- */

function routeOf(file) {
  const name = relative(root, file).replaceAll(sep, "/").replace(/\.html$/, "");
  return name === "index" ? "/" : "/" + name.replace(/\/index$/, "");
}

function publicHas(pathname) {
  let clean;
  try {
    clean = decodeURIComponent(pathname.split("?")[0].split("#")[0]);
  } catch {
    return false;
  }
  const full = resolve(PUBLIC_DIR, "." + clean);
  return full.startsWith(PUBLIC_DIR) && existsSync(full) && statSync(full).isFile();
}

const SYSTEM_PATHS = new Set(["/sitemap.xml", "/robots.txt", "/manifest.webmanifest", "/favicon.ico"]);

/** O endereço interno existe? Páginas geradas, arquivos de public/ e rotas de sistema. */
function internalExists(url, routes) {
  if (!url.startsWith("/") || url.startsWith("//")) return true;
  const path = url.split("#")[0].split("?")[0];
  if (path === "") return true;
  if (path.startsWith("/_next/image")) {
    const real = new URL(url, "http://x").searchParams.get("url") ?? "";
    return real.startsWith("/") ? publicHas(real) : true;
  }
  if (path.startsWith("/_next/") || path.startsWith("/api/") || path.startsWith("/admin")) return true;
  const norm = path.length > 1 ? path.replace(/\/$/, "") : path;
  return (
    routes.has(norm) ||
    publicHas(norm) ||
    SYSTEM_PATHS.has(norm) ||
    /^\/(opengraph|twitter)-image/.test(norm) ||
    /^\/(icon|apple-icon)/.test(norm)
  );
}

function checkExtras(html, routes, jsCache) {
  const errors = [];
  const htmlTag = html.match(/<html\b[^>]*>/i)?.[0] ?? "";
  if (!/\slang\s*=\s*["']pt-BR["']/i.test(htmlTag)) errors.push(`<html> sem lang="pt-BR": ${htmlTag.slice(0, 80)}`);
  const metas = html.match(/<meta\b[^>]*>/gi) ?? [];
  if (!metas.some((m) => (attr(m, "name") ?? "").toLowerCase() === "viewport")) errors.push("sem meta viewport");

  const visible = html.replace(/<script\b[\s\S]*?<\/script>/gi, " ").replace(/<style\b[\s\S]*?<\/style>/gi, " ");
  const missing = new Set();
  for (const m of visible.matchAll(/<a\b[^>]*>/gi)) {
    const href = attr(m[0], "href");
    if (href && !internalExists(decode(href), routes)) missing.add(`link ${href}`);
  }
  for (const m of visible.matchAll(/<(?:img|source)\b[^>]*>/gi)) {
    for (const name of ["src", "srcset"]) {
      const v = attr(m[0], name);
      if (!v) continue;
      for (const part of decode(v).split(",")) {
        const u = part.trim().split(/\s+/)[0];
        if (u && !internalExists(u, routes)) missing.add(`imagem ${u}`);
      }
    }
  }
  for (const m of missing) errors.push(`endereço interno que não existe: ${m}`);

  let jsKb = null;
  if (BUILD_DIR) {
    let total = 0;
    const seen = new Set();
    for (const m of html.matchAll(/<script\b[^>]*\ssrc="(\/_next\/static\/[^"?]+\.js)[^"]*"[^>]*>/gi)) {
      if (seen.has(m[1])) continue;
      seen.add(m[1]);
      if (!jsCache.has(m[1])) {
        const f = join(BUILD_DIR, m[1].replace("/_next/", ""));
        jsCache.set(m[1], existsSync(f) ? gzipSync(readFileSync(f)).length : 0);
      }
      total += jsCache.get(m[1]);
    }
    jsKb = total / 1024;
    if (jsKb > JS_BUDGET_KB) errors.push(`JavaScript inicial com ${jsKb.toFixed(0)} kB gzip (orçamento ${JS_BUDGET_KB} kB)`);
  }
  return { errors, jsKb };
}

function checkSeoFiles(routes) {
  const errors = [];
  const find = (...names) => names.map((n) => join(root, n)).find((p) => existsSync(p));
  const sitemap = find("sitemap.xml.body", "sitemap.xml");
  const robots = find("robots.txt.body", "robots.txt");
  if (sitemap) {
    for (const m of readFileSync(sitemap, "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)) {
      let p;
      try {
        p = new URL(decode(m[1])).pathname;
      } catch {
        errors.push(`sitemap: URL inválida ${m[1]}`);
        continue;
      }
      const norm = p.length > 1 ? p.replace(/\/$/, "") : p;
      if (!routes.has(norm)) errors.push(`sitemap: ${m[1]} não é uma página gerada`);
    }
  } else if (BUILD_DIR) {
    console.warn("aviso: sitemap não encontrado em .next/server/app (conferir o nome do arquivo gerado)");
  }
  if (robots) {
    const txt = readFileSync(robots, "utf8");
    if (!/^Sitemap:\s*\S+/im.test(txt)) errors.push("robots sem linha Sitemap");
    if (/^Host:/im.test(txt)) errors.push('robots com a linha "Host:" (diretiva do Yandex, sem efeito no Google)');
  } else if (BUILD_DIR) {
    console.warn("aviso: robots não encontrado em .next/server/app (conferir o nome do arquivo gerado)");
  }
  return errors;
}

/* ---------------------------------- main ---------------------------------- */

if (!existsSync(root) || !statSync(root).isDirectory()) {
  console.error(`Pasta não encontrada: ${root}\nRode "next build" antes, ou use --dir <pasta>.`);
  process.exit(1);
}

const files = walk(root).sort();
if (files.length === 0) {
  console.error(`Nenhum .html em ${root}.`);
  process.exit(1);
}

const routes = new Set(files.map(routeOf));
const jsCache = new Map();
let failed = 0;
let maxJs = 0;
for (const file of files) {
  const name = relative(root, file).replaceAll("\\", "/");
  const html = readFileSync(file, "utf8");
  const { errors, title } = checkPage(html, name);
  const extra = checkExtras(html, routes, jsCache);
  errors.push(...extra.errors);
  if (extra.jsKb) maxJs = Math.max(maxJs, extra.jsKb);
  if (errors.length) {
    failed += 1;
    console.error(`FALHA  ${name}`);
    for (const e of errors) console.error(`         - ${e}`);
  } else if (!quiet) {
    console.log(`ok     ${name}  (${title.length} car.)`);
  }
}

const seoErrors = checkSeoFiles(routes);
if (seoErrors.length) {
  failed += 1;
  console.error("FALHA  sitemap/robots");
  for (const e of seoErrors) console.error(`         - ${e}`);
}
if (maxJs) console.log(`\nMaior JS inicial: ${maxJs.toFixed(0)} kB gzip (orçamento ${JS_BUDGET_KB} kB)`);
console.log(`\n${files.length} página(s) verificada(s), ${failed} com problema.`);
process.exit(failed ? 1 : 0);
