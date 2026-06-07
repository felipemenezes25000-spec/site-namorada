"use client";

import { MapPin, Clock, Navigation, MessageCircle, Phone } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { whatsappLink, waMessages } from "@/lib/whatsapp";
import { track } from "@/lib/analytics";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

export function LocationSection() {
  const hasMap = Boolean(siteConfig.address.mapsEmbedUrl);
  return (
    <section id="localizacao" className="section-y bg-brand-bone">
      <div className="container">
        <SectionHeading
          align="left"
          eyebrow="Localização"
          title="Um espaço acolhedor, pensado para o seu conforto"
          description={`Atendimento em ${siteConfig.region}. Venha conhecer ou fale com a Dra. Ana para combinar o melhor horário.`}
          className="max-w-3xl"
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-12">
          {/* Informações */}
          <Reveal className="lg:col-span-5" y={24}>
            <div className="surface flex h-full flex-col gap-7 p-7 sm:p-9">
              <div className="flex gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-green/[0.07] text-brand-green">
                  <MapPin className="size-5" strokeWidth={1.6} />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-eyebrow text-brand-gold-ink">Endereço</p>
                  <p className="mt-1 leading-relaxed text-brand-ink/80">{siteConfig.address.full}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-green/[0.07] text-brand-green">
                  <Clock className="size-5" strokeWidth={1.6} />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-eyebrow text-brand-gold-ink">Horários</p>
                  <ul className="mt-1 space-y-0.5 text-brand-ink/80">
                    {siteConfig.hours.map((h) => (
                      <li key={h.days}>
                        <span className="text-brand-ink/55">{h.days}:</span> {h.time}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-green/[0.07] text-brand-green">
                  <Phone className="size-5" strokeWidth={1.6} />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-eyebrow text-brand-gold-ink">Contato</p>
                  <a
                    href={`tel:+${siteConfig.phone}`}
                    onClick={() => track("phone_click", { location: "location_section" })}
                    className="mt-1 block text-brand-ink/80 hover:text-brand-green"
                  >
                    {siteConfig.phoneDisplay}
                  </a>
                </div>
              </div>

              <div className="mt-auto flex flex-col gap-3 pt-2 sm:flex-row">
                <ButtonLink
                  href={siteConfig.address.mapsDirectionsUrl}
                  external
                  variant="primary"
                  size="md"
                  className="flex-1"
                  onClick={() => track("map_click", { location: "location_section" })}
                >
                  <Navigation className="size-4" strokeWidth={1.7} />
                  Como chegar
                </ButtonLink>
                <ButtonLink
                  href={whatsappLink(waMessages.default)}
                  external
                  variant="whatsapp"
                  size="md"
                  className="flex-1"
                  onClick={() => track("whatsapp_click", { location: "location_section" })}
                >
                  <MessageCircle className="size-4" strokeWidth={1.7} />
                  Agendar
                </ButtonLink>
              </div>
            </div>
          </Reveal>

          {/* Mapa */}
          <Reveal className="lg:col-span-7" y={24} delay={0.08}>
            <div className="relative h-full min-h-[20rem] overflow-hidden rounded-3xl border border-brand-ink/[0.07] shadow-card">
              {hasMap ? (
                <iframe
                  src={siteConfig.address.mapsEmbedUrl}
                  title={`Localização — ${siteConfig.doctorName}`}
                  className="size-full"
                  style={{ border: 0, minHeight: "20rem" }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              ) : (
                <div className="texture-grain flex size-full flex-col items-center justify-center gap-4 bg-gradient-to-br from-brand-mint via-brand-beige to-brand-mint/60 px-6 py-16 text-center">
                  <span className="flex size-16 items-center justify-center rounded-full bg-white/70 text-brand-green shadow-soft">
                    <MapPin className="size-7" strokeWidth={1.5} />
                  </span>
                  <p className="max-w-xs text-sm text-brand-green/70">
                    Mapa do consultório. Cole o link de incorporação do Google Maps em
                    <code className="mx-1 rounded bg-white/70 px-1 text-xs">site-config.ts</code>
                    para exibir aqui.
                  </p>
                  <ButtonLink
                    href={siteConfig.address.mapsDirectionsUrl}
                    external
                    variant="secondary"
                    size="sm"
                    onClick={() => track("map_click", { location: "location_map_placeholder" })}
                  >
                    <Navigation className="size-4" strokeWidth={1.7} />
                    Abrir no Google Maps
                  </ButtonLink>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
