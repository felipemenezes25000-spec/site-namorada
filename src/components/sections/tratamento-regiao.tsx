import { siteConfig, locale } from "@/lib/site-config";
import { Section, type SectionTone } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { MapCTA, PhoneCTA } from "@/components/ui/cta";
import styles from "./tratamento-regiao.module.css";

/**
 * "Onde fica" de cada tratamento (SEO local; DESIGN.md 6.4), em uma faixa compacta (até 200px a 1440):
 * uma frase PRÓPRIA do tratamento (`texto`), o cartão de endereço (NAP, igual em todas as páginas,
 * lido de `siteConfig`) e os dois botões de apoio: "Como chegar" e o telefone. O WhatsApp já está na
 * abertura, no botão fixo e no fecho. Não afirma nada sobre estacionamento nem acesso. Servidor.
 */
export function TratamentoRegiao({ tone = "papel", texto }: { tone?: SectionTone; texto: string }) {
  const a = siteConfig.address;
  return (
    <Section tone={tone} id="onde" spacing="none" className={styles.sec} aria-labelledby="onde-titulo">
      <Container>
        <div className="grid12">
          <div className={styles.text}>
            <Eyebrow>Onde fica</Eyebrow>
            <h2 id="onde-titulo" className="t-d3 display">
              Atendimento na {locale.bairro}
            </h2>
            <p className={`t-body ${styles.p}`}>{texto}</p>
          </div>

          <div className={styles.card}>
            <address className={styles.addr}>
              <span className={`t-body ${styles.street}`}>{a.street}</span>
              <span className="t-body">
                {a.neighborhood} (região da {locale.regiao}), {a.city} - {a.state}, {a.zip}
              </span>
            </address>
            <div className={styles.actions}>
              <MapCTA location="treatment_region" className={styles.btn} />
              <PhoneCTA as="texto" location="treatment_region" />
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
