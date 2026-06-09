import { z } from "zod";

const onlyDigits = (v: string) => v.replace(/\D/g, "");

export const periods = ["Manhã", "Tarde", "Noite", "Tanto faz"] as const;
export const sources = [
  "Instagram",
  "Google",
  "Indicação de amigo ou familiar",
  "Já sou paciente",
  "Anúncio",
  "Outro",
] as const;

export const appointmentSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, "Por favor, informe seu nome completo.")
    .max(120, "Nome muito longo."),
  whatsapp: z
    .string()
    .trim()
    .min(1, "Informe um WhatsApp para contato.")
    .refine((v) => {
      const d = onlyDigits(v);
      return d.length === 10 || d.length === 11;
    }, "Informe um número de WhatsApp válido com DDD."),
  email: z
    .string()
    .trim()
    .email("E-mail inválido.")
    .optional()
    .or(z.literal("")),
  treatmentInterest: z
    .string()
    .min(1, "Selecione um tratamento de interesse."),
  preferredDate: z.string().optional().or(z.literal("")),
  preferredPeriod: z.enum(periods, {
    errorMap: () => ({ message: "Selecione um período." }),
  }),
  hasXray: z.enum(["sim", "nao"]).optional(),
  mainComplaint: z
    .string()
    .trim()
    .max(800, "Texto muito longo.")
    .optional()
    .or(z.literal("")),
  source: z.enum(sources).optional().or(z.literal("")),
  // Honeypot anti-spam: humanos deixam vazio; bots tendem a preencher.
  website: z.string().optional(),
  lgpdConsent: z.literal(true, {
    errorMap: () => ({
      message: "É necessário autorizar o uso dos dados para contato.",
    }),
  }),
});

export type AppointmentInput = z.infer<typeof appointmentSchema>;
