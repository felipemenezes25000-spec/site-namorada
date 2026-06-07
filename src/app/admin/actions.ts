"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getAdminSupabase } from "@/lib/supabase";
import {
  ADMIN_COOKIE,
  adminConfigured,
  createToken,
  isAuthed,
  verifyPassword,
} from "@/lib/admin-auth";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { leadStatuses, type LeadStatus } from "@/types/lead";

export type LoginState = { error?: string };

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  if (!adminConfigured()) {
    return { error: "Painel não configurado. Defina ADMIN_PASSWORD no ambiente." };
  }

  // Proteção contra força bruta: 8 tentativas / 10 min por IP.
  const ip = clientIp(await headers());
  const limit = rateLimit(`admin-login:${ip}`, 8, 10 * 60 * 1000);
  if (!limit.ok) {
    return { error: `Muitas tentativas. Tente novamente em ${limit.retryAfter}s.` };
  }

  const password = String(formData.get("password") || "");
  if (!verifyPassword(password)) {
    return { error: "Senha incorreta. Tente novamente." };
  }

  const store = await cookies();
  store.set(ADMIN_COOKIE, createToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  redirect("/admin");
}

export async function logout() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
  redirect("/admin");
}

export async function updateLeadStatus(id: string, status: string) {
  if (!(await isAuthed())) return { ok: false, error: "unauthorized" };
  if (!leadStatuses.includes(status as LeadStatus)) {
    return { ok: false, error: "invalid_status" };
  }
  const supabase = getAdminSupabase();
  if (!supabase) return { ok: false, error: "no_db" };

  const { error } = await supabase
    .from("appointment_leads")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin");
  return { ok: true };
}
