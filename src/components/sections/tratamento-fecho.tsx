import { cn } from "@/lib/utils";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { AgendarCTA, WhatsAppCTA } from "@/components/ui/cta";
import { FioSmile } from "@/components/brand/fio-smile";
import ctaStyles from "./cta-section.module.css";
import styles from "./tratamento-fecho.module.css";

/**
 * Fecho das páginas de tratamento: mesma estrutura e mesmo CSS do <CTASection kind="tratamento" />, mas
 * o botão do formulário leva o tratamento (/agendamento?tratamento=<slug>), o que o CTASection (arquivo
 * da base) ainda não aceita. Quando ele ganhar a prop `treatment`, este arquivo pode voltar a ele.
 */
export function TratamentoFecho({ slug, message }: { slug: string; message: string }) {
  const id = "agendar";
  return (
    <Section
      tone="noite"
      id={id}
      hideFloating
      aria-labelledby={`${id}-titulo`}
      className={styles.fecho}
    >
      <Container>
        <div className="grid12">
          <div className={ctaStyles.head}>
            <Eyebrow>Próximo passo</Eyebrow>
            <h2 id={`${id}-titulo`} className={cn("t-d2", ctaStyles.title)}>
              Conte o seu caso
            </h2>
          </div>
          <div className={ctaStyles.action}>
            <p className={cn("t-body", ctaStyles.desc)}>
              Escreva pelo WhatsApp ou preencha o formulário. A Dra. Ana responde e combina com você
              a avaliação, no seu tempo.
            </p>
            <div className={ctaStyles.buttons}>
              <FioSmile className={ctaStyles.smile}>
                <WhatsAppCTA
                  location="cta_final"
                  message={message}
                  variant="ouro"
                  size="md"
                  className={ctaStyles.wa}
                />
              </FioSmile>
              <AgendarCTA
                location="cta_final"
                treatment={slug}
                variant="contorno-claro"
                className={ctaStyles.alt}
              />
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
