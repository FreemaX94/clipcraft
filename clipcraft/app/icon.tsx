import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

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
          background: "linear-gradient(135deg, #0a0a0a 0%, #1f1f1f 100%)",
          borderRadius: 12,
          fontSize: 40,
          lineHeight: 1,
        }}
      >
        🎬
      </div>
    ),
    { ...size },
  );
}
