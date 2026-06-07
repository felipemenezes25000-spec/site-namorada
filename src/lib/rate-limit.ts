/**
 * Rate limiter simples em memória (por processo).
 * Suficiente para instância única / volume baixo a moderado.
 * Para escala horizontal, troque por Upstash Redis ou similar.
 */
type Entry = { count: number; reset: number };
const buckets = new Map<string, Entry>();

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { ok: boolean; remaining: number; retryAfter: number } {
  const now = Date.now();
  const e = buckets.get(key);
  if (!e || now > e.reset) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    return { ok: true, remaining: limit - 1, retryAfter: 0 };
  }
  if (e.count >= limit) {
    return { ok: false, remaining: 0, retryAfter: Math.ceil((e.reset - now) / 1000) };
  }
  e.count += 1;
  return { ok: true, remaining: limit - e.count, retryAfter: 0 };
}

/** Extrai o IP do cliente a partir dos headers (proxy-aware). */
export function clientIp(headers: Headers): string {
  const xff = headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return headers.get("x-real-ip") || "unknown";
}
