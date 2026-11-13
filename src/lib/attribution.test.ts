import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// O módulo importa getConsent de um componente cliente (React, next/link): trocamos por um stub.
let consentimento: "accepted" | "declined" | "pending" = "pending";
vi.mock("@/components/seo/cookie-consent", () => ({ getConsent: () => consentimento }));

import { captureAttribution, getAttribution, syncAttributionConsent } from "./attribution";

class MemoryStorage {
  private data = new Map<string, string>();
  getItem(k: string) {
    return this.data.get(k) ?? null;
  }
  setItem(k: string, v: string) {
    this.data.set(k, String(v));
  }
  removeItem(k: string) {
    this.data.delete(k);
  }
}

/** Armazenamento bloqueado (modo privado restrito, cookies desligados): toda chamada lança. */
const blocked = {
  getItem() {
    throw new Error("SecurityError: armazenamento bloqueado");
  },
  setItem() {
    throw new Error("SecurityError: armazenamento bloqueado");
  },
  removeItem() {
    throw new Error("SecurityError: armazenamento bloqueado");
  },
};

type Win = { sessionStorage: MemoryStorage; localStorage: MemoryStorage };

function montar(search: string, opts: { session?: unknown; local?: unknown } = {}) {
  const win = {
    location: { search, pathname: "/tratamentos/implante" },
    sessionStorage: opts.session ?? new MemoryStorage(),
    localStorage: opts.local ?? new MemoryStorage(),
  };
  vi.stubGlobal("window", win);
  vi.stubGlobal("document", { referrer: "https://www.google.com/" });
  return win as unknown as Win;
}

beforeEach(() => {
  consentimento = "pending";
});
afterEach(() => {
  vi.unstubAllGlobals();
});

describe("captureAttribution", () => {
  it("guarda gclid e UTM na sessão, com página de entrada e referrer", () => {
    montar("?gclid=ABC123&utm_source=google&utm_medium=cpc&utm_campaign=implante&x=1");
    captureAttribution();
    expect(getAttribution()).toMatchObject({
      gclid: "ABC123",
      utmSource: "google",
      utmMedium: "cpc",
      utmCampaign: "implante",
      // a página de entrada guarda o caminho com a query, como foi aberta
      landingPage:
        "/tratamentos/implante?gclid=ABC123&utm_source=google&utm_medium=cpc&utm_campaign=implante&x=1",
      referrer: "https://www.google.com/",
    });
  });

  it("limita cada valor a 200 caracteres", () => {
    montar(`?gclid=${"a".repeat(500)}`);
    captureAttribution();
    expect(getAttribution()?.gclid?.length).toBe(200);
  });

  it("sem aceite de cookies não grava nada no localStorage", () => {
    const w = montar("?gclid=ABC");
    captureAttribution();
    expect(w.localStorage.getItem("abl_attribution")).toBeNull();
  });

  it("com aceite grava também no localStorage, e recusar apaga a cópia", () => {
    consentimento = "accepted";
    const w = montar("?gclid=ABC");
    captureAttribution();
    expect(w.localStorage.getItem("abl_attribution")).toContain("ABC");
    syncAttributionConsent(false);
    expect(w.localStorage.getItem("abl_attribution")).toBeNull();
  });

  it("novos parâmetros de campanha substituem os anteriores (último clique)", () => {
    const w = montar("?gclid=PRIMEIRO");
    captureAttribution();
    expect(getAttribution()?.gclid).toBe("PRIMEIRO");
    vi.stubGlobal("window", { ...w, location: { search: "?gclid=SEGUNDO", pathname: "/" } });
    captureAttribution();
    expect(getAttribution()?.gclid).toBe("SEGUNDO");
  });

  it("sem parâmetros novos, preserva o que já foi capturado", () => {
    const w = montar("?gclid=PRIMEIRO");
    captureAttribution();
    vi.stubGlobal("window", { ...w, location: { search: "", pathname: "/sobre" } });
    captureAttribution();
    expect(getAttribution()?.gclid).toBe("PRIMEIRO");
  });

  it("uma cópia persistida com mais de 90 dias é descartada", () => {
    consentimento = "accepted";
    const w = montar("");
    const velho = Date.now() - 91 * 86_400_000;
    w.localStorage.setItem("abl_attribution", JSON.stringify({ gclid: "VELHO", savedAt: velho }));
    expect(getAttribution()).toBeNull();
    expect(w.localStorage.getItem("abl_attribution")).toBeNull();
  });
});

describe("armazenamento bloqueado", () => {
  it("captureAttribution, getAttribution e syncAttributionConsent nunca lançam", () => {
    montar("?gclid=ABC", { session: blocked, local: blocked });
    expect(() => captureAttribution()).not.toThrow();
    expect(() => getAttribution()).not.toThrow();
    expect(getAttribution()).toBeNull();
    expect(() => syncAttributionConsent(true)).not.toThrow();
    expect(() => syncAttributionConsent(false)).not.toThrow();
  });
});

describe("no servidor", () => {
  it("não faz nada nem lança quando não há window", () => {
    vi.stubGlobal("window", undefined);
    expect(() => captureAttribution()).not.toThrow();
    expect(getAttribution()).toBeNull();
  });
});
