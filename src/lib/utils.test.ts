import { describe, expect, it } from "vitest";
import { cn, formatPhone } from "./utils";

describe("formatPhone", () => {
  it("formata celular com DDD, com ou sem o 55", () => {
    expect(formatPhone("11939222289")).toBe("(11) 93922-2289");
    expect(formatPhone("5511939222289")).toBe("(11) 93922-2289");
  });

  it("formata fixo de 10 dígitos", () => {
    expect(formatPhone("1139222289")).toBe("(11) 3922-2289");
  });

  it("devolve o texto original quando não reconhece o formato", () => {
    expect(formatPhone("123")).toBe("123");
  });
});

describe("cn", () => {
  it("junta classes e resolve conflitos do Tailwind", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
    expect(cn("a", false && "b", undefined, "c")).toBe("a c");
  });

  it("tamanho e cor de texto convivem (classes padrão do Tailwind)", () => {
    const out = cn("text-lg", "text-tinta");
    expect(out).toContain("text-lg");
    expect(out).toContain("text-tinta");
  });
});

describe("semQuebraNome", () => {
  it("prende 'Dra.' ao nome e 'do Ó' à palavra anterior com espaço inseparável", async () => {
    const { semQuebraNome } = await import("./utils");
    expect(semQuebraNome("Fale com a Dra. Ana")).toBe("Fale com a Dra. Ana");
    expect(semQuebraNome("na Freguesia do Ó, zona norte")).toBe("na Freguesia do Ó, zona norte");
    expect(semQuebraNome("do Óleo")).toBe("do Óleo");
  });
});
