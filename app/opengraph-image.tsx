import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "NexForge Labz — Ship Your MVP in 6 Weeks";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          backgroundColor: "#050508",
          padding: "80px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative gradient orbs */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-50px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-100px",
            right: "200px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(59,122,255,0.12) 0%, transparent 70%)",
          }}
        />

        {/* Logo wordmark */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: "24px" }}>
          <span
            style={{
              fontSize: "32px",
              fontWeight: 800,
              color: "#f0f0f8",
              letterSpacing: "-0.01em",
            }}
          >
            NexForge Labz
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: "64px",
            fontWeight: 800,
            color: "#f0f0f8",
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            marginBottom: "8px",
          }}
        >
          Ship Your MVP in
        </div>
        <div
          style={{
            fontSize: "72px",
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            marginBottom: "32px",
            background: "linear-gradient(135deg, #3b7aff 0%, #8b5cf6 50%, #06d6d6 100%)",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          6 Weeks.
        </div>

        {/* Subtext */}
        <div
          style={{
            fontSize: "22px",
            color: "#8888aa",
            fontWeight: 400,
            lineHeight: 1.5,
            maxWidth: "600px",
          }}
        >
          Mobile, web & AI apps for founders — built by real humans, shipped in 6 weeks.
        </div>

        {/* Bottom URL */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            left: "80px",
            fontSize: "16px",
            color: "#555570",
            letterSpacing: "0.05em",
          }}
        >
          nexforgelabz.com
        </div>

        {/* Bottom accent line */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, #3b7aff, #8b5cf6, #06d6d6)",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
