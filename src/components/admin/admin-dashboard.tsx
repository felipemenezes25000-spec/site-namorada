"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Copy,
  Check,
  MessageCircle,
  LogOut,
  Inbox,
  RefreshCw,
  ChevronDown,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from "./admin-icons";
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
    return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(
      new Date(iso),
    );
  } catch {
    return iso;
  }
}

function listHref(page: number, status: LeadStatus | null, q: string): string {
  const qs = new URLSearchParams();
  if (status) qs.set("status", status);
  if (q) qs.set("q", q);
  if (page > 1) qs.set("p", String(page));
  const s = qs.toString();
  return s ? `/admin?${s}` : "/admin";
}

export function AdminDashboard({
  leads,
  dbConfigured,
  page,
  pageSize,
  total,
  statusFilter,
  query = "",
}: {
  leads: AppointmentLead[];
  dbConfigured: boolean;
  page: number;
  pageSize: number;
  total: number;
  statusFilter: LeadStatus | null;
  /** Termo da busca no servidor (nome ou telefone), já limpo. */
  query?: string;
}) {
  const router = useRouter();
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const [copied, setCopied] = useState<string | null>(null);
  /** Status escolhido e ainda não confirmado pelo servidor; some quando o servidor responde. */
  const [chosen, setChosen] = useState<Record<string, LeadStatus>>({});
  /** Aviso de erro (copiar, trocar status). Vai para um role="alert". */
  const [notice, setNotice] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  async function copy(value: string, id: string) {
    try {
      if (!navigator.clipboard?.writeText) throw new Error("clipboard indisponível");
      await navigator.clipboard.writeText(value);
      setNotice(null);
      setCopied(id);
      setTimeout(() => setCopied((c) => (c === id ? null : c)), 1600);
    } catch {
      // Sem permissão (ou sem HTTPS): mostra o número para copiar à mão.
      setNotice(`Não foi possível copiar automaticamente. O número é ${value}.`);
    }
  }

  function forget(id: string) {
    setChosen((c) => {
      const next = { ...c };
      delete next[id];
      return next;
    });
  }

  function changeStatus(lead: AppointmentLead, status: string) {
    setNotice(null);
    setChosen((c) => ({ ...c, [lead.id]: status as LeadStatus }));
    startTransition(async () => {
      try {
        const res = await updateLeadStatus(lead.id, status);
        forget(lead.id);
        if (res.ok) return;
        if (res.error === "unauthorized") {
          setNotice("Sua sessão expirou. Entre de novo para continuar.");
          router.refresh(); // sem sessão, a página volta para o login
          return;
        }
        setNotice(
          `Não foi possível salvar o status de ${lead.full_name}. Nada foi alterado; tente de novo.`,
        );
      } catch {
        forget(lead.id);
        setNotice(`Sem conexão com o servidor: o status de ${lead.full_name} não foi alterado.`);
      }
    });
  }

  return (
    <main className="min-h-screen bg-osso">
      {/* Topo */}
      <header className="sticky top-0 z-10 border-b border-tinta/[0.07] bg-painel-osso/85 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <div>
            <h1 className="font-display text-xl text-verde">Painel de leads</h1>
            <p className="text-xs text-painel-tinta/70">
              {total} {total === 1 ? "solicitação" : "solicitações"}
              {statusFilter ? ` com status “${leadStatusLabels[statusFilter]}”` : " no total"}
              {query ? ` para “${query}”` : ""}
            </p>
          </div>
          <form action={logout}>
            <button className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-painel-tinta/70 ring-1 ring-inset ring-painel-tinta/10 transition hover:bg-verde/[0.05] hover:text-verde">
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
              <code className="rounded bg-amber-100 px-1">SUPABASE_SERVICE_ROLE_KEY</code> (e{" "}
              <code className="rounded bg-amber-100 px-1">NEXT_PUBLIC_SUPABASE_URL</code>) no
              ambiente para listar e gerenciar os agendamentos recebidos pelo site.
            </span>
          </div>
        )}
        {/* Filtros */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
            {(["all", ...leadStatuses] as const).map((s) => {
              const active = (s === "all" ? null : s) === statusFilter;
              return (
                <Link
                  key={s}
                  href={listHref(1, s === "all" ? null : s, query)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "inline-flex min-h-11 items-center whitespace-nowrap rounded-full px-4 text-sm font-medium transition",
                    active
                      ? "bg-verde text-osso"
                      : "bg-white text-painel-tinta/75 ring-1 ring-inset ring-painel-tinta/10 hover:text-verde",
                  )}
                >
                  {s === "all" ? "Todos" : leadStatusLabels[s]}
                </Link>
              );
            })}
          </div>
          {/* Busca no servidor (todas as páginas); funciona também sem JavaScript. */}
          <form method="get" action="/admin" role="search" className="flex w-full gap-2 lg:w-96">
            {statusFilter && <input type="hidden" name="status" value={statusFilter} />}
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-painel-tinta/60" />
              <input
                type="search"
                name="q"
                defaultValue={query}
                maxLength={60}
                placeholder="Buscar por nome ou telefone"
                aria-label="Buscar por nome ou telefone, em todas as páginas"
                className="h-11 w-full rounded-xl border border-painel-tinta/10 bg-white pl-10 pr-4 text-sm focus:border-painel-ouro/60 focus:outline-none focus:ring-2 focus:ring-painel-ouro/40"
              />
            </div>
            <button
              type="submit"
              className="inline-flex min-h-11 items-center rounded-full bg-verde px-5 text-sm font-semibold text-osso transition hover:bg-verde-escuro"
            >
              Buscar
            </button>
          </form>
        </div>

        {query && (
          <p className="mt-3 text-sm text-painel-tinta/70">
            Resultado da busca em todos os leads.{" "}
            <Link
              href={listHref(1, statusFilter, "")}
              className="font-medium text-verde underline underline-offset-2"
            >
              Limpar busca
            </Link>
          </p>
        )}

        {/* Avisos: role="alert" anuncia o erro a quem usa leitor de tela */}
        <div role="alert" aria-atomic="true" className={notice ? "mt-4" : undefined}>
          {notice && (
            <p className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" />
              <span>{notice}</span>
            </p>
          )}
        </div>

        <div role="status" aria-live="polite">
          {pending && (
            <p className="mt-4 flex items-center gap-2 text-sm text-painel-tinta/70">
              <RefreshCw className="size-3.5 animate-spin" /> Atualizando…
            </p>
          )}
        </div>

        {/* Lista */}
        {leads.length === 0 ? (
          <div className="mt-10 flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-painel-tinta/15 bg-white/60 p-16 text-center">
            <Inbox className="size-10 text-painel-tinta/50" strokeWidth={1.4} />
            <p className="mt-4 font-display text-xl text-verde">
              {query ? "Nenhum lead encontrado" : "Nenhum lead por aqui"}
            </p>
            <p className="mt-1 max-w-sm text-sm text-painel-tinta/70">
              {query
                ? "Nenhum nome ou telefone corresponde a essa busca. Confira a grafia ou limpe a busca."
                : "Os agendamentos enviados pelo site aparecem nesta lista assim que o Supabase estiver configurado."}
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {leads.map((lead) => (
              <article key={lead.id} className="surface overflow-hidden">
                <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="font-display text-xl text-verde">{lead.full_name}</h2>
                      <LeadStatusBadge status={chosen[lead.id] ?? lead.status} />
                    </div>
                    <p className="mt-1 text-xs text-painel-tinta/70">
                      Recebido em {fmtDate(lead.created_at)}
                    </p>

                    <dl className="mt-4 grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
                      <div className="flex items-center gap-2">
                        <dt className="text-painel-tinta/70">WhatsApp:</dt>
                        <dd className="font-medium text-painel-tinta/90">
                          {formatPhone(lead.whatsapp)}
                        </dd>
                      </div>
                      {lead.email && (
                        <div className="flex items-center gap-2">
                          <dt className="text-painel-tinta/70">E-mail:</dt>
                          <dd className="truncate text-painel-tinta/90">{lead.email}</dd>
                        </div>
                      )}
                      {lead.treatment_interest && (
                        <div className="flex items-center gap-2">
                          <dt className="text-painel-tinta/70">Interesse:</dt>
                          <dd className="text-painel-tinta/90">{lead.treatment_interest}</dd>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <dt className="text-painel-tinta/70">Preferência:</dt>
                        <dd className="text-painel-tinta/90">
                          {[lead.preferred_date, lead.preferred_period]
                            .filter(Boolean)
                            .join(" · ") || "—"}
                        </dd>
                      </div>
                      {lead.source && (
                        <div className="flex items-center gap-2">
                          <dt className="text-painel-tinta/70">Origem:</dt>
                          <dd className="text-painel-tinta/90">{lead.source}</dd>
                        </div>
                      )}
                    </dl>

                    {lead.main_complaint && (
                      <p className="mt-3 rounded-xl bg-painel-areia/40 p-3 text-sm text-painel-tinta/80">
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
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-verde px-4 py-2.5 text-sm font-semibold text-osso transition hover:bg-verde-escuro"
                    >
                      <MessageCircle className="size-4" /> Abrir WhatsApp
                      <span className="sr-only"> (abre em nova aba)</span>
                    </a>
                    <button
                      onClick={() => copy(formatPhone(lead.whatsapp), lead.id)}
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium text-verde ring-1 ring-inset ring-painel-verde/20 transition hover:bg-verde/[0.05]"
                    >
                      {copied === lead.id ? (
                        <Check className="size-4" />
                      ) : (
                        <Copy className="size-4" />
                      )}
                      {copied === lead.id ? "Copiado!" : "Copiar número"}
                    </button>
                    <div className="relative">
                      <select
                        value={chosen[lead.id] ?? lead.status}
                        onChange={(e) => changeStatus(lead, e.target.value)}
                        disabled={pending}
                        aria-label={`Alterar status de ${lead.full_name}`}
                        className="h-11 w-full cursor-pointer appearance-none rounded-full border border-painel-tinta/15 bg-white pl-4 pr-9 text-sm font-medium text-painel-tinta/90 focus:border-painel-ouro/60 focus:outline-none focus:ring-2 focus:ring-painel-ouro/40"
                      >
                        {leadStatuses.map((s) => (
                          <option key={s} value={s}>
                            {leadStatusLabels[s]}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-painel-verde/70" />
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {pageCount > 1 && (
          <nav
            aria-label="Paginação"
            className="mt-8 flex items-center justify-between gap-3 text-sm"
          >
            {page > 1 ? (
              <Link
                href={listHref(page - 1, statusFilter, query)}
                className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-4 py-2 font-medium text-verde ring-1 ring-inset ring-painel-verde/20 hover:bg-verde/[0.05]"
              >
                <ChevronLeft className="size-4" /> Anteriores
              </Link>
            ) : (
              <span />
            )}
            <span className="text-painel-tinta/70">
              Página {page} de {pageCount}
            </span>
            {page < pageCount ? (
              <Link
                href={listHref(page + 1, statusFilter, query)}
                className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-4 py-2 font-medium text-verde ring-1 ring-inset ring-painel-verde/20 hover:bg-verde/[0.05]"
              >
                Próximas <ChevronRight className="size-4" />
              </Link>
            ) : (
              <span />
            )}
          </nav>
        )}
      </div>
    </main>
  );
}
