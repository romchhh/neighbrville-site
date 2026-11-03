import { ImageResponse } from "next/og";

export const alt =
  "NeighbrVille — local community experiences in London & Berlin";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#2b1a12",
          color: "#f5f0e8",
          padding: "64px 72px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            fontSize: 28,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            opacity: 0.85,
            fontFamily: "Helvetica, Arial, sans-serif",
          }}
        >
          <div
            style={{
              display: "flex",
              width: 18,
              height: 18,
              borderRadius: 999,
              background: "#f7d5ac",
            }}
          />
          <span>NeighbrVille</span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 72,
              lineHeight: 0.95,
              letterSpacing: "-0.04em",
              textTransform: "uppercase",
              fontFamily: "Georgia, 'Times New Roman', serif",
            }}
          >
            <span>Find your people.</span>
            <span>Feel at home.</span>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 28,
              lineHeight: 1.35,
              fontFamily: "Helvetica, Arial, sans-serif",
              maxWidth: 760,
              opacity: 0.9,
            }}
          >
            Local community experiences launching Early 2027 in London & Berlin.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontFamily: "Helvetica, Arial, sans-serif",
            fontSize: 22,
            opacity: 0.8,
          }}
        >
          <span>neighbrville.com</span>
          <span>Join the waitlist</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
