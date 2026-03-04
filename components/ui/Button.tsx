"use client";

import { ReactNode, ButtonHTMLAttributes } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import Link from "next/link";

/* ═══════════════════════════════════════════════════
   BUTTON — Primary | Secondary | Ghost
   NexForge Labz Design System
   ═══════════════════════════════════════════════════ */

interface ButtonBaseProps {
  variant?: "primary" | "secondary" | "ghost";
  children: ReactNode;
  href?: string;
  className?: string;
  loading?: boolean;
  fullWidth?: boolean;
}

type ButtonAsButton = ButtonBaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> & {
    href?: undefined;
  };

type ButtonAsLink = ButtonBaseProps & {
  href: string;
  onClick?: () => void;
};

type ButtonProps = ButtonAsButton | ButtonAsLink;

/* ── Spinner ──────────────────────────────────────── */

function Spinner() {
  return (
    <svg
      className="animate-spin h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

/* ── Variant styles ───────────────────────────────── */

const variantStyles = {
  primary: [
    "font-syne font-bold text-[15px] tracking-[-0.01em] text-white",
    "px-7 py-3.5 rounded-[10px]",
    "bg-gradient-to-r from-[#3b7aff] via-[#8b5cf6] to-[#06d6d6]",
    "shadow-[0_0_24px_rgba(59,122,255,0.35)]",
  ].join(" "),
  secondary: [
    "font-syne font-semibold text-[15px] text-[var(--text)]",
    "px-7 py-3.5 rounded-[10px]",
    "bg-transparent border border-[rgba(255,255,255,0.12)]",
  ].join(" "),
  ghost: [
    "font-spaceMono text-[13px] text-[var(--accent-cyan)]",
    "px-7 py-3.5 rounded-[10px]",
    "bg-transparent border border-[rgba(6,214,214,0.25)]",
  ].join(" "),
};

const hoverVariants = {
  primary: {
    y: -2,
    boxShadow: "0 8px 32px rgba(59,122,255,0.45)",
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  },
  secondary: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderColor: "rgba(255,255,255,0.2)",
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  },
  ghost: {
    backgroundColor: "rgba(6,214,214,0.07)",
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  },
};

const tapVariant = {
  scale: 0.97,
  transition: { duration: 0.1 },
};

/* ── Component ────────────────────────────────────── */

export default function Button({
  variant = "primary",
  children,
  href,
  className = "",
  loading = false,
  fullWidth = false,
  ...props
}: ButtonProps) {
  const baseClasses = [
    "inline-flex items-center justify-center gap-2",
    "cursor-pointer select-none",
    "transition-colors duration-300",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-blue)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]",
    "disabled:opacity-50 disabled:pointer-events-none",
    fullWidth ? "w-full" : "",
    variantStyles[variant],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      {loading && <Spinner />}
      <span>{children}</span>
    </>
  );

  if (href) {
    return (
      <motion.div
        whileHover={hoverVariants[variant]}
        whileTap={tapVariant}
        className="inline-block"
      >
        <Link
          href={href}
          className={baseClasses}
          aria-disabled={loading}
          tabIndex={loading ? -1 : 0}
        >
          {content}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      whileHover={hoverVariants[variant]}
      whileTap={tapVariant}
      className={baseClasses}
      disabled={loading}
      aria-busy={loading}
      {...(props as Omit<HTMLMotionProps<"button">, "children">)}
    >
      {content}
    </motion.button>
  );
}
