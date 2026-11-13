/** Cabeçalhos de produção (next.config.mjs): CSP sem 'unsafe-eval' e sem domínio fora da lista; cache das imagens; redirect. */
import { afterEach, describe, expect, it, vi } from "vitest";

type Header = { key: string; value: string };
type Grupo = { source: string; headers: Header[] };
type Redirect = {
  has?: { type: string; value: string }[];
  destination: string;
  permanent: boolean;
};
type Config = { headers: () => Promise<Grupo[]>; redirects: () => Promise<Redirect[]> };

async function configDeProducao(): Promise<Config> {
  vi.resetModules();
  vi.stubEnv("NODE_ENV", "production");
  vi.stubEnv("VERCEL_ENV", "production");
  const mod = (await import("../../next.config.mjs")) as unknown as { default: Config };
  return mod.default;
}

afterEach(() => vi.unstubAllEnvs());

describe("next.config (produção)", () => {
  it("CSP sem unsafe-eval e só com os domínios permitidos", async () => {
    const cfg = await configDeProducao();
    const grupos = await cfg.headers();
    const csp = grupos[0].headers.find((h) => h.key === "Content-Security-Policy")!.value;
    expect(csp).not.toContain("unsafe-eval");
    const permitidos =
      /^(https:\/\/([a-z0-9*-]+\.)*(google|googletagmanager|google-analytics|googleadservices|doubleclick|facebook)\.(com|net)|'self'|'unsafe-inline'|'none'|data:|blob:)$/;
    for (const diretiva of csp.split(";")) {
      const [, ...fontes] = diretiva.trim().split(/\s+/);
      for (const f of fontes) expect(f, `fonte inesperada: ${f}`).toMatch(permitidos);
    }
  });

  it("imagens de public/ com cache de 1 dia e revalidação", async () => {
    const cfg = await configDeProducao();
    const grupos = await cfg.headers();
    const img = grupos.find((g) => g.source.includes("png|jpe?g"));
    expect(img?.headers[0].value).toBe("public, max-age=86400, stale-while-revalidate=604800");
  });

  it("qualquer *.vercel.app redireciona ao domínio oficial, sem depender do nome do projeto", async () => {
    const cfg = await configDeProducao();
    const r = (await cfg.redirects())[0];
    expect(r.has?.[0]).toMatchObject({ type: "host", value: ".*\\.vercel\\.app" });
    expect(r.destination).toBe("https://www.draanabeatrizodonto.com.br/:path*");
    expect(r.permanent).toBe(true);
  });
});
