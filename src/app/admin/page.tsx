import type { Metadata } from "next";
import { isAuthed, adminStatus } from "@/lib/admin-auth";
import { getAdminSupabase, isAdminDbConfigured } from "@/lib/supabase";
import { leadStatuses, type AppointmentLead, type LeadStatus } from "@/types/lead";
import { AdminLogin } from "@/components/admin/admin-login";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

export const metadata: Metadata = {
  title: "Painel",
  description: "Área restrita da equipe.",
  // Sem canonical: a herdada do layout raiz apontaria esta página interna para a home.
  alternates: { canonical: null },
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const PAGE_SIZE = 25;

type Search = { p?: string | string[]; status?: string | string[]; q?: string | string[] };

function first(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

/**
 * Termo de busca limpo para o filtro do PostgREST: tira vírgula, parênteses, aspas, curingas e
 * barras, que quebrariam a sintaxe de `.or()`. Espaços repetidos viram um.
 */
function cleanSearch(raw: string | undefined): string {
  return (raw ?? "")
    .replace(/[,()%*_\\"'`:;]/g, " ")
    .replace(/[\s]+/g, " ")
    .trim()
    .slice(0, 60);
}

async function fetchLeads(
  page: number,
  status: LeadStatus | null,
  q: string,
): Promise<{ leads: AppointmentLead[]; total: number }> {
  const supabase = getAdminSupabase();
  if (!supabase) return { leads: [], total: 0 };
  const from = (page - 1) * PAGE_SIZE;
  let query = supabase
    .from("appointment_leads")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, from + PAGE_SIZE - 1);
  if (status) query = query.eq("status", status);
  if (q) {
    // Busca no servidor: vale para todas as páginas, não só para as 25 carregadas.
    const digits = q.replace(/[^0-9]/g, "");
    const conds = [`full_name.ilike.%${q}%`];
    if (digits.length >= 3) conds.push(`whatsapp.ilike.%${digits}%`);
    query = query.or(conds.join(","));
  }
  const { data, error, count } = await query;
  if (error) {
    console.error("[admin] fetch leads error:", error.code ?? "unknown");
    return { leads: [], total: 0 };
  }
  return { leads: (data as AppointmentLead[]) ?? [], total: count ?? 0 };
}

export default async function AdminPage({ searchParams }: { searchParams: Promise<Search> }) {
  const status = adminStatus();
  if (status !== "ok") {
    // O motivo fica só no log do servidor; a tela pública em produção não o revela.
    console.error("[admin] painel desativado:", status);
    return <AdminLogin status={status} detail={process.env.NODE_ENV !== "production"} />;
  }
  if (!(await isAuthed())) {
    return <AdminLogin status={status} />;
  }
  const sp = await searchParams;
  const requested = Number.parseInt(first(sp.p) ?? "1", 10);
  const page = Number.isFinite(requested) && requested > 0 ? Math.min(requested, 10000) : 1;
  const s = first(sp.status);
  const statusFilter = leadStatuses.find((x) => x === s) ?? null;

  const q = cleanSearch(first(sp.q));

  const dbConfigured = isAdminDbConfigured();
  const { leads, total } = dbConfigured
    ? await fetchLeads(page, statusFilter, q)
    : { leads: [], total: 0 };
  return (
    <AdminDashboard
      leads={leads}
      dbConfigured={dbConfigured}
      page={page}
      pageSize={PAGE_SIZE}
      total={total}
      statusFilter={statusFilter}
      query={q}
    />
  );
}
