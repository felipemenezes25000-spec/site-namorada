import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Clock, Home, Instagram } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { buildMetadata } from "@/lib/seo";
import { ThankYouActions } from "@/components/sections/thank-you-actions";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = buildMetadata({
  title: "Solicitação recebida",
  description: "Recebemos sua solicitação de agendamento.",
  path: "/obrigado",
  noindex: true,
});

type SearchParams = Promise<{ n?: string; t?: string }>;

export default async function ObrigadoPage({ searchParams }: { searchParams: SearchParams }) {
  const { n, t } = await searchParams;
  const name = (n || "").trim();
  const firstName = name.split(" ")[0] || "";
  const treatment = (t || "uma avaliação").trim();

  return (
    <section className="relative flex min-h-[80vh] items-center overflow-hidden bg-gradient-to-b from-brand-beige/40 to-brand-bone pt-28 pb-20 sm:pt-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_50%_at_50%_0%,#dde8e1_0%,transparent_60%)]"
      />
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <span className="mx-auto flex size-20 items-center justify-center rounded-full bg-brand-green/10 text-brand-green">
            <CheckCircle2 className="size-10" strokeWidth={1.5} />
          </span>

          <p className="eyebrow mt-8 justify-center text-center">Solicitação recebida</p>
          <h1 className="mt-4 text-display-lg text-balance">
            {firstName ? `Obrigada, ${firstName}!` : "Obrigada pelo contato!"}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-pretty text-lg leading-relaxed text-brand-ink/75">
            Recebemos sua solicitação de agendamento com a Dra. Ana. Em breve
            entraremos em contato para confirmar o melhor horário. Se preferir
            adiantar, é só continuar a conversa pelo WhatsApp.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ThankYouActions name={name || "Paciente"} treatment={treatment} />
            <ButtonLink href="/" variant="secondary" size="lg">
              <Home className="size-4" strokeWidth={1.7} />
              Voltar ao início
            </ButtonLink>
          </div>

          <div className="mx-auto mt-12 max-w-md rounded-3xl border border-brand-ink/[0.07] bg-white/70 p-6 text-left shadow-card">
            <p className="flex items-center gap-2 text-sm font-semibold text-brand-green">
              <Clock className="size-4 text-brand-gold" /> Próximos passos
            </p>
            <ol className="mt-3 space-y-2 text-sm text-brand-ink/70">
              <li>1. A Dra. Ana confirma o melhor dia e horário com você.</li>
              <li>2. Você recebe as orientações para a sua avaliação.</li>
              <li>3. É só comparecer — cuidamos do resto com calma.</li>
            </ol>
            <div className="mt-5 flex items-center gap-2 border-t border-brand-ink/[0.07] pt-4 text-sm text-brand-ink/60">
              <Instagram className="size-4 text-brand-gold" />
              Acompanhe também no Instagram:
              <Link href={siteConfig.instagramUrl} target="_blank" className="font-semibold text-brand-green hover:underline">
                {siteConfig.instagram}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
