import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

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
          background: "#2b1a12",
          color: "#f7d5ac",
          fontSize: 84,
          fontFamily: "Georgia, serif",
          fontWeight: 700,
          letterSpacing: "-0.04em",
        }}
      >
        NV
      </div>
    ),
    { ...size },
  );
}
