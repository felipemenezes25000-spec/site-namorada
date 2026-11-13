import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({ baseDirectory: dirname(fileURLToPath(import.meta.url)) });

// next/core-web-vitals já traz as regras de React, hooks e acessibilidade do Next;
// next/typescript acrescenta as regras de TypeScript. Sem react-refresh (não é app Vite).
const config = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "_arquivo/**",
      "coverage/**",
      "test-results/**",
      "next-env.d.ts",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default config;
