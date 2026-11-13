import type { ReactNode } from "react";
import Link from "next/link";
import { Section, type SectionTone } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ArrowIcon } from "@/components/ui/icons";
import { IndexEnd, IndexRow } from "@/components/ui/index-list";
import { TrackedLink } from "@/components/ui/tracked-link";
import styles from "./tratamento-outros.module.css";

export interface TratamentoRelacionado {
  slug: string;
  /** Âncora descritiva, até 6 palavras. */
  label: string;
  shortName: string;
}

/**
 * "Leia também" (DESIGN.md 5.4, momento 6): dois ou três links temáticos do campo `related` do
 * tratamento, em linhas com fio e âncora descritiva (sem heading "Os demais", sem numeral: o único
 * numeral de ordem da página é o da abertura), e um link para o sumário de todos. Sem cartões.
 * Servidor; só o link mede o clique (`treatment_card_click`).
 */
export function TratamentoOutros({
  tone = "papel",
  items,
  children,
}: {
  tone?: SectionTone;
  items: TratamentoRelacionado[];
  /** Fim do conteúdo da página: aviso informativo e linha de autoria (abaixo de um fio). */
  children?: ReactNode;
}) {
  return (
    <Section tone={tone} id="outros" spacing="none" className={styles.sec} aria-labelledby="outros-titulo">
      <Container>
        <div className="grid12">
          <div className={styles.head}>
            <Eyebrow>Continue lendo</Eyebrow>
            <h2 id="outros-titulo" className="t-d3 display">
              Leia também
            </h2>
          </div>
          <div className={styles.body}>
            <ul data-reveal="" className="idx">
              {items.map((t, i) => (
                <IndexRow key={t.slug} i={i}>
                  <TrackedLink
                    href={`/tratamentos/${t.slug}`}
                    event="treatment_card_click"
                    eventParams={{ treatment: t.shortName, location: "treatment_related" }}
                    className={styles.link}
                  >
                    <span className="t-lead">{t.label}</span>
                    <ArrowIcon size={22} />
                  </TrackedLink>
                </IndexRow>
              ))}
              <IndexEnd i={items.length} />
            </ul>
            <Link href="/tratamentos" className={`link ${styles.todos}`}>
              Ver todos os tratamentos
              <ArrowIcon size={18} />
            </Link>
          </div>
        </div>
        {children && <div className={styles.rodape}>{children}</div>}
      </Container>
    </Section>
  );
}
