import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/site-shell";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Numeral } from "@/components/ui/numeral";
import { DisplayHeading } from "@/components/ui/display-heading";
import { ButtonLink } from "@/components/ui/button";
import { WhatsAppCTA, CTA_DUVIDAS_WHATSAPP } from "@/components/ui/cta";
import { Symbol } from "@/components/brand/logo";
import { waMessages } from "@/lib/whatsapp";

/**
 * O Next já injeta `<meta name="robots" content="noindex">` em toda 404. O layout raiz declara
 * `index, follow`, que apareceria como segunda meta conflitante: aqui ela é zerada (null) para sobrar
 * uma só. Descrição e cartões sociais herdados falam da home, então também saem.
 */
export const metadata: Metadata = {
  title: "Página não encontrada",
  description: null,
  alternates: { canonical: null },
  robots: null,
  openGraph: null,
  twitter: null,
};

/** 404 (DESIGN.md 5.13): tom osso, alinhado à esquerda, 7/5. Mesmo molde do error.tsx. */
export default function NotFound() {
  return (
    <SiteShell>
      <Section tone="osso" className="min-h-[70vh]">
        <Container>
          <div className="grid12 items-center">
            <div className="min-w-0 tab:col-span-7">
              <Numeral size="xl">404</Numeral>
              <DisplayHeading level={1} size="d1i" className="mt-2">
                Página não encontrada
              </DisplayHeading>
              <p className="t-lead mt-6 max-w-leitura">
                A página que você procura saiu para uma limpeza. Que tal voltar ao início ou
                conhecer os tratamentos da Dra. Ana?
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <ButtonLink href="/" variant="primario">
                  Voltar ao início
                </ButtonLink>
                <ButtonLink href="/tratamentos" variant="contorno">
                  Ver tratamentos
                </ButtonLink>
              </div>
              <div className="mt-4">
                <WhatsAppCTA
                  location="not_found"
                  variant="texto"
                  message={waMessages.default}
                  label={CTA_DUVIDAS_WHATSAPP}
                />
              </div>
            </div>
            <div className="hidden tab:col-span-5 tab:block">
              <Symbol size={380} className="ml-auto h-auto w-full max-w-[380px]" />
            </div>
          </div>
        </Container>
      </Section>
    </SiteShell>
  );
}
