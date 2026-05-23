import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const alt = "ClipCraft — Convert videos in your browser. Zero upload.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)",
          color: "white",
          padding: 80,
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 36,
            fontSize: 36,
            opacity: 0.85,
          }}
        >
          <span style={{ fontSize: 64 }}>🎬</span>
          <span style={{ fontWeight: 600, letterSpacing: -1 }}>ClipCraft</span>
        </div>
        <div
          style={{
            fontSize: 76,
            fontWeight: 700,
            letterSpacing: -2,
            lineHeight: 1.1,
            textAlign: "center",
            maxWidth: 1000,
          }}
        >
          Convert, compress, GIF-ify videos.
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 40,
            color: "#a1a1aa",
            letterSpacing: -1,
            textAlign: "center",
          }}
        >
          Right in your browser. Zero upload.
        </div>
        <div
          style={{
            marginTop: 64,
            display: "flex",
            gap: 24,
            fontSize: 24,
            color: "#71717a",
          }}
        >
          <span>🔒 No upload</span>
          <span>·</span>
          <span>⚡ Instant</span>
          <span>·</span>
          <span>🎁 Forever free</span>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
