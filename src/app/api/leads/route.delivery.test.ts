/**
 * Entrega do lead em POST /api/leads, com e-mail e banco SIMULADOS (nenhum lead real é gravado
 * nem enviado): o registro do consentimento vai no e-mail, gravação no banco (com e sem a coluna
 * health_consent), 503 quando nada entrega, e-mail lento sem 503 e descarte de envio repetido.
 *   npx vitest run src/app/api/leads/route.delivery.test.ts
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PRIVACY_POLICY_VERSION } from "@/lib/content";

type EmailResult = { ok: boolean; reason?: string };

const email = vi.hoisted(() => ({
  configurado: true,
  enviar: vi.fn<(data: Record<string, unknown>) => Promise<EmailResult>>(),
}));
const banco = vi.hoisted(() => ({
  configurado: false,
  inserts: [] as Record<string, unknown>[],
  respostas: [] as ({ error: null } | { error: { code: string } })[],
}));

vi.mock("@/lib/email", () => ({
  isEmailConfigured: () => email.configurado,
  sendLeadNotification: (data: Record<string, unknown>) => email.enviar(data),
}));
vi.mock("@/lib/supabase", () => ({
  isSupabaseConfigured: () => banco.configurado,
  getServerSupabase: () => ({
    from: () => ({
      insert: (row: Record<string, unknown>) => {
        banco.inserts.push(row);
        const resposta = banco.respostas.shift() ?? { error: null };
        return { abortSignal: () => Promise.resolve(resposta) };
      },
    }),
  }),
}));

const { POST } = await import("./route");

let ipSeq = 0;
const novoIp = () => `10.9.${Math.floor(ipSeq / 250)}.${(ipSeq++ % 250) + 1}`;
const valido = (extra: Record<string, unknown> = {}) => ({
  fullName: "Maria da Silva",
  whatsapp: "(11) 91234-5678",
  treatmentInterest: "Avaliação odontológica",
  preferredPeriod: "Tanto faz",
  lgpdConsent: true,
  formStartedAt: Date.now() - 60_000,
  ...extra,
});
const chamar = (body: unknown) =>
  POST(
    new Request("http://localhost:3100/api/leads", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        host: "localhost:3100",
        "x-real-ip": novoIp(),
      },
      body: JSON.stringify(body),
    }),
  );

beforeEach(() => {
  email.configurado = true;
  email.enviar.mockReset();
  email.enviar.mockResolvedValue({ ok: true });
  banco.configurado = false;
  banco.inserts = [];
  banco.respostas = [];
});
afterEach(() => {
  vi.useRealTimers();
});

describe("POST /api/leads — entrega", () => {
  it("só e-mail: 200 emailed e o e-mail leva data, hora, versão da política e 'não se aplica'", async () => {
    const res = await chamar(valido());
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true, persisted: false, emailed: true });
    const dados = email.enviar.mock.calls[0][0];
    expect(dados.privacyPolicyVersion).toBe(PRIVACY_POLICY_VERSION);
    expect(String(dados.consentAt)).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/);
    expect(dados.healthConsent).toBe("nao_se_aplica");
  });

  it("com queixa e consentimento de saúde, o e-mail registra 'sim'", async () => {
    await chamar(valido({ mainComplaint: "Dor no dente do siso", healthConsent: true }));
    expect(email.enviar.mock.calls[0][0].healthConsent).toBe("sim");
  });

  it("com banco: grava o lead com o mesmo instante do consentimento do e-mail", async () => {
    banco.configurado = true;
    email.enviar.mockResolvedValue({ ok: false, reason: "not_configured" });
    const res = await chamar(valido());
    expect(await res.json()).toEqual({ ok: true, persisted: true, emailed: false });
    expect(banco.inserts).toHaveLength(1);
    expect(banco.inserts[0].lgpd_consent_at).toBe(email.enviar.mock.calls[0][0].consentAt);
    expect(banco.inserts[0].privacy_policy_version).toBe(PRIVACY_POLICY_VERSION);
  });

  it("banco sem a coluna health_consent (PGRST204 ou 42703): grava de novo sem ela", async () => {
    for (const code of ["PGRST204", "42703"]) {
      banco.configurado = true;
      banco.inserts = [];
      banco.respostas = [{ error: { code } }, { error: null }];
      const res = await chamar(valido());
      expect((await res.json()).persisted).toBe(true);
      expect(banco.inserts).toHaveLength(2);
      expect("health_consent" in banco.inserts[1]).toBe(false);
    }
  });

  it("nem banco nem e-mail: 503 delivery_failed", async () => {
    banco.configurado = true;
    banco.respostas = [{ error: { code: "500" } }];
    email.enviar.mockResolvedValue({ ok: false, reason: "send_failed" });
    const res = await chamar(valido());
    expect(res.status).toBe(503);
    expect((await res.json()).error).toBe("delivery_failed");
  });

  it("e-mail lento (9 s) sem banco: não devolve 503, responde emailed 'pending'", async () => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
    email.enviar.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ ok: true }), 9000)),
    );
    const pendente = chamar(valido());
    await vi.advanceTimersByTimeAsync(8100);
    const res = await pendente;
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true, persisted: false, emailed: "pending" });
  });

  it("o mesmo submissionId duas vezes gera um só envio", async () => {
    const corpo = valido({ submissionId: "3f1c2b9a-7d4e-4a51-9b0c-2e8f6a1d5c77" });
    const r1 = await chamar(corpo);
    const r2 = await chamar(corpo);
    expect((await r1.json()).emailed).toBe(true);
    expect(await r2.json()).toEqual({
      ok: true,
      persisted: false,
      emailed: false,
      duplicate: true,
    });
    expect(email.enviar).toHaveBeenCalledTimes(1);
  });

  it("submissionId fora do formato é ignorado (não deduplica)", async () => {
    const corpo = valido({ submissionId: "<x>" });
    await chamar(corpo);
    await chamar(corpo);
    expect(email.enviar).toHaveBeenCalledTimes(2);
  });
});
