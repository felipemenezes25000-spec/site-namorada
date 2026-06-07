"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send, ShieldCheck, MessageCircle, AlertCircle } from "lucide-react";
import {
  appointmentSchema,
  type AppointmentInput,
  periods,
  sources,
} from "@/lib/validations";
import { treatments } from "@/lib/treatments";
import { whatsappLink, waMessages } from "@/lib/whatsapp";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { Input, Textarea, Select, Label, FieldError } from "@/components/ui/field";
import { Button, ButtonLink } from "@/components/ui/button";

function maskPhone(value: string): string {
  const d = value.replace(/\D/g, "").slice(0, 11);
  const len = d.length;
  if (len === 0) return "";
  if (len < 3) return `(${d}`;
  if (len < 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (len < 11) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

const treatmentOptions = [
  "Avaliação odontológica",
  ...treatments.filter((t) => t.slug !== "avaliacao-odontologica").map((t) => t.name),
  "Ainda não tenho certeza",
];

export function AppointmentForm() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");

  const {
    register,
    handleSubmit,
    setFocus,
    getValues,
    formState: { errors },
  } = useForm<AppointmentInput>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: { preferredPeriod: "Tanto faz" },
    mode: "onBlur",
  });

  const whatsappReg = register("whatsapp");

  function onInvalid(errs: typeof errors) {
    const first = Object.keys(errs)[0] as keyof AppointmentInput | undefined;
    if (first) setFocus(first);
  }

  async function onSubmit(data: AppointmentInput) {
    setStatus("submitting");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("request_failed");

      track("appointment_form_submit", { treatment: data.treatmentInterest });
      track("lead_created", { treatment: data.treatmentInterest });

      const params = new URLSearchParams({
        n: data.fullName,
        t: data.treatmentInterest,
      });
      router.push(`/obrigado?${params.toString()}`);
    } catch {
      setStatus("error");
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onInvalid)}
      noValidate
      className="surface space-y-6 p-6 sm:p-8 lg:p-10"
    >
      {/* Honeypot anti-spam (oculto de humanos e leitores de tela). */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}>
        <label htmlFor="website">Não preencha este campo</label>
        <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="fullName" required>Nome completo</Label>
          <Input
            id="fullName"
            placeholder="Como você gostaria de ser chamado(a)"
            autoComplete="name"
            invalid={!!errors.fullName}
            aria-describedby="err-fullName"
            {...register("fullName")}
          />
          <FieldError id="err-fullName" message={errors.fullName?.message} />
        </div>

        <div>
          <Label htmlFor="whatsapp" required>WhatsApp</Label>
          <Input
            id="whatsapp"
            type="tel"
            inputMode="tel"
            placeholder="(00) 00000-0000"
            autoComplete="tel"
            invalid={!!errors.whatsapp}
            aria-describedby="err-whatsapp"
            {...whatsappReg}
            onChange={(e) => {
              e.target.value = maskPhone(e.target.value);
              whatsappReg.onChange(e);
            }}
          />
          <FieldError id="err-whatsapp" message={errors.whatsapp?.message} />
        </div>

        <div>
          <Label htmlFor="email">E-mail <span className="font-normal text-brand-ink/60">(opcional)</span></Label>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            autoComplete="email"
            invalid={!!errors.email}
            aria-describedby="err-email"
            {...register("email")}
          />
          <FieldError id="err-email" message={errors.email?.message} />
        </div>

        <div>
          <Label htmlFor="treatmentInterest" required>Tratamento de interesse</Label>
          <Select
            id="treatmentInterest"
            defaultValue=""
            invalid={!!errors.treatmentInterest}
            aria-describedby="err-treatment"
            {...register("treatmentInterest")}
          >
            <option value="" disabled>Selecione uma opção</option>
            {treatmentOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </Select>
          <FieldError id="err-treatment" message={errors.treatmentInterest?.message} />
        </div>

        <div>
          <Label htmlFor="preferredPeriod" required>Melhor período</Label>
          <Select
            id="preferredPeriod"
            invalid={!!errors.preferredPeriod}
            {...register("preferredPeriod")}
          >
            {periods.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </Select>
          <FieldError message={errors.preferredPeriod?.message} />
        </div>

        <div>
          <Label htmlFor="preferredDate">Melhor dia <span className="font-normal text-brand-ink/60">(opcional)</span></Label>
          <Input id="preferredDate" type="date" {...register("preferredDate")} />
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="mainComplaint">Queixa principal ou observação <span className="font-normal text-brand-ink/60">(opcional)</span></Label>
          <Textarea
            id="mainComplaint"
            placeholder="Conte, com suas palavras, o que te trouxe até aqui. Fique à vontade."
            invalid={!!errors.mainComplaint}
            {...register("mainComplaint")}
          />
          <FieldError message={errors.mainComplaint?.message} />
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="source">Como conheceu a Dra. Ana? <span className="font-normal text-brand-ink/60">(opcional)</span></Label>
          <Select id="source" defaultValue="" {...register("source")}>
            <option value="">Prefiro não informar</option>
            {sources.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </Select>
        </div>
      </div>

      {/* Consentimento LGPD */}
      <div>
        <label
          htmlFor="lgpdConsent"
          className={cn(
            "flex cursor-pointer items-start gap-3 rounded-xl border border-brand-ink/10 bg-brand-beige/30 p-4 transition-colors",
            errors.lgpdConsent && "border-red-400 bg-red-50/50",
          )}
        >
          <input
            id="lgpdConsent"
            type="checkbox"
            className="mt-0.5 size-5 shrink-0 cursor-pointer accent-brand-green"
            aria-describedby="err-lgpd"
            aria-invalid={!!errors.lgpdConsent || undefined}
            {...register("lgpdConsent")}
          />
          <span className="text-sm leading-relaxed text-brand-ink/75">
            Autorizo o uso dos meus dados para contato e continuidade do
            atendimento, conforme a{" "}
            <a href="/politica-de-privacidade" target="_blank" className="font-semibold text-brand-green underline decoration-brand-gold/50 underline-offset-2 hover:decoration-brand-gold">
              Política de Privacidade
            </a>
            .
          </span>
        </label>
        <FieldError id="err-lgpd" message={errors.lgpdConsent?.message as string | undefined} />
      </div>

      {/* Estado de erro */}
      {status === "error" && (
        <div role="alert" className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <span className="flex items-center gap-2 font-medium">
            <AlertCircle className="size-4" /> Não foi possível enviar agora.
          </span>
          <span className="text-red-700/80">
            Você pode tentar novamente ou falar diretamente com a Dra. Ana pelo WhatsApp — seus dados não se perdem.
          </span>
          <ButtonLink
            href={whatsappLink(
              waMessages.fromForm(
                getValues("fullName") || "",
                getValues("treatmentInterest") || "uma avaliação",
              ),
            )}
            external
            variant="whatsapp"
            size="sm"
            className="self-start"
            onClick={() => track("whatsapp_click", { location: "form_error_fallback" })}
          >
            <MessageCircle className="size-4" strokeWidth={1.7} />
            Continuar pelo WhatsApp
          </ButtonLink>
        </div>
      )}

      <div className="space-y-4">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={status === "submitting"}
          className="w-full"
        >
          {status === "submitting" ? (
            <>
              <Loader2 className="size-5 animate-spin" /> Enviando solicitação…
            </>
          ) : (
            <>
              <Send className="size-5" strokeWidth={1.7} /> Quero agendar minha avaliação
            </>
          )}
        </Button>
        <p className="flex items-center justify-center gap-2 text-center text-xs text-brand-ink/65">
          <ShieldCheck className="size-3.5 shrink-0 text-brand-green" />
          Sem compromisso de venda. Seus dados são sigilosos e usados apenas para contato.
        </p>
      </div>
    </form>
  );
}
