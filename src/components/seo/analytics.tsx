"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { getConsent, subscribeConsent, type ConsentState } from "./cookie-consent";
import { captureAttribution } from "@/lib/attribution";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

/**
 * Medição com Google Consent Mode v2 (LGPD-friendly):
 *
 *  - As tags do GOOGLE (GA4/GTM) carregam SEMPRE, porém com todo o
 *    armazenamento negado por padrão (`consent default: denied`) — nenhum
 *    cookie é gravado sem autorização. Ao aceitar o banner, disparamos
 *    `consent update: granted`. Isso permite ao Google Ads MODELAR conversões
 *    de quem ignora/recusa o banner (pings sem cookies), em vez de perder
 *    100% da medição como no modelo anterior (opt-in que não injetava nada).
 *
 *  - O META PIXEL não tem equivalente ao Consent Mode; continua estritamente
 *    opt-in: só é injetado após o aceite.
 */
export function Analytics() {
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    // Guarda gclid/UTM da visita (independe de consentimento de cookies:
    // é dado de 1ª parte só enviado com o formulário, que tem aceite próprio).
    captureAttribution();

    function apply(state: ConsentState) {
      const ok = state === "accepted";
      setConsented(ok);
      // Atualiza o Consent Mode das tags Google já carregadas.
      window.gtag?.("consent", "update", {
        ad_storage: ok ? "granted" : "denied",
        ad_user_data: ok ? "granted" : "denied",
        ad_personalization: ok ? "granted" : "denied",
        analytics_storage: ok ? "granted" : "denied",
      });
    }
    apply(getConsent());
    return subscribeConsent(apply);
  }, []);

  if (!GA_ID && !GTM_ID && !PIXEL_ID) return null;

  return (
    <>
      {(GA_ID || GTM_ID) && (
        <>
          {/* Consent Mode v2: o default 'denied' PRECISA entrar no dataLayer
              antes de qualquer tag do Google processar a fila. */}
          <Script id="consent-default" strategy="beforeInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  wait_for_update: 500
});
gtag('set', 'ads_data_redaction', true);
gtag('set', 'url_passthrough', true);`}
          </Script>

          {GA_ID && (
            <>
              <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
                strategy="afterInteractive"
              />
              <Script id="ga4-init" strategy="afterInteractive">
                {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}', { anonymize_ip: true });`}
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
