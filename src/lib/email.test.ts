/**
 * E-mail de aviso de lead: todo valor vindo do formulário ou da URL é escapado, o assunto é de uma
 * linha só e o registro do consentimento (data, hora e versão da política) está no corpo.
 *   npx vitest run src/lib/email.test.ts
 */
import { describe, expect, it } from "vitest";
import { buildLeadEmail, escapeHtml, type LeadEmailData } from "./email";

const base: LeadEmailData = {
  fullName: "Maria da Silva",
  whatsapp: "(11) 91234-5678",
  treatmentInterest: "Avaliação odontológica",
  consentAt: "2026-11-13T14:05:09.000Z",
  privacyPolicyVersion: "2026-11-13",
  healthConsent: "nao_se_aplica",
};

describe("buildLeadEmail", () => {
  it("escapa nome, queixa, UTM e página de entrada maliciosos", () => {
    const { html } = buildLeadEmail({
      ...base,
      fullName: `<img src=x onerror=alert(1)>`,
      mainComplaint: "dor\n<script>alert(1)</script>",
      utmSource: `"><script>x</script>`,
      utmCampaign: "<b>c</b>",
      landingPage: `/agendamento?x="><img src=x>`,
      healthConsent: "sim",
    });
    expect(html).not.toMatch(/<img/i);
    expect(html).not.toMatch(/<script/i);
    expect(html).toContain("&lt;img src=x onerror=alert(1)&gt;");
  });

  it("assunto de uma linha só, mesmo com quebras no nome e no tratamento", () => {
    const { subject } = buildLeadEmail({
      ...base,
      fullName: "Maria\r\nBcc: x@y.z",
      treatmentInterest: "Limpeza\ndental",
    });
    expect(subject).not.toMatch(/[\r\n]/);
    expect(subject).toBe("Novo lead: Maria Bcc: x@y.z — Limpeza dental");
  });

  it("traz o registro do consentimento: data e hora de Brasília, versão e dado de saúde", () => {
    const { html } = buildLeadEmail(base);
    expect(html).toContain("Consentimento (LGPD)");
    expect(html).toContain("13/11/2026 11:05 (horário de Brasília)");
    expect(html).toContain("Política de Privacidade versão 2026-11-13");
    expect(html).toContain("não se aplica");
  });

  it("escapeHtml cobre aspas simples e duplas", () => {
    expect(escapeHtml(`a"b'c<d>&`)).toBe("a&quot;b&#39;c&lt;d&gt;&amp;");
  });
});
