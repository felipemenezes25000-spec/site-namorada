import { NextResponse } from "next/server";
import { appointmentSchema } from "@/lib/validations";
import { getServerSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { sendLeadNotification, isEmailConfigured } from "@/lib/email";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import type { NewAppointmentLead } from "@/types/lead";

export const runtime = "nodejs";

/** Versão vigente da Política de Privacidade aceita no formulário (prova de consentimento). */
const PRIVACY_POLICY_VERSION = "2026-06-08";

export async function POST(request: Request) {
  // 1) Mesma origem (mitiga CSRF/abuso cross-site).
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin && host) {
    try {
      if (new URL(origin).host !== host) {
        return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403 });
    }
  }

  // 2) Rate limit por IP: 5 envios / 10 min.
  const ip = clientIp(request.headers);
  const limit = rateLimit(`leads:${ip}`, 5, 10 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  // 3) Honeypot: se preenchido, finge sucesso sem persistir.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true, persisted: false });
  }

  const parsed = appointmentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "validation", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const data = parsed.data;

  // 4) Enviar e-mail de notificação para a Dra. (assíncrono, não bloqueia resposta).
  const emailPromise = isEmailConfigured()
    ? sendLeadNotification({
        fullName: data.fullName,
        whatsapp: data.whatsapp,
        email: data.email || null,
        treatmentInterest: data.treatmentInterest,
        preferredPeriod: data.preferredPeriod || null,
        preferredDate: data.preferredDate || null,
        hasXray: data.hasXray || null,
        mainComplaint: data.mainComplaint || null,
        source: data.source || null,
      })
    : Promise.resolve({ ok: false, reason: "not_configured" });

  const lead: NewAppointmentLead = {
    full_name: data.fullName,
    whatsapp: data.whatsapp,
    email: data.email || null,
    treatment_interest: data.treatmentInterest || null,
    preferred_date: data.preferredDate || null,
    preferred_period: data.preferredPeriod || null,
    main_complaint: data.mainComplaint || null,
    source: data.source || null,
    lgpd_consent: data.lgpdConsent,
    lgpd_consent_at: new Date().toISOString(),
    privacy_policy_version: PRIVACY_POLICY_VERSION,
    status: "new",
  };

  // 5) Persistir no Supabase (quando configurado).
  let persisted = false;
  if (isSupabaseConfigured()) {
    try {
      const supabase = getServerSupabase();
      if (supabase) {
        const { error } = await supabase.from("appointment_leads").insert(lead);
        if (error) console.error("[leads] supabase insert error:", error.message);
        else persisted = true;
      }
    } catch (err) {
      console.error("[leads] supabase unexpected error:", err);
    }
  }

  // Espera o e-mail terminar (já disparou em paralelo).
  const emailResult = await emailPromise;
  const emailed = "ok" in emailResult && emailResult.ok;

  return NextResponse.json({ ok: true, persisted, emailed });
}
