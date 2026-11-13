import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { FioRule } from "@/components/brand/fio-rule";
import styles from "./sobre-sections.module.css";

/** "bem-estar" sem quebra, com o hífen em Hanken: no Bodoni o hífen some em corpo grande. */
function BemEstar() {
  return (
    <span>
      bem<span className={styles.hifen}>-</span>estar
    </span>
  );
}

/**
 * Trajetória de /sobre (DESIGN.md 5.2, momento 2): ensaio em coluna de leitura (7 colunas) e, ao
 * lado, a declaração em display itálico (5 colunas, acompanha a leitura no desktop). A declaração
 * não é fala da Dra.: é uma frase de apresentação em terceira pessoa, sem atribuição e sem promessa
 * de resultado. Texto do ensaio reescrito só para clareza: mesmas ideias, sem fatos novos.
 * Servidor puro.
 */
export function SobreEnsaio({ id = "trajetoria" }: { id?: string }) {
  return (
    <Section tone="papel" id={id} aria-labelledby={`${id}-titulo`}>
      <Container>
        <div className="grid12">
          <div className={styles.essay}>
            <Eyebrow>Trajetória</Eyebrow>
            <h2 id={`${id}-titulo`} className="t-d2">
              Uma vocação para cuidar das pessoas
            </h2>
            <p className={`t-lead ${styles.essayLead}`}>
              A Dra. Ana Beatriz escolheu a área da saúde por vontade de cuidar do próximo. Sempre
              atenta ao bem-estar de quem está ao redor, encontrou na Odontologia a união entre o
              rigor da prática clínica e o cuidado humano.
            </p>
            <p className={`t-body ${styles.essayBody}`}>
              Para ela, a Odontologia vai além do dente. O cuidado considera a identidade de cada
              pessoa, a função da mastigação e da fala e o modo como ela se sente com o próprio
              sorriso. O sorriso está presente em todas as esferas da vida: de comer e falar com clareza até a
              autoestima e a estética.
            </p>
            <p className={`t-body ${styles.essayBody}`}>
              Cuidar do sorriso é, essencialmente, cuidar do que move o seu <BemEstar /> todos
              os dias.
            </p>
          </div>

          <div className={styles.pull}>
            <FioRule />
            <p className={`t-d4 ${styles.pullText}`}>
              O objetivo da doutora é acompanhar cada paciente no cuidado com a saúde e o{" "}
              <BemEstar /> ao longo da vida.
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
