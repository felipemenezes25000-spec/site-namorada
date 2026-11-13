import type { ReactNode } from "react";
import { locale, localeTexto, siteConfig } from "@/lib/site-config";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { DisplayHeading } from "@/components/ui/display-heading";
import { ArchPortrait } from "@/components/ui/arch-portrait";
import { ButtonLink } from "@/components/ui/button";
import { PhoneCTA, WhatsAppCTA } from "@/components/ui/cta";
import { ArrowIcon } from "@/components/ui/icons";
import { FioRule } from "@/components/brand/fio-rule";
import styles from "./hero.module.css";

/**
 * Capa da home (DESIGN.md 5.1, momento 1). SERVIDOR, sem JavaScript para aparecer:
 * masthead com fio duplo (CRO e bairro), H1 monumental com a linha-chamada em itálico
 * dentro do mesmo título, retrato recortado passando na frente do arco do Fio, texto de
 * apoio, botão de WhatsApp dominante, "Ver tratamentos" e o telefone.
 *
 * Nada começa invisível: só o arco se desenha (2,4s) e a luz atravessa o título uma
 * vez (1,8s), ambos em CSS com `animation-fill-mode: backwards`, e só com movimento
 * permitido. Com `prefers-reduced-motion` tudo já está no estado final.
 *
 * Composição: celular em uma coluna (H1, texto com a lista do que se atende, o botão de
 * WhatsApp e o link "Ver tratamentos", e só então o retrato: quem é, o que faz e o botão ficam
 * na primeira tela; o retrato "espia" por baixo);
 * tablet estreito (760 a 959px) com o H1 em largura total e texto + retrato lado a lado;
 * a partir de 960px H1 + texto à esquerda e o retrato ocupando as duas linhas à direita. `children` entra no mesmo momento da capa
 * (a declaração com as três colunas).
 */
export function Hero({ children }: { children?: ReactNode }) {
  return (
    <Section
      tone="osso"
      id="capa"
      spacing="none"
      aria-labelledby="capa-titulo"
      className={styles.hero}
    >
      <Container>
        <div className={styles.grid}>
          <div className={styles.mast}>
            <div className={styles.mastRow}>
              <p className={styles.mastLeft}>Cirurgiã-dentista · {siteConfig.cro}</p>
              <p className={styles.mastRight}>
                <span className={styles.mastShort}>{locale.bairro}</span>
                <span className={styles.mastLong}>
                  {locale.bairro} · {localeTexto("regiaoZona")}
                </span>
              </p>
            </div>
            <FioRule double reveal={false} />
          </div>

          <DisplayHeading
            level={1}
            size="d1"
            id="capa-titulo"
            kicker={<span className={styles.kicker}>Dentista particular na {locale.regiao}</span>}
            className={styles.title}
          >
            Atendimento acolhedor, claro e sem&nbsp;pressão.
          </DisplayHeading>

          <div className={styles.text}>
            <p className={`t-body ${styles.lead}`}>
              Consulta de 40 a 60 minutos com avaliação completa, explicação simples e plano de
              tratamento individualizado.
              <span className={styles.leadMore}>
                {" "}
                Prevenção, restaurações, clareamento, cirurgia oral e urgências odontológicas.
              </span>
            </p>

            {/* data-hide-floating: enquanto estes botões estão na tela a barra do celular se recolhe (um só WhatsApp por tela) */}
            <div className={styles.actions} data-hide-floating="">
              <WhatsAppCTA location="hero" className={styles.wa} />
              {/* celular: link de texto logo abaixo do botão, ainda na primeira tela */}
              <ButtonLink
                href="#tratamentos"
                variant="texto"
                size="md"
                className={styles.verMobile}
              >
                Ver tratamentos
                <ArrowIcon />
              </ButtonLink>
              <ButtonLink
                href="#tratamentos"
                variant="contorno"
                size="md"
                className={`${styles.ver} ${styles.deskOnly}`}
              >
                Ver tratamentos
                <ArrowIcon />
              </ButtonLink>
            </div>

            <p className={`t-body ${styles.phone} ${styles.deskOnly}`}>
              Prefere telefone? <PhoneCTA as="texto" location="home_hero" />
            </p>
          </div>

          <div className={styles.fig}>
            <ArchPortrait />
          </div>

          {/* celular: o telefone vem depois do retrato (fora da primeira tela) */}
          <div className={styles.more}>
            <p className={`t-body ${styles.phone}`}>
              Prefere telefone? <PhoneCTA as="texto" location="home_hero" />
            </p>
          </div>
        </div>

        {children}
      </Container>
    </Section>
  );
}
