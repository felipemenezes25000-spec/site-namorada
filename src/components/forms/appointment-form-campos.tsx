"use client";

import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { AppointmentInput } from "@/lib/validations";
import { periods, sources } from "@/lib/lead-options";
import { cn } from "@/lib/utils";
import {
  Input,
  Textarea,
  Select,
  Label,
  Hint,
  FieldError,
  ChipRadio,
  Checkbox,
} from "@/components/ui/field";
import { PlusIcon } from "@/components/ui/icons";
import { maskPhone } from "./use-lead-submit";
import styles from "./agendamento-form.module.css";

type Props = {
  register: UseFormRegister<AppointmentInput>;
  errors: FieldErrors<AppointmentInput>;
};

/** `aria-describedby` com a dica (quando houver) e o erro (quando houver). */
const descr = (erro: boolean, err: string, hint?: string) =>
  [hint, erro ? err : undefined].filter(Boolean).join(" ") || undefined;

/** "O essencial": nome, WhatsApp e tratamento (os três obrigatórios). */
export function CamposEssenciais({
  register,
  errors,
  treatmentOptions,
}: Props & { treatmentOptions: string[] }) {
  const whatsappReg = register("whatsapp");
  return (
    <div className={styles.etapa}>
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>
          <span className={cn("t-d3 display", styles.legendTitle)}>O essencial</span>
          <span className={`t-sm ${styles.req}`}>Os campos com * são obrigatórios.</span>
        </legend>

        <div className={styles.campos}>
          <div className={styles.campo}>
            <Label htmlFor="fullName" required>
              Nome completo
            </Label>
            <Input
              id="fullName"
              placeholder="Nome e sobrenome"
              autoComplete="name"
              autoCapitalize="words"
              enterKeyHint="next"
              aria-required="true"
              invalid={!!errors.fullName}
              aria-describedby={descr(!!errors.fullName, "err-fullName")}
              {...register("fullName")}
            />
            <FieldError id="err-fullName" message={errors.fullName?.message} />
          </div>

          <div className={styles.campo}>
            <Label htmlFor="whatsapp" required>
              WhatsApp
            </Label>
            <Input
              id="whatsapp"
              type="tel"
              inputMode="tel"
              placeholder="(00) 00000-0000"
              autoComplete="tel"
              enterKeyHint="next"
              aria-required="true"
              invalid={!!errors.whatsapp}
              aria-describedby={descr(!!errors.whatsapp, "err-whatsapp", "hint-whatsapp")}
              {...whatsappReg}
              onChange={(e) => {
                e.target.value = maskPhone(e.target.value);
                whatsappReg.onChange(e);
              }}
            />
            <Hint id="hint-whatsapp">
              Com DDD, para a Dra. Ana confirmar o melhor horário com você.
            </Hint>
            <FieldError id="err-whatsapp" message={errors.whatsapp?.message} />
          </div>

          <div className={styles.campo}>
            <Label htmlFor="treatmentInterest" required>
              Tratamento de interesse
            </Label>
            <Select
              id="treatmentInterest"
              aria-required="true"
              invalid={!!errors.treatmentInterest}
              aria-describedby={descr(!!errors.treatmentInterest, "err-treatmentInterest")}
              {...register("treatmentInterest")}
            >
              <option value="" disabled>
                Selecione uma opção
              </option>
              {treatmentOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </Select>
            <FieldError id="err-treatmentInterest" message={errors.treatmentInterest?.message} />
          </div>
        </div>
      </fieldset>
    </div>
  );
}

/** "Se quiser, conte mais": período, dia, e-mail, radiografia, queixa (com o consentimento de saúde) e origem. */
export function CamposOpcionais({
  register,
  errors,
  open,
  onOpenChange,
  minDate,
}: Props & { open: boolean; onOpenChange: (open: boolean) => void; minDate?: string }) {
  return (
    <div className={styles.etapa}>
      <details
        className={styles.mais}
        open={open}
        onToggle={(e) => onOpenChange(e.currentTarget.open)}
      >
        <summary className={styles.sum}>
          <span className={styles.sumTexto}>
            <span className={cn("t-d3 display", styles.sumTitulo)}>
              Se quiser, conte mais (opcional)
            </span>
            <span className={`t-sm ${styles.sumAjuda}`}>
              Melhor período, e-mail, radiografia e o que trouxe você até aqui.
            </span>
          </span>
          <PlusIcon className={styles.plus} />
        </summary>

        <div className={styles.maisCorpo}>
          <fieldset className={styles.grupo}>
            <legend className="fld-label">Melhor período</legend>
            <div className={styles.chips}>
              {periods.map((p, i) => (
                <ChipRadio
                  key={p}
                  id={`preferredPeriod-${i}`}
                  value={p}
                  label={p}
                  {...register("preferredPeriod")}
                />
              ))}
            </div>
          </fieldset>

          <div className={styles.par}>
            <div className={styles.campo}>
              <Label htmlFor="preferredDate">
                Melhor dia <span className={styles.opc}>(opcional)</span>
              </Label>
              <Input
                id="preferredDate"
                type="date"
                min={minDate}
                invalid={!!errors.preferredDate}
                aria-describedby={descr(!!errors.preferredDate, "err-preferredDate")}
                {...register("preferredDate")}
              />
              <FieldError id="err-preferredDate" message={errors.preferredDate?.message} />
            </div>

            <div className={styles.campo}>
              <Label htmlFor="email">
                E-mail <span className={styles.opc}>(opcional)</span>
              </Label>
              <Input
                id="email"
                type="email"
                inputMode="email"
                placeholder="seu@email.com"
                autoComplete="email"
                autoCapitalize="none"
                spellCheck={false}
                invalid={!!errors.email}
                aria-describedby={descr(!!errors.email, "err-email")}
                {...register("email")}
              />
              <FieldError id="err-email" message={errors.email?.message} />
            </div>
          </div>

          <fieldset className={styles.grupo}>
            <legend className="fld-label">Tem exame radiográfico?</legend>
            <div className={styles.chips}>
              <ChipRadio id="hasXray-sim" value="sim" label="Sim" {...register("hasXray")} />
              <ChipRadio id="hasXray-nao" value="nao" label="Não" {...register("hasXray")} />
            </div>
          </fieldset>

          <div className={styles.campo}>
            <Label htmlFor="mainComplaint">
              Queixa principal ou observação <span className={styles.opc}>(opcional)</span>
            </Label>
            <Textarea
              id="mainComplaint"
              placeholder="Conte, com suas palavras, o que te trouxe até aqui."
              invalid={!!errors.mainComplaint}
              aria-describedby={descr(!!errors.mainComplaint, "err-mainComplaint", "hint-queixa")}
              {...register("mainComplaint")}
            />
            <Hint id="hint-queixa">Evite informar dados sensíveis além do necessário.</Hint>
            <FieldError id="err-mainComplaint" message={errors.mainComplaint?.message} />
          </div>

          {/* Dado de saúde: consentimento próprio (LGPD, art. 11, I). Só vale a pena marcar se a
              queixa ou a radiografia foram preenchidas; a API exige nesse caso. */}
          <div className={styles.campo}>
            <Checkbox
              id="healthConsent"
              aria-invalid={!!errors.healthConsent || undefined}
              aria-describedby={errors.healthConsent ? "err-healthConsent" : "hint-healthConsent"}
              label={
                <>
                  <span className={cn("t-sm", styles.consTexto)}>
                    Autorizo o tratamento dos dados de saúde que eu informar (queixa e radiografia)
                    para esta finalidade. Veja a{" "}
                    <a
                      href="/politica-de-privacidade#dados"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link"
                    >
                      seção 2 da Política de Privacidade
                      <span className="sr-only"> (abre em nova aba)</span>
                    </a>
                    .
                  </span>
                  <span id="hint-healthConsent" className={cn("t-sm", styles.consRevoga)}>
                    Só é necessário se você preencher a queixa ou responder “Sim” na radiografia.
                  </span>
                </>
              }
              {...register("healthConsent")}
            />
            <FieldError
              id="err-healthConsent"
              message={errors.healthConsent?.message as string | undefined}
            />
          </div>

          <div className={styles.campo}>
            <Label htmlFor="source">
              Como conheceu a Dra. Ana? <span className={styles.opc}>(opcional)</span>
            </Label>
            <Select id="source" defaultValue="" {...register("source")}>
              <option value="">Prefiro não informar</option>
              {sources.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </details>
    </div>
  );
}
