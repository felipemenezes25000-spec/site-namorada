"use client";

import { useEffect } from "react";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { DisplayHeading } from "@/components/ui/display-heading";
import { Button } from "@/components/ui/button";
import { WhatsAppCTA } from "@/components/ui/cta";
import { Logo, Symbol } from "@/components/brand/logo";
import { waMessages } from "@/lib/whatsapp";

/**
 * Erro inesperado (DESIGN.md 5.13): mesmo molde do 404, com chamada para o
 * WhatsApp. Fica fora do cabeçalho e do rodapé do site de propósito: se o erro
 * veio da moldura, a página precisa continuar de pé sozinha.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main id="conteudo">
      <Section tone="osso" spacing="none" className="min-h-[100svh] py-8">
        <Container>
          <Logo />
          <div className="grid12 items-center py-16 tab:py-24">
            <div className="min-w-0 tab:col-span-7">
              <DisplayHeading level={1} size="d1i">
                Algo não saiu como esperado
              </DisplayHeading>
              <p className="t-lead mt-6 max-w-leitura">
                Não conseguimos abrir esta página agora. Tente carregar de novo. Se preferir, fale
                com a Dra. Ana pelo WhatsApp.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button variant="primario" onClick={() => reset()}>
                  Tentar de novo
                </Button>
                <WhatsAppCTA
                  location="error_page"
                  variant="contorno"
                  message={waMessages.default}
                />
              </div>
              <p className="mt-4">
                {/*
                  <a> comum, e não <Link>, de propósito: a navegação do Link seria feita pelo
                  roteador do cliente, que pode estar com o estado quebrado depois do erro.
                  Recarregar o documento inteiro devolve o site a um estado limpo.
                */}
                {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                <a href="/" className="link t-label inline-flex min-h-[44px] items-center">
                  Voltar ao início
                </a>
              </p>
            </div>
            <div className="hidden tab:col-span-5 tab:block">
              <Symbol size={340} className="ml-auto h-auto w-full max-w-[340px]" />
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}
