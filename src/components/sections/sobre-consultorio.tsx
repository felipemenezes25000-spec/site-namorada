import { locale } from "@/lib/site-config";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ButtonLink } from "@/components/ui/button";
import { MapCTA } from "@/components/ui/cta";
import { MapFacade } from "@/components/ui/map-facade";
import { ArrowIcon } from "@/components/ui/icons";
import { FioRule } from "@/components/brand/fio-rule";
import { EnderecoLinha } from "./contato-endereco";
import styles from "./sobre-sections.module.css";

/** "Freguesia do Ó" nunca deixa o "Ó" sozinho na linha. */
const REGIAO = locale.regiao.replace(/ (\S+)$/, " $1");

/**
 * O consultório (DESIGN.md 5.2, momento 5), tom noite: o endereço em Bodoni e o mapa em arco
 * (`MapFacade`: o iframe do Google só entra depois do toque). Nenhuma foto: não há imagem
 * autorizada do espaço, e imagem de procedimento nunca ilustra esta seção. Sem alegações sobre o
 * espaço (só endereço, referência de via e botões). Servidor, com a fachada do mapa como ilha.
 */
export function SobreConsultorio({ id = "consultorio" }: { id?: string }) {
  return (
    <Section tone="noite" id={id} aria-labelledby={`${id}-titulo`}>
      <Container>
        <div className={`grid12 ${styles.officeGrid}`}>
          <div className={styles.office}>
            <Eyebrow>O consultório</Eyebrow>
            <h2 id={`${id}-titulo`} className="t-d2">
              Onde fica o consultório
            </h2>
            <p className={`t-lead ${styles.officeLead}`}>
              Na {locale.bairro}, na região da {REGIAO}, {locale.zona}.
            </p>

            <div className={styles.addr}>
              <FioRule />
              <p className={`t-d3 display ${styles.addrLine}`}>{locale.ruaNumero}</p>
              <p className={`t-body ${styles.addrSub}`}>
                <EnderecoLinha />
              </p>
              <p className={`t-body ${styles.addrRef}`}>Travessa da Av. Edgar Facó</p>
            </div>

            <div className={styles.officeBtns}>
              <MapCTA location="sobre_consultorio" variant="ouro" />
              <ButtonLink href="/contato" variant="contorno-claro">
                Ver formas de contato
                <ArrowIcon />
              </ButtonLink>
            </div>
          </div>

          <div className={styles.officeMap}>
            <MapFacade location="sobre_consultorio" tone="escuro" showDirections={false} />
          </div>
        </div>
      </Container>
    </Section>
  );
}
