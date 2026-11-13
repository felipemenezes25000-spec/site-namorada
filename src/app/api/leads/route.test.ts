/**
 * Testes de POST /api/leads: validação em português, origem, limite de taxa, honeypot e trava de
 * tempo. Sem Supabase nem Resend configurados, um lead válido termina em 503 delivery_failed: é o
 * sinal de que a validação passou (nenhum lead é gravado nem enviado nos testes).
 *   npx vitest run src/app/api/leads/route.test.ts
 */
import { beforeAll as before, describe, it } from "vitest";
import assert from "node:assert/strict";

delete process.env.RESEND_API_KEY;
delete process.env.NEXT_PUBLIC_SUPABASE_URL;
delete process.env.SUPABASE_SERVICE_ROLE_KEY;

type Route = typeof import("./route");
let POST: Route["POST"];
before(async () => {
  ({ POST } = await import("./route"));
});

let ipSeq = 0;
const novoIp = () => `10.0.${Math.floor(ipSeq / 250)}.${(ipSeq++ % 250) + 1}`;

const valido = () => ({
  fullName: "Maria da Silva",
  whatsapp: "(11) 91234-5678",
  treatmentInterest: "Avaliação odontológica",
  preferredPeriod: "Tanto faz",
  lgpdConsent: true,
  formStartedAt: Date.now() - 60_000,
});

function chamar(body: unknown, headers: Record<string, string> = {}, ip = novoIp()) {
  return POST(
    new Request("http://localhost:3100/api/leads", {
      method: "POST",
      headers: { "content-type": "application/json", host: "localhost:3100", "x-real-ip": ip, ...headers },
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
  );
}

describe("POST /api/leads", () => {
  it("lead válido passa pela validação (503 porque nada está configurado no teste)", async () => {
    const res = await chamar(valido());
    assert.equal(res.status, 503);
    assert.equal((await res.json()).error, "delivery_failed");
  });

  it("422 em português para tratamento inexistente", async () => {
    const res = await chamar({ ...valido(), treatmentInterest: "Clareamento milagroso" });
    assert.equal(res.status, 422);
    const j = await res.json();
    assert.deepEqual(j.fieldErrors.treatmentInterest, ["Selecione um tratamento de interesse."]);
    assert.equal("issues" in j, false);
  });

  it("422 em português quando faltam o whatsapp e o tratamento", async () => {
    const { whatsapp: _w, treatmentInterest: _t, ...resto } = valido();
    void _w;
    void _t;
    const res = await chamar(resto);
    assert.equal(res.status, 422);
    const j = await res.json();
    assert.deepEqual(j.fieldErrors.whatsapp, ["Informe um WhatsApp para contato."]);
    assert.deepEqual(j.fieldErrors.treatmentInterest, ["Selecione um tratamento de interesse."]);
  });

  it("422 para data preferida inválida", async () => {
    for (const preferredDate of ["abc", "2026-13-40", "1999-01-01"]) {
      const res = await chamar({ ...valido(), preferredDate });
      assert.equal(res.status, 422, preferredDate);
      assert.deepEqual((await res.json()).fieldErrors.preferredDate, ["Informe uma data válida."]);
    }
  });

  it("aceita data preferida válida", async () => {
    const d = new Date(Date.now() + 7 * 86_400_000).toISOString().slice(0, 10);
    const res = await chamar({ ...valido(), preferredDate: d });
    assert.equal(res.status, 503);
  });

  it("nome com quebra de linha é normalizado e não leva a linha ao assunto", async () => {
    const { buildAppointmentSchema } = await import("@/lib/validations");
    const { treatmentOptions } = await import("@/lib/lead-treatments");
    const r = buildAppointmentSchema(treatmentOptions).safeParse({
      ...valido(),
      fullName: "Maria\r\nBcc: x@y.com Silva",
    });
    assert.equal(r.success, true);
    if (r.success) assert.equal(/[\r\n]/.test(r.data.fullName), false);
  });

  it("grava o WhatsApp só com dígitos", async () => {
    const { buildAppointmentSchema } = await import("@/lib/validations");
    const { treatmentOptions } = await import("@/lib/lead-treatments");
    const r = buildAppointmentSchema(treatmentOptions).safeParse(valido());
    assert.equal(r.success && r.data.whatsapp, "11912345678");
  });

  it("exige consentimento de saúde quando há queixa ou radiografia", async () => {
    const res = await chamar({ ...valido(), mainComplaint: "Dor ao mastigar" });
    assert.equal(res.status, 422);
    assert.equal((await res.json()).fieldErrors.healthConsent.length, 1);
    const ok = await chamar({ ...valido(), mainComplaint: "Dor ao mastigar", healthConsent: true });
    assert.equal(ok.status, 503);
    // Responder "Não" na radiografia não é dado de saúde a proteger: não exige a caixa.
    assert.equal((await chamar({ ...valido(), hasXray: "nao" })).status, 503);
    assert.equal((await chamar({ ...valido(), hasXray: "sim" })).status, 422);
  });

  it("422 sem consentimento de contato", async () => {
    const res = await chamar({ ...valido(), lgpdConsent: false });
    assert.equal(res.status, 422);
    assert.ok((await res.json()).fieldErrors.lgpdConsent);
  });

  it("403 para origem de outro site", async () => {
    const res = await chamar(valido(), { origin: "https://outro-site.example" });
    assert.equal(res.status, 403);
    assert.equal((await res.json()).error, "forbidden");
  });

  it("403 para Sec-Fetch-Site cross-site sem Origin", async () => {
    const res = await chamar(valido(), { "sec-fetch-site": "cross-site" });
    assert.equal(res.status, 403);
  });

  it("400 para JSON inválido e 413 para corpo grande", async () => {
    assert.equal((await chamar("{isto nao e json")).status, 400);
    assert.equal((await chamar("[]")).status, 400);
    const grande = await chamar({ ...valido(), mainComplaint: "x".repeat(25_000) });
    assert.equal(grande.status, 413);
  });

  it("honeypot preenchido finge sucesso sem gravar", async () => {
    const res = await chamar({ ...valido(), website: "http://spam.example" });
    assert.equal(res.status, 200);
    const j = await res.json();
    assert.equal(j.trap, true);
    assert.equal(j.persisted, false);
  });

  it("trava de tempo: menos de 3 s é descartado; relógio no futuro ou ausente não é suspeito", async () => {
    const rapido = await chamar({ ...valido(), formStartedAt: Date.now() - 500 });
    assert.equal((await rapido.json()).trap, true);
    const futuro = await chamar({ ...valido(), formStartedAt: Date.now() + 3_600_000 });
    assert.equal(futuro.status, 503);
    const { formStartedAt: _f, ...semRelogio } = valido();
    void _f;
    assert.equal((await chamar(semRelogio)).status, 503);
  });

  it("429 com Retry-After depois de 30 requisições do mesmo IP", async () => {
    const ip = novoIp();
    for (let i = 0; i < 30; i++) await chamar("[]", {}, ip);
    const res = await chamar(valido(), {}, ip);
    assert.equal(res.status, 429);
    const j = await res.json();
    assert.equal(j.error, "rate_limited");
    assert.ok(Number(res.headers.get("retry-after")) > 0);
    assert.equal(j.retryAfter, Number(res.headers.get("retry-after")));
  });

  it("429 do limite estrito: a sexta requisição válida do mesmo IP", async () => {
    const ip = novoIp();
    for (let i = 0; i < 5; i++) assert.equal((await chamar(valido(), {}, ip)).status, 503);
    assert.equal((await chamar(valido(), {}, ip)).status, 429);
  });

  it("erro de preenchimento (422) não gasta o limite estrito", async () => {
    const ip = novoIp();
    for (let i = 0; i < 6; i++) await chamar({ ...valido(), whatsapp: "1" }, {}, ip);
    assert.equal((await chamar(valido(), {}, ip)).status, 503);
  });
});
