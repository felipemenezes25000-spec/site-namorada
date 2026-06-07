import Link from "next/link";
import { MapPin, Clock, MessageCircle, Instagram, Mail, Phone } from "lucide-react";
import { siteConfig, mainNav } from "@/lib/site-config";
import { whatsappLink, waMessages } from "@/lib/whatsapp";
import { treatments } from "@/lib/treatments";
import { BrandSymbol } from "@/components/ui/logo";

const legal = [
  { label: "Política de Privacidade", href: "/politica-de-privacidade" },
  { label: "Termos de Uso", href: "/termos-de-uso" },
];

export function Footer() {
  const year = 2026; // fixo para build determinístico; edite se necessário.
  return (
    <footer className="texture-grain relative overflow-hidden bg-brand-green-deep text-brand-bone">
      {/* brilho dourado sutil */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-brand-gold/10 blur-3xl"
      />
      <div className="container relative py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Marca */}
          <div className="lg:col-span-4">
            <Link href="/" aria-label="Início" className="inline-flex">
              <BrandSymbol size={56} badge />
            </Link>
            <p className="mt-5 font-display text-2xl text-brand-bone">
              {siteConfig.doctorName}
            </p>
            <p className="mt-1 text-sm uppercase tracking-eyebrow text-brand-gold-soft">
              {siteConfig.title} · {siteConfig.cro}
            </p>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-brand-bone/70">
              Cuidado odontológico humanizado, com planejamento individual e foco
              em naturalidade. Atendimento em {siteConfig.region}.
            </p>
          </div>

          {/* Navegação */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-semibold uppercase tracking-eyebrow text-brand-gold-soft">
              Navegação
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-brand-bone/75 transition-colors hover:text-brand-bone"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tratamentos */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-eyebrow text-brand-gold-soft">
              Tratamentos
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              {treatments.map((t) => (
                <li key={t.slug}>
                  <Link
                    href={`/tratamentos/${t.slug}`}
                    className="text-brand-bone/75 transition-colors hover:text-brand-bone"
                  >
                    {t.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contato */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-eyebrow text-brand-gold-soft">
              Contato
            </h3>
            <ul className="mt-5 space-y-4 text-sm text-brand-bone/80">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-brand-gold-soft" strokeWidth={1.6} />
                <span>{siteConfig.address.full}</span>
              </li>
              <li className="flex gap-3">
                <Clock className="mt-0.5 size-4 shrink-0 text-brand-gold-soft" strokeWidth={1.6} />
                <span>
                  {siteConfig.hours.map((h) => (
                    <span key={h.days} className="block">
                      {h.days}: {h.time}
                    </span>
                  ))}
                </span>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 size-4 shrink-0 text-brand-gold-soft" strokeWidth={1.6} />
                <a href={`tel:+${siteConfig.phone}`} className="hover:text-brand-bone">
                  {siteConfig.phoneDisplay}
                </a>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 size-4 shrink-0 text-brand-gold-soft" strokeWidth={1.6} />
                <a href={`mailto:${siteConfig.email}`} className="hover:text-brand-bone">
                  {siteConfig.email}
                </a>
              </li>
            </ul>
            <div className="mt-6 flex gap-3">
              <a
                href={whatsappLink(waMessages.default)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="inline-flex size-11 items-center justify-center rounded-full bg-brand-bone/10 text-brand-bone ring-1 ring-inset ring-brand-bone/15 transition hover:bg-brand-gold hover:text-brand-green-deep"
              >
                <MessageCircle className="size-5" strokeWidth={1.7} />
              </a>
              <a
                href={siteConfig.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="inline-flex size-11 items-center justify-center rounded-full bg-brand-bone/10 text-brand-bone ring-1 ring-inset ring-brand-bone/15 transition hover:bg-brand-gold hover:text-brand-green-deep"
              >
                <Instagram className="size-5" strokeWidth={1.7} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-brand-bone/10 pt-8 text-xs text-brand-bone/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.doctorName}. Todos os direitos reservados.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {legal.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-brand-bone">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
        <p className="mt-6 max-w-3xl text-[0.7rem] leading-relaxed text-brand-bone/65">
          Conteúdo de caráter informativo, sem promessa de resultados. Cada caso é
          avaliado individualmente. As imagens e depoimentos seguem as normas de
          publicidade odontológica.
        </p>
      </div>
    </footer>
  );
}
