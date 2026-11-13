import { siteConfig, localeTexto } from "@/lib/site-config";
import { Section, type SectionTone } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { MapCTA, PhoneCTA } from "@/components/ui/cta";
import { MapFacade } from "@/components/ui/map-facade";
import { IndexEnd, IndexRow } from "@/components/ui/index-list";
import { RouteWhatsAppCTA } from "@/components/layout/route-ctas";
import styles from "./editorial.module.css";

/**
 * Localização (DESIGN.md 5.1, momento 6): título e abertura, fatos em lista com fios
 * (endereço, horário só se existir em `siteConfig.hours`, contato), "Como chegar" como botão e
 * "Agendar pelo WhatsApp" como link (com a mensagem da rota, B-06), e o mapa numa fachada em arco
 * (MapFacade): o iframe do Google só entra depois do clique em "Ver mapa". Sem cartões, sem
 * ícones em círculo, sem rótulos em caixa-alta. Usada na home.
 */
export function LocationSection({ tone = "osso" }: { tone?: SectionTone }) {
  return (
    <Section
      tone={tone}
      id="localizacao"
      aria-labelledby="localizacao-titulo"
      className={styles.secM}
    >
      <Container>
        <div className="grid12">
          <div className={styles.locHead}>
            <Eyebrow>Localização</Eyebrow>
            <h2 id="localizacao-titulo" className="t-d2 mt-3">
              Um espaço acolhedor, pensado para&nbsp;o&nbsp;seu conforto
            </h2>
            <p className="t-lead">
              Consultório em uma travessa da Av. Edgar Facó, na {localeTexto("regiaoZona")}. Venha
              conhecer ou fale com a Dra. Ana para combinar o melhor horário.
            </p>
          </div>

          <div className={styles.locInfo}>
            <ul data-reveal="" className="idx">
              {[
                { label: "Endereço", value: localeTexto("endereco") },
                ...(siteConfig.hours ? [{ label: "Horário", value: siteConfig.hours }] : []),
                { label: "Contato", value: <PhoneCTA as="texto" location="location_section" /> },
              ].map((row, i) => (
                <IndexRow key={row.label} i={i} className={styles.locRow}>
                  <p className="t-kicker m-0">{row.label}</p>
                  <div className={`t-body ${styles.locValue}`}>{row.value}</div>
                </IndexRow>
              ))}
              <IndexEnd i={3} />
            </ul>
            <div className={styles.locBtns}>
              <MapCTA location="location_section" />
              <RouteWhatsAppCTA location="location_section" variant="texto" />
            </div>
          </div>

          <div className={styles.map}>
            <MapFacade location="location_map" showDirections={false} minHeight={240} />
          </div>
        </div>
      </Container>
    </Section>
  );
}
