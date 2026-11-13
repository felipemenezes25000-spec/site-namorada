/**
 * Ações do painel /admin com cookies, cabeçalhos, redirecionamento e banco SIMULADOS: login com
 * bloqueio depois de 8 falhas, senha certa grava a sessão, troca de status validada e sem sessão.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";

const estado = vi.hoisted(() => ({
  cookies: new Map<string, string>(),
  ip: "10.1.1.1",
  updates: [] as { status: string; id: string }[],
  erroUpdate: null as null | { code: string },
}));

vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: (k: string) =>
      estado.cookies.has(k) ? { name: k, value: estado.cookies.get(k)! } : undefined,
    set: (k: string, v: string) => estado.cookies.set(k, v),
    delete: (k: string) => estado.cookies.delete(k),
  }),
  headers: async () => new Headers({ "x-real-ip": estado.ip }),
}));
vi.mock("next/navigation", () => ({
  redirect: (to: string) => {
    throw new Error(`REDIRECT:${to}`);
  },
}));
vi.mock("next/cache", () => ({ revalidatePath: () => {} }));
vi.mock("@/lib/supabase", () => ({
  getAdminSupabase: () => ({
    from: () => ({
      update: (v: { status: string }) => ({
        eq: async (_c: string, id: string) => {
          estado.updates.push({ status: v.status, id });
          return { error: estado.erroUpdate };
        },
      }),
    }),
  }),
}));

process.env.ADMIN_PASSWORD = "senha-de-teste-1234";
process.env.ADMIN_SESSION_SECRET = "segredo-de-sessao-de-teste-com-32-caracteres!";

const { login, updateLeadStatus } = await import("./actions");
const { ADMIN_COOKIE } = await import("@/lib/admin-auth");

const form = (password: string) => {
  const f = new FormData();
  f.set("password", password);
  return f;
};

let ipSeq = 0;
beforeEach(() => {
  estado.cookies.clear();
  estado.ip = `10.1.${Math.floor(ipSeq / 250)}.${(ipSeq++ % 250) + 1}`;
  estado.updates = [];
  estado.erroUpdate = null;
});

async function entrar() {
  await expect(login({}, form("senha-de-teste-1234"))).rejects.toThrow("REDIRECT:/admin");
}

describe("login", () => {
  it("senha errada: mensagem, sem sessão", async () => {
    expect(await login({}, form("errada"))).toEqual({ error: "Senha incorreta. Tente novamente." });
    expect(estado.cookies.has(ADMIN_COOKIE)).toBe(false);
  });

  it("senha certa: grava a sessão e redireciona", async () => {
    await entrar();
    expect(estado.cookies.get(ADMIN_COOKIE)).toBeTruthy();
  });

  it("depois de 8 falhas o IP fica bloqueado, mesmo acertando a senha", async () => {
    for (let i = 0; i < 8; i++) await login({}, form("errada"));
    const r = await login({}, form("senha-de-teste-1234"));
    expect(r.error).toMatch(/^Muitas tentativas/);
    expect(estado.cookies.has(ADMIN_COOKIE)).toBe(false);
  });
});

describe("updateLeadStatus", () => {
  it("sem sessão: unauthorized e nada muda", async () => {
    expect(await updateLeadStatus("3f1c2b9a-7d4e", "contacted")).toEqual({
      ok: false,
      error: "unauthorized",
    });
    expect(estado.updates).toHaveLength(0);
  });

  it("com sessão: id e status inválidos são recusados", async () => {
    await entrar();
    expect(await updateLeadStatus("'; drop table", "contacted")).toEqual({
      ok: false,
      error: "invalid_id",
    });
    expect(await updateLeadStatus("3f1c2b9a-7d4e", "qualquer")).toEqual({
      ok: false,
      error: "invalid_status",
    });
    expect(estado.updates).toHaveLength(0);
  });

  it("com sessão: status válido é gravado; erro do banco vira update_failed", async () => {
    await entrar();
    const { leadStatuses } = await import("@/types/lead");
    expect(await updateLeadStatus("3f1c2b9a-7d4e", leadStatuses[1])).toEqual({ ok: true });
    expect(estado.updates).toEqual([{ status: leadStatuses[1], id: "3f1c2b9a-7d4e" }]);
    estado.erroUpdate = { code: "500" };
    expect(await updateLeadStatus("3f1c2b9a-7d4e", leadStatuses[0])).toEqual({
      ok: false,
      error: "update_failed",
    });
  });

  it("sessão adulterada não vale", async () => {
    estado.cookies.set(ADMIN_COOKIE, "token.falso");
    expect(await updateLeadStatus("3f1c2b9a-7d4e", "contacted")).toEqual({
      ok: false,
      error: "unauthorized",
    });
  });
});
