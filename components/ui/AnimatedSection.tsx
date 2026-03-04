"use client";

import { useRef, ReactNode } from "react";
import { motion, Variants, useReducedMotion } from "framer-motion";
import useScrollReveal from "@/hooks/useScrollReveal";
import { reducedMotion } from "@/lib/animations";

/* ═══════════════════════════════════════════════════
   ANIMATED SECTION — Scroll-triggered wrapper
   Uses useScrollReveal internally. Respects
   prefers-reduced-motion for accessibility.
   ═══════════════════════════════════════════════════ */

interface AnimatedSectionProps {
  variant: Variants;
  children: ReactNode;
  className?: string;
  delay?: number;
  threshold?: number;
  as?: "div" | "section" | "article";
}

export default function AnimatedSection({
  variant,
  children,
  className = "",
  delay = 0,
  threshold = 0.1,
  as = "div",
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useScrollReveal(ref, { threshold });
  const prefersReduced = useReducedMotion();

  const activeVariant = prefersReduced ? reducedMotion : variant;

  const delayedVariant: Variants = delay
    ? {
        ...activeVariant,
        visible: {
          ...(activeVariant.visible as object),
          transition: {
            ...((activeVariant.visible as Record<string, unknown>)?.transition as object),
            delay,
          },
        },
      }
    : activeVariant;

  const Component = motion[as];

  return (
    <Component
      ref={ref}
      variants={delayedVariant}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      className={className}
    >
      {children}
    </Component>
  );
}
