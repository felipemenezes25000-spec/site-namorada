/**
 * Limitador de taxa em memória (por instância serverless).
 *
 * LIMITAÇÃO CONHECIDA: na Vercel cada instância tem o seu próprio mapa e ele
 * zera quando a instância é reciclada. O limite é, portanto, "melhor esforço":
 * freia robôs simples e erros em laço, mas não é uma barreira distribuída.
 * Para um limite global, troque `rateLimit` por um armazenamento compartilhado
 * (Upstash Redis, Vercel KV, tabela no Supabase) mantendo a assinatura
 * rateLimit(key, limit, windowMs). Nenhuma outra parte do código precisa mudar.
 * Decisão pendente do dono: qual armazenamento compartilhado usar. Enquanto isso, a camada que vale
 * para todas as instâncias é a regra do Vercel Firewall (10 requisições por minuto por IP em
 * /api/leads e /admin), descrita no README.md, seção "Variáveis de ambiente".
 *
 * Comportamento (coberto por rate-limit.test.ts): a janela começa na primeira chamada e NÃO desliza;
 * passado o prazo o contador reinicia; com 5000 chaves a limpeza remove primeiro as expiradas e, se
 * ainda estiver cheio, as mais antigas; reiniciar a instância zera tudo.
 */
type Entry = { count: number; reset: number };
const buckets = new Map<string, Entry>();
const MAX_BUCKETS = 5000;

function prune(now: number) {
  if (buckets.size < MAX_BUCKETS) return;
  for (const [key, entry] of buckets) {
    if (now > entry.reset) buckets.delete(key);
  }
  // Ainda cheio (ataque com muitos IPs): descarta os mais antigos.
  if (buckets.size >= MAX_BUCKETS) {
    const excess = buckets.size - MAX_BUCKETS + 1;
    let i = 0;
    for (const key of buckets.keys()) {
      buckets.delete(key);
      if (++i >= excess) break;
    }
  }
}

/** Só para testes: simula a reciclagem da instância (o mapa em memória zera). */
export function resetRateLimitForTests(): void {
  buckets.clear();
}

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { ok: boolean; remaining: number; retryAfter: number } {
  const now = Date.now();
  const e = buckets.get(key);
  if (!e || now > e.reset) {
    prune(now);
    buckets.set(key, { count: 1, reset: now + windowMs });
    return { ok: true, remaining: limit - 1, retryAfter: 0 };
  }
  if (e.count >= limit) {
    return { ok: false, remaining: 0, retryAfter: Math.max(1, Math.ceil((e.reset - now) / 1000)) };
  }
  e.count += 1;
  return { ok: true, remaining: limit - e.count, retryAfter: 0 };
}

/**
 * IP do cliente. Na Vercel, `x-vercel-forwarded-for` e `x-real-ip` são
 * definidos pela plataforma e não podem ser forjados pelo visitante; só depois
 * caímos no `x-forwarded-for` (que, fora da Vercel, o cliente pode falsificar).
 */
export function clientIp(headers: Headers): string {
  const vercel = headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim();
  if (vercel) return vercel;
  const real = headers.get("x-real-ip")?.trim();
  if (real) return real;
  const xff = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return xff || "unknown";
}
