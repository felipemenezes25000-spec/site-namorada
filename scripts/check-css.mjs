#!/usr/bin/env node
/**
 * Régua do CSS dos módulos (src/**\/*.module.css), rodada na CI:
 *  1) espaçamento em px (padding, margin, gap) só pode DIMINUIR: o limite é o número de hoje
 *     (BASE_PX). Valor novo usa os degraus `var(--s-1)` a `var(--s-10)` do globals.css;
 *  2) toda media query de largura fora de 760px e 1100px (os dois cortes do DESIGN.md) precisa de
 *     um comentário na linha de cima dizendo por quê.
 * Uso: node scripts/check-css.mjs   (sai 1 quando alguma regra falha)
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "src");
/** Declarações com px em padding/margin/gap em 13/11/2026. Baixe este número quando trocar px por token. */
const BASE_PX = 108;
// 759px e 1099px são os mesmos cortes vistos "de cima" (max-width)
const CORTES = new Set(["760px", "1100px", "759px", "1099px"]);

function arquivos(dir, out = []) {
  for (const n of readdirSync(dir)) {
    const p = path.join(dir, n);
    if (statSync(p).isDirectory()) arquivos(p, out);
    else if (n.endsWith(".module.css")) out.push(p);
  }
  return out;
}

let px = 0;
const semComentario = [];
for (const f of arquivos(RAIZ)) {
  const linhas = readFileSync(f, "utf8").split(/\r?\n/);
  linhas.forEach((l, i) => {
    if (
      /^\s*(padding|margin|gap|row-gap|column-gap)(-[a-z-]+)?\s*:[^;]*\b\d+px\b/.test(l) &&
      !/calc|clamp|min\(|max\(/.test(l)
    )
      px++;
    const m = /@media[^{]*\((?:min|max)-width:\s*(\d+px)\)/.exec(l);
    if (m && !CORTES.has(m[1])) {
      const anterior = (linhas[i - 1] ?? "").trim();
      if (!anterior.startsWith("/*") && !anterior.endsWith("*/")) {
        semComentario.push(`${path.relative(RAIZ, f)}:${i + 1} ${l.trim()}`);
      }
    }
  });
}

let falhou = false;
console.log(`px em padding/margin/gap nos módulos: ${px} (limite ${BASE_PX})`);
if (px > BASE_PX) {
  console.error(`  FALHA: ${px - BASE_PX} declaração(ões) nova(s) em px. Use var(--s-n).`);
  falhou = true;
}
if (semComentario.length) {
  console.log(`media queries fora de 760/1100 sem comentário: ${semComentario.length}`);
  for (const s of semComentario) console.log("  " + s);
  falhou = true;
}
process.exit(falhou ? 1 : 0);
