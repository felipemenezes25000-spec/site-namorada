import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Ícone para iOS (tela inicial): monograma AB sobre verde da marca. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #22513A 0%, #15301F 100%)",
          fontFamily: "Georgia, serif",
          fontSize: 104,
          fontWeight: 600,
          letterSpacing: -2,
        }}
      >
        <span style={{ color: "#FCFCFC" }}>A</span>
        <span style={{ color: "#C6A56E" }}>B</span>
      </div>
    ),
    { ...size },
  );
}
