"use client";

import { useEffect, useRef, useState, type FocusEvent, type MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { useForm, type FieldErrors, type Resolver } from "react-hook-form";
import type { AppointmentInput } from "@/lib/validations";
import { waMessages } from "@/lib/whatsapp";
import { track } from "@/lib/analytics";
import { getAttribution } from "@/lib/attribution";
import { cn } from "@/lib/utils";
import { firstNameOf, saveLeadHandoff, treatmentForMessage } from "@/lib/agendamento-handoff";
import { FieldError, ErrorSummary, Checkbox } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { PhoneCTA, WhatsAppCTA, CTA_CONTINUAR_WHATSAPP } from "@/components/ui/cta";
import { ArrowIcon } from "@/components/ui/icons";
import { CamposEssenciais, CamposOpcionais } from "./appointment-form-campos";
import {
  OPTIONAL_FIELDS,
  SUMMARY_FIELDS,
  TEXTO_TALVEZ_ENVIADO,
  avisoTexto,
  enviarLead,
  novoSubmissionId,
  todayLocal,
  type Aviso,
} from "./use-lead-submit";
import styles from "./agendamento-form.module.css";

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
  // Mesmo id em todas as tentativas do mesmo envio: a API descarta a repetição (sem lead duplicado).
  const submissionIdRef = useRef<string | null>(null);

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
          zodResolver(
            buildAppointmentSchema(treatmentOptions),
          ) as unknown as Resolver<AppointmentInput>,
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
    const t = window.setTimeout(() => document.getElementById("resumo-erros")?.focus(), 0);
    return () => window.clearTimeout(t);
  }, [focusTick]);

  function onInvalid(errs: FieldErrors<AppointmentInput>) {
    if (Object.keys(errs).some((k) => OPTIONAL_FIELDS.includes(k))) setMoreOpen(true);
    setAviso(null);
    setFocusTick((n) => n + 1);
  }

  /** Clique num erro do resumo: foca o campo (e abre o bloco opcional se ele estiver lá dentro). */
  function onSummaryClick(e: MouseEvent<HTMLDivElement>) {
    const link = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
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

    submissionIdRef.current ??= novoSubmissionId();
    const resultado = await enviarLead({
      ...data,
      // Atribuição de campanha (gclid/UTM) viaja junto com o lead —
      // viabiliza importar conversões offline no Google Ads.
      attribution: getAttribution() ?? undefined,
      formStartedAt: openedAtRef.current,
      submissionId: submissionIdRef.current,
    });

    if (resultado.tipo === "validacao") {
      // O servidor recusou campos específicos: mostra cada um no seu lugar e no resumo.
      for (const { campo, mensagem } of resultado.erros) {
        setError(campo as keyof AppointmentInput, { type: "server", message: mensagem });
      }
      if (resultado.abrirOpcionais) setMoreOpen(true);
      release();
      setFocusTick((n) => n + 1);
      return;
    }
    if (resultado.tipo === "aviso") {
      release(resultado.aviso);
      return;
    }

    // Sucesso. `appointment_form_submit` é o evento do envio; `lead_created` (a conversão) dispara uma
    // única vez em /obrigado, guiado por sessionStorage. O botão fica travado até a página mudar.
    if (resultado.trap) {
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
            Este formulário precisa de JavaScript para funcionar. Para agendar agora, fale pelo
            WhatsApp ou ligue.
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
            <ErrorSummary errors={summary} title="Revise estes campos antes de enviar:" />
          </div>
        )}

        <CamposEssenciais register={register} errors={errors} treatmentOptions={treatmentOptions} />
        <CamposOpcionais
          register={register}
          errors={errors}
          open={moreOpen}
          onOpenChange={setMoreOpen}
          minDate={minDate}
        />

        {/* Consentimento LGPD e envio */}
        <div className={cn(styles.envio, styles.etapa, styles.etapaFim)}>
          <p className={cn("t-sm", styles.garantia)}>
            Usamos seus dados para entrar em contato e agendar. Se você veio de um anúncio,
            guardamos também a origem do clique, para saber qual anúncio trouxe o contato.
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
              aria-describedby={errors.lgpdConsent ? "err-lgpdConsent" : undefined}
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
                    Posso retirar este consentimento a qualquer momento pelos canais indicados na
                    política.
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
                  {aviso.kind === "rede" && aviso.talvezEnviado ? ` ${TEXTO_TALVEZ_ENVIADO}` : ""}
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
            <WhatsAppCTA location="form_alt" variant="texto" intent="duvidas" />
          </p>
        </div>
      </form>
    </>
  );
}
