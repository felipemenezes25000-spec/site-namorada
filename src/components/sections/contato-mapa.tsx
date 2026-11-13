import { locale } from "@/lib/site-config";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { CTA_DUVIDAS_WHATSAPP, MapCTA, WhatsAppCTA } from "@/components/ui/cta";
import { MapFacade } from "@/components/ui/map-facade";
import { FioRule } from "@/components/brand/fio-rule";
import { EnderecoLinha } from "./contato-endereco";
import styles from "./contato-sections.module.css";

/** "Freguesia do Ó" nunca deixa o "Ó" sozinho na linha. */
const REGIAO = locale.regiao.replace(/ (\S+)$/, " $1");

/**
 * "Como chegar" de /contato (DESIGN.md 5.6), tom noite: endereço em display, a via, a referência
 * ("travessa da Av. Edgar Facó", que já consta nas perguntas frequentes), o CEP e o mapa em arco
 * com fio dourado (`MapFacade`: o iframe do Google só é montado depois do toque, então a página
 * não faz nenhuma requisição ao Google ao carregar). Nada sobre estacionamento nem acessibilidade:
 * são fatos que dependem da confirmação da Dra. Servidor, com a fachada como ilha. Esconde a
 * barra do celular: o botão de WhatsApp da própria seção já cumpre o papel.
 */
export function ContatoMapa({ id = "como-chegar" }: { id?: string }) {
  return (
    <Section tone="noite" id={id} hideFloating aria-labelledby={`${id}-titulo`}>
      <Container>
        <div className={`grid12 ${styles.mapGrid}`}>
          <div className={styles.head}>
            <Eyebrow>Localização</Eyebrow>
            <h2 id={`${id}-titulo`} className="t-d2">
              Como chegar
            </h2>
            <p className={`t-lead ${styles.lead}`}>
              O consultório fica na {locale.bairro}, na região da {REGIAO}, {locale.zona}, em uma
              travessa da Av. Edgar Facó.
            </p>

            <div className={styles.addrBlock}>
              <FioRule />
              <p className={`t-d3 display ${styles.addr}`}>{locale.ruaNumero}</p>
              <p className={`t-body ${styles.addrSub}`}>
                <EnderecoLinha />
              </p>
              <dl className={styles.refs}>
                <div className={styles.ref}>
                  <dt className="t-folio">Referência</dt>
                  <dd className="t-body">Travessa da Av. Edgar Facó</dd>
                </div>
                <div className={styles.ref}>
                  <dt className="t-folio">CEP</dt>
                  <dd className="t-body nums">{locale.cep}</dd>
                </div>
              </dl>
              <p className={`t-body ${styles.note}`}>
                Dúvida sobre o caminho? Pergunte pelo WhatsApp.
              </p>
            </div>

            <div className={styles.btns}>
              <MapCTA location="contact_map" variant="ouro" />
              <WhatsAppCTA
                location="contact_map"
                label={CTA_DUVIDAS_WHATSAPP}
                variant="contorno-claro"
              />
            </div>
          </div>

          <div className={styles.mapCol}>
            <MapFacade
              location="contact_map"
              tone="escuro"
              minHeight={320}
              showDirections={false}
              className={styles.facade}
            />
          </div>
        </div>
      </Container>
    </Section>
  );
}
