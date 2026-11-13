import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Grid12 } from "@/components/ui/grid12";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ButtonLink } from "@/components/ui/button";
import { MapCTA, PhoneCTA } from "@/components/ui/cta";
import { siteConfig } from "@/lib/site-config";
import { IndexList } from "@/components/ui/index-list";
import { TrustBlock } from "@/components/ui/trust-block";
import { Monogram } from "@/components/brand/logo";
import { ThankYouActions } from "@/components/sections/thank-you-actions";
import { ObrigadoHeading } from "@/components/sections/obrigado-heading";
import styles from "./obrigado-page.module.css";

export const metadata: Metadata = buildMetadata({
  title: "Solicitação recebida",
  description: "Recebemos sua solicitação de agendamento.",
  path: "/obrigado",
  noindex: true,
});

const passos = [
  { title: "Recebemos a sua solicitação." },
  { title: "A Dra. Ana entra em contato para confirmar o melhor dia e horário." },
  { title: "Se preferir adiantar, continue a conversa pelo WhatsApp." },
];

/** O arco do fio da capa, desenhado uma vez. O tamanho vem do contêiner. */
function Arco({ className, mono }: { className: string; mono: number }) {
  return (
    <div className={`arch-line ${className}`} aria-hidden="true">
      <svg viewBox="0 0 1072 1100" preserveAspectRatio="xMidYMid meet" focusable="false">
        <path pathLength={1} d="M1.5 1100V536A534.5 534.5 0 0 1 1070.5 536V1100" />
      </svg>
      <Monogram size={mono} className="arch-mono" />
    </div>
  );
}

/**
 * Confirmação do formulário (DESIGN.md 5.11). Página estática: nada de dado pessoal na URL. O primeiro
 * nome e o tratamento chegam por sessionStorage e são lidos no navegador (`ObrigadoHeading` e
 * `ThankYouActions`); sem nada guardado, o título é "Recebemos seu pedido". `lead_created` dispara
 * em `ThankYouActions`, uma única vez por lead. Duas cenas: abertura `osso` com o arco grande e o
 * próximo passo; faixa `verde` com o que acontece agora, o mapa e a identificação. As duas são
 * `data-hide-floating`: a barra fixa do celular não repete o botão de WhatsApp nem oferece "agendar
 * de novo" a quem acabou de agendar.
 */
export default function ObrigadoPage() {
  return (
    <>
      <Section tone="osso" spacing="none" hideFloating className={styles.abertura}>
        <Container>
          <Grid12 split="7-5">
            <div className={styles.main}>
              <div className={styles.kickLinha}>
                <Arco className={styles.arcoMini} mono={22} />
                <Eyebrow>Solicitação recebida</Eyebrow>
              </div>
              <ObrigadoHeading className={`t-d1i luz ${styles.title}`} />
              <p className={`t-lead ${styles.lead}`}>
                Recebemos sua solicitação de agendamento com a Dra. Ana. Ela entra em contato para
                confirmar o melhor dia e horário.
              </p>
              <p className={`t-body ${styles.urgente}`}>
                Se for urgente, ligue agora:{" "}
                <PhoneCTA as="texto" location="thank_you" label={siteConfig.phoneDisplay} />
              </p>
              <div className={styles.actions}>
                <ThankYouActions />
                <ButtonLink href="/" variant="texto" className={styles.back}>
                  Voltar ao início
                </ButtonLink>
              </div>
            </div>

            <Arco className={styles.arcoGrande} mono={96} />
          </Grid12>
        </Container>
      </Section>

      <Section tone="verde" hideFloating aria-labelledby="obrigado-agora">
        <Container>
          <Grid12 split="7-5">
            <div className={styles.passos}>
              <h2 id="obrigado-agora" className="t-d3 display">
                O que acontece agora
              </h2>
              <IndexList variant="passos" items={passos} className={styles.lista} />
            </div>
            <div className={styles.chegar}>
              <h2 className="t-d3 display">Como chegar</h2>
              <p className={`t-body ${styles.chegarTexto}`}>Veja o consultório no mapa.</p>
              <div className={styles.mapa}>
                <MapCTA location="thank_you" variant="contorno-claro" />
              </div>
            </div>
          </Grid12>
          <TrustBlock variant="linha" className={styles.trust} />
        </Container>
      </Section>
    </>
  );
}
