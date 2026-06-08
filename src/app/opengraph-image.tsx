import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site-config";

// Runtime node (padrão) para permitir prerender estático da imagem.
export const alt = `${siteConfig.doctorName} — ${siteConfig.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Open Graph gerado dinamicamente com a identidade da marca.
 * Tipografia serifada (system serif no runtime do OG) + verde/dourado.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "linear-gradient(135deg, #22513A 0%, #1B4030 55%, #15301F 100%)",
          padding: "72px 80px",
          fontFamily: "Georgia, serif",
          color: "#FCFCFC",
          position: "relative",
        }}
      >
        {/* monograma AB */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 84,
              height: 84,
              borderRadius: 24,
              border: "1.5px solid rgba(198,165,110,0.6)",
              fontSize: 44,
              letterSpacing: 2,
            }}
          >
            <span style={{ color: "#FCFCFC" }}>A</span>
            <span style={{ color: "#C6A56E" }}>B</span>
          </div>
          <div
            style={{
              fontFamily: "Arial, sans-serif",
              fontSize: 20,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "#C6A56E",
            }}
          >
            {siteConfig.title}
          </div>
        </div>

        {/* nome + frase */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 68, lineHeight: 1.05, maxWidth: 900 }}>
            {siteConfig.doctorName}
          </div>
          <div
            style={{
              fontFamily: "Arial, sans-serif",
              fontSize: 28,
              color: "rgba(252,252,252,0.78)",
              maxWidth: 820,
              lineHeight: 1.35,
            }}
          >
            Cuidado odontológico sem dor — a união entre saúde, estética e
            bem-estar.
          </div>
        </div>

        {/* rodapé */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontFamily: "Arial, sans-serif",
            fontSize: 22,
            color: "#C6A56E",
          }}
        >
          <div style={{ width: 40, height: 2, background: "#C6A56E" }} />
          {siteConfig.region}
        </div>
      </div>
    ),
    { ...size },
  );
}
