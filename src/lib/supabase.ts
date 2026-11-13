import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Acesso ao Supabase com tolerância a falta de configuração.
 * O site funciona normalmente SEM Supabase — neste caso, os leads
 * não são persistidos e o fluxo segue para o WhatsApp.
 *
 * Só a SERVICE ROLE (no servidor) grava e lê leads. A chave anônima pública NÃO é usada: com ela,
 * qualquer pessoa poderia inserir linhas direto pela API REST do Supabase, sem passar pela
 * validação, pela armadilha de robôs e pelo limite de envios de `/api/leads`
 * (supabase/schema.sql remove a política que permitia isso).
 */

/** Capaz de RECEBER leads (INSERT pelo servidor): URL + service role. */
export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

/** Capaz de LER/EDITAR leads no painel — a mesma exigência (service role, que ignora RLS). */
export function isAdminDbConfigured(): boolean {
  return isSupabaseConfigured();
}

function serviceClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

/** Cliente para gravar o lead (só service role). */
export function getServerSupabase(): SupabaseClient | null {
  return serviceClient();
}

/** Cliente do PAINEL — usa SOMENTE a service role (leitura/edição de leads). */
export function getAdminSupabase(): SupabaseClient | null {
  return serviceClient();
}
