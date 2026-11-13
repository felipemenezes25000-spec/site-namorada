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
    // Lista COMPLETA e em ordem crescente: se só estendêssemos, os breakpoints
    // novos cairiam depois de 2xl no CSS gerado e quebrariam a cascata.
    // sm/md/lg/xl/2xl mantêm os valores padrão (o /admin usa).
    screens: {
      xs: "375px",
      sm: "640px",
      tab: "760px",
      md: "768px",
      lg: "1024px",
      desk: "1100px",
      xl: "1280px",
      wide: "1440px",
      "2xl": "1536px",
    },
    container: {
      center: true,
      padding: {
        DEFAULT: "1.25rem",
        sm: "1.5rem",
        lg: "2rem",
        xl: "2.5rem",
      },
      screens: {
        "2xl": "1240px",
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

        /* LEGADO /admin — não usar no site */
        brand: {
          green: "#22513A",
          "green-dark": "#1B4030",
          "green-deep": "#15301F",
          gold: "#B69050",
          "gold-soft": "#C6A56E",
          "gold-ink": "#7A5E28",
          "gold-bright": "#D8BE8C",
          bone: "#FBF8F1",
          beige: "#EFE7DA",
          mint: "#DDE8E1",
          gray: "#6F6F6F",
          ink: "#23302A",
        },
        /* LEGADO (páginas antigas; remover quando todas forem refeitas) */
        background: "#FCFCFC",
        foreground: "#23302A",
        ring: "#B69050",
      },
      fontFamily: {
        // As variáveis vêm de next/font em src/app/layout.tsx.
        display: ["var(--font-display)", "Didot", "Bodoni 72", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
      },
      borderRadius: {
        /* LEGADO /admin */
        "3xl": "2rem",
      },
      boxShadow: {
        /* LEGADO /admin e páginas antigas */
        soft: "0 2px 8px -2px rgba(21, 48, 31, 0.06), 0 12px 32px -12px rgba(21, 48, 31, 0.12)",
        card: "0 1px 2px rgba(21, 48, 31, 0.04), 0 18px 48px -24px rgba(21, 48, 31, 0.18)",
        lift: "0 10px 24px -8px rgba(21, 48, 31, 0.14), 0 30px 60px -28px rgba(21, 48, 31, 0.22)",
        gold: "0 6px 24px -10px rgba(182, 144, 80, 0.45)",
      },
      transitionTimingFunction: {
        /* LEGADO */
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      /* As camadas (z-index) são variáveis CSS (--z-*) em globals.css; nenhuma classe z-* do Tailwind é usada. */
      maxWidth: {
        leitura: "34rem",
      },

      /* ============ LEGADO DAS PÁGINAS ANTIGAS ============
         Mantido só para as páginas que ainda não foram refeitas continuarem
         legíveis. Quem refizer a página não usa nada daqui; ao final, apagar. */
      fontSize: {
        "display-md": ["clamp(1.9rem, 3.4vw, 2.75rem)", { lineHeight: "1.12" }],
      },
    },
  },
  plugins: [],
};

export default config;
