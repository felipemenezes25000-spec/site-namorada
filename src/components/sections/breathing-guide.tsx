"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { waMessages } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import { buttonClasses } from "@/components/ui/button";
import { WhatsAppCTA } from "@/components/ui/cta";
import { Container } from "@/components/ui/container";
import { Monogram } from "@/components/brand/logo";
import styles from "./breathing-guide.module.css";

type Phase = "inspire" | "solte";
type Status = "idle" | "running" | "done";

const WORDS = ["", "uma", "duas", "três", "quatro", "cinco"];

/**
 * Guia de respiração (DESIGN.md 4.5): guia opcional e discreto de respiração, para a página
 * /medo-de-dentista. Uso:
 *
 *   <Section tone="noite" id="respirar" aria-labelledby="respirar-titulo"><BreathingGuide /></Section>
 *
 * A SEÇÃO (e o id `respirar`, alvo do seletor de situação) é da página; o guia só traz o conteúdo
 * e não repete o id.
 *
 * Fluxo: título + parágrafo curto + botão. Ao iniciar, a luz baixa fica restrita à seção que o
 * contém (o fundo vai de noite a noite-fundo em 800ms, por `:has`); um anel de ouro cresce em 4s
 * ("Inspire") e volta em 6s ("Solte"), por 3 vezes (finito, nunca infinito). O botão "Parar"
 * recebe o foco e Esc também interrompe. No fim: "Pronto." e o botão de WhatsApp. O foco volta
 * ao botão que abriu. Leitor de tela: só o início e o fim são anunciados (nunca cada fase).
 *
 * Com movimento reduzido (ou sem JavaScript) não anima: mostra só o texto das instruções e o
 * botão de WhatsApp; se a preferência mudar durante o guia, ele encerra. Nunca fica mudo.
 * Sem promessa de efeito ("reduz ansiedade" não aparece em lugar nenhum).
 */
export function BreathingGuide({
  headingId = "respirar-titulo",
  kicker = "Um momento só seu",
  title = "Respire um pouco antes de falar com a Dra. Ana",
  intro,
  message = waMessages.fear,
  inhale = 4,
  exhale = 6,
  rounds = 3,
  className,
}: {
  /** id do título (a seção da página o usa em `aria-labelledby`). */
  headingId?: string;
  kicker?: string;
  title?: string;
  /** Parágrafo curto abaixo do título. */
  intro?: string;
  /** Mensagem do WhatsApp mostrada no fim do guia. */
  message?: string;
  /** Segundos para inspirar. */
  inhale?: number;
  /** Segundos para soltar. */
  exhale?: number;
  /** Número de respirações. */
  rounds?: number;
  className?: string;
}) {
  const total = inhale + exhale;
  const times = WORDS[rounds] ?? String(rounds);
  const instructions = `Inspire pelo nariz contando até ${inhale}. Solte devagar contando até ${exhale}. Repita ${rounds} vezes.`;
  const lead =
    intro ??
    `Se quiser, faça ${times} ${rounds === 1 ? "respiração" : "respirações"} no seu ritmo. É opcional e você pode parar quando quiser.`;

  const [status, setStatus] = useState<Status>("idle");
  const [phase, setPhase] = useState<Phase>("inspire");
  const [round, setRound] = useState(1);
  const [announce, setAnnounce] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const startRef = useRef<HTMLButtonElement>(null);
  const stopRef = useRef<HTMLButtonElement>(null);
  const animRef = useRef<Animation | null>(null);
  const timers = useRef<number[]>([]);

  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };

  const finish = useCallback((next: Status, text: string) => {
    clearTimers();
    animRef.current?.cancel();
    animRef.current = null;
    setStatus(next);
    setAnnounce(text);
    // O foco volta ao botão que abriu, mas só se ainda estiver no guia (ou perdido no body):
    // quem já foi para outro ponto da página não perde o lugar nem é puxado de volta.
    window.requestAnimationFrame(() => {
      const a = document.activeElement;
      if (!a || a === document.body || rootRef.current?.contains(a)) {
        startRef.current?.focus({ preventScroll: true });
      }
    });
  }, []);

  const start = () => {
    // Com movimento reduzido o botão nem aparece (CSS): este caminho só roda com animação permitida.
    track("cta_click", { location: "breathing_guide", target: "start" });
    setRound(1);
    setPhase("inspire");
    setStatus("running");
    setAnnounce(`Guia iniciado: ${times} ${rounds === 1 ? "respiração" : "respirações"}.`);
  };

  // O ciclo: anel (WAAPI) e rótulos (temporizadores) saem dos mesmos números.
  useEffect(() => {
    if (status !== "running") return;
    stopRef.current?.focus();
    const ring = ringRef.current;
    const split = inhale / total;
    if (ring) {
      animRef.current = ring.animate(
        [
          { transform: "scale(1)", easing: "cubic-bezier(.65, 0, .35, 1)" },
          { transform: "scale(1.5)", offset: split, easing: "cubic-bezier(.65, 0, .35, 1)" },
          { transform: "scale(1)" },
        ],
        { duration: total * 1000, iterations: rounds },
      );
    }
    for (let r = 0; r < rounds; r++) {
      timers.current.push(
        window.setTimeout(
          () => {
            setRound(r + 1);
            setPhase("inspire");
          },
          r * total * 1000,
        ),
        window.setTimeout(() => setPhase("solte"), (r * total + inhale) * 1000),
      );
    }
    timers.current.push(
      window.setTimeout(() => finish("done", "Guia concluído."), rounds * total * 1000),
    );
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") finish("idle", "Guia interrompido.");
    };
    // se a pessoa ligar "reduzir movimento" no meio do guia, ele encerra e vira texto
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotion = () => {
      if (mq.matches) finish("idle", instructions);
    };
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMotion);
    return () => {
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMotion);
      clearTimers();
      animRef.current?.cancel();
    };
  }, [status, inhale, total, rounds, finish, instructions]);

  const running = status === "running";
  return (
    <div
      ref={rootRef}
      data-running={running ? "true" : undefined}
      className={cn(styles.root, className)}
    >
      <Container>
        <div className="grid12">
          <div className={styles.head}>
            <p className="t-kicker">{kicker}</p>
            <h2 id={headingId} className={cn("t-d2", styles.title)}>
              {title}
            </h2>
          </div>

          <div className={styles.body}>
            {!running && (
              <>
                <p className={cn("t-body", styles.lead)}>
                  {status === "done" ? "Pronto. Quando quiser, fale com a Dra. Ana." : lead}
                </p>

                {/* Movimento reduzido ou sem JavaScript: só o texto. */}
                <p className={cn("t-lead", styles.instructions)}>{instructions}</p>

                <div className={styles.actions}>
                  <button
                    ref={startRef}
                    type="button"
                    onClick={start}
                    className={buttonClasses("contorno-claro", "md", styles.start)}
                  >
                    {status === "done" ? "Respirar de novo" : "Começar a respirar"}
                  </button>
                  {/* Sempre no HTML: aparece no fim do guia, com movimento reduzido ou sem JavaScript. */}
                  <WhatsAppCTA
                    location="breathing_guide"
                    message={message}
                    variant="ouro"
                    className={cn(styles.wa, status === "done" && styles.waOn)}
                  />
                </div>
              </>
            )}

            {running && (
              <div className={styles.live}>
                <p className={cn("t-cap", styles.count)}>
                  Respiração {round} de {rounds}
                </p>
                <button
                  ref={stopRef}
                  type="button"
                  onClick={() => finish("idle", "Guia interrompido.")}
                  className={buttonClasses("contorno-claro", "md", styles.stop)}
                >
                  Parar
                </button>
                <p className={cn("t-cap", styles.hint)}>Esc também interrompe.</p>
              </div>
            )}
          </div>

          {/* O anel é só imagem: leitores de tela recebem o texto e os avisos de início e fim. */}
          <div className={styles.stage} aria-hidden="true">
            <div ref={ringRef} className={styles.ring} />
            <div className={styles.core}>
              <Monogram size={64} tone="claro" />
            </div>
            {running && (
              <p className={cn("display", styles.phase)} data-phase={phase}>
                {phase === "inspire" ? "Inspire" : "Solte"}
              </p>
            )}
          </div>
        </div>

        <p className="sr-only" role="status" aria-live="polite">
          {announce}
        </p>
      </Container>
    </div>
  );
}
