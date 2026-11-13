"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { getConsent, subscribeConsent, type ConsentState } from "./cookie-consent";
import { captureAttribution, syncAttributionConsent } from "@/lib/attribution";
import { GTM_ID } from "@/lib/analytics";

/*
 * Cada ID só vale se tiver o formato esperado: ele é gravado em script inline,
 * então um valor malformado no ambiente nunca vira código.
 */
function pick(value: string | undefined, pattern: RegExp): string | undefined {
  const v = value?.trim();
  return v && pattern.test(v) ? v : undefined;
}

const GA_ID = pick(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, /^G-[A-Z0-9]{4,20}$/);
const ADS_ID = pick(process.env.NEXT_PUBLIC_GOOGLE_ADS_ID, /^AW-\d{6,14}$/);
const PIXEL_ID = pick(process.env.NEXT_PUBLIC_META_PIXEL_ID, /^\d{5,20}$/);

/** Chave gravada por cookie-consent.tsx; o script inline abaixo lê o mesmo valor. */
const CONSENT_KEY = "abl_cookie_consent";

/**
 * Medição com Google Consent Mode v2 (LGPD):
 *
 *  - O padrão NEGADO é declarado antes de qualquer tag, num <script> inline do
 *    HTML renderizado no servidor (executa durante a leitura da página, antes de
 *    qualquer tag carregada depois da hidratação). Quem já aceitou em visita
 *    anterior recebe o `consent update: granted` no mesmo script.
 *  - Consent Mode avançado: com ID configurado, as tags do Google carregam para todos
 *    e, sem aceite, enviam só pings sem cookie (com URL, referrer e IP, que o Google
 *    usa para modelar conversões). Isso precisa constar na Política de Privacidade.
 *    A opção mais conservadora é injetar gtag.js/GTM só depois do aceite, como o Pixel.
 *  - O painel /admin nunca é medido.
 *  - Nenhuma tag é injetada sem ID configurado. Com GTM, o GA4 e o Ads devem ser
 *    configurados DENTRO do contêiner (carregar gtag.js direto também contaria
 *    cada visita duas vezes), e `track()` envia os eventos só ao dataLayer; sem GTM, só ao gtag.
 *  - O Meta Pixel não tem Consent Mode equivalente ao do Google: só entra depois
 *    do aceite; se o aceite for revogado, enviamos `fbq('consent','revoke')`.
 *  - Nenhum evento leva dado pessoal (ver `sanitizeParams` em lib/analytics.ts).
 */
export function Analytics() {
  const pathname = usePathname();
  const isAdmin = pathname === "/admin" || pathname?.startsWith("/admin/");
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    if (isAdmin) return;
    captureAttribution();

    function apply(state: ConsentState) {
      const ok = state === "accepted";
      setConsented(ok);
      // Medição nunca derruba a página: armazenamento bloqueado ou tag com defeito só desligam a medição.
      try {
        syncAttributionConsent(ok);
        const value = ok ? "granted" : "denied";
        window.gtag?.("consent", "update", {
          ad_storage: value,
          ad_user_data: value,
          ad_personalization: value,
          analytics_storage: value,
        });
        if (!ok) window.fbq?.("consent", "revoke");
      } catch {
        /* sem medição */
      }
    }
    apply(getConsent());
    return subscribeConsent(apply);
  }, [isAdmin]);

  const useGtm = Boolean(GTM_ID);
  const gtagId = useGtm ? undefined : GA_ID ?? ADS_ID;
  const hasGoogle = useGtm || Boolean(gtagId);

  if (isAdmin || (!hasGoogle && !PIXEL_ID)) return null;

  return (
    <>
      {hasGoogle && (
        <>
          <script
            id="consent-default"
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  wait_for_update: 500
});
gtag('set', 'ads_data_redaction', true);
gtag('set', 'url_passthrough', true);
try {
  if (window.localStorage.getItem('${CONSENT_KEY}') === 'accepted') {
    gtag('consent', 'update', {
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
      analytics_storage: 'granted'
    });
  }
} catch (e) {}`,
            }}
          />

          {gtagId && (
            <>
              <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${gtagId}`}
                strategy="afterInteractive"
              />
              <Script id="gtag-init" strategy="afterInteractive">
                {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());${GA_ID ? `\ngtag('config', '${GA_ID}');` : ""}${ADS_ID ? `\ngtag('config', '${ADS_ID}');` : ""}`}
              </Script>
            </>
          )}

          {GTM_ID && (
            <Script id="gtm-init" strategy="afterInteractive">
              {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
            </Script>
          )}
        </>
      )}

      {PIXEL_ID && consented && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('consent', 'grant');
fbq('init', '${PIXEL_ID}');
fbq('track', 'PageView');`}
        </Script>
      )}
    </>
  );
}
