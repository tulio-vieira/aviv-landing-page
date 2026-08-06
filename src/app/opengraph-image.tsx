import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

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
          background: "#BA2C47",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            color: "#fff",
          }}
        >
          <span style={{ fontSize: 130, fontWeight: 700 }}>aviv</span>
          <span style={{ fontSize: 130, fontWeight: 700, marginLeft: 24 }}>
            SDG
          </span>
        </div>
        <span
          style={{
            fontSize: 40,
            color: "#fff",
            opacity: 0.85,
            marginTop: 4,
            letterSpacing: 6,
          }}
        >
          EDITORIAL
        </span>
        <span
          style={{
            fontSize: 32,
            color: "#fff",
            marginTop: 40,
          }}
        >
          Serviços editoriais para o universo cristão
        </span>
      </div>
    ),
    { ...size }
  );
}
