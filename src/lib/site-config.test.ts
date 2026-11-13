import { describe, expect, it } from "vitest";
import { locale, localeTexto, mainNav, siteConfig } from "./site-config";

describe("localeTexto", () => {
  it("compõe as cinco formas a partir do siteConfig", () => {
    expect(localeTexto("bairroRegiao")).toBe("Vila Bruna, região da Freguesia do Ó");
    expect(localeTexto("bairroRegiaoCidade")).toBe(
      "Vila Bruna, região da Freguesia do Ó, São Paulo",
    );
    expect(localeTexto("regiaoZona")).toBe("região da Freguesia do Ó, zona norte de São Paulo");
    expect(localeTexto("endereco")).toBe(
      "R. Rio Verde, 1029 — Vila Bruna (região da Freguesia do Ó), São Paulo - SP, 02934-201",
    );
    expect(localeTexto("enderecoCurto")).toBe("R. Rio Verde, 1029 — Vila Bruna, São Paulo - SP");
  });

  it("nunca devolve marcador entre colchetes nem o endereço antigo", () => {
    const formas = [
      "bairroRegiao",
      "bairroRegiaoCidade",
      "regiaoZona",
      "endereco",
      "enderecoCurto",
    ] as const;
    for (const f of formas) {
      expect(localeTexto(f)).not.toMatch(/[[\]]/);
      expect(localeTexto(f)).not.toMatch(/Itapeva|Bela Vista/i);
    }
  });

  it("locale e siteConfig concordam", () => {
    expect(locale.cep).toBe(siteConfig.address.zip);
    expect(locale.ruaNumero).toBe(siteConfig.address.street);
  });
});

describe("siteConfig", () => {
  it("usa o domínio oficial sem barra no final quando NEXT_PUBLIC_SITE_URL não está definida", () => {
    expect(siteConfig.url).not.toMatch(/\/$/);
    expect(siteConfig.url).toMatch(/^https:\/\//);
  });

  it("WhatsApp e telefone levam só dígitos, com 55 e DDD", () => {
    expect(siteConfig.whatsapp).toMatch(/^55\d{10,11}$/);
    expect(siteConfig.phone).toMatch(/^55\d{10,11}$/);
  });

  it("o menu principal só aponta para rotas internas", () => {
    for (const item of mainNav) expect(item.href).toMatch(/^\//);
  });
});
