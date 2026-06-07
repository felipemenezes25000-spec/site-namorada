"use client";

import { MessageCircle, Phone, Mail, Instagram, ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { whatsappLink, waMessages } from "@/lib/whatsapp";
import { track } from "@/lib/analytics";
import { Reveal } from "@/components/ui/reveal";

const methods = [
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "Resposta rápida e sem compromisso",
    href: whatsappLink(waMessages.default),
    event: "whatsapp_click" as const,
    accent: true,
  },
  {
    icon: Phone,
    label: "Telefone",
    value: siteConfig.phoneDisplay,
    href: `tel:+${siteConfig.phone}`,
    event: "phone_click" as const,
  },
  {
    icon: Mail,
    label: "E-mail",
    value: siteConfig.email,
    href: `mailto:${siteConfig.email}`,
    event: null,
  },
  {
    icon: Instagram,
    label: "Instagram",
    value: siteConfig.instagram,
    href: siteConfig.instagramUrl,
    event: "instagram_click" as const,
  },
];

export function ContactMethods() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {methods.map((m, i) => {
        const Icon = m.icon;
        const external = m.href.startsWith("http");
        return (
          <Reveal key={m.label} delay={i * 0.06}>
            <a
              href={m.href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              onClick={() => m.event && track(m.event, { location: "contact_page" })}
              className="group flex h-full items-center justify-between gap-4 rounded-3xl border border-brand-ink/[0.07] bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-gold/40 hover:shadow-lift"
            >
              <span className="flex items-center gap-4">
                <span
                  className={
                    "flex size-12 items-center justify-center rounded-2xl transition-colors " +
                    (m.accent
                      ? "bg-[#1F8C4D]/10 text-[#1F8C4D] group-hover:bg-[#1F8C4D] group-hover:text-white"
                      : "bg-brand-green/[0.07] text-brand-green group-hover:bg-brand-green group-hover:text-brand-bone")
                  }
                >
                  <Icon className="size-5" strokeWidth={1.7} />
                </span>
                <span>
                  <span className="block font-display text-lg text-brand-green">{m.label}</span>
                  <span className="block text-sm text-brand-ink/60">{m.value}</span>
                </span>
              </span>
              <ArrowUpRight className="size-5 text-brand-gold transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </Reveal>
        );
      })}
    </div>
  );
}
