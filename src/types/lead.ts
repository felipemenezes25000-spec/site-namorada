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
  created_at: string;
  updated_at: string;
}

/** Payload de criação de lead (sem campos gerados pelo banco). */
export type NewAppointmentLead = Omit<
  AppointmentLead,
  "id" | "status" | "notes" | "created_at" | "updated_at"
> & { status?: LeadStatus };
