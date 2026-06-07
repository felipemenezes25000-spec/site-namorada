import type { Metadata } from "next";
import { isAuthed, adminConfigured } from "@/lib/admin-auth";
import { getAdminSupabase, isAdminDbConfigured } from "@/lib/supabase";
import type { AppointmentLead } from "@/types/lead";
import { AdminLogin } from "@/components/admin/admin-login";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

export const metadata: Metadata = {
  title: "Painel",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

async function fetchLeads(): Promise<AppointmentLead[]> {
  const supabase = getAdminSupabase();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("appointment_leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);
  if (error) {
    console.error("[admin] fetch leads error:", error.message);
    return [];
  }
  return (data as AppointmentLead[]) ?? [];
}

export default async function AdminPage() {
  const authed = await isAuthed();
  if (!authed) {
    return <AdminLogin configured={adminConfigured()} />;
  }
  const dbConfigured = isAdminDbConfigured();
  const leads = dbConfigured ? await fetchLeads() : [];
  return <AdminDashboard leads={leads} dbConfigured={dbConfigured} />;
}
