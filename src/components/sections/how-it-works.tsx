import { journeySteps } from "@/lib/content";
import { ArrowIcon } from "@/components/ui/icons";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { IndexList } from "@/components/ui/index-list";
import { buttonClasses } from "@/components/ui/button";
import { TrackedLink } from "@/components/ui/tracked-link";
import styles from "./editorial.module.css";

/**
 * "Como funciona" (DESIGN.md 5.1, momento 5): seção verde com o título à esquerda e os
 * quatro passos à direita, em numerais itálicos grandes separados por fios. Servidor puro:
 * sem círculos, sem degradês, sem biblioteca de animação (os fios se desenham em CSS).
 * No celular cada passo ocupa pouco mais de uma linha de título (numeral pequeno ao lado, descrição
 * logo abaixo; ver `.howList` em editorial.module.css).
 * Só um link no fim (cta_click, location how_it_works): o pedido de WhatsApp fica no fecho da página.
 */
export function HowItWorks({ id = "como-funciona" }: { id?: string }) {
  return (
    <Section tone="verde" id={id} aria-labelledby={`${id}-titulo`} className={styles.secM}>
      <Container>
        <div className="grid12">
          <div className={styles.howHead}>
            <Eyebrow>Como funciona</Eyebrow>
            <h2 id={`${id}-titulo`} className="t-d2 mt-3">
              Do primeiro contato à&nbsp;sua consulta, em&nbsp;passos simples
            </h2>
            <p className="t-body">
              Você não precisa chegar sabendo o que precisa. Sem burocracia e sem etapas
              desnecessárias, um caminho claro, no seu ritmo, até o cuidado que você procura.
            </p>
          </div>

          <div className={styles.howList}>
            <IndexList
              variant="passos"
              items={journeySteps.map((s) => ({
                n: s.number,
                title: s.title,
                description: s.description,
              }))}
            />
            <div className={styles.howActions}>
              <TrackedLink
                href="/primeira-consulta"
                event="cta_click"
                eventParams={{ location: "how_it_works", target: "primeira_consulta" }}
                className={buttonClasses("texto", "md")}
              >
                Ver como é a primeira consulta
                <ArrowIcon />
              </TrackedLink>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
