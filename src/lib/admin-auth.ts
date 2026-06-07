import crypto from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "abl_admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 8; // 8h

function secret(): string {
  // Prefere um segredo dedicado; cai para a própria senha se não houver.
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "";
}

export function adminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_PASSWORD.length > 0);
}

function sign(payload: string): string {
  return crypto.createHmac("sha256", secret()).update(payload).digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

/** Token de sessão assinado com expiração: `<expMs>.<hmac>`. */
export function createToken(): string {
  const exp = String(Date.now() + SESSION_TTL_MS);
  return `${exp}.${sign(exp)}`;
}

export function verifyToken(token: string | undefined): boolean {
  if (!token) return false;
  const dot = token.indexOf(".");
  if (dot < 0) return false;
  const exp = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  if (!/^\d+$/.test(exp)) return false;
  if (Date.now() > Number(exp)) return false;
  return safeEqual(sig, sign(exp));
}

/** Comparação de senha em tempo constante. */
export function verifyPassword(input: string): boolean {
  const pw = process.env.ADMIN_PASSWORD || "";
  if (!pw) return false;
  return safeEqual(input, pw);
}

export async function isAuthed(): Promise<boolean> {
  if (!adminConfigured()) return false;
  const store = await cookies();
  return verifyToken(store.get(ADMIN_COOKIE)?.value);
}
