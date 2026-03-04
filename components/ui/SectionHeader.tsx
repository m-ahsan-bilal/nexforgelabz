"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

/* ═══════════════════════════════════════════════════
   SECTION HEADER — Eyebrow + Title + Subtitle
   NexForge Labz Design System
   ═══════════════════════════════════════════════════ */

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  titleHighlight?: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
  children?: ReactNode;
}

/* ── Animation ────────────────────────────────────── */

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

/* ── Title renderer ───────────────────────────────── */

function renderTitle(title: string, highlight?: string) {
  if (!highlight) return title;

  const idx = title.toLowerCase().indexOf(highlight.toLowerCase());
  if (idx === -1) return title;

  const before = title.slice(0, idx);
  const match = title.slice(idx, idx + highlight.length);
  const after = title.slice(idx + highlight.length);

  return (
    <>
      {before}
      <span className="gradient-text">{match}</span>
      {after}
    </>
  );
}

/* ── Component ────────────────────────────────────── */

export default function SectionHeader({
  eyebrow,
  title,
  titleHighlight,
  subtitle,
  align = "center",
  className = "",
  children,
}: SectionHeaderProps) {
  const alignClasses =
    align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <motion.div
      className={`mb-16 max-w-3xl ${alignClasses} ${className}`}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
    >
      {/* Eyebrow */}
      <motion.div
        className="flex items-center gap-3 mb-4"
        style={{ justifyContent: align === "center" ? "center" : "flex-start" }}
        variants={itemVariants}
      >
        <span className="font-spaceMono text-[9px] tracking-[0.2em] uppercase text-[var(--text-dimmer)] leading-none">
          {eyebrow}
        </span>
        <span
          className="h-px flex-1 max-w-[48px] bg-[var(--border)]"
          aria-hidden="true"
        />
      </motion.div>

      {/* Title */}
      <motion.h2
        className="font-syne font-extrabold text-3xl md:text-4xl lg:text-5xl tracking-[-0.02em] leading-[1.1] text-[var(--text)] mb-4"
        variants={itemVariants}
      >
        {renderTitle(title, titleHighlight)}
      </motion.h2>

      {/* Subtitle */}
      {subtitle && (
        <motion.p
          className={`font-dmSans font-light text-base text-[var(--text-dim)] leading-[1.7] max-w-xl ${
            align === "center" ? "mx-auto" : ""
          }`}
          variants={itemVariants}
        >
          {subtitle}
        </motion.p>
      )}

      {/* Optional slot for extra content below */}
      {children && <motion.div variants={itemVariants}>{children}</motion.div>}
    </motion.div>
  );
}
