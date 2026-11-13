/**
 * Testes do limitador de taxa (Vitest, o executor oficial do projeto).
 *   npx vitest run src/lib/rate-limit.test.ts
 * O comportamento está documentado em rate-limit.ts.
 */
import { afterEach, beforeEach, describe, it, vi } from "vitest";
import assert from "node:assert/strict";
import { clientIp, rateLimit, resetRateLimitForTests } from "./rate-limit";

const MIN = 60_000;

describe("rateLimit", () => {
  let now = 1_700_000_000_000;
  beforeEach(() => {
    resetRateLimitForTests();
    now = 1_700_000_000_000;
    vi.spyOn(Date, "now").mockImplementation(() => now);
  });
  afterEach(() => vi.restoreAllMocks());

  it("libera até o limite e bloqueia a seguinte, com Retry-After em segundos", () => {
    for (let i = 0; i < 3; i++) assert.equal(rateLimit("k", 3, 10 * MIN).ok, true);
    const bloqueada = rateLimit("k", 3, 10 * MIN);
    assert.equal(bloqueada.ok, false);
    assert.equal(bloqueada.remaining, 0);
    assert.equal(bloqueada.retryAfter, 600);
    now += 90_000;
    assert.equal(rateLimit("k", 3, 10 * MIN).retryAfter, 510);
  });

  it("conta o restante a cada chamada", () => {
    assert.equal(rateLimit("r", 2, MIN).remaining, 1);
    assert.equal(rateLimit("r", 2, MIN).remaining, 0);
  });

  it("a janela não desliza: passado o prazo o contador reinicia", () => {
    for (let i = 0; i < 2; i++) rateLimit("j", 2, MIN);
    assert.equal(rateLimit("j", 2, MIN).ok, false);
    now += MIN + 1;
    const nova = rateLimit("j", 2, MIN);
    assert.equal(nova.ok, true);
    assert.equal(nova.remaining, 1);
  });

  it("chaves diferentes não se misturam", () => {
    rateLimit("a", 1, MIN);
    assert.equal(rateLimit("a", 1, MIN).ok, false);
    assert.equal(rateLimit("b", 1, MIN).ok, true);
  });

  it("limpeza: com 5000 chaves, remove as expiradas e continua aceitando novas", () => {
    for (let i = 0; i < 5000; i++) rateLimit(`velha-${i}`, 1, MIN);
    now += MIN + 1; // todas expiram
    assert.equal(rateLimit("nova", 1, MIN).ok, true);
    assert.equal(rateLimit("velha-0", 1, MIN).ok, true);
  });

  it("limpeza: cheio e sem expiradas, descarta as mais antigas e mantém o teto", () => {
    for (let i = 0; i < 5000; i++) rateLimit(`k-${i}`, 1, 10 * MIN);
    assert.equal(rateLimit("extra", 1, 10 * MIN).ok, true);
    // a mais antiga saiu (janela nova); uma recente continua bloqueada
    assert.equal(rateLimit("k-0", 1, 10 * MIN).ok, true);
    assert.equal(rateLimit("k-4999", 1, 10 * MIN).ok, false);
  });

  it("reinício da instância zera os contadores (limitação conhecida)", () => {
    rateLimit("z", 1, MIN);
    assert.equal(rateLimit("z", 1, MIN).ok, false);
    resetRateLimitForTests();
    assert.equal(rateLimit("z", 1, MIN).ok, true);
  });
});

describe("clientIp", () => {
  it("prefere os cabeçalhos da plataforma ao x-forwarded-for", () => {
    const h = new Headers({
      "x-forwarded-for": "1.1.1.1",
      "x-real-ip": "2.2.2.2",
      "x-vercel-forwarded-for": "3.3.3.3, 9.9.9.9",
    });
    assert.equal(clientIp(h), "3.3.3.3");
    h.delete("x-vercel-forwarded-for");
    assert.equal(clientIp(h), "2.2.2.2");
    h.delete("x-real-ip");
    assert.equal(clientIp(h), "1.1.1.1");
    assert.equal(clientIp(new Headers()), "unknown");
  });
});
