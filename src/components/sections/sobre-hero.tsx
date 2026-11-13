import Image from "next/image";
import { siteConfig, locale } from "@/lib/site-config";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { DisplayHeading } from "@/components/ui/display-heading";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { AgendarCTA, WhatsAppCTA } from "@/components/ui/cta";
import { FioRule } from "@/components/brand/fio-rule";
import styles from "./sobre-sections.module.css";

const FACTS = [
  { k: "Profissão", v: "Cirurgiã-dentista" },
  { k: "Registro", v: siteConfig.cro },
  { k: "Atendimento", v: "Particular, sem convênios" },
];

/**
 * Abertura de /sobre (DESIGN.md 5.2, momento 1): a página que convence pela pessoa.
 * H1 à esquerda com o brilho `.luz` (kicker com o nome da doutora e o bairro, dentro do mesmo
 * heading), retrato em arco (moldura dourada) e três fatos em linhas com fio. O retrato é a única
 * imagem da página: legenda sem numeral. No celular o arco ocupa a largura útil e vem logo depois
 * do título; no desktop fica na coluna da direita. Os dois botões entram nas três primeiras telas.
 * Servidor, sem Reveal: tudo está no HTML. O fio de cada fato é desenhado em CSS.
 *
 * O fundo da foto mostra números de sala; dois borrões em CSS (`.sala`) os cobrem. As posições são
 * porcentagens do arco, que tem proporção fixa 4/5 e `object-fit: cover`.
 */
export function SobreHero({ id = "abertura" }: { id?: string }) {
  return (
    <Section tone="osso" id={id} spacing="none" className={styles.hero}>
      <Container>
        <div className={styles.crumbs}>
          <Breadcrumbs items={[{ name: "Início", href: "/" }, { name: "Sobre" }]} />
        </div>
        <FioRule double reveal={false} />

        <div className={`grid12 ${styles.heroGrid}`}>
          <div className={styles.heroHead}>
            <DisplayHeading
              level={1}
              size="d1i"
              kicker={`${siteConfig.doctorFirstName}, dentista na ${locale.bairro}`}
              className={styles.heroTitle}
            >
              Uma odontologia construída com cuidado e confiança
            </DisplayHeading>
          </div>

          <figure className={`m-0 ${styles.heroFig}`}>
            <div className={styles.archFrame}>
            <div className={styles.arch}>
              <Image
                src="/dra-ana-trajetoria.jpg"
                alt={`${siteConfig.doctorName}, cirurgiã-dentista, sorrindo, de jaleco branco, em ambiente de atendimento`}
                width={1200}
                height={1600}
                sizes="(min-width: 1100px) 480px, (min-width: 760px) 40vw, 92vw"
                quality={72}
                priority
                fetchPriority="high"
              />
              <span className={`${styles.sala} ${styles.salaEsq}`} aria-hidden="true" />
              <span className={`${styles.sala} ${styles.salaDir}`} aria-hidden="true" />
            </div>
            </div>
            <figcaption className={styles.figCap}>
              <span className="t-cap">{siteConfig.doctorName}, cirurgiã-dentista.</span>
            </figcaption>
          </figure>

          <div className={styles.heroRest}>
            <p className={`t-lead ${styles.lede}`}>
              Por trás de cada sorriso existe uma pessoa, uma história e um tempo próprio. É a
              partir disso que a Dra. Ana conduz o seu trabalho.
            </p>

            <dl className={styles.facts}>
              {FACTS.map((f) => (
                <div key={f.k} className={styles.fact}>
                  <dt className="t-folio">{f.k}</dt>
                  <dd className="t-body">{f.v}</dd>
                </div>
              ))}
            </dl>

            <div className={styles.heroCtas}>
              <WhatsAppCTA location="sobre_hero" />
              <AgendarCTA location="sobre_hero" />
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
