/** Esquema do formulário: obrigatórios, consentimento de saúde condicional e data plausível. */
import { describe, expect, it } from "vitest";
import { buildAppointmentSchema } from "./validations";

const schema = buildAppointmentSchema(["Avaliação odontológica", "Limpeza dental"]);
const base = {
  fullName: "Maria da Silva",
  whatsapp: "(11) 91234-5678",
  treatmentInterest: "Avaliação odontológica",
  preferredPeriod: "Tanto faz",
  lgpdConsent: true,
};
const erros = (v: unknown) => {
  const r = schema.safeParse(v);
  return r.success ? {} : r.error.flatten().fieldErrors;
};

describe("buildAppointmentSchema", () => {
  it("aceita o mínimo obrigatório", () => {
    expect(schema.safeParse(base).success).toBe(true);
  });

  it("sem consentimento LGPD não passa", () => {
    expect(erros({ ...base, lgpdConsent: false }).lgpdConsent?.length).toBeGreaterThan(0);
  });

  it("tratamento fora da lista não passa", () => {
    expect(
      erros({ ...base, treatmentInterest: "Clareamento milagroso" }).treatmentInterest,
    ).toBeTruthy();
  });

  it("queixa preenchida exige o consentimento para dado de saúde", () => {
    expect(erros({ ...base, mainComplaint: "Dor no siso" }).healthConsent).toBeTruthy();
    expect(
      schema.safeParse({ ...base, mainComplaint: "Dor no siso", healthConsent: true }).success,
    ).toBe(true);
  });

  it("radiografia 'sim' também exige o consentimento de saúde; 'não' não exige", () => {
    expect(erros({ ...base, hasXray: "sim" }).healthConsent).toBeTruthy();
    expect(schema.safeParse({ ...base, hasXray: "nao" }).success).toBe(true);
  });

  it("data impossível ou muito no passado não passa; data de amanhã passa", () => {
    expect(erros({ ...base, preferredDate: "2026-02-31" }).preferredDate).toBeTruthy();
    expect(erros({ ...base, preferredDate: "1999-01-01" }).preferredDate).toBeTruthy();
    const amanha = new Date(Date.now() + 86_400_000);
    const iso = `${amanha.getFullYear()}-${String(amanha.getMonth() + 1).padStart(2, "0")}-${String(amanha.getDate()).padStart(2, "0")}`;
    expect(schema.safeParse({ ...base, preferredDate: iso }).success).toBe(true);
  });

  it("WhatsApp sem dígitos suficientes não passa", () => {
    expect(erros({ ...base, whatsapp: "123" }).whatsapp).toBeTruthy();
  });
});
