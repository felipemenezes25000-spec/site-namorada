import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container } from "@/components/ui/container";
import { DisplayHeading } from "@/components/ui/display-heading";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Section } from "@/components/ui/section";
import { IdentityLine } from "@/components/ui/identity-line";
import { FioRule } from "@/components/brand/fio-rule";
import styles from "./apoio-hero.module.css";

/**
 * Abertura das páginas de apoio (primeira consulta, valores, urgência, medo de dentista).
 * Mesma moldura de PageHero (breadcrumb, fio duplo, H1 `.t-d1i` com o brilho) com duas diferenças:
 * a coluna do visual (`aside`) é livre (cada página põe a sua) e `ampla` dá ao texto 9 colunas.
 * Abaixo do lede vai sempre a `IdentityLine` (nome, CRO e bairro): quem chega de anúncio vê quem
 * atende e onde sem rolar. O `aviso` (opcional) vem antes dos botões.
 * Servidor, sem Reveal e sem fade: tudo está no HTML.
 */
export function ApoioHero({
  kicker,
  title,
  lede,
  breadcrumbs,
  actions,
  aviso,
  note,
  aside,
  mobileMark,
  ampla = false,
  actionsRow = false,
  asideIdentifica = false,
  className,
}: {
  kicker: ReactNode;
  title: ReactNode;
  lede: ReactNode;
  breadcrumbs: { name: string; href?: string }[];
  actions?: ReactNode;
  /** Aviso de segurança (ex.: emergência), antes dos botões. */
  aviso?: ReactNode;
  /** Aviso curto (`.t-cap`) abaixo dos botões. */
  note?: ReactNode;
  /** Coluna da direita (5 colunas, só a partir de 760px). */
  aside?: ReactNode;
  /** Gesto visual do celular, acima do kicker (some a partir de 760px, onde entra o `aside`). */
  mobileMark?: ReactNode;
  /** Texto em 9 colunas (a página que decide em segundos: urgência). */
  ampla?: boolean;
  /** Os dois botões lado a lado também no celular (rótulos curtos). */
  actionsRow?: boolean;
  /**
   * O `aside` já mostra nome, registro e endereço (cartão TrustBlock): a linha de identidade some onde
   * o cartão aparece (a partir de 760px), para a página não repetir a assinatura.
   */
  asideIdentifica?: boolean;
  className?: string;
}) {
  return (
    <Section tone="osso" spacing="none" className={cn(styles.hero, className)}>
      <Container>
        {/* Abaixo de 480px o breadcrumb e o fio duplo saem (o JSON-LD do breadcrumb fica na página). */}
        <div className={styles.topo}>
          <div className={styles.crumb}>
            <Breadcrumbs items={breadcrumbs} />
          </div>
          <FioRule double reveal={false} />
        </div>

        <div className={cn("grid12", styles.grid)}>
          <div className={cn(styles.text, ampla && styles.ampla)}>
            {mobileMark && <div className={styles.mark}>{mobileMark}</div>}
            <Eyebrow className={styles.kicker}>{kicker}</Eyebrow>
            <DisplayHeading level={1} size="d1i" className={styles.title}>
              {title}
            </DisplayHeading>
            <p className={cn("t-lead", styles.lede)}>{lede}</p>
            <IdentityLine
              className={cn(styles.identidade, asideIdentifica && styles.identidadeSoCelular)}
            />
            {aviso && <div className={styles.aviso}>{aviso}</div>}
            {actions && (
              <div className={cn(styles.actions, actionsRow && styles.row)} data-hide-floating="">
                {actions}
              </div>
            )}
            {note && <p className={cn("t-cap", styles.note)}>{note}</p>}
          </div>
          {aside && <div className={styles.aside}>{aside}</div>}
        </div>
      </Container>
    </Section>
  );
}
