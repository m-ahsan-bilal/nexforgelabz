"use client";

/* ═══════════════════════════════════════════════════
   GLOW ORB — Decorative radial gradient blob
   NexForge Labz Design System
   ═══════════════════════════════════════════════════ */

type OrbColor = "blue" | "purple" | "cyan";

interface GlowOrbProps {
  color?: OrbColor;
  size?: number;
  opacity?: number;
  position?: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  className?: string;
}

/* ── Color map ────────────────────────────────────── */

const orbColorMap: Record<OrbColor, string> = {
  blue: "59,122,255",
  purple: "139,92,246",
  cyan: "6,214,214",
};

/* ── Component ────────────────────────────────────── */

export default function GlowOrb({
  color = "blue",
  size = 400,
  opacity = 0.12,
  position = {},
  className = "",
}: GlowOrbProps) {
  const rgb = orbColorMap[color];

  return (
    <div
      className={`absolute pointer-events-none ${className}`}
      style={{
        width: size,
        height: size,
        top: position.top,
        bottom: position.bottom,
        left: position.left,
        right: position.right,
        background: `radial-gradient(circle, rgba(${rgb},${opacity}) 0%, rgba(${rgb},${opacity * 0.4}) 35%, transparent 70%)`,
        filter: "blur(40px)",
      }}
      aria-hidden="true"
      role="presentation"
    />
  );
}
