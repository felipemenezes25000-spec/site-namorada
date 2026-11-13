"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { siteConfig, locale, localeTexto } from "@/lib/site-config";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { buttonClasses } from "./button";
import { MapCTA } from "./cta";
import { MapPinIcon } from "./icons";
import styles from "./map-facade.module.css";

/** Altura mínima do arco, em px. Abaixo disso o pino e o rótulo do mapa ficam cortados. */
const ALTURA_MINIMA = 220;

/**
 * Fachada do mapa (contrato do base). Ilha de cliente: mostra o endereço num arco com o botão
 * "Ver mapa". O iframe do Google Maps só é montado depois do clique, então a página carrega sem
 * nenhuma requisição a google.com, gstatic ou googleapis, e o clique é o gesto que abre o mapa.
 * O botão "Como chegar" (MapCTA, abre o Google Maps em nova aba) continua logo abaixo.
 *
 * Props:
 *  - `location` (obrigatória): onde está, vira `eventParams.location` ("location_section",
 *    "contact_map"…). O clique em "Ver mapa" dispara `cta_click` com `target: "map_embed"`;
 *  - `tone`: "claro" (padrão, seção osso/papel/areia) ou "escuro" (seção noite/verde). Só troca
 *    a variante dos botões; as demais cores vêm das variáveis do tom da seção;
 *  - `minHeight`: altura mínima em px no celular (padrão 320; nunca menos de 220). A partir de
 *    1100px o arco tem no mínimo 32rem, ou preenche a célula da grade se ela for maior;
 *  - `showDirections`: mostra o MapCTA "Como chegar" abaixo do arco (padrão true). Passe false
 *    quando a seção já tem esse botão ao lado;
 *  - `className`: classes extras na raiz.
 *
 * Exemplo: `<MapFacade location="contact_map" tone="escuro" />`
 */
export function MapFacade({
  location,
  tone = "claro",
  minHeight = 320,
  showDirections = true,
  className,
}: {
  location: string;
  tone?: "claro" | "escuro";
  minHeight?: number;
  showDirections?: boolean;
  className?: string;
}) {
  const [aberto, setAberto] = useState(false);
  const quadroRef = useRef<HTMLIFrameElement>(null);
  const url = siteConfig.address.mapsEmbedUrl;
  const alto = Math.max(ALTURA_MINIMA, Math.round(minHeight));

  // Depois do clique o botão some: o foco vai para o mapa, para o teclado seguir de onde parou.
  useEffect(() => {
    if (aberto) quadroRef.current?.focus({ preventScroll: true });
  }, [aberto]);

  const abrir = () => {
    track("cta_click", { location, target: "map_embed" });
    setAberto(true);
  };

  return (
    <div
      className={cn(styles.root, className)}
      style={{ "--mf-min": `${alto}px` } as CSSProperties}
    >
      <div className={styles.arco}>
        {aberto && url ? (
          <iframe
            ref={quadroRef}
            className={styles.quadro}
            src={url}
            title={`Mapa: ${locale.ruaNumero}, ${localeTexto("bairroRegiaoCidade")}`}
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        ) : (
          <div className={styles.conteudo}>
            <MapPinIcon size={28} className={styles.pino} />
            <p className={cn("t-label", styles.rua)}>{locale.ruaNumero}</p>
            <p className={cn("t-sm", styles.local)}>{localeTexto("bairroRegiaoCidade")}</p>
            {url ? (
              <>
                <button
                  type="button"
                  className={buttonClasses(tone === "escuro" ? "contorno-claro" : "contorno", "md")}
                  onClick={abrir}
                >
                  Ver mapa
                </button>
                <p className={cn("t-cap", styles.aviso)}>
                  O mapa só é carregado do Google depois do seu toque.
                </p>
              </>
            ) : null}
          </div>
        )}
      </div>
      {showDirections ? (
        <div className={styles.acoes}>
          <MapCTA location={location} variant={tone === "escuro" ? "ouro" : "primario"} />
        </div>
      ) : null}
    </div>
  );
}
