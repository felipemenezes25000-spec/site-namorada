"use client";

import { useEffect, useRef, useState, type FocusEvent, type MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { useForm, type FieldErrors, type Resolver } from "react-hook-form";
import type { AppointmentInput } from "@/lib/validations";
import { periods, sources } from "@/lib/lead-options";
import { waMessages } from "@/lib/whatsapp";
import { track } from "@/lib/analytics";
import { getAttribution } from "@/lib/attribution";
import { cn } from "@/lib/utils";
import { firstNameOf, saveLeadHandoff, treatmentForMessage } from "@/lib/agendamento-handoff";
import type { LeadsResponse } from "@/types/lead";
import {
  Input,
  Textarea,
  Select,
  Label,
  Hint,
  FieldError,
  ErrorSummary,
  ChipRadio,
  Checkbox,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { PhoneCTA, WhatsAppCTA, CTA_CONTINUAR_WHATSAPP, CTA_DUVIDAS_WHATSAPP } from "@/components/ui/cta";
import { ArrowIcon, PlusIcon } from "@/components/ui/icons";
import styles from "./agendamento-form.module.css";

function maskPhone(value: string): string {
  const d = value.replace(/\D/g, "").slice(0, 11);
  const len = d.length;
  if (len === 0) return "";
  if (len < 3) return `(${d}`;
  if (len < 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (len < 11) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

/** Hoje no relógio do aparelho (AAAA-MM-DD), para o `min` do campo de data. Sem fuso, sem UTC. */
function todayLocal(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Campos que aparecem no resumo de erros, na ordem em que estão na tela. */
const SUMMARY_FIELDS = [
  "fullName",
  "whatsapp",
  "treatmentInterest",
  "email",
  "preferredDate",
  "mainComplaint",
  "healthConsent",
  "lgpdConsent",
] as const;
/** Campos do bloco "conte mais": se um deles falhar, o bloco abre sozinho. */
const OPTIONAL_FIELDS: readonly string[] = [
  "email",
  "preferredPeriod",
  "preferredDate",
  "hasXray",
  "mainComplaint",
  "healthConsent",
  "source",
];
/** Só estes campos têm onde mostrar uma mensagem de erro do servidor (campo + resumo). */
const SERVER_FIELDS: readonly string[] = SUMMARY_FIELDS;

type Aviso =
  | { kind: "limite"; minutos?: number }
  | { kind: "servidor" }
  | { kind: "rede" };

const avisoTexto: Record<Aviso["kind"], { titulo: string; texto: string }> = {
  limite: {
    titulo: "Muitas tentativas em pouco tempo.",
    texto: "Para não esperar, continue pelo WhatsApp.",
  },
  servidor: {
    titulo: "Não conseguimos enviar agora.",
    texto:
      "O problema é do nosso lado. Seus dados continuam no formulário: tente de novo ou continue pelo WhatsApp.",
  },
  rede: {
    titulo: "Parece que a conexão caiu.",
    texto:
      "Confira a internet e tente de novo. Seus dados continuam no formulário. Se preferir, continue pelo WhatsApp.",
  },
};

export function AppointmentForm({
  treatmentOptions,
  treatmentBySlug,
}: {
  /** Opções do select, na ordem da tela (derivadas de treatments.ts pela página, no servidor). */
  treatmentOptions: string[];
  /** slug de /tratamentos/[slug] -> opção do select, para `?tratamento=<slug>`. */
  treatmentBySlug: Record<string, string>;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [aviso, setAviso] = useState<Aviso | null>(null);
  const [fallbackMsg, setFallbackMsg] = useState<string>(waMessages.default);
  const [moreOpen, setMoreOpen] = useState(false);
  const [focusTick, setFocusTick] = useState(0);
  const [minDate, setMinDate] = useState<string | undefined>(undefined);
  const submittingRef = useRef(false);
  const startedRef = useRef(false);
  // Hora em que o formulário abriu: a API usa para descartar envios automáticos (menos de 3 s).
  const openedAtRef = useRef(Date.now());
  const resolverRef = useRef<Promise<Resolver<AppointmentInput>> | null>(null);

  /**
   * O esquema Zod e o resolvedor só são baixados na primeira validação (ou assim que a pessoa entra
   * no formulário): o primeiro carregamento da página não paga por eles. Mesmas mensagens de antes.
   */
  function loadResolver(): Promise<Resolver<AppointmentInput>> {
    if (!resolverRef.current) {
      resolverRef.current = Promise.all([
        import("@hookform/resolvers/zod"),
        import("@/lib/validations"),
      ]).then(
        ([{ zodResolver }, { buildAppointmentSchema }]) =>
          zodResolver(buildAppointmentSchema(treatmentOptions)) as unknown as Resolver<AppointmentInput>,
      );
    }
    return resolverRef.current;
  }

  // O grupo de rádio "radiografia" devolve `null` quando ninguém escolhe e o esquema espera "sim", "nao"
  // ou ausente: `null` vira ausente antes de validar.
  const resolver: Resolver<AppointmentInput> = async (values, context, options) => {
    const r = await loadResolver();
    return r({ ...values, hasXray: values.hasXray || undefined }, context, options);
  };


  /** `form_start` só quando a pessoa entra num campo (não num link do formulário). */
  function onFormStart(e: FocusEvent<HTMLFormElement>) {
    if (!(e.target as HTMLElement).matches("input,select,textarea")) return;
    void loadResolver();
    if (!startedRef.current) {
      startedRef.current = true;
      track("form_start", { location: "appointment_page" });
    }
  }

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<AppointmentInput>({
    resolver,
    defaultValues: {
      preferredPeriod: "Tanto faz",
      treatmentInterest: "",
    },
    mode: "onBlur",
    shouldFocusError: false, // o foco vai para o resumo de erros
  });

  const whatsappReg = register("whatsapp");

  // `?tratamento=<slug>` pré-seleciona o tratamento (slug que não existe é ignorado). A leitura é no
  // navegador, depois da hidratação, para a página continuar estática; não sobrescreve uma escolha já feita.
  useEffect(() => {
    setMinDate(todayLocal());
    const slug = new URLSearchParams(window.location.search).get("tratamento");
    const option = slug && Object.hasOwn(treatmentBySlug, slug) ? treatmentBySlug[slug] : undefined;
    if (option && !getValues("treatmentInterest")) setValue("treatmentInterest", option);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const summary = SUMMARY_FIELDS.flatMap((k) => {
    const message = errors[k]?.message;
    return message ? [{ id: k, message: String(message) }] : [];
  });

  // Depois de um envio com erro de preenchimento, o foco vai para o resumo (já renderizado neste ponto).
  useEffect(() => {
    if (focusTick === 0) return;
    const t = window.setTimeout(
      () => document.getElementById("resumo-erros")?.focus(),
      0,
    );
    return () => window.clearTimeout(t);
  }, [focusTick]);

  function onInvalid(errs: FieldErrors<AppointmentInput>) {
    if (Object.keys(errs).some((k) => OPTIONAL_FIELDS.includes(k)))
      setMoreOpen(true);
    setAviso(null);
    setFocusTick((n) => n + 1);
  }

  /** Clique num erro do resumo: foca o campo (e abre o bloco opcional se ele estiver lá dentro). */
  function onSummaryClick(e: MouseEvent<HTMLDivElement>) {
    const link = (e.target as HTMLElement).closest<HTMLAnchorElement>(
      'a[href^="#"]',
    );
    if (!link) return;
    e.preventDefault();
    const id = link.getAttribute("href")!.slice(1);
    if (OPTIONAL_FIELDS.includes(id)) setMoreOpen(true);
    window.setTimeout(() => document.getElementById(id)?.focus(), 0);
  }

  async function onSubmit(data: AppointmentInput) {
    if (submittingRef.current) return; // sem envio duplo (Enter repetido, toque duplo)
    submittingRef.current = true;
    setSubmitting(true);
    setAviso(null);
    const firstName = firstNameOf(data.fullName);
    setFallbackMsg(
      firstName
        ? waMessages.fromForm(firstName, treatmentForMessage(data.treatmentInterest))
        : waMessages.default,
    );

    // O botão usa aria-disabled (não `disabled`), então o foco nunca sai dele: depois de qualquer
    // falha a pessoa continua com o foco no botão e o aviso (role="alert") é anunciado uma vez.
    const release = (next?: Aviso) => {
      submittingRef.current = false;
      setSubmitting(false);
      if (next) setAviso(next);
    };

    let res: Response;
    try {
      res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Atribuição de campanha (gclid/UTM) viaja junto com o lead —
        // viabiliza importar conversões offline no Google Ads.
        body: JSON.stringify({
          ...data,
          attribution: getAttribution() ?? undefined,
          formStartedAt: openedAtRef.current,
        }),
      });
    } catch {
      release({ kind: "rede" });
      return;
    }

    if (res.status === 422) {
      // O servidor recusou campos específicos: mostra cada um no seu lugar e no resumo.
      const body = (await res.json().catch(() => null)) as LeadsResponse | null;
      const fieldErrors =
        body && !body.ok && body.error === "validation" ? body.fieldErrors : {};
      let placed = 0;
      for (const [field, msgs] of Object.entries(fieldErrors)) {
        const message = msgs?.[0];
        if (message && SERVER_FIELDS.includes(field)) {
          setError(field as keyof AppointmentInput, {
            type: "server",
            message,
          });
          placed += 1;
        }
      }
      if (!placed) {
        setError("fullName", {
          type: "server",
          message:
            "Alguns dados não foram aceitos. Revise as informações e tente de novo.",
        });
      }
      if (Object.keys(fieldErrors).some((k) => OPTIONAL_FIELDS.includes(k)))
        setMoreOpen(true);
      release();
      setFocusTick((n) => n + 1);
      return;
    }

    if (res.status === 429) {
      const retry = Number(res.headers.get("Retry-After"));
      release({
        kind: "limite",
        minutos: retry > 0 ? Math.max(1, Math.ceil(retry / 60)) : undefined,
      });
      return;
    }

    if (!res.ok) {
      release({ kind: "servidor" });
      return;
    }

    // Sucesso. `appointment_form_submit` é o evento do envio; `lead_created` (a conversão) dispara uma
    // única vez em /obrigado, guiado por sessionStorage. O botão fica travado até a página mudar.
    const okBody = (await res.json().catch(() => null)) as LeadsResponse | null;
    if (okBody?.ok && okBody.trap) {
      // Envio descartado pela API (armadilha anti-robô): mostra o mesmo caminho, sem contar conversão.
      router.push("/obrigado");
      return;
    }
    track("appointment_form_submit", { treatment: data.treatmentInterest });
    const saved = saveLeadHandoff({
      firstName,
      treatment: data.treatmentInterest,
    });
    if (!saved) {
      // Sem sessionStorage (janela privada, dados bloqueados): /obrigado não saberá do lead, então a
      // conversão sai aqui, uma vez.
      track("lead_created", {
        treatment: data.treatmentInterest,
        location: "appointment_page",
      });
    }
    router.push("/obrigado");
    // Se a navegação não completar (conexão caiu logo após o envio), o lead já existe: leva a pessoa
    // à confirmação em vez de deixá-la presa num botão bloqueado (reenviar duplicaria o lead).
    window.setTimeout(() => {
      if (window.location.pathname !== "/obrigado") window.location.assign("/obrigado");
    }, 4000);
  }

  return (
    <>
      {/*
        Sem JavaScript o formulário não envia nada: ele some e dá lugar ao WhatsApp e ao telefone.
        `method="post"` evita que um envio antes da hidratação coloque nome, WhatsApp e e-mail na URL.
      */}
      <noscript>
        <style>{"[data-needs-js]{display:none!important}"}</style>
        <div className={styles.semJs}>
          <p className="t-body">
            Este formulário precisa de JavaScript para funcionar. Para agendar agora, fale pelo WhatsApp ou
            ligue.
          </p>
          <div className={styles.semJsAcoes}>
            <WhatsAppCTA location="form_no_js" message={waMessages.default} />
            <PhoneCTA location="form_no_js" variant="contorno" />
          </div>
        </div>
      </noscript>
      <form
        method="post"
        data-needs-js=""
        onSubmit={handleSubmit(onSubmit, onInvalid)}
        onFocus={onFormStart}
        noValidate
        className={styles.form}
      >
        {/* Honeypot anti-spam (oculto de humanos e leitores de tela). */}
        <div aria-hidden="true" className={styles.honey}>
          <label htmlFor="website">Não preencha este campo</label>
          <input
            id="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            {...register("website")}
          />
        </div>

        {summary.length > 0 && (
          <div onClick={onSummaryClick}>
            <ErrorSummary
              errors={summary}
              title="Revise estes campos antes de enviar:"
            />
          </div>
        )}

        {/* O essencial */}
        <div className={styles.etapa}>
          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>
              <span className={cn("t-d3 display", styles.legendTitle)}>
                O essencial
              </span>
              <span className={`t-sm ${styles.req}`}>
                Os campos com * são obrigatórios.
              </span>
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
                  aria-describedby={errors.fullName ? "err-fullName" : undefined}
                  {...register("fullName")}
                />
                <FieldError
                  id="err-fullName"
                  message={errors.fullName?.message}
                />
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
                  aria-describedby={
                    errors.whatsapp
                      ? "hint-whatsapp err-whatsapp"
                      : "hint-whatsapp"
                  }
                  {...whatsappReg}
                  onChange={(e) => {
                    e.target.value = maskPhone(e.target.value);
                    whatsappReg.onChange(e);
                  }}
                />
                <Hint id="hint-whatsapp">
                  Com DDD, para a Dra. Ana confirmar o melhor horário com você.
                </Hint>
                <FieldError
                  id="err-whatsapp"
                  message={errors.whatsapp?.message}
                />
              </div>

              <div className={styles.campo}>
                <Label htmlFor="treatmentInterest" required>
                  Tratamento de interesse
                </Label>
                <Select
                  id="treatmentInterest"
                  aria-required="true"
                  invalid={!!errors.treatmentInterest}
                  aria-describedby={
                    errors.treatmentInterest ? "err-treatmentInterest" : undefined
                  }
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
                <FieldError
                  id="err-treatmentInterest"
                  message={errors.treatmentInterest?.message}
                />
              </div>
            </div>
          </fieldset>
        </div>

        {/* Opcional, no mesmo envio */}
        <div className={styles.etapa}>
          <details
            className={styles.mais}
            open={moreOpen}
            onToggle={(e) => setMoreOpen(e.currentTarget.open)}
          >
            <summary className={styles.sum}>
              <span className={styles.sumTexto}>
                <span className={cn("t-d3 display", styles.sumTitulo)}>
                  Se quiser, conte mais (opcional)
                </span>
                <span className={`t-sm ${styles.sumAjuda}`}>
                  Melhor período, e-mail, radiografia e o que trouxe você até
                  aqui.
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
                    aria-describedby={errors.preferredDate ? "err-preferredDate" : undefined}
                    {...register("preferredDate")}
                  />
                  <FieldError
                    id="err-preferredDate"
                    message={errors.preferredDate?.message}
                  />
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
                    aria-describedby={errors.email ? "err-email" : undefined}
                    {...register("email")}
                  />
                  <FieldError id="err-email" message={errors.email?.message} />
                </div>
              </div>

              <fieldset className={styles.grupo}>
                <legend className="fld-label">Tem exame radiográfico?</legend>
                <div className={styles.chips}>
                  <ChipRadio
                    id="hasXray-sim"
                    value="sim"
                    label="Sim"
                    {...register("hasXray")}
                  />
                  <ChipRadio
                    id="hasXray-nao"
                    value="nao"
                    label="Não"
                    {...register("hasXray")}
                  />
                </div>
              </fieldset>

              <div className={styles.campo}>
                <Label htmlFor="mainComplaint">
                  Queixa principal ou observação{" "}
                  <span className={styles.opc}>(opcional)</span>
                </Label>
                <Textarea
                  id="mainComplaint"
                  placeholder="Conte, com suas palavras, o que te trouxe até aqui."
                  invalid={!!errors.mainComplaint}
                  aria-describedby={
                    errors.mainComplaint
                      ? "hint-queixa err-mainComplaint"
                      : "hint-queixa"
                  }
                  {...register("mainComplaint")}
                />
                <Hint id="hint-queixa">
                  Evite informar dados sensíveis além do necessário.
                </Hint>
                <FieldError
                  id="err-mainComplaint"
                  message={errors.mainComplaint?.message}
                />
              </div>

              {/* Dado de saúde: consentimento próprio (LGPD, art. 11, I). Só vale a pena marcar se a
                  queixa ou a radiografia foram preenchidas; a API exige nesse caso. */}
              <div className={styles.campo}>
                <Checkbox
                  id="healthConsent"
                  aria-invalid={!!errors.healthConsent || undefined}
                  aria-describedby={
                    errors.healthConsent ? "err-healthConsent" : "hint-healthConsent"
                  }
                  label={
                    <>
                      <span className={cn("t-sm", styles.consTexto)}>
                        Autorizo o tratamento dos dados de saúde que eu informar (queixa e
                        radiografia) para esta finalidade. Veja a{" "}
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
                  Como conheceu a Dra. Ana?{" "}
                  <span className={styles.opc}>(opcional)</span>
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

        {/* Consentimento LGPD e envio */}
        <div className={cn(styles.envio, styles.etapa, styles.etapaFim)}>
          <p className={cn("t-sm", styles.garantia)}>
            Usamos seus dados para entrar em contato e agendar. Se você veio de um anúncio, guardamos
            também a origem do clique, para saber qual anúncio trouxe o contato.
          </p>
          <p className={cn("t-sm", styles.garantia)}>
            Paciente com menos de 18 anos: o contato e o consentimento são de um dos pais ou do
            responsável legal.
          </p>

          <div>
            <Checkbox
              id="lgpdConsent"
              aria-required="true"
              aria-invalid={!!errors.lgpdConsent || undefined}
              aria-describedby={
                errors.lgpdConsent ? "err-lgpdConsent" : undefined
              }
              label={
                <>
                  <span className={cn("t-sm", styles.consTexto)}>
                    Autorizo o uso dos meus dados para contato e agendamento, conforme a{" "}
                    <a
                      href="/politica-de-privacidade"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link"
                    >
                      Política de Privacidade
                      <span className="sr-only"> (abre em nova aba)</span>
                    </a>
                    .
                  </span>
                  <span className={cn("t-sm", styles.consRevoga)}>
                    Posso retirar este consentimento a qualquer momento pelos canais
                    indicados na política.
                  </span>
                </>
              }
              {...register("lgpdConsent")}
            />
            <FieldError
              id="err-lgpdConsent"
              message={errors.lgpdConsent?.message as string | undefined}
            />
          </div>

          {/* Estado do envio. O texto "Enviando…" é uma região viva; o aviso de falha é um alerta
              próprio, anunciado uma vez quando aparece. */}
          <div className={styles.status}>
            <p role="status" aria-live="polite" className={cn("t-sm", styles.enviando)}>
              {submitting ? "Enviando sua solicitação…" : ""}
            </p>
            {aviso && (
              <div role="alert" className={`fld-resumo ${styles.aviso}`}>
                <p className="font-medium">{avisoTexto[aviso.kind].titulo}</p>
                <p className="t-sm">
                  {avisoTexto[aviso.kind].texto}
                  {aviso.kind === "limite" && aviso.minutos
                    ? ` Se preferir, tente de novo em cerca de ${aviso.minutos} ${aviso.minutos === 1 ? "minuto" : "minutos"}.`
                    : ""}
                </p>
                <WhatsAppCTA
                  location="form_error_fallback"
                  message={fallbackMsg}
                  label={CTA_CONTINUAR_WHATSAPP}
                  size="sm"
                />
              </div>
            )}
          </div>

          <Button
            type="submit"
            variant="primario"
            size="md"
            aria-disabled={submitting ? "true" : undefined}
            className={styles.submit}
            iconRight={submitting ? undefined : <ArrowIcon />}
          >
            {submitting ? "Enviando…" : "Agendar minha avaliação"}
          </Button>

          <p className={`t-sm ${styles.alt}`}>
            <span>Prefere não preencher?</span>
            <WhatsAppCTA location="form_alt" variant="texto" label={CTA_DUVIDAS_WHATSAPP} />
          </p>
        </div>
      </form>
    </>
  );
}
