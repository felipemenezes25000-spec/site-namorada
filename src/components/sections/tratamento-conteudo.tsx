import type { CSSProperties } from "react";
import { Section, type SectionTone } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { IndexEnd, IndexList, IndexRow } from "@/components/ui/index-list";
import { Numeral } from "@/components/ui/numeral";
import { WhatsAppCTA } from "@/components/ui/cta";
import { splitFirstSentence } from "./tratamento-util";
import { TratamentoGrupo } from "./tratamento-grupo";
import styles from "./tratamento-conteudo.module.css";

/** Lista com fios (IndexRow): losango vazado + frase. A variante `fatos` do IndexList não tem fios. */
function Lista({ items, className }: { items: string[]; className?: string }) {
  return (
    <ul data-reveal="" className={`idx ${className ?? ""}`}>
      {items.map((text, i) => (
        <IndexRow key={text} i={i} className={styles.li}>
          <span className={`idx-dia ${styles.dia}`} aria-hidden="true" />
          <span className="min-w-0">{text}</span>
        </IndexRow>
      ))}
      <IndexEnd i={items.length} />
    </ul>
  );
}

/**
 * "O tratamento" (DESIGN.md 5.4, momento 2): três faixas com a legenda na margem esquerda
 * (O que é, Para quem, O que você encontra no atendimento). Sem cartões: fios, uma declaração em
 * display (a primeira frase de `what`) e listas com losango. A coluna de leitura começa sempre na
 * coluna 7 da grade (>= 1100px). Com `colunas`, "Para quem é indicado" vira duas colunas
 * separadas por um fio vertical. Com `limite` (frase de `notFor`), uma quarta faixa, "Limites do
 * tratamento", entra DEPOIS de "Para quem é indicado" (a primeira faixa é sempre "O que é"); no
 * celular o corpo dela recolhe. O fio de cada legenda e o primeiro fio da lista ficam na mesma linha.
 */
export function TratamentoDetalhes({
  tone = "papel",
  what,
  forWhom,
  benefits,
  colunas = false,
  limite,
}: {
  tone?: SectionTone;
  what: string;
  forWhom: string[];
  benefits: string[];
  colunas?: boolean;
  limite?: string;
}) {
  const [first, rest] = splitFirstSentence(what);
  const [limFirst, limRest] = limite ? splitFirstSentence(limite) : ["", ""];
  const declaracao = first.length <= 150;
  const metade = Math.ceil(forWhom.length / 2);
  return (
    <Section tone={tone} id="tratamento" className={`${styles.sec} ${styles.secDetalhes}`}>
      <Container>
        <div className={styles.rows}>
          <div className={`grid12 ${styles.row}`}>
            <span className={`fio-h ${styles.rule}`} data-reveal="" aria-hidden="true" />
            <div className={styles.legend}>
              <h2 className="t-kicker">O que é</h2>
            </div>
            <div className={styles.body}>
              {declaracao ? (
                <>
                  <p className={`t-d3 display ${styles.decl}`}>{first}</p>
                  {rest && <p className={`t-body ${styles.rest}`}>{rest}</p>}
                </>
              ) : (
                <p className={`t-lead ${styles.lone}`}>{what}</p>
              )}
            </div>
          </div>

          <div className={`grid12 ${styles.row}`}>
            <span className={`fio-h ${styles.rule}`} data-reveal="" aria-hidden="true" />
            <div className={styles.legend}>
              <h2 className="t-kicker">Para quem é indicado</h2>
            </div>
            <div className={styles.body}>
              <TratamentoGrupo id="para-quem-lista" title={`Ver os ${forWhom.length} itens`} heading="none" soCelular>
                {colunas ? (
                  <div className={styles.duas}>
                    <Lista items={forWhom.slice(0, metade)} className={styles.lead} />
                    <Lista items={forWhom.slice(metade)} className={`${styles.lead} ${styles.segunda}`} />
                  </div>
                ) : (
                  <Lista items={forWhom} className={styles.lead} />
                )}
              </TratamentoGrupo>
            </div>
          </div>

          {limite && (
            <div id="limite" className={`grid12 ${styles.row}`}>
              <span className={`fio-h ${styles.rule}`} data-reveal="" aria-hidden="true" />
              <div className={styles.legend}>
                <h2 className="t-kicker">Limites do tratamento</h2>
              </div>
              <div className={styles.body}>
                <TratamentoGrupo id="limite-texto" title="Ler os limites" heading="none" soCelular>
                  <p className={`${limFirst.length > 70 ? "t-d3" : "t-d2"} display ${styles.limDecl}`}>{limFirst}</p>
                  {limRest && <p className={`t-lead ${styles.limRest}`}>{limRest}</p>}
                </TratamentoGrupo>
              </div>
            </div>
          )}

          <div className={`grid12 ${styles.row}`}>
            <span className={`fio-h ${styles.rule}`} data-reveal="" aria-hidden="true" />
            <div className={styles.legend}>
              <h2 className="t-kicker">O que você encontra no atendimento</h2>
            </div>
            <div className={styles.body}>
              <TratamentoGrupo id="encontra-lista" title={`Ver os ${benefits.length} itens`} heading="none" soCelular>
                <Lista items={benefits} />
              </TratamentoGrupo>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

type Passo = { title: string; description: string };

/**
 * "Como funciona" (momento 3 do roteiro). Dois arranjos, escolhidos pelo tratamento (`layout`):
 *  - "coluna" (padrão): título preso à esquerda (sticky no desktop) e os passos à direita, na coluna 7;
 *  - "linha": título e convite em cima e os passos lado a lado, em largura total, com numerais grandes.
 */
export function TratamentoPassos({
  tone = "osso",
  steps,
  message,
  linha = false,
}: {
  tone?: SectionTone;
  steps: Passo[];
  message: string;
  linha?: boolean;
}) {
  // no celular o convite ao WhatsApp não se repete aqui (o botão fixo e o fecho já o oferecem)
  const cta = (
    <div className={styles.passosCta}>
      <WhatsAppCTA
        location="treatment_steps"
        message={message}
        label="Tirar dúvidas no WhatsApp"
        variant="contorno"
        className={styles.passosBtn}
      />
    </div>
  );
  return (
    <Section tone={tone} id="passos" aria-labelledby="passos-titulo" className={`${styles.sec} ${styles.secPassos}`}>
      <Container>
        {linha ? (
          <>
            <div className="grid12">
              <div className={styles.linhaHead}>
                <Eyebrow>Passo a passo</Eyebrow>
                <h2 id="passos-titulo" className="t-d2">
                  Como funciona
                </h2>
              </div>
              <div className={styles.linhaAside}>
                <p className="t-body">
                  Veja o caminho, etapa por etapa. Ficou com dúvida? É só falar com a Dra. Ana pelo WhatsApp.
                </p>
                {cta}
              </div>
            </div>
            <TratamentoGrupo id="passos-lista" title={`Ver as ${steps.length} etapas`} heading="none" soCelular>
            <ol
              data-reveal=""
              className={styles.linha}
              style={{ "--n": steps.length } as CSSProperties}
            >
              {steps.map((s, i) => (
                <li key={s.title} className={styles.passo} style={{ "--i": Math.min(i, 8) } as CSSProperties}>
                  <span className={`fio-h ${styles.fio}`} aria-hidden="true" />
                  <Numeral size="lg" decorative className={styles.passoNum}>
                    {String(i + 1).padStart(2, "0")}
                  </Numeral>
                  <h3 className="t-d3 display">{s.title}</h3>
                  <p className="t-body">{s.description}</p>
                </li>
              ))}
            </ol>
            </TratamentoGrupo>
          </>
        ) : (
          <div className="grid12">
            <div className={styles.passosHead}>
              <Eyebrow>Passo a passo</Eyebrow>
              <h2 id="passos-titulo" className="t-d2">
                Como funciona
              </h2>
              <p className="t-body">
                Veja o caminho, etapa por etapa. Ficou com dúvida? É só falar com a Dra. Ana pelo WhatsApp.
              </p>
              {cta}
            </div>
            <div className={styles.passosList}>
              <TratamentoGrupo id="passos-lista" title={`Ver as ${steps.length} etapas`} heading="none" soCelular>
                <IndexList
                  variant="passos"
                  items={steps.map((s) => ({ title: s.title, description: s.description }))}
                />
              </TratamentoGrupo>
            </div>
          </div>
        )}
      </Container>
    </Section>
  );
}
