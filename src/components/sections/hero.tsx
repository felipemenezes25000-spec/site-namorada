import Image from "next/image";
import { ArrowRight, ShieldCheck, MapPin, HeartHandshake, CalendarCheck, Sparkles, Navigation } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { ButtonLink } from "@/components/ui/button";
import { HeroWhatsAppButton } from "./hero-whatsapp-button";

/**
 * Hero como Server Component: o H1 (LCP) é renderizado estático e visível —
 * sem gate de opacidade dependente de hidratação. A entrada é puramente CSS
 * (animate-fade-up + delay), que funciona sem JS e respeita prefers-reduced-motion
 * (desativado em globals.css). Apenas o CTA de WhatsApp é um client component leve.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden bg-brand-bone pt-28 sm:pt-32 lg:pt-40">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(120%_90%_at_85%_-10%,#dde8e1_0%,transparent_55%),radial-gradient(90%_70%_at_-10%_10%,#efe7da80_0%,transparent_50%)]"
      />
      <div className="container grid items-center gap-14 pb-20 lg:grid-cols-12 lg:gap-10 lg:pb-28">
        {/* Texto */}
        <div className="lg:col-span-6">
          <p
            className="eyebrow flex items-center gap-3 animate-fade-up"
            style={{ animationDelay: "0.05s" }}
          >
            <span className="inline-block h-px w-7 bg-brand-gold/70" />
            {siteConfig.title} · {siteConfig.cro}
          </p>

          {/* H1 estático = LCP imediato (sem animação que atrase o paint) */}
          <h1 className="mt-6 text-display-xl text-balance">
            Dentista particular em{" "}
            <span className="whitespace-nowrap italic text-brand-gold-ink">{siteConfig.neighborhood}</span>{" "}
            com atendimento acolhedor, claro e sem pressão.
          </h1>

          <p
            className="mt-6 max-w-prose2 text-pretty text-base leading-relaxed text-brand-ink/75 animate-fade-up sm:text-lg"
            style={{ animationDelay: "0.14s" }}
          >
            Consulta de 40 a 60 minutos com avaliação completa, explicação simples
            e plano de tratamento individualizado. Prevenção, restaurações,
            clareamento, cirurgia oral e urgências odontológicas.
          </p>

          <div
            className="mt-9 flex flex-col gap-3 animate-fade-up sm:flex-row sm:flex-wrap"
            style={{ animationDelay: "0.22s" }}
          >
            <HeroWhatsAppButton />
            <ButtonLink href="/tratamentos" variant="secondary" size="lg">
              Ver tratamentos
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.7} />
            </ButtonLink>
            <ButtonLink href={siteConfig.address.mapsDirectionsUrl} variant="secondary" size="lg" external>
              <Navigation className="size-4" strokeWidth={1.7} />
              Como chegar
            </ButtonLink>
          </div>

          <ul
            className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm text-brand-ink/75 animate-fade-up"
            style={{ animationDelay: "0.3s" }}
          >
            <li className="flex items-center gap-2">
              <HeartHandshake className="size-4 text-brand-green" strokeWidth={1.6} />
              Consulta sem linha de produção
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-brand-green" strokeWidth={1.6} />
              Diagnóstico antes de qualquer decisão
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="size-4 text-brand-green" strokeWidth={1.6} />
              {siteConfig.neighborhood}, {siteConfig.city}
            </li>
          </ul>

          {/* Microprovas — respostas rápidas às primeiras dúvidas do paciente */}
          <ul
            className="mt-6 flex flex-wrap gap-2 text-xs font-medium text-brand-green animate-fade-up"
            style={{ animationDelay: "0.36s" }}
          >
            {[
              siteConfig.cro,
              "Atendimento particular",
              "Crianças a partir de 7 anos",
              "Pix, débito e crédito",
            ].map((item) => (
              <li
                key={item}
                className="rounded-full border border-brand-gold/30 bg-brand-gold/[0.06] px-3 py-1"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Visual */}
        <div
          className="relative animate-fade-in lg:col-span-6"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="relative mx-auto max-w-md lg:max-w-none">
            {/* arco dourado — eco da curva da mandíbula da logo */}
            <svg
              aria-hidden
              viewBox="0 0 400 400"
              className="pointer-events-none absolute -inset-4 -z-0 h-[108%] w-[108%] text-brand-gold/25"
            >
              <path d="M40 120 C 40 300, 360 300, 360 120" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>

            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-brand-green/5 shadow-lift">
              <Image
                src="/dra-ana.webp"
                alt={`Foto profissional da ${siteConfig.doctorName}`}
                fill
                priority
                sizes="(min-width: 1024px) 36rem, (min-width: 640px) 28rem, 90vw"
                className="object-cover"
              />
            </div>

            {/* chip flutuante superior */}
            <div className="surface absolute -top-4 right-4 hidden items-center gap-2.5 rounded-2xl px-4 py-2.5 sm:flex lg:-right-5">
              <span className="flex size-9 items-center justify-center rounded-full bg-brand-gold/15 text-brand-gold-ink">
                <CalendarCheck className="size-4" strokeWidth={1.8} />
              </span>
              <span className="text-sm font-medium text-brand-green">
                Plano de tratamento com clareza
              </span>
            </div>

            {/* chip "odontologia sem dor" — destaque lateral esquerdo */}
            <div className="surface absolute top-1/2 left-4 hidden -translate-y-1/2 items-center gap-2.5 rounded-2xl px-4 py-2.5 sm:flex lg:-left-6">
              <span className="flex size-9 items-center justify-center rounded-full bg-brand-green/10 text-brand-green">
                <Sparkles className="size-4" strokeWidth={1.8} />
              </span>
              <span className="text-sm font-medium text-brand-green">
                Odontologia sem dor
              </span>
            </div>

            {/* chip credencial */}
            <div className="surface absolute -bottom-5 left-4 right-4 mx-auto flex max-w-xs items-center gap-3 rounded-2xl px-4 py-3 sm:-left-6 sm:right-auto">
              <span className="flex size-10 items-center justify-center rounded-full bg-brand-green/10 text-brand-green">
                <ShieldCheck className="size-5" strokeWidth={1.7} />
              </span>
              <span className="leading-tight">
                <span className="block font-display text-base text-brand-green">
                  {siteConfig.doctorName}
                </span>
                <span className="block text-xs text-brand-ink/65">
                  {siteConfig.title} · {siteConfig.cro}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
