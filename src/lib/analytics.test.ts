import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

type Win = {
  gtag: ReturnType<typeof vi.fn>;
  fbq: ReturnType<typeof vi.fn>;
  dataLayer: Record<string, unknown>[];
};

function fakeWindow(): Win {
  return { gtag: vi.fn(), fbq: vi.fn(), dataLayer: [] };
}

/** O modo (GTM ou gtag) é decidido na carga do módulo: recarrega com o ambiente pedido. */
async function carregar(gtmId?: string) {
  vi.resetModules();
  vi.stubEnv("NEXT_PUBLIC_GTM_ID", gtmId ?? "");
  return import("./analytics");
}

describe("sanitizeParams", () => {
  it("remove chaves de dado pessoal e valores com e-mail ou telefone", async () => {
    const { sanitizeParams } = await carregar();
    const out = sanitizeParams({
      location: "hero",
      email: "a@b.com",
      full_name: "Maria",
      phone: "11999999999",
      treatment: "implante",
      target: "contato@exemplo.com.br",
      href: "tel:+5511939222289",
    });
    expect(out).toEqual({ location: "hero", treatment: "implante" });
  });

  it("corta textos longos em 100 caracteres e mantém números e booleanos", async () => {
    const { sanitizeParams } = await carregar();
    const out = sanitizeParams({ location: "x".repeat(300), n: 3, ok: true });
    expect((out.location as string).length).toBe(100);
    expect(out.n).toBe(3);
    expect(out.ok).toBe(true);
  });
});

describe("track", () => {
  let win: Win;
  beforeEach(() => {
    win = fakeWindow();
    vi.stubGlobal("window", win);
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("sem GTM, só o gtag recebe o evento, e o dataLayer fica vazio", async () => {
    const { track } = await carregar();
    track("whatsapp_click", { location: "hero" });
    expect(win.gtag).toHaveBeenCalledTimes(1);
    expect(win.gtag).toHaveBeenCalledWith("event", "whatsapp_click", { location: "hero" });
    expect(win.dataLayer).toHaveLength(0);
  });

  it("com GTM, só o dataLayer recebe { event, ... } e o gtag não é chamado", async () => {
    const { track } = await carregar("GTM-ABC1234");
    track("whatsapp_click", { location: "mobile_bar" });
    expect(win.dataLayer).toEqual([{ event: "whatsapp_click", location: "mobile_bar" }]);
    expect(win.gtag).not.toHaveBeenCalled();
    // nenhuma entrada no formato do gtag: ['event', ...]
    expect(win.dataLayer.some((e) => Array.isArray(e))).toBe(false);
  });

  it("ID de GTM malformado é ignorado (volta ao gtag)", async () => {
    const { track } = await carregar("gtm-invalido");
    track("phone_click", { location: "footer" });
    expect(win.gtag).toHaveBeenCalledTimes(1);
    expect(win.dataLayer).toHaveLength(0);
  });

  it("o Meta Pixel não recebe `need` e mapeia os eventos-chave", async () => {
    const { track } = await carregar();
    track("situation_select", { location: "home", need: "dor" });
    expect(win.fbq).toHaveBeenCalledWith("trackCustom", "situation_select", { location: "home" });
    track("lead_created", { location: "obrigado", need: "tempo" });
    expect(win.fbq).toHaveBeenCalledWith("track", "Lead", { location: "obrigado" });
    track("whatsapp_click", { location: "hero" });
    expect(win.fbq).toHaveBeenCalledWith("track", "Contact", { location: "hero" });
  });

  it("o gtag recebe `need` (identificador neutro) e nunca dado pessoal", async () => {
    const { track } = await carregar();
    track("situation_select", { location: "home", need: "dor", email: "x@y.com" } as never);
    expect(win.gtag).toHaveBeenCalledWith("event", "situation_select", {
      location: "home",
      need: "dor",
    });
  });

  it("email_click é um evento válido", async () => {
    const { track } = await carregar();
    track("email_click", { location: "footer" });
    expect(win.gtag).toHaveBeenCalledWith("event", "email_click", { location: "footer" });
  });

  it("nunca lança, mesmo com um gtag que falha, e não faz nada no servidor", async () => {
    const { track } = await carregar();
    win.gtag.mockImplementation(() => {
      throw new Error("falha do script de terceiros");
    });
    expect(() => track("map_click", { location: "contact" })).not.toThrow();
    vi.unstubAllGlobals();
    expect(() => track("map_click", {})).not.toThrow();
  });
});
