import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { DisplayHeading } from "@/components/ui/display-heading";
import { Figure, type FigureProps } from "@/components/ui/figure";
import { Numeral } from "@/components/ui/numeral";
import { FioRule } from "@/components/brand/fio-rule";
import { Monogram } from "@/components/brand/logo";
import { Section } from "@/components/ui/section";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  kicker?: ReactNode;
  title: ReactNode;
  lede?: ReactNode;
  breadcrumbs?: { name: string; href?: string }[];
  /** Visual da coluna direita (5 colunas). Padrão: "arco". Abaixo de 760px "arco" e "numeral" são omitidos. */
  visual?: "numeral" | "figure" | "arco" | "none";
  /** Para visual="numeral": "08", "5"... */
  numeral?: string;
  /** Para visual="figure". */
  figure?: FigureProps;
  /** Botões (WhatsAppCTA, AgendarCTA...). */
  actions?: ReactNode;
  className?: string;
}

/**
 * Abertura das páginas internas (DESIGN.md 4.4), tom osso: breadcrumb, fio duplo
 * de masthead, H1 `.t-d1i` com o brilho `.luz` e visual à direita. Servidor.
 * SEM Reveal e SEM fade: tudo está no HTML (nada acima da dobra depende de JS).
 */
export function PageHero({
  kicker,
  title,
  lede,
  breadcrumbs,
  visual = "arco",
  numeral,
  figure,
  actions,
  className,
}: PageHeroProps) {
  const showVisual =
    (visual === "figure" && figure) || (visual === "numeral" && numeral) || visual === "arco";

  return (
    <Section
      tone="osso"
      spacing="none"
      className={cn("pb-14 pt-8 tab:pb-20 desk:pb-24", className)}
    >
      <Container>
        {breadcrumbs && (
          <div className="mb-2">
            <Breadcrumbs items={breadcrumbs} />
          </div>
        )}
        <FioRule double reveal={false} />

        <div className="grid12 mt-10 items-end tab:mt-14">
          <div className={cn("pg-text", !showVisual && "pg-text--wide")}>
            {kicker && <Eyebrow className="mb-3">{kicker}</Eyebrow>}
            <DisplayHeading
              level={1}
              size="d1i"
              className="max-w-[18ch] [text-wrap:balance] tab:max-w-none"
            >
              {title}
            </DisplayHeading>
            {lede && <p className="t-lead mt-6 max-w-leitura tab:mt-8">{lede}</p>}
            {actions && (
              <div className="mt-8 flex flex-wrap items-center gap-3 tab:mt-10">{actions}</div>
            )}
          </div>

          {showVisual && (
            <div className={cn("pg-fig mt-12 tab:mt-0", visual !== "figure" && "hidden tab:block")}>
              {visual === "figure" && figure && <Figure priority {...figure} />}
              {visual === "numeral" && numeral && (
                <div className="flex justify-end">
                  <Numeral size="xl">{numeral}</Numeral>
                </div>
              )}
              {visual === "arco" && (
                <div className="arch-line mx-auto max-w-[360px] desk:mr-0">
                  <svg
                    viewBox="0 0 1072 1100"
                    preserveAspectRatio="xMidYMid meet"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path pathLength={1} d="M1.5 1100V536A534.5 534.5 0 0 1 1070.5 536V1100" />
                  </svg>
                  <Monogram size={96} className="arch-mono" />
                </div>
              )}
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
}
