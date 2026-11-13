import { z } from "zod";
import { periods, sources } from "@/lib/lead-options";

export { periods, sources };

const onlyDigits = (v: string) => v.replace(/\D/g, "");

/** Quebras de linha e outros controles viram espaço: o nome vai ao assunto do e-mail. */
const cleanLine = (v: string) =>
  v
    .replace(/[\p{Cc}\p{Zl}\p{Zp}]+/gu, " ")
    .replace(/ {2,}/g, " ")
    .trim();

const DATA_INVALIDA = "Informe uma data válida.";

/** AAAA-MM-DD real, de ontem até dois anos à frente (ontem: folga de fuso do aparelho). */
function isReasonableDate(v: string): boolean {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v);
  if (!m) return false;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const t = Date.UTC(y, mo - 1, d);
  const back = new Date(t);
  if (back.getUTCFullYear() !== y || back.getUTCMonth() !== mo - 1 || back.getUTCDate() !== d)
    return false;
  const day = 86_400_000;
  const now = Date.now();
  return t >= now - 2 * day && t <= now + 2 * 365 * day;
}

/**
 * Esquema do formulário e da API. Recebe a lista de tratamentos aceitos (derivada de treatments.ts
 * pelo servidor em lead-treatments.ts; o formulário recebe a mesma lista por props). Todas as
 * mensagens, inclusive as de campo ausente, são em português.
 */
export function buildAppointmentSchema(treatmentOptions: readonly string[]) {
  const treatmentMsg = "Selecione um tratamento de interesse.";
  return z
    .object({
      fullName: z
        .string({
          required_error: "Por favor, informe seu nome completo.",
          invalid_type_error: "Por favor, informe seu nome completo.",
        })
        .trim()
        .min(3, "Por favor, informe seu nome completo.")
        .max(120, "Nome muito longo.")
        .transform(cleanLine)
        .pipe(z.string().min(3, "Por favor, informe seu nome completo.")),
      whatsapp: z
        .string({
          required_error: "Informe um WhatsApp para contato.",
          invalid_type_error: "Informe um WhatsApp para contato.",
        })
        .trim()
        .min(1, "Informe um WhatsApp para contato.")
        .refine((v) => {
          const d = onlyDigits(v);
          return d.length === 10 || d.length === 11;
        }, "Informe um número de WhatsApp válido com DDD.")
        .transform(onlyDigits),
      email: z
        .string({ invalid_type_error: "E-mail inválido." })
        .trim()
        .email("E-mail inválido.")
        .max(160, "E-mail muito longo.")
        .optional()
        .or(z.literal("")),
      treatmentInterest: z
        .string({ required_error: treatmentMsg, invalid_type_error: treatmentMsg })
        .refine((v) => treatmentOptions.includes(v), treatmentMsg),
      preferredDate: z
        .string({ invalid_type_error: DATA_INVALIDA })
        .refine(isReasonableDate, DATA_INVALIDA)
        .optional()
        .or(z.literal("")),
      preferredPeriod: z.enum(periods, {
        errorMap: () => ({ message: "Selecione um período." }),
      }),
      hasXray: z
        .enum(["sim", "nao"], { errorMap: () => ({ message: "Resposta inválida." }) })
        .optional(),
      mainComplaint: z
        .string({ invalid_type_error: "Texto inválido." })
        .trim()
        .max(800, "Texto muito longo.")
        .optional()
        .or(z.literal("")),
      source: z
        .enum(sources, { errorMap: () => ({ message: "Opção inválida." }) })
        .optional()
        .or(z.literal("")),
      // Honeypot anti-spam: humanos deixam vazio; bots tendem a preencher.
      website: z.string().optional(),
      lgpdConsent: z.literal(true, {
        errorMap: () => ({
          message: "É necessário autorizar o uso dos dados para contato.",
        }),
      }),
      // Consentimento próprio para dado de saúde (queixa e radiografia). Só é exigido quando a pessoa
      // preenche um desses campos (LGPD, art. 11, I).
      healthConsent: z.boolean().optional(),
      // Atribuição de campanha (gclid/UTM), capturada no navegador.
      // Opcional e tolerante: nunca derruba um lead válido.
      attribution: z
        .object({
          gclid: z.string().max(200).optional(),
          gbraid: z.string().max(200).optional(),
          wbraid: z.string().max(200).optional(),
          utmSource: z.string().max(200).optional(),
          utmMedium: z.string().max(200).optional(),
          utmCampaign: z.string().max(200).optional(),
          utmTerm: z.string().max(200).optional(),
          utmContent: z.string().max(200).optional(),
          landingPage: z.string().max(300).optional(),
          referrer: z.string().max(300).optional(),
        })
        .optional(),
    })
    .superRefine((v, ctx) => {
      if ((v.mainComplaint || v.hasXray === "sim") && v.healthConsent !== true) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["healthConsent"],
          message:
            "Para enviar a queixa ou a informação sobre radiografia, autorize o tratamento desses dados de saúde, ou deixe esses campos em branco.",
        });
      }
    });
}

export type AppointmentSchema = ReturnType<typeof buildAppointmentSchema>;
export type AppointmentInput = z.infer<AppointmentSchema>;
