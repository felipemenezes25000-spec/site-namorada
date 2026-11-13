import { describe, expect, it } from "vitest";
import { waContextForPath, waMessages, whatsappLink } from "./whatsapp";
import { siteConfig } from "./site-config";

describe("whatsappLink", () => {
  it("sem mensagem devolve só o número", () => {
    expect(whatsappLink()).toBe(`https://wa.me/${siteConfig.whatsapp}`);
  });

  it("codifica a mensagem para a URL", () => {
    const url = whatsappLink("Olá, Dra. Ana! Tudo bem?");
    expect(url.startsWith(`https://wa.me/${siteConfig.whatsapp}?text=`)).toBe(true);
    expect(new URL(url).searchParams.get("text")).toBe("Olá, Dra. Ana! Tudo bem?");
    expect(url).not.toContain(" ");
  });
});

describe("waContextForPath", () => {
  const nomes = { implante: "Implante dentário", "limpeza-dental": "Limpeza dental" };

  it("usa a mensagem de cada página de apoio", () => {
    expect(waContextForPath("/urgencia-odontologica").message).toBe(waMessages.urgency);
    expect(waContextForPath("/medo-de-dentista").message).toBe(waMessages.fear);
    expect(waContextForPath("/primeira-consulta").message).toBe(waMessages.firstVisit);
  });

  it("em tratamento conhecido cita o nome em minúsculas e devolve o slug", () => {
    const ctx = waContextForPath("/tratamentos/implante", nomes);
    expect(ctx.kind).toBe("treatment");
    expect(ctx.treatmentSlug).toBe("implante");
    expect(ctx.message).toBe(waMessages.treatment("implante dentário"));
  });

  it("slug desconhecido, home e caminho vazio usam a mensagem padrão", () => {
    expect(waContextForPath("/tratamentos/inexistente", nomes).kind).toBe("default");
    expect(waContextForPath("/").message).toBe(waMessages.default);
    expect(waContextForPath(null).message).toBe(waMessages.default);
    expect(waContextForPath(undefined).message).toBe(waMessages.default);
  });

  it("ignora barra final, query e âncora", () => {
    expect(waContextForPath("/urgencia-odontologica/").kind).toBe("urgency");
    expect(waContextForPath("/medo-de-dentista?utm_source=x#topo").kind).toBe("fear");
  });

  it("não confunde nomes herdados do protótipo de objeto com slugs", () => {
    expect(waContextForPath("/tratamentos/constructor", {}).kind).toBe("default");
  });
});
