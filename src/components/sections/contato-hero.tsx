import Link from "next/link";
import { siteConfig, locale } from "@/lib/site-config";
import { waMessages } from "@/lib/whatsapp";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { DisplayHeading } from "@/components/ui/display-heading";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ArchPortrait } from "@/components/ui/arch-portrait";
import { PhoneCTA, WhatsAppCTA } from "@/components/ui/cta";
import { FioRule } from "@/components/brand/fio-rule";
import styles from "./contato-sections.module.css";

/**
 * Abertura de /contato (DESIGN.md 5.6): a página que leva ao WhatsApp. H1 à esquerda (kicker
 * "Contato e endereço do consultório na Vila Bruna" dentro do heading), o canal principal
 * (WhatsApp) e o telefone em numerais grandes já na primeira tela, e o retrato da Dra. em arco à
 * direita (>= 760px). No celular a abertura é enxuta: a barra fixa e a primeira linha de canais
 * entram na primeira tela, e o botão de WhatsApp da página não se repete sobre o da barra.
 * Servidor, sem Reveal: tudo está no HTML.
 *
 * Retrato: `loading="eager"` e `fetchPriority="high"`, sem `priority` (que geraria um preload
 * escondido no celular). No celular o bloco fica `display: none`; o `sizes` ali aponta para 1px,
 * então o navegador escolhe o menor candidato e o custo é mínimo.
 */
export function ContatoHero() {
  return (
    <Section tone="osso" spacing="none" className={styles.hero}>
      <Container>
        <div className={styles.crumbs}>
          <Breadcrumbs items={[{ name: "Início", href: "/" }, { name: "Contato" }]} />
        </div>
        <FioRule double reveal={false} />

        <div className={`grid12 ${styles.heroGrid}`}>
          <div className={styles.heroText}>
            <DisplayHeading
              level={1}
              size="d1i"
              kicker={`Contato e endereço do consultório na ${locale.bairro}`}
              className={styles.heroTitle}
            >
              Fale com a Dra. Ana pelo canal que for mais fácil para você
            </DisplayHeading>
            <p className={`t-lead ${styles.heroLede}`}>
              O atendimento é acolhedor desde a primeira mensagem.
            </p>
            {/* atalho para quem está com dor: telefone e a página de urgência, ainda na primeira tela */}
            <p className={`t-sm ${styles.heroUrgente}`}>
              Com dor forte ou inchaço?{" "}
              <PhoneCTA as="texto" location="contact_urgency" className="inline min-h-0" /> ou veja
              a{" "}
              <Link href="/urgencia-odontologica" className="link">
                página de urgência
              </Link>
              .
            </p>

            <div className={styles.heroActions} data-hide-floating="">
              <WhatsAppCTA location="contact_page" message={waMessages.default} />
              <p className={styles.heroPhoneWrap}>
                Prefere ligar?{" "}
                <PhoneCTA as="texto" location="contact_page" className={styles.heroPhone} />
              </p>
            </div>
          </div>

          <div className={styles.heroFig}>
            {/* lazy: no celular o retrato fica oculto (display: none) e não é baixado; no computador ele está
                na primeira tela e entra logo depois do CSS, com prioridade alta */}
            <ArchPortrait
              priority={false}
              loading="lazy"
              fetchPriority="high"
              fig={1}
              sizes="(min-width: 1100px) 440px, (min-width: 760px) 40vw, 1px"
              caption={`${siteConfig.doctorName}, cirurgiã-dentista.`}
            />
          </div>
        </div>
      </Container>
    </Section>
  );
}
