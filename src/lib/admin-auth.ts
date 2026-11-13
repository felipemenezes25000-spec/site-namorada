import crypto from "crypto";
import { cookies } from "next/headers";

// Em produção o prefixo __Host- obriga Secure, path=/ e nenhum Domain: subdomínios não sobrescrevem o cookie.
export const ADMIN_COOKIE =
  process.env.NODE_ENV === "production" ? "__Host-abl_admin_session" : "abl_admin_session";
const SESSION_TTL_S = 60 * 60 * 8; // 8h
const MIN_SECRET_LENGTH = 32;
const MIN_PASSWORD_LENGTH = 12;

export type AdminStatus = "ok" | "missing_password" | "missing_secret" | "weak_secret" | "weak_password";

/**
 * O painel só liga com as DUAS variáveis: senha e segredo de sessão (>= 32
 * caracteres). O segredo nunca cai de volta para a senha.
 */
export function adminStatus(): AdminStatus {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return "missing_password";
  if (password.length < MIN_PASSWORD_LENGTH) return "weak_password";
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) return "missing_secret";
  if (secret.length < MIN_SECRET_LENGTH) return "weak_secret";
  return "ok";
}

export function adminConfigured(): boolean {
  return adminStatus() === "ok";
}

function sign(payload: string): string {
  return crypto
    .createHmac("sha256", process.env.ADMIN_SESSION_SECRET ?? "")
    .update(payload)
    .digest("base64url");
}

/** Comparação em tempo constante; hash antes para não vazar o tamanho. */
function safeEqual(a: string, b: string): boolean {
  const ha = crypto.createHash("sha256").update(a).digest();
  const hb = crypto.createHash("sha256").update(b).digest();
  return crypto.timingSafeEqual(ha, hb);
}

/** Impressão digital da senha atual: trocar ADMIN_PASSWORD invalida as sessões abertas. */
function passwordFingerprint(): string {
  return crypto
    .createHash("sha256")
    .update(process.env.ADMIN_PASSWORD ?? "")
    .digest("hex")
    .slice(0, 16);
}

function signSession(exp: string): string {
  return sign(`${exp}.${passwordFingerprint()}`);
}

/** Token de sessão assinado com expiração: `<expMs>.<hmac(exp + senha)>`. */
export function createToken(): string {
  const exp = String(Date.now() + SESSION_TTL_S * 1000);
  return `${exp}.${signSession(exp)}`;
}

export function verifyToken(token: string | undefined): boolean {
  if (!token || !adminConfigured()) return false;
  const dot = token.indexOf(".");
  if (dot < 0) return false;
  const exp = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  if (!/^\d{1,16}$/.test(exp)) return false;
  if (Date.now() > Number(exp)) return false;
  return safeEqual(sig, signSession(exp));
}

/** Comparação de senha em tempo constante. */
export function verifyPassword(input: string): boolean {
  const pw = process.env.ADMIN_PASSWORD || "";
  if (!pw || !adminConfigured()) return false;
  return safeEqual(input, pw);
}

/** Atributos do cookie de sessão: HttpOnly, Secure em produção, SameSite estrito. */
export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge: SESSION_TTL_S,
  };
}

/* ---------- Limite de tentativas de login ----------
 * Só tentativa ERRADA conta: quem acerta a senha não gasta o limite. O bloqueio é conferido ANTES de
 * verificar a senha, então quem já estourou o limite não consegue entrar nem acertando. Em memória,
 * por instância (mesma limitação de rate-limit.ts). */
export const LOGIN_MAX_FAILURES = 8;
export const LOGIN_WINDOW_MS = 10 * 60 * 1000;
const MAX_TRACKED = 2000;
const failures = new Map<string, { count: number; reset: number }>();

/** Segundos até liberar o login desta chave (IP); 0 quando não está bloqueada. */
export function loginLockRemaining(key: string): number {
  const now = Date.now();
  const e = failures.get(key);
  if (!e || now > e.reset) return 0;
  if (e.count < LOGIN_MAX_FAILURES) return 0;
  return Math.max(1, Math.ceil((e.reset - now) / 1000));
}

/** Registra uma senha errada. A janela começa na primeira falha e não desliza. */
export function registerLoginFailure(key: string): void {
  const now = Date.now();
  const e = failures.get(key);
  if (!e || now > e.reset) {
    if (failures.size >= MAX_TRACKED) {
      for (const [k, v] of failures) if (now > v.reset) failures.delete(k);
      if (failures.size >= MAX_TRACKED) failures.delete(failures.keys().next().value as string);
    }
    failures.set(key, { count: 1, reset: now + LOGIN_WINDOW_MS });
    return;
  }
  e.count += 1;
}

/** Login correto: zera as falhas desta chave. */
export function clearLoginFailures(key: string): void {
  failures.delete(key);
}

/** Só para testes. */
export function resetLoginFailuresForTests(): void {
  failures.clear();
}

export async function isAuthed(): Promise<boolean> {
  if (!adminConfigured()) return false;
  const store = await cookies();
  return verifyToken(store.get(ADMIN_COOKIE)?.value);
}
