import { waMessages } from "@/lib/whatsapp";
import { Section, type SectionTone } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { FAQ } from "@/components/ui/faq";
import { CTA_DUVIDAS_WHATSAPP, WhatsAppCTA } from "@/components/ui/cta";
import styles from "./editorial.module.css";

/** Perguntas abertas à vista; as outras ficam em "Ver todas" (mesma lista vai ao JSON-LD). */
const FAQ_VISIVEIS = 4;

/**
 * Dúvidas (DESIGN.md 4.4 e 5.1, momento 7): o título e o convite para o WhatsApp ficam
 * presos à esquerda (sticky no desktop) enquanto a lista, com fios e o sinal "+" sem círculo,
 * corre à direita. Usa o <FAQ> nativo (<details>, sem JavaScript).
 *
 * A página escolhe as perguntas e passa a MESMA lista ao <FAQSection> e ao `faqSchema` do JSON-LD:
 * o componente não corta nada em silêncio. As 4 primeiras aparecem; o resto fica em "Ver todas"
 * (um <details> que já está no HTML servido, então nada some para buscadores nem para leitores de tela).
 */
export function FAQSection({
  items,
  id = "faq",
  tone = "papel",
  eyebrow = "Dúvidas frequentes",
  title = "Perguntas que ouvimos com frequência",
  description = "Não achou a sua dúvida? Pergunte pelo WhatsApp.",
  whatsappMessage = waMessages.questions,
}: {
  items: { q: string; a: string }[];
  id?: string;
  tone?: SectionTone;
  eyebrow?: string;
  title?: string;
  description?: string;
  whatsappMessage?: string;
}) {
  return (
    <Section tone={tone} id={id} aria-labelledby={`${id}-titulo`} className={styles.secM}>
      <Container>
        <div className="grid12">
          <div className={styles.faqHead}>
            <Eyebrow>{eyebrow}</Eyebrow>
            <h2 id={`${id}-titulo`} className="t-d2 mt-3">
              {title}
            </h2>
            <p className="t-body">{description}</p>
            <div className={styles.faqAsk}>
              <WhatsAppCTA
                location="faq"
                label={CTA_DUVIDAS_WHATSAPP}
                message={whatsappMessage}
                variant="contorno"
              />
            </div>
          </div>
          <div className={styles.faqList}>
            <FAQ items={items.slice(0, FAQ_VISIVEIS)} />
            {items.length > FAQ_VISIVEIS && (
              // As demais perguntas continuam no HTML (e no JSON-LD): só ficam recolhidas.
              <details className={styles.faqRest}>
                <summary className={`link t-label ${styles.faqRestSum}`}>
                  <span className={styles.faqRestOpen}>Ver todas as perguntas ({items.length})</span>
                  <span className={styles.faqRestClose}>Mostrar menos perguntas</span>
                </summary>
                <FAQ items={items.slice(FAQ_VISIVEIS)} />
              </details>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}
