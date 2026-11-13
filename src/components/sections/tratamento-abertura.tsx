import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { DisplayHeading } from "@/components/ui/display-heading";
import { IdentityLine } from "@/components/ui/identity-line";
import { Numeral } from "@/components/ui/numeral";
import { FioRule } from "@/components/brand/fio-rule";
import { AgendarCTA, PhoneCTA, WhatsAppCTA } from "@/components/ui/cta";
import { locale } from "@/lib/site-config";
import { NomeTratamento } from "./tratamento-nome";
import { TratamentoFigura } from "./tratamento-figura";
import { splitFirstSentence } from "./tratamento-util";
import styles from "./tratamento-abertura.module.css";

/**
 * Abertura de capítulo de /tratamentos/[slug] (DESIGN.md 5.4, momento 1). Servidor, tudo no HTML
 * (sem Reveal, sem fade): breadcrumb, fio duplo de masthead, H1 com a linha-chamada do lugar
 * ("Tratamento · Vila Bruna") DENTRO do heading, a linha de identidade (nome, CRO, local), o lede,
 * o botão de WhatsApp dominante e o formulário em segundo plano. À direita (>= 760px), o numeral do
 * capítulo, que é o ÚNICO numeral de ordem da página, o desenho em fio do tratamento (>= 1100px) e a
 * ficha de fatos, só com os campos que existem. Sem cartão, sem foto.
 *
 * Em celular baixo (<= 820px de altura) a segunda frase do lede desce para depois dos botões (a
 * mesma tag, por `order`: o texto existe uma vez só no HTML), para o botão de WhatsApp ficar acima
 * do aviso de cookies e da barra fixa.
 */
export function TratamentoAbertura({
  slug,
  name,
  n,
  intro,
  duration,
  sessions,
  message,
}: {
  slug: string;
  name: string;
  /** Posição no array `treatments` (1 a total). */
  n: number;
  intro: string;
  duration?: string;
  sessions?: string;
  message: string;
}) {
  const num = String(n).padStart(2, "0");
  const ficha = [
    duration && { k: "Duração", v: duration },
    sessions && { k: "Sessões", v: sessions },
  ].filter(Boolean) as { k: string; v: string }[];
  const [first, rest] = splitFirstSentence(intro);
  const nomeLongo = name.length > 28;

  return (
    <Section tone="osso" id="capitulo" spacing="none" className={styles.sec} aria-labelledby="capitulo-titulo">
      <Container>
        <div className={styles.crumb}>
          <Breadcrumbs
            items={[
              { name: "Início", href: "/" },
              { name: "Tratamentos", href: "/tratamentos" },
              { name: name },
            ]}
          />
        </div>
        <FioRule double reveal={false} />

        <div className={`grid12 ${styles.grid}`}>
          <div className={styles.text}>
            <DisplayHeading
              level={1}
              size="d1i"
              id="capitulo-titulo"
              kicker={`Tratamento · ${locale.bairro}`}
              className={`${styles.title} ${nomeLongo ? styles.longTitle : ""}`}
            >
              <NomeTratamento name={name} />
            </DisplayHeading>
            <IdentityLine className={styles.identity} />
            <p className={`t-lead ${styles.lede}`}>{first}</p>
            {rest && <p className={`t-lead ${styles.rest}`}>{rest}</p>}

            <div className={styles.actions}>
              <WhatsAppCTA location="treatment_page" message={message} className={styles.btn} />
              <AgendarCTA location="treatment_page" treatment={slug} className={styles.btn} />
            </div>
            <p className={`t-body ${styles.phone}`}>
              Prefere ligar? <PhoneCTA as="texto" location="treatment_page" />
            </p>
          </div>

          <aside className={styles.aside} aria-label={`Ficha: ${name}`}>
            <div className={styles.marca}>
              <Numeral size="xl" className={styles.numeral}>
                {num}
              </Numeral>
              <TratamentoFigura slug={slug} className={styles.figura} />
            </div>
            {ficha.length > 0 && (
              <dl className={styles.ficha}>
                {ficha.map((row) => (
                  <div key={row.k} className={styles.row}>
                    <dt className="t-folio">{row.k}</dt>
                    <dd className="t-body">{row.v}</dd>
                  </div>
                ))}
              </dl>
            )}
            <p className={`t-label ${styles.particular}`}>Atendimento particular, sem convênios.</p>
          </aside>
        </div>
      </Container>
    </Section>
  );
}
