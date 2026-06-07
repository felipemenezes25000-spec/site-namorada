"use client";

import { useMemo, useState, useTransition } from "react";
import {
  Search, Copy, Check, MessageCircle, LogOut, Inbox, RefreshCw, ChevronDown, AlertTriangle,
} from "lucide-react";
import type { AppointmentLead, LeadStatus } from "@/types/lead";
import { leadStatuses, leadStatusLabels } from "@/types/lead";
import { updateLeadStatus, logout } from "@/app/admin/actions";
import { LeadStatusBadge } from "@/components/ui/lead-status-badge";
import { formatPhone } from "@/lib/utils";
import { cn } from "@/lib/utils";

function leadWa(raw: string): string {
  const d = raw.replace(/\D/g, "");
  const withCountry = d.startsWith("55") ? d : `55${d}`;
  return `https://wa.me/${withCountry}`;
}

function fmtDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function AdminDashboard({
  leads,
  dbConfigured,
}: {
  leads: AppointmentLead[];
  dbConfigured: boolean;
}) {
  const [filter, setFilter] = useState<LeadStatus | "all">("all");
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: leads.length };
    for (const s of leadStatuses) c[s] = 0;
    for (const l of leads) c[l.status] = (c[l.status] || 0) + 1;
    return c;
  }, [leads]);

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      const okStatus = filter === "all" || l.status === filter;
      const q = query.trim().toLowerCase();
      const okQuery = !q || l.full_name.toLowerCase().includes(q) || l.whatsapp.includes(q);
      return okStatus && okQuery;
    });
  }, [leads, filter, query]);

  function copy(value: string, id: string) {
    navigator.clipboard?.writeText(value).then(() => {
      setCopied(id);
      setTimeout(() => setCopied((c) => (c === id ? null : c)), 1600);
    });
  }

  function changeStatus(id: string, status: string) {
    startTransition(async () => {
      await updateLeadStatus(id, status);
    });
  }

  return (
    <div className="min-h-screen bg-brand-bone">
      {/* Topo */}
      <header className="sticky top-0 z-10 border-b border-brand-ink/[0.07] bg-brand-bone/85 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <div>
            <h1 className="font-display text-xl text-brand-green">Painel de leads</h1>
            <p className="text-xs text-brand-ink/50">{leads.length} solicitações no total</p>
          </div>
          <form action={logout}>
            <button className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-brand-ink/70 ring-1 ring-inset ring-brand-ink/10 transition hover:bg-brand-green/[0.05] hover:text-brand-green">
              <LogOut className="size-4" /> Sair
            </button>
          </form>
        </div>
      </header>

      <div className="container py-8">
        {!dbConfigured && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            <AlertTriangle className="mt-0.5 size-5 shrink-0" />
            <span>
              Banco de leads não conectado. Defina{" "}
              <code className="rounded bg-amber-100 px-1">SUPABASE_SERVICE_ROLE_KEY</code>{" "}
              (e <code className="rounded bg-amber-100 px-1">NEXT_PUBLIC_SUPABASE_URL</code>) no
              ambiente para listar e gerenciar os agendamentos recebidos pelo site.
            </span>
          </div>
        )}
        {/* Filtros */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
            {(["all", ...leadStatuses] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={cn(
                  "whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium transition",
                  filter === s
                    ? "bg-brand-green text-brand-bone"
                    : "bg-white text-brand-ink/65 ring-1 ring-inset ring-brand-ink/10 hover:text-brand-green",
                )}
              >
                {s === "all" ? "Todos" : leadStatusLabels[s]}
                <span className="ml-1.5 opacity-60">{counts[s] ?? 0}</span>
              </button>
            ))}
          </div>
          <div className="relative w-full lg:w-72">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-brand-ink/40" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nome ou telefone"
              className="h-11 w-full rounded-xl border border-brand-ink/10 bg-white pl-10 pr-4 text-sm focus:border-brand-gold/60 focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
            />
          </div>
        </div>

        {pending && (
          <p className="mt-4 flex items-center gap-2 text-sm text-brand-ink/50">
            <RefreshCw className="size-3.5 animate-spin" /> Atualizando…
          </p>
        )}

        {/* Lista */}
        {filtered.length === 0 ? (
          <div className="mt-10 flex flex-col items-center justify-center rounded-3xl border border-dashed border-brand-ink/15 bg-white/60 p-16 text-center">
            <Inbox className="size-10 text-brand-ink/30" strokeWidth={1.4} />
            <p className="mt-4 font-display text-xl text-brand-green">Nenhum lead por aqui</p>
            <p className="mt-1 max-w-sm text-sm text-brand-ink/55">
              Os agendamentos enviados pelo site aparecem nesta lista assim que o
              Supabase estiver configurado.
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {filtered.map((lead) => (
              <article key={lead.id} className="surface overflow-hidden">
                <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="font-display text-xl text-brand-green">{lead.full_name}</h2>
                      <LeadStatusBadge status={lead.status} />
                    </div>
                    <p className="mt-1 text-xs text-brand-ink/45">Recebido em {fmtDate(lead.created_at)}</p>

                    <dl className="mt-4 grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
                      <div className="flex items-center gap-2">
                        <dt className="text-brand-ink/45">WhatsApp:</dt>
                        <dd className="font-medium text-brand-ink/80">{formatPhone(lead.whatsapp)}</dd>
                      </div>
                      {lead.email && (
                        <div className="flex items-center gap-2">
                          <dt className="text-brand-ink/45">E-mail:</dt>
                          <dd className="truncate text-brand-ink/80">{lead.email}</dd>
                        </div>
                      )}
                      {lead.treatment_interest && (
                        <div className="flex items-center gap-2">
                          <dt className="text-brand-ink/45">Interesse:</dt>
                          <dd className="text-brand-ink/80">{lead.treatment_interest}</dd>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <dt className="text-brand-ink/45">Preferência:</dt>
                        <dd className="text-brand-ink/80">
                          {[lead.preferred_date, lead.preferred_period].filter(Boolean).join(" · ") || "—"}
                        </dd>
                      </div>
                      {lead.source && (
                        <div className="flex items-center gap-2">
                          <dt className="text-brand-ink/45">Origem:</dt>
                          <dd className="text-brand-ink/80">{lead.source}</dd>
                        </div>
                      )}
                    </dl>

                    {lead.main_complaint && (
                      <p className="mt-3 rounded-xl bg-brand-beige/40 p-3 text-sm text-brand-ink/70">
                        “{lead.main_complaint}”
                      </p>
                    )}
                  </div>

                  {/* Ações */}
                  <div className="flex shrink-0 flex-col gap-2 sm:w-48">
                    <a
                      href={leadWa(lead.whatsapp)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1F8C4D] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#19743f]"
                    >
                      <MessageCircle className="size-4" /> Abrir WhatsApp
                    </a>
                    <button
                      onClick={() => copy(formatPhone(lead.whatsapp), lead.id)}
                      className="inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium text-brand-green ring-1 ring-inset ring-brand-green/20 transition hover:bg-brand-green/[0.05]"
                    >
                      {copied === lead.id ? <Check className="size-4" /> : <Copy className="size-4" />}
                      {copied === lead.id ? "Copiado!" : "Copiar número"}
                    </button>
                    <div className="relative">
                      <select
                        value={lead.status}
                        onChange={(e) => changeStatus(lead.id, e.target.value)}
                        disabled={pending}
                        aria-label={`Alterar status de ${lead.full_name}`}
                        className="h-10 w-full cursor-pointer appearance-none rounded-full border border-brand-ink/15 bg-white pl-4 pr-9 text-sm font-medium text-brand-ink/80 focus:border-brand-gold/60 focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
                      >
                        {leadStatuses.map((s) => (
                          <option key={s} value={s}>{leadStatusLabels[s]}</option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-brand-green/60" />
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
