import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Acesso ao Supabase com tolerância a falta de configuração.
 * O site funciona normalmente SEM Supabase — neste caso, os leads
 * não são persistidos e o fluxo segue para o WhatsApp.
 */

/** Capaz de RECEBER leads do público (INSERT) — anon ou service role bastam. */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      (process.env.SUPABASE_SERVICE_ROLE_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  );
}

/** Capaz de LER/EDITAR leads no painel — exige service role (ignora RLS). */
export function isAdminDbConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

/** Cliente para o INSERT público (service role quando disponível, senão anon). */
export function getServerSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

/** Cliente do PAINEL — usa SOMENTE a service role (leitura/edição de leads). */
export function getAdminSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}
