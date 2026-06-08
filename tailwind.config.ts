import type { Config } from "tailwindcss";

/**
 * Design system — Dra. Ana Beatriz Lemos Souza
 * Tokens derived from the official brand manual:
 *  - Verde oficial #22513A (authority / headings / primary)
 *  - Dourado oficial #B69050 (hairline accent only — used sparingly)
 *  - Off-white #FCFCFC (breathing room / backgrounds)
 *  Proportion rule: ~70% light · 20% green · 10% gold.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
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
        brand: {
          green: "#22513A",
          "green-dark": "#1B4030",
          "green-deep": "#15301F",
          gold: "#B69050",
          "gold-soft": "#C6A56E",
          // Dourado escurecido para TEXTO sobre fundo claro (>=4.5:1 AA — ~5.9:1).
          "gold-ink": "#7A5E28",
          // Dourado clareado para TEXTO sobre verde escuro (>=4.5:1 AA — ~5.06:1).
          "gold-bright": "#D8BE8C",
          bone: "#FBF8F1",
          beige: "#EFE7DA",
          mint: "#DDE8E1",
          gray: "#6F6F6F",
          ink: "#23302A",
        },
        // semantic aliases
        background: "#FCFCFC",
        foreground: "#23302A",
        ring: "#B69050",
      },
      fontFamily: {
        display: ["var(--font-cormorant)", "Cormorant Garamond", "Georgia", "serif"],
        sans: ["var(--font-montserrat)", "Montserrat", "system-ui", "sans-serif"],
      },
      fontSize: {
        // refined editorial scale
        "display-xl": ["clamp(2.75rem, 6vw, 5rem)", { lineHeight: "1.04", letterSpacing: "-0.01em" }],
        "display-lg": ["clamp(2.25rem, 4.5vw, 3.75rem)", { lineHeight: "1.08", letterSpacing: "-0.01em" }],
        "display-md": ["clamp(1.9rem, 3.4vw, 2.75rem)", { lineHeight: "1.12" }],
        "display-sm": ["clamp(1.5rem, 2.4vw, 2rem)", { lineHeight: "1.2" }],
      },
      letterSpacing: {
        widest2: "0.28em",
        eyebrow: "0.22em",
      },
      maxWidth: {
        prose2: "68ch",
      },
      borderRadius: {
        xl2: "1.5rem",
        "3xl": "2rem",
      },
      boxShadow: {
        soft: "0 2px 8px -2px rgba(21, 48, 31, 0.06), 0 12px 32px -12px rgba(21, 48, 31, 0.12)",
        card: "0 1px 2px rgba(21, 48, 31, 0.04), 0 18px 48px -24px rgba(21, 48, 31, 0.18)",
        lift: "0 10px 24px -8px rgba(21, 48, 31, 0.14), 0 30px 60px -28px rgba(21, 48, 31, 0.22)",
        gold: "0 6px 24px -10px rgba(182, 144, 80, 0.45)",
        inset: "inset 0 1px 0 0 rgba(255,255,255,0.6)",
      },
      backgroundImage: {
        "grain": "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E\")",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        "in-out-soft": "cubic-bezier(0.45, 0, 0.15, 1)",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "soft-pulse": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(37, 211, 102, 0.45)" },
          "50%": { boxShadow: "0 0 0 12px rgba(37, 211, 102, 0)" },
        },
        "draw": {
          from: { strokeDashoffset: "1" },
          to: { strokeDashoffset: "0" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) both",
        "fade-in": "fade-in 0.8s ease both",
        "soft-pulse": "soft-pulse 2.4s ease-in-out infinite",
        shimmer: "shimmer 1.6s infinite",
      },
    },
  },
  plugins: [],
};

export default config;
