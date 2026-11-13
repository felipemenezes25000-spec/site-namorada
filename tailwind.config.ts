import type { Config } from "tailwindcss";

/**
 * Sistema de design — "Edição de Consultório" (ver DESIGN.md).
 * Fonte única dos valores: variáveis CSS em src/app/globals.css (:root).
 * Aqui só espelhamos com var(--x). Cores de texto são sólidas: sem opacidade
 * (os tokens abaixo não declaram <alpha-value> de propósito: `text-fg/70` não gera nada).
 *
 * Proporção: ~70% claro · ~20% verde/noite · ~10% ouro.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  // Classes montadas dinamicamente (`t-${size}`, `idx-${variant}`): o Tailwind não as
  // enxerga no código e as descartaria do bloco @layer components de globals.css.
  safelist: [
    "t-d1",
    "t-d1i",
    "t-d2",
    "t-d3",
    "t-d4",
    "t-row",
    "idx-sumario",
    "idx-passos",
    "idx-fatos",
    "idx-contatos",
  ],
  theme: {
    // Lista COMPLETA e em ordem crescente: só as larguras que o código usa (DESIGN.md: 760 e 1100;
    // sm e lg ficam para o /admin). Media query fora destas, só em módulo e com comentário.
    screens: {
      sm: "640px",
      tab: "760px",
      lg: "1024px",
      desk: "1100px",
    },
    container: {
      center: true,
      padding: {
        DEFAULT: "1.25rem",
        sm: "1.5rem",
        lg: "2rem",
      },
    },
    extend: {
      colors: {
        /* ----- Novo sistema (site público) ----- */
        osso: "var(--osso)",
        papel: "var(--papel)",
        areia: "var(--areia)",
        verde: "var(--verde)",
        "verde-escuro": "var(--verde-escuro)",
        noite: "var(--noite)",
        "noite-fundo": "var(--noite-fundo)",
        tinta: "var(--tinta)",
        "tinta-2": "var(--tinta-2)",
        ouro: "var(--ouro)",
        "ouro-tinta": "var(--ouro-tinta)",
        "ouro-claro": "var(--ouro-claro)",
        "ouro-hover": "var(--ouro-hover)",
        nevoa: "var(--nevoa)",
        linha: "var(--linha)",
        erro: "var(--erro)",
        // Semânticas por tom de seção (Section define; componentes só leem).
        bg: "var(--bg)",
        head: "var(--head)",
        fg: "var(--fg)",
        "fg-2": "var(--fg-2)",
        accent: "var(--accent)",
        rule: "var(--rule)",

        /* Painel /admin: as cores do site com opacidade (`text-painel-tinta/70`). Só o painel usa;
           no site o texto é sólido (os tokens acima não aceitam opacidade de propósito). */
        painel: {
          verde: "rgb(34 81 58 / <alpha-value>)",
          tinta: "rgb(22 37 29 / <alpha-value>)",
          osso: "rgb(251 248 241 / <alpha-value>)",
          areia: "rgb(239 229 208 / <alpha-value>)",
          ouro: "rgb(182 144 80 / <alpha-value>)",
        },
      },
      fontFamily: {
        // As variáveis vêm de next/font em src/app/layout.tsx.
        display: ["var(--font-display)", "Didot", "Bodoni 72", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
      },
      boxShadow: {
        /* Painel /admin (cartões e janela de login) */
        painel: "0 2px 8px -2px rgba(21, 48, 31, 0.06), 0 12px 32px -12px rgba(21, 48, 31, 0.12)",
        "painel-alto":
          "0 10px 24px -8px rgba(21, 48, 31, 0.14), 0 30px 60px -28px rgba(21, 48, 31, 0.22)",
      },
      transitionTimingFunction: {
        toque: "var(--ease-toque)",
      },
      /* As camadas (z-index) são variáveis CSS (--z-*) em globals.css; nenhuma classe z-* do Tailwind é usada. */
      maxWidth: {
        leitura: "34rem",
      },
    },
  },
  plugins: [],
};

export default config;
