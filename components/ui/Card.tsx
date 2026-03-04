"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

/* ═══════════════════════════════════════════════════
   CARD — Surface container with hover
   NexForge Labz Design System
   ═══════════════════════════════════════════════════ */

type AccentColor = "blue" | "purple" | "cyan" | "gradient";

interface CardProps {
  children: ReactNode;
  accentColor?: AccentColor;
  glow?: boolean;
  className?: string;
  hover?: boolean;
}

/* ── Accent bar colors ────────────────────────────── */

const accentColorMap: Record<AccentColor, string> = {
  blue: "bg-[var(--accent-blue)]",
  purple: "bg-[var(--accent-purple)]",
  cyan: "bg-[var(--accent-cyan)]",
  gradient: "bg-gradient-to-r from-[#3b7aff] via-[#8b5cf6] to-[#06d6d6]",
};

const glowColorMap: Record<AccentColor, string> = {
  blue: "radial-gradient(ellipse at 50% 0%, rgba(59,122,255,0.12) 0%, transparent 70%)",
  purple: "radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.12) 0%, transparent 70%)",
  cyan: "radial-gradient(ellipse at 50% 0%, rgba(6,214,214,0.12) 0%, transparent 70%)",
  gradient: "radial-gradient(ellipse at 50% 0%, rgba(59,122,255,0.08) 0%, rgba(139,92,246,0.06) 40%, transparent 70%)",
};

/* ── Component ────────────────────────────────────── */

export default function Card({
  children,
  accentColor,
  glow = false,
  className = "",
  hover = true,
}: CardProps) {
  return (
    <motion.div
      className={`relative bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-7 overflow-hidden ${className}`}
      whileHover={
        hover
          ? {
              y: -4,
              borderColor: "rgba(255,255,255,0.12)",
              transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
            }
          : undefined
      }
    >
      {/* Accent bar */}
      {accentColor && (
        <div
          className={`absolute top-0 left-0 right-0 h-[3px] ${accentColorMap[accentColor]}`}
          aria-hidden="true"
        />
      )}

      {/* Glow effect */}
      {glow && accentColor && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: glowColorMap[accentColor] }}
          aria-hidden="true"
        />
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
