import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { AgendarCTA } from "@/components/ui/cta";
import styles from "./contato-sections.module.css";

/**
 * Fecho curto de /contato (tom osso). O WhatsApp já foi oferecido nos canais e em "Como chegar",
 * então aqui entra só a outra porta: o formulário. Esconde a barra do celular enquanto está na tela.
 * Servidor puro.
 */
export function ContatoFecho({ id = "agendar" }: { id?: string }) {
  return (
    <Section tone="osso" id={id} hideFloating aria-labelledby={`${id}-titulo`}>
      <Container>
        <div className={`grid12 ${styles.fecho}`}>
          <div className={styles.fechoHead}>
            <Eyebrow>Outra forma de falar com a gente</Eyebrow>
            <h2 id={`${id}-titulo`} className="t-d2">
              Prefere o formulário?
            </h2>
          </div>
          <div className={styles.fechoAction}>
            <p className="t-body m-0">
              Preencha com calma, o que for mais confortável para você. Tudo no seu tempo, sem
              pressão.
            </p>
            <AgendarCTA location="cta_final" variant="primario" />
          </div>
        </div>
      </Container>
    </Section>
  );
}
