/** Status do lead no funil de atendimento. */
export const leadStatuses = [
  "new",
  "contacted",
  "scheduled",
  "confirmed",
  "attended",
  "rescheduled",
  "canceled",
  "no_response",
] as const;

export type LeadStatus = (typeof leadStatuses)[number];

/** Rótulos em português para o painel. */
export const leadStatusLabels: Record<LeadStatus, string> = {
  new: "Novo",
  contacted: "Em contato",
  scheduled: "Agendado",
  confirmed: "Confirmado",
  attended: "Compareceu",
  rescheduled: "Remarcou",
  canceled: "Cancelado",
  no_response: "Sem resposta",
};

/** Linha da tabela appointment_leads (Supabase). */
export interface AppointmentLead {
  id: string;
  full_name: string;
  whatsapp: string;
  email: string | null;
  treatment_interest: string | null;
  preferred_date: string | null;
  preferred_period: string | null;
  main_complaint: string | null;
  source: string | null;
  status: LeadStatus;
  notes: string | null;
  lgpd_consent: boolean;
  lgpd_consent_at: string | null;
  privacy_policy_version: string | null;
  /** Atribuição de campanha (Google Ads / UTM) — preenchida quando o lead veio de anúncio. */
  gclid: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  landing_page: string | null;
  referrer: string | null;
  created_at: string;
  updated_at: string;
}

/** Payload de criação de lead (sem campos gerados pelo banco). */
export type NewAppointmentLead = Omit<
  AppointmentLead,
  "id" | "status" | "notes" | "created_at" | "updated_at"
> & { status?: LeadStatus };
