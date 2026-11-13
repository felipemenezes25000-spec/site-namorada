import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { DisplayHeading } from "@/components/ui/display-heading";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Numeral } from "@/components/ui/numeral";
import { FioRule } from "@/components/brand/fio-rule";
import { AgendarCTA, WhatsAppCTA } from "@/components/ui/cta";
import styles from "./tratamento-indice.module.css";

const FICHA = [
  { k: "Primeira etapa", v: "Avaliação odontológica" },
  { k: "Orçamento", v: "Depois da avaliação" },
  { k: "Atendimento", v: "Particular, sem convênios" },
];

/**
 * Capa de /tratamentos (DESIGN.md 5.3): breadcrumb, fio duplo, kicker, H1, lede, os dois botões com a
 * mesma largura e, à direita, a contagem de tratamentos em numeral de cartaz alinhada ao topo do H1,
 * com a ficha de três fatos logo abaixo (a coluna não fica vazia). O título quebra em sintagmas
 * (espaços inseparáveis e `text-wrap: balance`). Servidor; nada depende de JavaScript.
 */
export function TratamentoCapa({ total }: { total: number }) {
  return (
    <Section tone="osso" spacing="none" className={styles.sec} aria-labelledby="tratamentos-titulo">
      <Container>
        <div className={styles.crumb}>
          <Breadcrumbs items={[{ name: "Início", href: "/" }, { name: "Tratamentos" }]} />
        </div>
        <FioRule double reveal={false} />
        <div className={`grid12 ${styles.grid}`}>
          <div className={styles.text}>
            <Eyebrow className={styles.kicker}>Tratamentos</Eyebrow>
            <DisplayHeading level={1} size="d1i" id="tratamentos-titulo" className={styles.title}>
              Cuidados completos para&nbsp;a&nbsp;saúde e&nbsp;a&nbsp;estética do&nbsp;seu&nbsp;sorriso
            </DisplayHeading>
            <p className={`t-lead ${styles.lede}`}>
              Cada tratamento começa com uma avaliação. Veja abaixo o que cada um envolve e escolha por onde começar.
            </p>
            <div className={styles.actions}>
              <WhatsAppCTA location="treatments_hero" className={styles.btn} />
              <AgendarCTA location="treatments_hero" className={styles.btn} />
            </div>
          </div>
          <div className={styles.lado}>
            <Numeral size="xl" className={styles.numeral}>
              {String(total).padStart(2, "0")}
            </Numeral>
            <dl className={styles.ficha}>
              {FICHA.map((row) => (
                <div key={row.k} className={styles.row}>
                  <dt className="t-folio">{row.k}</dt>
                  <dd className="t-body">{row.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Container>
    </Section>
  );
}
