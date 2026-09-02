import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** Provisional IMOVIX favicon — an "IX" mark in the brand colour. */
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
          background: "#e86a24",
          color: "#fff",
          fontSize: 17,
          fontWeight: 700,
          letterSpacing: -0.5,
          borderRadius: 7,
        }}
      >
        IX
      </div>
    ),
    { ...size },
  );
}
