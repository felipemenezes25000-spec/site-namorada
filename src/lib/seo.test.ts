/** JSON-LD e metadados: autoria, perguntas exclusivas, pagamento fora do FAQPage, imagem versionada. */
import { describe, expect, it } from "vitest";
import { homeFaqs } from "./content";
import {
  buildMetadata,
  dentistSchema,
  exclusiveFaqs,
  faqSchema,
  medicalWebPageSchema,
  ogImageUrl,
  personSchema,
} from "./seo";

describe("medicalWebPageSchema", () => {
  it("tem @id, isPartOf e publisher, e nunca a doutora como author", () => {
    const s = medicalWebPageSchema({
      path: "/valores",
      name: "Valores",
      description: "d",
    }) as Record<string, unknown>;
    expect(s["@id"]).toMatch(/\/valores#webpage$/);
    expect(s.isPartOf).toBeTruthy();
    expect(s.publisher).toBeTruthy();
    expect("author" in s).toBe(false);
    expect("reviewedBy" in s).toBe(false);
  });

  it("com `about`, descreve o procedimento como MedicalProcedure do consultório", () => {
    const s = medicalWebPageSchema({
      path: "/tratamentos/implante",
      name: "Implante dentário",
      description: "d",
      about: {
        name: "Implante dentário",
        description: "o que é",
        extra: { bodyLocation: "Cavidade oral" },
      },
    }) as unknown as { about: Record<string, unknown> };
    expect(s.about["@type"]).toBe("MedicalProcedure");
    expect(s.about.bodyLocation).toBe("Cavidade oral");
    expect(s.about.provider).toBeTruthy();
  });
});

describe("FAQ", () => {
  it("a pergunta de formas de pagamento nunca vai ao FAQPage", () => {
    const s = faqSchema(homeFaqs);
    const nomes = s.mainEntity.map((q) => q.name);
    expect(nomes.some((n) => /pagamento/i.test(n))).toBe(false);
    expect(nomes.length).toBe(homeFaqs.length - 1);
  });

  it("exclusiveFaqs tira as perguntas que já estão na home", () => {
    const itens = [
      { q: homeFaqs[0].q, a: "x" },
      { q: "Pergunta só desta página?", a: "y" },
    ];
    expect(exclusiveFaqs(itens).map((i) => i.q)).toEqual(["Pergunta só desta página?"]);
  });

  it("a home não tem pergunta sobre estacionamento (fato não confirmado)", () => {
    expect(homeFaqs.some((f) => /estacionamento/i.test(f.q + f.a))).toBe(false);
  });
});

describe("profissional e consultório", () => {
  it("knowsAbout não atribui implante nem cirurgia sem registro de especialidade", () => {
    for (const s of [dentistSchema(), personSchema()]) {
      expect(s.knowsAbout.some((k: string) => /implante|cirurgia/i.test(k))).toBe(false);
    }
  });

  it("medicalSpecialty usa a URL do schema.org", () => {
    expect(dentistSchema().medicalSpecialty).toBe("https://schema.org/Dentistry");
  });
});

describe("imagem de compartilhamento", () => {
  it("og:image e twitter:image são a mesma URL, versionada, com tipo JPEG", () => {
    const m = buildMetadata({ title: "Teste", description: "d", path: "/" });
    const og = (m.openGraph?.images as { url: string; type: string }[])[0];
    const tw = (m.twitter?.images as string[])[0];
    expect(og.url).toBe(ogImageUrl());
    expect(tw).toBe(ogImageUrl());
    expect(og.url).toMatch(/\?v=/);
    expect(og.type).toBe("image/jpeg");
  });
});
