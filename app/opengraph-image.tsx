import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "IMOVIX";

/** Social share preview card. Code-rendered, same technique as app/icon.tsx. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0D0D0D",
        }}
      >
        <div style={{ display: "flex", fontSize: 120, fontWeight: 800, letterSpacing: -4 }}>
          <span style={{ color: "#F7F4EF" }}>IMOV</span>
          <span style={{ color: "#E86A24" }}>IX</span>
        </div>
        <div style={{ display: "flex", marginTop: 28, fontSize: 34, color: "#A8A39B" }}>
          Venda mais apresentando melhor os seus imoveis
        </div>
      </div>
    ),
    { ...size },
  );
}
