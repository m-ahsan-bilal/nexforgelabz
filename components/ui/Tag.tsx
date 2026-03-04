"use client";

import { ReactNode } from "react";

/* ═══════════════════════════════════════════════════
   TAG — Color-coded labels
   NexForge Labz Design System
   ═══════════════════════════════════════════════════ */

type TagColor = "blue" | "purple" | "cyan" | "green" | "red" | "yellow";

interface TagProps {
  children: ReactNode;
  color?: TagColor;
  dot?: boolean;
  outline?: boolean;
  className?: string;
}

/* ── Color maps ───────────────────────────────────── */

const colorMap: Record<
  TagColor,
  { text: string; bg: string; border: string; dot: string }
> = {
  blue: {
    text: "text-[var(--accent-blue)]",
    bg: "bg-[rgba(59,122,255,0.15)]",
    border: "border-[rgba(59,122,255,0.3)]",
    dot: "bg-[var(--accent-blue)]",
  },
  purple: {
    text: "text-[var(--accent-purple)]",
    bg: "bg-[rgba(139,92,246,0.15)]",
    border: "border-[rgba(139,92,246,0.3)]",
    dot: "bg-[var(--accent-purple)]",
  },
  cyan: {
    text: "text-[var(--accent-cyan)]",
    bg: "bg-[rgba(6,214,214,0.15)]",
    border: "border-[rgba(6,214,214,0.3)]",
    dot: "bg-[var(--accent-cyan)]",
  },
  green: {
    text: "text-[var(--green)]",
    bg: "bg-[rgba(34,197,94,0.15)]",
    border: "border-[rgba(34,197,94,0.3)]",
    dot: "bg-[var(--green)]",
  },
  red: {
    text: "text-[var(--red)]",
    bg: "bg-[rgba(255,68,68,0.15)]",
    border: "border-[rgba(255,68,68,0.3)]",
    dot: "bg-[var(--red)]",
  },
  yellow: {
    text: "text-[var(--yellow)]",
    bg: "bg-[rgba(245,158,11,0.15)]",
    border: "border-[rgba(245,158,11,0.3)]",
    dot: "bg-[var(--yellow)]",
  },
};

/* ── Component ────────────────────────────────────── */

export default function Tag({
  children,
  color = "cyan",
  dot = false,
  outline = false,
  className = "",
}: TagProps) {
  const c = colorMap[color];

  const classes = [
    "inline-flex items-center gap-1.5",
    "font-spaceMono text-[10px] tracking-[0.05em] uppercase",
    "px-[9px] py-[3px] rounded-[4px]",
    c.text,
    outline ? `bg-transparent border ${c.border}` : c.bg,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={classes} role="status">
      {dot && (
        <span
          className={`inline-block w-[5px] h-[5px] rounded-full ${c.dot} flex-shrink-0`}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}
