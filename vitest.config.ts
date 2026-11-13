import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { defineConfig } from "vitest/config";

/**
 * Alguns testes de src usam o executor nativo do Node (`import ... from "node:test"`), não o Vitest.
 * Eles ficam de fora daqui para não aparecerem como "suíte sem testes"; quem os converter para
 * `import { describe, it, expect } from "vitest"` passa a rodá-los automaticamente.
 */
function testesDoNode(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) testesDoNode(full, out);
    else if (
      name.endsWith(".test.ts") &&
      /from\s+["']node:test["']/.test(readFileSync(full, "utf8"))
    ) {
      out.push(path.relative(__dirname, full).replaceAll(path.sep, "/"));
    }
  }
  return out;
}

export default defineConfig({
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    exclude: ["node_modules/**", ...testesDoNode(path.join(__dirname, "src"))],
  },
});
