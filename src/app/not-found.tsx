import Link from "next/link";
import { Home, Stethoscope, MessageCircle } from "lucide-react";
import { whatsappLink, waMessages } from "@/lib/whatsapp";
import { ButtonLink } from "@/components/ui/button";
import { BrandSymbol } from "@/components/ui/logo";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[80vh] items-center overflow-hidden bg-gradient-to-b from-brand-beige/40 to-brand-bone pt-28 pb-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_50%_at_50%_0%,#dde8e1_0%,transparent_60%)]"
      />
      <div className="container text-center">
        <div className="mx-auto flex max-w-lg flex-col items-center">
          <BrandSymbol size={72} badge />
          <p className="eyebrow mt-8 justify-center">Página não encontrada</p>
          <h1 className="mt-4 font-display text-[clamp(4rem,16vw,8rem)] leading-none text-brand-green">
            404
          </h1>
          <p className="mt-4 max-w-md text-pretty text-lg leading-relaxed text-brand-ink/75">
            A página que você procura saiu para uma limpeza. Que tal voltar ao
            início ou conhecer os tratamentos da Dra. Ana?
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/" variant="primary" size="lg">
              <Home className="size-4" strokeWidth={1.7} />
              Voltar ao início
            </ButtonLink>
            <ButtonLink href="/tratamentos" variant="secondary" size="lg">
              <Stethoscope className="size-4" strokeWidth={1.7} />
              Ver tratamentos
            </ButtonLink>
          </div>
          <Link
            href={whatsappLink(waMessages.default)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-green hover:text-brand-gold"
          >
            <MessageCircle className="size-4" strokeWidth={1.7} />
            Ou fale pelo WhatsApp
          </Link>
        </div>
      </div>
    </section>
  );
}
