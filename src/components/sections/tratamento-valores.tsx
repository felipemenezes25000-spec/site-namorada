import Link from "next/link";
import { Section, type SectionTone } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ArrowIcon } from "@/components/ui/icons";
import styles from "./tratamento-valores.module.css";

const APOIO = [
  { href: "/valores", label: "Como funcionam os valores" },
  { href: "/primeira-consulta", label: "Como é a primeira consulta" },
];

/**
 * "Valores" (DESIGN.md 5.4, momento 4), em uma faixa compacta (até 200px a 1440): o que pesa no
 * orçamento DESTE tratamento (`valores`, um texto por tratamento), sem preço e sem forma de
 * pagamento (Código de Ética Odontológica, art. 44, I), e dois links de apoio em linha. O aviso de
 * conteúdo informativo vai ao fim da página, junto da autoria. Sem cartão.
 */
export function TratamentoValores({ tone = "osso", texto }: { tone?: SectionTone; texto: string }) {
  return (
    <Section tone={tone} id="valores" spacing="none" className={styles.sec} aria-labelledby="valores-titulo">
      <Container>
        <div className="grid12">
          <div className={styles.head}>
            <Eyebrow>Valores</Eyebrow>
            <h2 id="valores-titulo" className="t-d3 display">
              Transparência sobre valores
            </h2>
          </div>
          <div className={styles.body}>
            <p className={`t-body ${styles.lead}`}>{texto}</p>
          </div>
          <ul className={styles.links}>
            {APOIO.map((a) => (
              <li key={a.href}>
                <Link href={a.href} className={styles.link}>
                  <span className="t-label">{a.label}</span>
                  <ArrowIcon size={18} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
