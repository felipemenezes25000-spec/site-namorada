import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Numeral } from "@/components/ui/numeral";
import { ArrowIcon } from "@/components/ui/icons";
import { AgendarCTA, WhatsAppCTA } from "@/components/ui/cta";
import { IndexEnd, IndexRow } from "@/components/ui/index-list";
import styles from "./sobre-sections.module.css";

const lattesUrl = "https://lattes.cnpq.br/3767606004982701";

/**
 * Credenciais reais da Dra. Ana Beatriz, repartidas em tipo, nome e instituição. O registro (CRO)
 * não entra aqui: já está na abertura e no trilho da página. Decisão do diretor (B-00): as linhas
 * de ABO, APCD e IOA são "Curso", com nome neutro, nunca título de especialidade; o "Rumo à
 * Residência" é um curso preparatório, não uma residência. `place` fica vazio quando o repositório
 * não informa a instituição.
 */
const credentials: { kind: string; name: string; place?: string }[] = [
  { kind: "Graduação", name: "Odontologia", place: "Centro Universitário Estácio de Brasília" },
  { kind: "Aperfeiçoamento", name: "Cirurgia Oral Menor", place: "São Leopoldo Mandic" },
  {
    kind: "Curso",
    name: "“Rumo à Residência”, curso preparatório em cirurgias da boca e da face",
  },
  { kind: "Curso", name: "Implante dentário", place: "ABO Central · APCD Central" },
  {
    kind: "Curso",
    name: "Remoção de dentes inclusos e cirurgias na boca",
    place: "ABO Central · IOA",
  },
];

/**
 * Formação e credenciais (DESIGN.md 5.2, momento 3): lista com fios, sem ícones e sem cartões.
 * Cada linha traz um numeral itálico dourado, o tipo, o nome e (quando existe) a instituição.
 * Não há anos nos dados, então não há linha do tempo. Título preso à esquerda no desktop; o link
 * do Lattes fecha a lista. Depois dela, um fecho curto com WhatsApp e formulário, antes das áreas e do consultório. Servidor puro.
 */
export function SobreFormacao({ id = "formacao" }: { id?: string }) {
  return (
    <Section tone="osso" id={id} aria-labelledby={`${id}-titulo`}>
      <Container>
        <div className="grid12">
          <div className={styles.fHead}>
            <Eyebrow>Currículo</Eyebrow>
            <h2 id={`${id}-titulo`} className="t-d2">
              Formação e credenciais
            </h2>
          </div>

          <div className={styles.fBody}>
            <ul data-reveal="" className="idx">
              {credentials.map((c, i) => (
                <IndexRow key={`${c.kind}-${c.name}`} i={i} className={styles.fRow}>
                  <Numeral size="md" className={styles.fNum}>
                    {String(i + 1).padStart(2, "0")}
                  </Numeral>
                  <div className="min-w-0">
                    <p className={`t-folio ${styles.fKind}`}>{c.kind}</p>
                    <p className={styles.fName}>{c.name}</p>
                    {c.place ? <p className={`t-body ${styles.fInst}`}>{c.place}</p> : null}
                  </div>
                </IndexRow>
              ))}
              <IndexEnd i={credentials.length} />
            </ul>
            <p className={styles.fMore}>
              <a
                href={lattesUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="link t-label inline-flex min-h-[44px] items-center gap-2"
              >
                Conheça o currículo completo no Lattes
                <ArrowIcon size={18} />
                <span className="sr-only"> (abre em nova aba)</span>
              </a>
            </p>

            <div className={styles.fFecho}>
              <p className={`t-body ${styles.fFechoText}`}>
                Quer conversar antes de decidir? Escolha o canal que for mais confortável.
              </p>
              <div className={styles.fFechoBtns}>
                <WhatsAppCTA location="sobre_formacao" />
                <AgendarCTA location="sobre_formacao" />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
