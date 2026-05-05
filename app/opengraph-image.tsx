import { ImageResponse } from "next/og";

export const alt = "PeraWays – PFA-Azubis aus Kenia";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: 80,
          background: "#19463C",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 24,
            fontWeight: 600,
            color: "#C4705E",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            marginBottom: 20,
          }}
        >
          Berlin × Nairobi
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 72,
            fontWeight: 800,
            color: "white",
            lineHeight: 1.1,
            marginBottom: 30,
          }}
        >
          Nursing Trainees from Kenya
          <br />
          <span style={{ color: "#C4705E" }}>. Ethical & Fast.</span>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 28,
            color: "rgba(255,255,255,0.7)",
            fontWeight: 400,
          }}
        >
          §16a AufenthG • Debt-free Relocation • ROI in 90 Days
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
