/**
 * Decisão de cookies com o armazenamento do navegador bloqueado (Safari restrito, navegadores
 * embutidos): ler ou gravar lança SecurityError, e o site não pode cair (regressão do defeito alto
 * nº 1 da rodada 1). A decisão vale na memória da visita.
 */
import { afterEach, describe, expect, it, vi } from "vitest";

const bloqueado = {
  getItem() {
    throw new DOMException("bloqueado", "SecurityError");
  },
  setItem() {
    throw new DOMException("bloqueado", "SecurityError");
  },
  removeItem() {
    throw new DOMException("bloqueado", "SecurityError");
  },
};

function janela(storage: unknown) {
  const ouvintes = new Map<string, ((e: Event) => void)[]>();
  vi.stubGlobal("window", {
    localStorage: storage,
    addEventListener: (t: string, f: (e: Event) => void) =>
      ouvintes.set(t, [...(ouvintes.get(t) ?? []), f]),
    removeEventListener: () => {},
    dispatchEvent: (e: Event) => {
      for (const f of ouvintes.get(e.type) ?? []) f(e);
      return true;
    },
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.resetModules();
});

describe("cookie-consent com armazenamento bloqueado", () => {
  it("getConsent não lança e começa pendente", async () => {
    janela(bloqueado);
    const { getConsent } = await import("./cookie-consent");
    expect(() => getConsent()).not.toThrow();
    expect(getConsent()).toBe("pending");
  });

  it("setConsent não lança, avisa quem escuta e a decisão vale na memória", async () => {
    janela(bloqueado);
    const { getConsent, setConsent, subscribeConsent } = await import("./cookie-consent");
    const recebidos: string[] = [];
    subscribeConsent((s) => recebidos.push(s));
    expect(() => setConsent("declined")).not.toThrow();
    expect(getConsent()).toBe("declined");
    expect(recebidos).toEqual(["declined"]);
  });

  it("com armazenamento normal, a decisão gravada é lida de volta", async () => {
    const dados = new Map<string, string>();
    janela({
      getItem: (k: string) => dados.get(k) ?? null,
      setItem: (k: string, v: string) => dados.set(k, v),
      removeItem: () => {},
    });
    const { getConsent, setConsent } = await import("./cookie-consent");
    setConsent("accepted");
    expect(dados.get("abl_cookie_consent")).toBe("accepted");
    expect(getConsent()).toBe("accepted");
  });

  it("no servidor (sem window) é sempre pendente", async () => {
    const { getConsent } = await import("./cookie-consent");
    expect(getConsent()).toBe("pending");
  });
});
