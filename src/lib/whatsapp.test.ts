import { describe, expect, it } from "vitest";
import {
  waContextForPath,
  waIntentForMessage,
  waMessageForIntent,
  waMessages,
  whatsappLink,
} from "./whatsapp";
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

  it("em tratamento conhecido pede para agendar a avaliação daquele tratamento e devolve o slug", () => {
    const ctx = waContextForPath("/tratamentos/implante", nomes);
    expect(ctx.kind).toBe("treatment");
    expect(ctx.intent).toBe("agendar");
    expect(ctx.treatmentSlug).toBe("implante");
    expect(ctx.message).toBe(waMessages.treatmentBooking("implante dentário"));
  });

  it("valores e contato são dúvida; obrigado continua a conversa; urgência fala agora", () => {
    expect(waContextForPath("/valores")).toMatchObject({
      intent: "duvidas",
      message: waMessages.questions,
    });
    expect(waContextForPath("/contato")).toMatchObject({
      intent: "duvidas",
      message: waMessages.questions,
    });
    expect(waContextForPath("/obrigado")).toMatchObject({
      intent: "continuar",
      message: waMessages.afterForm,
    });
    expect(waContextForPath("/urgencia-odontologica").intent).toBe("urgencia");
    expect(waContextForPath("/medo-de-dentista").intent).toBe("duvidas");
    expect(waContextForPath("/primeira-consulta").intent).toBe("agendar");
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

describe("intenção x mensagem (rótulo e mensagem nunca se contradizem)", () => {
  it("cada mensagem tem a intenção esperada", () => {
    expect(waIntentForMessage(waMessages.default)).toBe("agendar");
    expect(waIntentForMessage(waMessages.firstVisit)).toBe("agendar");
    expect(waIntentForMessage(waMessages.treatmentBooking("implante dentário"))).toBe("agendar");
    expect(waIntentForMessage(waMessages.fromForm("Ana", "limpeza"))).toBe("agendar");
    expect(waIntentForMessage(waMessages.treatment("implante dentário"))).toBe("duvidas");
    expect(waIntentForMessage(waMessages.questions)).toBe("duvidas");
    expect(waIntentForMessage(waMessages.fear)).toBe("duvidas");
    expect(waIntentForMessage(waMessages.whitening)).toBe("duvidas");
    expect(waIntentForMessage(waMessages.location)).toBe("duvidas");
    expect(waIntentForMessage(waMessages.situation("dor"))).toBe("duvidas");
    expect(waIntentForMessage(waMessages.urgency)).toBe("urgencia");
    expect(waIntentForMessage(waMessages.afterForm)).toBe("continuar");
  });

  it("a mensagem padrão de cada intenção volta à mesma intenção", () => {
    for (const intent of ["agendar", "duvidas", "urgencia", "continuar"] as const) {
      expect(waIntentForMessage(waMessageForIntent[intent])).toBe(intent);
    }
  });
});
