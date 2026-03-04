"use client";

import { useRef, useEffect, useState } from "react";
import { useSpring, useTransform, motion, useReducedMotion } from "framer-motion";
import useScrollReveal from "@/hooks/useScrollReveal";

/* ═══════════════════════════════════════════════════
   COUNT UP — Animated number counter
   Triggers when element enters viewport.
   Uses Framer Motion spring for smooth animation.
   ═══════════════════════════════════════════════════ */

interface CountUpProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

export default function CountUp({
  end,
  duration = 1200,
  suffix = "",
  prefix = "",
  className = "",
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isVisible = useScrollReveal(ref, { threshold: 0.3 });
  const prefersReduced = useReducedMotion();

  /* Spring-based animation */
  const springValue = useSpring(0, {
    stiffness: 100,
    damping: 30,
    duration: duration / 1000,
  });

  const display = useTransform(springValue, (v) => Math.floor(v));
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isVisible) {
      if (prefersReduced) {
        setDisplayValue(end);
      } else {
        springValue.set(end);
      }
    }
  }, [isVisible, end, springValue, prefersReduced]);

  useEffect(() => {
    const unsubscribe = display.on("change", (v) => {
      setDisplayValue(v);
    });
    return unsubscribe;
  }, [display]);

  return (
    <motion.span ref={ref} className={className}>
      {prefix}
      {displayValue}
      {suffix}
    </motion.span>
  );
}
