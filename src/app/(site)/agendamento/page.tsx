import type { Metadata } from "next";
import { locale, localeTexto } from "@/lib/site-config";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";
import { waMessages } from "@/lib/whatsapp";
import { treatments } from "@/lib/treatments";
import { treatmentOptions } from "@/lib/lead-treatments";
import { JsonLd } from "@/components/seo/json-ld";
import { AppointmentForm } from "@/components/forms/appointment-form";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Eyebrow } from "@/components/ui/eyebrow";
import { DisplayHeading } from "@/components/ui/display-heading";
import { Numeral } from "@/components/ui/numeral";
import { IndexRow, IndexEnd } from "@/components/ui/index-list";
import { TrustBlock } from "@/components/ui/trust-block";
import { WhatsAppCTA } from "@/components/ui/cta";
import { Monogram } from "@/components/brand/logo";
import styles from "./agendamento-page.module.css";

export const metadata: Metadata = buildMetadata({
  // 44 caracteres, com o local; a marca fica na descrição e no domínio.
  absoluteTitle: `Agendar avaliação odontológica na ${locale.bairro}`,
  description: `Agende sua avaliação odontológica com a Dra. Ana Beatriz, na ${localeTexto("bairroRegiao")}. Preencha o formulário ou fale pelo WhatsApp.`,
  path: "/agendamento",
});

/**
 * slug do tratamento -> opção do select, para `?tratamento=<slug>`. Vai por props ao formulário, que lê a
 * URL no navegador: a página continua estática (cacheada na borda), sem custo extra para o tráfego de
 * anúncios. Slug que não existe é ignorado pelo formulário.
 */
const treatmentBySlug: Record<string, string> = Object.fromEntries(
  treatments.filter((t) => treatmentOptions.includes(t.name)).map((t) => [t.slug, t.name]),
);

const expect = [
  "Uma conversa tranquila para entender o que te trouxe",
  "Exame clínico completo, sem pressa",
  "Diagnóstico explicado em linguagem simples",
  "Plano de cuidado individual e transparente",
];

/**
 * /agendamento (DESIGN.md 5.5). Uma só cena `osso`, numa grade de 12 colunas a partir de 1024px:
 * título e formulário à esquerda (7), painel de WhatsApp e "O que esperar" à direita (5, fixos ao
 * rolar). A ordem do HTML é a ordem de leitura e de Tab: título, formulário, identificação, WhatsApp,
 * "O que esperar". No celular a ordem visual é a do HTML (título, formulário, WhatsApp, "O que esperar",
 * identificação): o primeiro campo aparece acima da barra fixa sem rolar. O painel de WhatsApp é uma
 * <section data-hide-floating>: enquanto ele está na tela, a barra fixa se esconde, sem dois botões
 * iguais. Sem JavaScript o formulário dá lugar ao WhatsApp e ao telefone (appointment-form.tsx).
 * Assinatura do desktop: arco com monograma ao lado do título.
 */
export default function AgendamentoPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Início", path: "/" },
          { name: "Agendamento", path: "/agendamento" },
        ])}
      />
      <Section tone="osso" id="formulario" spacing="none" className={styles.sec}>
        <Container>
          <div className={styles.trilha}>
            <Breadcrumbs items={[{ name: "Início", href: "/" }, { name: "Agendamento" }]} />
          </div>

          <div className={styles.layout}>
            <div className={styles.main}>
              <header className={styles.intro}>
                <div className={`arch-line ${styles.assinatura}`} aria-hidden="true">
                  <svg viewBox="0 0 1072 1100" preserveAspectRatio="xMidYMid meet" focusable="false">
                    <path pathLength={1} d="M1.5 1100V536A534.5 534.5 0 0 1 1070.5 536V1100" />
                  </svg>
                  <Monogram size={44} className="arch-mono" lazy />
                </div>
                <Eyebrow>Avaliação</Eyebrow>
                <DisplayHeading level={1} size="d1i" className={styles.titulo}>
                  Vamos marcar a sua avaliação
                </DisplayHeading>
                <p className={`t-lead ${styles.lede}`}>
                  Preencha com tranquilidade. A&nbsp;Dra.&nbsp;Ana confirma com você o melhor dia e
                  horário.
                </p>
              </header>

              <div className={styles.form}>
                <h2 className="sr-only">Formulário de agendamento</h2>
                <AppointmentForm treatmentOptions={treatmentOptions} treatmentBySlug={treatmentBySlug} />
              </div>

              <TrustBlock variant="linha" className={styles.trust} />
            </div>

            <div className={styles.lado}>
              <section className={styles.wa} data-tone="noite" aria-labelledby="ag-whatsapp">
                <h2 id="ag-whatsapp" className={`t-d3 display ${styles.waTitulo}`}>
                  Prefere o WhatsApp?
                </h2>
                <p className={`t-body ${styles.waTexto}`}>
                  Tire dúvidas ou agende direto com a Dra.&nbsp;Ana, em poucos toques.
                </p>
                <div className={styles.waBotao}>
                  <WhatsAppCTA
                    location="appointment_page"
                    message={waMessages.default}
                    variant="ouro"
                    block
                  />
                </div>
              </section>

              <div className={styles.rest}>
                <h2 className={`t-d3 display ${styles.restTitulo}`}>O que esperar</h2>
                <ol data-reveal="" className={`idx ${styles.passos}`}>
                  {expect.map((texto, i) => (
                    <IndexRow key={texto} i={i} className={styles.passo}>
                      <Numeral size="md" decorative>
                        {String(i + 1).padStart(2, "0")}
                      </Numeral>
                      <span className="t-body">{texto}</span>
                    </IndexRow>
                  ))}
                  <IndexEnd i={expect.length} />
                </ol>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
