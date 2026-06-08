import type { Metadata } from "next";
import { MessageCircle, Clock, MapPin, ShieldCheck, HeartHandshake, CheckCircle2 } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";
import { whatsappLink, waMessages } from "@/lib/whatsapp";
import { JsonLd } from "@/components/seo/json-ld";
import { PageHero } from "@/components/sections/page-hero";
import { AppointmentForm } from "@/components/forms/appointment-form";
import { Reveal } from "@/components/ui/reveal";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = buildMetadata({
  title: "Agendamento de avaliação",
  description:
    "Agende sua avaliação odontológica com a Dra. Ana Beatriz Lemos Souza. Preencha o formulário ou fale pelo WhatsApp — atendimento humanizado em [Cidade].",
  path: "/agendamento",
  keywords: [`agendar dentista em ${siteConfig.city}`, `avaliação odontológica em ${siteConfig.city}`],
});

const expect = [
  "Uma conversa tranquila para entender o que te trouxe",
  "Exame clínico completo, sem pressa",
  "Diagnóstico explicado em linguagem simples",
  "Plano de cuidado individual e transparente",
];

export default function AgendamentoPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Início", path: "/" },
          { name: "Agendamento", path: "/agendamento" },
        ])}
      />
      <PageHero
        eyebrow="Agendamento"
        title="Vamos marcar a sua avaliação"
        description="Preencha o formulário abaixo com tranquilidade. A Dra. Ana confirma com você o melhor dia e horário. Se preferir, fale direto pelo WhatsApp."
        breadcrumbs={[{ name: "Início", href: "/" }, { name: "Agendamento" }]}
      />

      <section className="section-y bg-brand-bone">
        <div className="container grid gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Formulário */}
          <div className="lg:col-span-7">
            <Reveal>
              <AppointmentForm />
            </Reveal>
          </div>

          {/* Aside */}
          <aside className="lg:col-span-5">
            <div className="lg:sticky lg:top-28 space-y-6">
              <Reveal delay={0.05}>
                <div className="rounded-3xl bg-brand-green p-7 text-brand-bone shadow-card">
                  <p className="eyebrow text-brand-gold-bright">Prefere conversar agora?</p>
                  <h2 className="mt-3 font-display text-2xl text-brand-bone">
                    Fale pelo WhatsApp em poucos toques
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-brand-bone/75">
                    Tire dúvidas ou agende diretamente com a Dra. Ana. Resposta com
                    atenção e sem pressão.
                  </p>
                  <ButtonLink
                    href={whatsappLink(waMessages.default)}
                    external
                    variant="gold"
                    size="md"
                    className="mt-5 w-full"
                  >
                    <MessageCircle className="size-4" strokeWidth={1.7} />
                    Falar pelo WhatsApp
                  </ButtonLink>
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <div className="surface p-7">
                  <h2 className="font-display text-2xl text-brand-green">O que esperar</h2>
                  <ul className="mt-4 space-y-3">
                    {expect.map((e) => (
                      <li key={e} className="flex items-start gap-3 text-sm text-brand-ink/75">
                        <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-brand-green" strokeWidth={1.7} />
                        {e}
                      </li>
                    ))}
                  </ul>

                  <dl className="mt-6 space-y-4 border-t border-brand-ink/[0.07] pt-6 text-sm">
                    <div className="flex gap-3">
                      <MapPin className="mt-0.5 size-4 shrink-0 text-brand-gold" strokeWidth={1.7} />
                      <div>
                        <dt className="font-semibold text-brand-green">Onde</dt>
                        <dd className="text-brand-ink/70">{siteConfig.address.full}</dd>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Clock className="mt-0.5 size-4 shrink-0 text-brand-gold" strokeWidth={1.7} />
                      <div>
                        <dt className="font-semibold text-brand-green">Horários</dt>
                        <dd className="text-brand-ink/70">
                          {siteConfig.hours.map((h) => (
                            <span key={h.days} className="block">{h.days}: {h.time}</span>
                          ))}
                        </dd>
                      </div>
                    </div>
                  </dl>

                  <div className="mt-6 flex items-center gap-4 rounded-2xl bg-brand-beige/40 p-4 text-xs text-brand-ink/60">
                    <span className="flex items-center gap-1.5"><ShieldCheck className="size-4 text-brand-green" /> Dados sigilosos</span>
                    <span className="flex items-center gap-1.5"><HeartHandshake className="size-4 text-brand-green" /> Sem compromisso</span>
                  </div>
                </div>
              </Reveal>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
