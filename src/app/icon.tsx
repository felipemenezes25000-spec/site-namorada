import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** Favicon gerado: monograma AB (verde + dourado) sobre off-white. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FCFCFC",
          borderRadius: 14,
          fontFamily: "Georgia, serif",
          fontSize: 40,
          fontWeight: 600,
          letterSpacing: -1,
        }}
      >
        <span style={{ color: "#22513A" }}>A</span>
        <span style={{ color: "#B69050" }}>B</span>
      </div>
    ),
    { ...size },
  );
}
