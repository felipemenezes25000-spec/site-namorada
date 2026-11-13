"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getAdminSupabase } from "@/lib/supabase";
import {
  ADMIN_COOKIE,
  adminConfigured,
  createToken,
  sessionCookieOptions,
  isAuthed,
  verifyPassword,
  loginLockRemaining,
  registerLoginFailure,
  clearLoginFailures,
} from "@/lib/admin-auth";
import { clientIp } from "@/lib/rate-limit";
import { leadStatuses, type LeadStatus } from "@/types/lead";

export type LoginState = { error?: string };

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  if (!adminConfigured()) {
    return { error: "Painel desativado: faltam variáveis de ambiente do servidor." };
  }

  // Proteção contra força bruta: 8 senhas erradas / 10 min por IP. Acertar a senha não gasta tentativa,
  // mas o bloqueio vale antes da conferência (quem estourou o limite não entra nem acertando).
  const ip = clientIp(await headers());
  const lockKey = `admin-login:${ip}`;
  const wait = loginLockRemaining(lockKey);
  if (wait > 0) {
    return { error: `Muitas tentativas. Tente novamente em ${wait}s.` };
  }

  const password = String(formData.get("password") || "");
  if (!verifyPassword(password)) {
    registerLoginFailure(lockKey);
    return { error: "Senha incorreta. Tente novamente." };
  }
  clearLoginFailures(lockKey);

  const store = await cookies();
  store.set(ADMIN_COOKIE, createToken(), sessionCookieOptions());
  redirect("/admin");
}

export async function logout() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
  redirect("/admin");
}

export type UpdateStatusResult = { ok: true } | { ok: false; error: string };

export async function updateLeadStatus(id: string, status: string): Promise<UpdateStatusResult> {
  if (!(await isAuthed())) return { ok: false, error: "unauthorized" };
  if (!/^[0-9a-f-]{8,64}$/i.test(id)) return { ok: false, error: "invalid_id" };
  if (!leadStatuses.includes(status as LeadStatus)) {
    return { ok: false, error: "invalid_status" };
  }
  const supabase = getAdminSupabase();
  if (!supabase) return { ok: false, error: "no_db" };

  const { error } = await supabase
    .from("appointment_leads")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    console.error("[admin] update status error:", error.code ?? "unknown");
    return { ok: false, error: "update_failed" };
  }
  revalidatePath("/admin");
  return { ok: true };
}
