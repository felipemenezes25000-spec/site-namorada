/**
 * Testes da autenticação do painel. Rodam com o executor nativo do Node (sem dependência nova):
 *   node --test --import <registro-do-alias @/> src/lib/admin-auth.test.ts
 * O registro do alias fica fora do repositório (rascunhos da reauditoria); o que vale aqui é o
 * comportamento documentado em admin-auth.ts.
 */
import { afterEach, beforeEach, describe, it, mock } from "node:test";
import assert from "node:assert/strict";
import {
  LOGIN_MAX_FAILURES,
  LOGIN_WINDOW_MS,
  adminStatus,
  clearLoginFailures,
  createToken,
  loginLockRemaining,
  registerLoginFailure,
  resetLoginFailuresForTests,
  verifyPassword,
  verifyToken,
} from "./admin-auth";

const PASSWORD = "senha-de-teste-longa";
const SECRET = "x".repeat(40);

describe("adminStatus", () => {
  const old = { p: process.env.ADMIN_PASSWORD, s: process.env.ADMIN_SESSION_SECRET };
  afterEach(() => {
    process.env.ADMIN_PASSWORD = old.p;
    process.env.ADMIN_SESSION_SECRET = old.s;
    if (old.p === undefined) delete process.env.ADMIN_PASSWORD;
    if (old.s === undefined) delete process.env.ADMIN_SESSION_SECRET;
  });

  it("só liga com senha (>= 12) e segredo (>= 32)", () => {
    delete process.env.ADMIN_PASSWORD;
    delete process.env.ADMIN_SESSION_SECRET;
    assert.equal(adminStatus(), "missing_password");
    process.env.ADMIN_PASSWORD = "curta";
    assert.equal(adminStatus(), "weak_password");
    process.env.ADMIN_PASSWORD = PASSWORD;
    assert.equal(adminStatus(), "missing_secret");
    process.env.ADMIN_SESSION_SECRET = "curto";
    assert.equal(adminStatus(), "weak_secret");
    process.env.ADMIN_SESSION_SECRET = SECRET;
    assert.equal(adminStatus(), "ok");
  });
});

describe("senha e token", () => {
  beforeEach(() => {
    process.env.ADMIN_PASSWORD = PASSWORD;
    process.env.ADMIN_SESSION_SECRET = SECRET;
  });
  afterEach(() => mock.restoreAll());

  it("confere a senha", () => {
    assert.equal(verifyPassword(PASSWORD), true);
    assert.equal(verifyPassword(PASSWORD + "x"), false);
    assert.equal(verifyPassword(""), false);
  });

  it("aceita o token emitido e recusa adulterado, vazio ou expirado", () => {
    const token = createToken();
    assert.equal(verifyToken(token), true);
    assert.equal(verifyToken(undefined), false);
    assert.equal(verifyToken("sem-ponto"), false);
    assert.equal(verifyToken(token.slice(0, -2) + "xx"), false);
    const real = Date.now();
    mock.method(Date, "now", () => real + 9 * 60 * 60 * 1000);
    assert.equal(verifyToken(token), false);
  });

  it("trocar a senha invalida as sessões abertas", () => {
    const token = createToken();
    process.env.ADMIN_PASSWORD = PASSWORD + "-nova";
    assert.equal(verifyToken(token), false);
  });
});

describe("limite de tentativas de login", () => {
  let now = 1_700_000_000_000;
  beforeEach(() => {
    resetLoginFailuresForTests();
    now = 1_700_000_000_000;
    mock.method(Date, "now", () => now);
  });
  afterEach(() => mock.restoreAll());

  it("senhas erradas bloqueiam depois do limite", () => {
    for (let i = 0; i < LOGIN_MAX_FAILURES - 1; i++) registerLoginFailure("ip-a");
    assert.equal(loginLockRemaining("ip-a"), 0);
    registerLoginFailure("ip-a");
    assert.ok(loginLockRemaining("ip-a") > 0);
  });

  it("acertar a senha não gasta tentativa: zera as falhas", () => {
    for (let i = 0; i < LOGIN_MAX_FAILURES - 1; i++) registerLoginFailure("ip-a");
    clearLoginFailures("ip-a");
    for (let i = 0; i < LOGIN_MAX_FAILURES - 1; i++) registerLoginFailure("ip-a");
    assert.equal(loginLockRemaining("ip-a"), 0);
  });

  it("não há contagem quando só há acertos (nada é registrado)", () => {
    for (let i = 0; i < 50; i++) clearLoginFailures("ip-a");
    assert.equal(loginLockRemaining("ip-a"), 0);
  });

  it("cada IP tem a sua conta", () => {
    for (let i = 0; i < LOGIN_MAX_FAILURES; i++) registerLoginFailure("ip-a");
    assert.ok(loginLockRemaining("ip-a") > 0);
    assert.equal(loginLockRemaining("ip-b"), 0);
  });

  it("a janela não desliza e o bloqueio acaba no prazo", () => {
    for (let i = 0; i < LOGIN_MAX_FAILURES; i++) registerLoginFailure("ip-a");
    now += LOGIN_WINDOW_MS - 1000;
    assert.equal(loginLockRemaining("ip-a"), 1);
    now += 2000;
    assert.equal(loginLockRemaining("ip-a"), 0);
    registerLoginFailure("ip-a"); // nova janela
    assert.equal(loginLockRemaining("ip-a"), 0);
  });
});
