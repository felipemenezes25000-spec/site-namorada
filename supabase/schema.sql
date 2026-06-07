-- ============================================================
--  Banco de leads / agendamentos — Dra. Ana Beatriz Lemos Souza
--  Execute no SQL Editor do Supabase (uma vez).
-- ============================================================

-- Status possíveis do lead no funil de atendimento.
do $$
begin
  if not exists (select 1 from pg_type where typname = 'lead_status') then
    create type lead_status as enum (
      'new', 'contacted', 'scheduled', 'confirmed',
      'attended', 'rescheduled', 'canceled', 'no_response'
    );
  end if;
end$$;

create table if not exists public.appointment_leads (
  id                 uuid primary key default gen_random_uuid(),
  full_name          text not null,
  whatsapp           text not null,
  email              text,
  treatment_interest text,
  preferred_date     text,
  preferred_period   text,
  main_complaint     text,
  source             text,
  status             lead_status not null default 'new',
  notes              text,
  lgpd_consent       boolean not null default false,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create index if not exists appointment_leads_status_idx
  on public.appointment_leads (status);
create index if not exists appointment_leads_created_at_idx
  on public.appointment_leads (created_at desc);

-- Mantém updated_at sincronizado.
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end$$;

drop trigger if exists trg_appointment_leads_updated_at on public.appointment_leads;
create trigger trg_appointment_leads_updated_at
  before update on public.appointment_leads
  for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
--  Row Level Security
-- ------------------------------------------------------------
alter table public.appointment_leads enable row level security;

-- Permite que o site (chave anon) INSIRA novos leads,
-- mas NÃO permite leitura pública (dados ficam protegidos).
drop policy if exists "anon can insert leads" on public.appointment_leads;
create policy "anon can insert leads"
  on public.appointment_leads
  for insert
  to anon
  with check (true);

-- A leitura/edição é feita apenas pelo servidor com a
-- SERVICE ROLE KEY, que ignora RLS por padrão.
-- (Não criamos policy de SELECT para anon de propósito.)
