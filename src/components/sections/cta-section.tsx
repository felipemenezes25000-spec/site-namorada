import { waMessages } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import { Section, type SectionTone } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { AgendarCTA, WhatsAppCTA } from "@/components/ui/cta";
import { FioSmile } from "@/components/brand/fio-smile";
import styles from "./cta-section.module.css";

export type FechoKind = "geral" | "tratamento" | "apoio";

/** Textos do fecho por tipo de página. `title`, `description` e `eyebrow` ainda sobrescrevem. */
const FECHOS: Record<FechoKind, { title: string; description: string; eyebrow: string }> = {
  geral: {
    title: "Agende sua avaliação",
    description:
      "Fale pelo WhatsApp ou preencha o formulário, o que for mais confortável para você. Tudo no seu tempo, sem pressão.",
    eyebrow: "Vamos cuidar do seu sorriso",
  },
  tratamento: {
    title: "Conte o seu caso",
    description:
      "Escreva pelo WhatsApp ou preencha o formulário. A Dra. Ana responde e combina com você a avaliação, no seu tempo.",
    eyebrow: "Próximo passo",
  },
  apoio: {
    title: "Sem pressa, no seu tempo",
    description:
      "Se ficou alguma dúvida, pergunte pelo WhatsApp. Quando fizer sentido para você, agende a avaliação.",
    eyebrow: "Quando quiser",
  },
};

/**
 * Fecho de página (DESIGN.md 5.1, momento 8): "Agende sua avaliação" com o Fio
 * fechando num arco de sorriso em volta do botão de WhatsApp. Usado uma vez por
 * página. Sem o fio, o botão continua sozinho. Esconde o botão flutuante
 * (data-hide-floating) enquanto está na tela. Endereço e contato ficam no rodapé (não se repetem aqui).
 * Na home usa tone="noite" (segunda cena de impacto, título monumental em itálico); nas
 * páginas internas segue em osso.
 *
 * Props antigas (`title`, `description`) seguem valendo para as páginas internas.
 */
export function CTASection({
  kind = "geral",
  title = FECHOS[kind].title,
  description = FECHOS[kind].description,
  eyebrow = FECHOS[kind].eyebrow,
  tone = "osso",
  id = "agendar",
  message = waMessages.default,
  location = "cta_final",
  className,
}: {
  /** Tipo de página: troca o texto do fecho (B-17, o fecho não é igual em todas as páginas). */
  kind?: FechoKind;
  title?: string;
  description?: string;
  eyebrow?: string;
  tone?: SectionTone;
  id?: string;
  /** Mensagem pré-preenchida do WhatsApp (ex.: waMessages.treatment(nome)). */
  message?: string;
  /** Valor de `location` nos eventos de clique. */
  location?: string;
  className?: string;
}) {
  const dark = tone === "noite" || tone === "verde";
  return (
    <Section
      tone={tone}
      id={id}
      hideFloating
      aria-labelledby={`${id}-titulo`}
      className={className}
    >
      <Container>
        <div className="grid12">
          <div className={styles.head}>
            <Eyebrow>{eyebrow}</Eyebrow>
            <h2 id={`${id}-titulo`} className={cn("t-d2", styles.title)}>
              {title}
            </h2>
          </div>

          <div className={styles.action}>
            <p className={cn("t-body", styles.desc)}>{description}</p>

            <div className={styles.buttons}>
              <FioSmile className={styles.smile}>
                <WhatsAppCTA
                  location={location}
                  message={message}
                  variant={dark ? "ouro" : "primario"}
                  size="md"
                  className={styles.wa}
                />
              </FioSmile>
              <AgendarCTA
                location={location}
                variant={dark ? "contorno-claro" : "contorno"}
                className={styles.alt}
              />
            </div>
          </div>
        </div>

      </Container>
    </Section>
  );
}
