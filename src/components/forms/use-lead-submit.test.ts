/** Resposta da API -> o que o formulário mostra (sem rede de verdade: fetch simulado). */
import { describe, expect, it, vi } from "vitest";
import { enviarLead, maskPhone, novoSubmissionId } from "./use-lead-submit";

const resposta = (status: number, body: unknown, headers: Record<string, string> = {}) =>
  vi.fn(async () => new Response(JSON.stringify(body), { status, headers }));

describe("enviarLead", () => {
  it("200: sucesso", async () => {
    const r = await enviarLead(
      {},
      { fetchImpl: resposta(200, { ok: true, persisted: false, emailed: true }) },
    );
    expect(r).toEqual({ tipo: "sucesso", trap: false });
  });

  it("200 com armadilha de robô: sucesso marcado como trap (sem conversão)", async () => {
    const r = await enviarLead(
      {},
      { fetchImpl: resposta(200, { ok: true, persisted: false, emailed: false, trap: true }) },
    );
    expect(r).toEqual({ tipo: "sucesso", trap: true });
  });

  it("200 com envio repetido (duplicate) ou e-mail pendente: sucesso", async () => {
    for (const body of [
      { ok: true, persisted: false, emailed: false, duplicate: true },
      { ok: true, persisted: false, emailed: "pending" },
    ]) {
      expect((await enviarLead({}, { fetchImpl: resposta(200, body) })).tipo).toBe("sucesso");
    }
  });

  it("422: erros por campo, e o bloco opcional abre quando o erro é de um campo dele", async () => {
    const r = await enviarLead(
      {},
      {
        fetchImpl: resposta(422, {
          ok: false,
          error: "validation",
          fieldErrors: {
            whatsapp: ["Informe um WhatsApp válido."],
            email: ["E-mail inválido."],
            website: ["x"],
          },
          formErrors: [],
        }),
      },
    );
    expect(r).toEqual({
      tipo: "validacao",
      erros: [
        { campo: "whatsapp", mensagem: "Informe um WhatsApp válido." },
        { campo: "email", mensagem: "E-mail inválido." },
      ],
      abrirOpcionais: true,
    });
  });

  it("422 sem campo conhecido: um erro genérico no nome", async () => {
    const r = await enviarLead(
      {},
      {
        fetchImpl: resposta(422, {
          ok: false,
          error: "validation",
          fieldErrors: {},
          formErrors: [],
        }),
      },
    );
    expect(r.tipo === "validacao" && r.erros[0].campo).toBe("fullName");
  });

  it("429: aviso de limite com os minutos do Retry-After", async () => {
    const r = await enviarLead(
      {},
      {
        fetchImpl: resposta(
          429,
          { ok: false, error: "rate_limited", retryAfter: 125 },
          { "Retry-After": "125" },
        ),
      },
    );
    expect(r).toEqual({ tipo: "aviso", aviso: { kind: "limite", minutos: 3 } });
  });

  it("503, 403 e 413: aviso genérico do servidor", async () => {
    for (const status of [503, 403, 413]) {
      const r = await enviarLead({}, { fetchImpl: resposta(status, { ok: false, error: "x" }) });
      expect(r).toEqual({ tipo: "aviso", aviso: { kind: "servidor" } });
    }
  });

  it("rede fora: aviso de conexão", async () => {
    const r = await enviarLead(
      {},
      { fetchImpl: vi.fn(async () => Promise.reject(new TypeError("Failed to fetch"))) },
    );
    expect(r).toEqual({ tipo: "aviso", aviso: { kind: "rede", talvezEnviado: false } });
  });

  it("tempo esgotado: aviso de conexão dizendo que o envio pode ter chegado", async () => {
    const pendurado = vi.fn(
      (_url: RequestInfo | URL, init?: RequestInit) =>
        new Promise<Response>((_, reject) => {
          init?.signal?.addEventListener("abort", () =>
            reject(new DOMException("abortado", "AbortError")),
          );
        }),
    );
    const r = await enviarLead(
      {},
      { fetchImpl: pendurado as unknown as typeof fetch, timeoutMs: 20 },
    );
    expect(r).toEqual({ tipo: "aviso", aviso: { kind: "rede", talvezEnviado: true } });
  });

  it("envia o corpo em JSON para /api/leads", async () => {
    const f = resposta(200, { ok: true, persisted: false, emailed: true });
    await enviarLead({ fullName: "Maria", submissionId: "abc12345" }, { fetchImpl: f });
    const [url, init] = f.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("/api/leads");
    expect(JSON.parse(String(init.body))).toMatchObject({
      fullName: "Maria",
      submissionId: "abc12345",
    });
  });
});

describe("auxiliares do formulário", () => {
  it("maskPhone formata enquanto a pessoa digita", () => {
    expect(maskPhone("11")).toBe("(11");
    expect(maskPhone("1191234")).toBe("(11) 9123-4");
    expect(maskPhone("11912345678")).toBe("(11) 91234-5678");
    expect(maskPhone("1132345678")).toBe("(11) 3234-5678");
  });

  it("novoSubmissionId gera ids distintos no formato aceito pela API", () => {
    const a = novoSubmissionId();
    const b = novoSubmissionId();
    expect(a).not.toBe(b);
    expect(a).toMatch(/^[A-Za-z0-9-]{8,64}$/);
  });
});
