import { siteConfig } from "@/lib/site-config";
import {
  whatsappLink,
  waMessages,
  waMessageForIntent,
  waIntentForMessage,
  type WaIntent,
} from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import { buttonClasses, type ButtonSize, type ButtonVariant } from "./button";
import { TrackedLink } from "./tracked-link";
import { CalendarIcon, MapPinIcon, PhoneIcon, WhatsAppIcon } from "./icons";

/**
 * VOCABULÁRIO FECHADO de rótulos de CTA (DESIGN.md 4.2). Todo botão ou link de WhatsApp,
 * telefone, mapa e agendamento usa UM destes textos; não invente variações ("Agendar",
 * "Falar com a Dra.", "Marcar consulta"…). O ícone sozinho leva o mesmo texto no nome acessível.
 *  - WhatsApp que leva a marcar: "Agendar pelo WhatsApp" (padrão de WhatsAppCTA);
 *  - WhatsApp que só tira dúvida (medo, valores, contato…): "Tirar dúvidas no WhatsApp";
 *  - WhatsApp de urgência (/urgencia-odontologica): "Falar agora pelo WhatsApp";
 *  - o rótulo do WhatsApp sai da intenção do botão (agendar, duvidas, urgencia, continuar), que também
 *    escolhe a mensagem: rótulo e mensagem nunca se contradizem (src/lib/whatsapp.ts);
 *  - formulário de agendamento: "Preencher formulário" (padrão de AgendarCTA);
 *  - mapa: "Como chegar" (padrão de MapCTA); telefone: "Ligar" (padrão de PhoneCTA);
 *  - EXCEÇÃO única: "Continuar no WhatsApp", só na etapa seguinte ao envio do formulário.
 */
export const CTA_AGENDAR_WHATSAPP = "Agendar pelo WhatsApp";
export const CTA_DUVIDAS_WHATSAPP = "Tirar dúvidas no WhatsApp";
export const CTA_URGENCIA_WHATSAPP = "Falar agora pelo WhatsApp";
export const CTA_FORMULARIO = "Preencher formulário";
export const CTA_COMO_CHEGAR = "Como chegar";
export const CTA_LIGAR = "Ligar";
/** Exceção: depois do envio do formulário (/agendamento e /obrigado), para seguir a conversa. */
export const CTA_CONTINUAR_WHATSAPP = "Continuar no WhatsApp";

export const CTA_LABELS = {
  agendarWhatsapp: CTA_AGENDAR_WHATSAPP,
  duvidasWhatsapp: CTA_DUVIDAS_WHATSAPP,
  urgenciaWhatsapp: CTA_URGENCIA_WHATSAPP,
  formulario: CTA_FORMULARIO,
  comoChegar: CTA_COMO_CHEGAR,
  ligar: CTA_LIGAR,
  continuarWhatsapp: CTA_CONTINUAR_WHATSAPP,
} as const;

const ROTULOS_PERMITIDOS: readonly string[] = Object.values(CTA_LABELS);

/** Rótulo de cada intenção do WhatsApp. */
export const WA_LABELS: Readonly<Record<WaIntent, string>> = {
  agendar: CTA_AGENDAR_WHATSAPP,
  duvidas: CTA_DUVIDAS_WHATSAPP,
  urgencia: CTA_URGENCIA_WHATSAPP,
  continuar: CTA_CONTINUAR_WHATSAPP,
};

/** Em desenvolvimento, avisa quando alguém foge do vocabulário fechado. Não faz nada em produção. */
function confereRotulo(label: string | undefined, origem: string) {
  if (process.env.NODE_ENV === "production" || label === undefined) return;
  if (!ROTULOS_PERMITIDOS.includes(label)) {
    console.warn(
      `[cta] rótulo fora do vocabulário em ${origem}: "${label}". Use CTA_LABELS (src/components/ui/cta.tsx).`,
    );
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

/**
 * Botão de WhatsApp. A intenção define rótulo e mensagem: `intent="duvidas"` sozinho já dá
 * "Tirar dúvidas no WhatsApp" com a mensagem de dúvida; com `message` e sem `intent`, a intenção é
 * deduzida da mensagem (pedir para agendar, urgência ou conversa). `label` só para a exceção
 * "Continuar no WhatsApp" do formulário.
 */
export function WhatsAppCTA({
  location,
  intent: intentProp,
  message: messageProp,
  label: labelProp,
  compactLabel,
  variant = "primario",
  size = "md",
  className,
  block,
  iconOnly,
}: BaseProps & {
  intent?: WaIntent;
  message?: string;
  label?: string;
  /** Rótulo curto (barra do celular, cabeçalho estreito). O nome acessível segue completo. */
  compactLabel?: string;
  iconOnly?: boolean;
}) {
  const message = messageProp ?? (intentProp ? waMessageForIntent[intentProp] : waMessages.default);
  const intent = intentProp ?? waIntentForMessage(message);
  const label = labelProp ?? WA_LABELS[intent];
  confereRotulo(label, "WhatsAppCTA");
  if (process.env.NODE_ENV !== "production" && labelProp && labelProp !== WA_LABELS[intent]) {
    console.warn(
      `[cta] rótulo "${labelProp}" não combina com a mensagem do WhatsApp em ${location}.`,
    );
  }
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
