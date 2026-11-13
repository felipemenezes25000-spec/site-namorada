import { siteConfig } from "@/lib/site-config";
import { whatsappLink, waMessages } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import { buttonClasses, type ButtonSize, type ButtonVariant } from "./button";
import { TrackedLink } from "./tracked-link";
import { CalendarIcon, MapPinIcon, PhoneIcon, WhatsAppIcon } from "./icons";

/**
 * VOCABULÁRIO FECHADO de rótulos de CTA (DESIGN.md 4.2). Todo botão ou link de WhatsApp,
 * telefone, mapa e agendamento usa UM destes textos; não invente variações ("Agendar",
 * "Falar com a Dra.", "Marcar consulta"…). O ícone sozinho leva o mesmo texto no nome acessível.
 *  - WhatsApp que leva a marcar: "Agendar pelo WhatsApp" (padrão de WhatsAppCTA);
 *  - WhatsApp que só tira dúvida (medo, valores, primeira consulta…): "Tirar dúvidas no WhatsApp";
 *  - formulário de agendamento: "Preencher formulário" (padrão de AgendarCTA);
 *  - mapa: "Como chegar" (padrão de MapCTA); telefone: "Ligar" (padrão de PhoneCTA);
 *  - EXCEÇÃO única: "Continuar no WhatsApp", só na etapa seguinte ao envio do formulário.
 */
export const CTA_AGENDAR_WHATSAPP = "Agendar pelo WhatsApp";
export const CTA_DUVIDAS_WHATSAPP = "Tirar dúvidas no WhatsApp";
export const CTA_FORMULARIO = "Preencher formulário";
export const CTA_COMO_CHEGAR = "Como chegar";
export const CTA_LIGAR = "Ligar";
/** Exceção: depois do envio do formulário (/agendamento e /obrigado), para seguir a conversa. */
export const CTA_CONTINUAR_WHATSAPP = "Continuar no WhatsApp";

export const CTA_LABELS = {
  agendarWhatsapp: CTA_AGENDAR_WHATSAPP,
  duvidasWhatsapp: CTA_DUVIDAS_WHATSAPP,
  formulario: CTA_FORMULARIO,
  comoChegar: CTA_COMO_CHEGAR,
  ligar: CTA_LIGAR,
  continuarWhatsapp: CTA_CONTINUAR_WHATSAPP,
} as const;

const ROTULOS_PERMITIDOS: readonly string[] = Object.values(CTA_LABELS);

/** Em desenvolvimento, avisa quando alguém foge do vocabulário fechado. Não faz nada em produção. */
function confereRotulo(label: string | undefined, origem: string) {
  if (process.env.NODE_ENV === "production" || label === undefined) return;
  if (!ROTULOS_PERMITIDOS.includes(label)) {
    console.warn(`[cta] rótulo fora do vocabulário em ${origem}: "${label}". Use CTA_LABELS (src/components/ui/cta.tsx).`);
  }
}

/**
 * As quatro chamadas para ação do site (DESIGN.md 4.2). TODO link de WhatsApp,
 * telefone, mapa e agendamento passa por aqui: assim todo clique é medido, com
 * os nomes de evento e o parâmetro `location` de sempre.
 */
interface BaseProps {
  /** Onde o botão está (vira eventParams.location): "hero", "header", "mobile_bar"… */
  location: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  /** Ocupa a largura toda do contêiner. */
  block?: boolean;
}

export function WhatsAppCTA({
  location,
  message = waMessages.default,
  label = CTA_AGENDAR_WHATSAPP,
  compactLabel,
  variant = "primario",
  size = "md",
  className,
  block,
  iconOnly,
}: BaseProps & {
  message?: string;
  label?: string;
  /** Rótulo curto abaixo de 375px (só na barra do celular). O nome acessível segue completo. */
  compactLabel?: string;
  iconOnly?: boolean;
}) {
  confereRotulo(label, "WhatsAppCTA");
  return (
    <TrackedLink
      href={whatsappLink(message)}
      event="whatsapp_click"
      eventParams={{ location }}
      external
      aria-label={compactLabel || iconOnly ? label : undefined}
      className={buttonClasses(variant, size, cn(block && "btn-block", className))}
    >
      <WhatsAppIcon />
      {iconOnly ? null : compactLabel ? (
        <>
          <span className="cta-full">{label}</span>
          <span className="cta-compact" aria-hidden="true">
            {compactLabel}
          </span>
        </>
      ) : (
        label
      )}
    </TrackedLink>
  );
}

export function PhoneCTA({
  location,
  variant = "contorno",
  size = "md",
  className,
  block,
  iconOnly,
  as = "botao",
  label,
}: BaseProps & {
  iconOnly?: boolean;
  /** "botao" (padrão) ou "texto": "Ligar" + número, sublinhado, para linhas de apoio. */
  as?: "botao" | "texto";
  /** Troca o conteúdo inteiro. Sem `label`: "Ligar" seguido do número. */
  label?: string;
}) {
  const href = `tel:+${siteConfig.phone}`;
  const conteudo = label ?? (
    <span>
      {CTA_LIGAR} <span className="nums">{siteConfig.phoneDisplay}</span>
    </span>
  );
  if (as === "texto") {
    return (
      <TrackedLink
        href={href}
        event="phone_click"
        eventParams={{ location }}
        className={cn("link nums inline-flex min-h-[44px] items-center", className)}
      >
        {conteudo}
      </TrackedLink>
    );
  }
  return (
    <TrackedLink
      href={href}
      event="phone_click"
      eventParams={{ location }}
      aria-label={iconOnly ? `Ligar para ${siteConfig.phoneDisplay}` : undefined}
      className={buttonClasses(
        variant,
        size,
        cn(iconOnly && "btn-icone", block && "btn-block", className),
      )}
    >
      <PhoneIcon />
      {iconOnly ? null : conteudo}
    </TrackedLink>
  );
}

export function MapCTA({
  location,
  label = CTA_COMO_CHEGAR,
  variant = "primario",
  size = "md",
  className,
  block,
}: BaseProps & { label?: string }) {
  confereRotulo(label, "MapCTA");
  return (
    <TrackedLink
      href={siteConfig.address.mapsDirectionsUrl}
      event="map_click"
      eventParams={{ location }}
      external
      className={buttonClasses(variant, size, cn(block && "btn-block", className))}
    >
      <MapPinIcon />
      {label}
    </TrackedLink>
  );
}

/**
 * Link para o formulário de agendamento. Com `treatment` (slug de /tratamentos/[slug]) o
 * destino é `/agendamento?tratamento=<slug>` e o formulário abre com o tratamento escolhido
 * (slug inválido é ignorado por quem lê). O slug também vai no evento `scheduling_intent`.
 * Exemplo: `<AgendarCTA location="treatment_hero" treatment="implante" />`.
 */
export function AgendarCTA({
  location,
  treatment,
  label = CTA_FORMULARIO,
  variant = "contorno",
  size = "md",
  className,
  block,
  iconOnly,
}: BaseProps & {
  /** Slug do tratamento (ex.: "implante"). Omita fora de páginas de tratamento. */
  treatment?: string;
  label?: string;
  iconOnly?: boolean;
}) {
  confereRotulo(label, "AgendarCTA");
  const href = treatment
    ? `/agendamento?tratamento=${encodeURIComponent(treatment)}`
    : "/agendamento";
  return (
    <TrackedLink
      href={href}
      event="scheduling_intent"
      eventParams={{ location, treatment }}
      aria-label={iconOnly ? label : undefined}
      className={buttonClasses(
        variant,
        size,
        cn(iconOnly && "btn-icone", block && "btn-block", className),
      )}
    >
      <CalendarIcon />
      {iconOnly ? null : label}
    </TrackedLink>
  );
}
