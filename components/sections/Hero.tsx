"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { useLenis } from "@/components/providers/SmoothScrollProvider";
import { useCtaModal } from "@/context/CTAModalContext";
import Button from "@/components/ui/Button";
import GlowOrb from "@/components/ui/GlowOrb";

/* ═══════════════════════════════════════════════════
   HERO — Above-the-fold conversion section
   NexForge Labz Design System
   ═══════════════════════════════════════════════════ */

/* ── Animation Variants ───────────────────────────── */

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
};

const wordVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1], delay },
  },
});

const staggerContainer = (delay = 0) => ({
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: delay } },
});

const staggerItem = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
};

/* ── Trust badges ─────────────────────────────────── */

const TRUST_ITEMS = [
  "10+ MVPs Shipped",
  "6-Week Average",
  "Global Clients",
  "0 Ghosted Projects",
];


/* ═══════════════════════════════════════════════════
   HERO SECTION
   ═══════════════════════════════════════════════════ */

export default function Hero() {
  const lenis = useLenis();
  const { scrollY } = useScroll();
  const { openModal } = useCtaModal();
  const [scrollIndicatorVisible, setScrollIndicatorVisible] = useState(true);

  /* ── Hide scroll indicator after 100px ──────────── */

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (y) => {
      setScrollIndicatorVisible(y < 100);
    });
    return unsubscribe;
  }, [scrollY]);

  /* ── Headline lines for word-by-word animation ──── */

  const line1Words = ["Your", "App,", "Built"];
  const line2Words = ["In", "6", "Weeks."];
  const line3Words = ["You", "Focus", "on", "Users.", "We", "Write", "the", "Code."];

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* ── Background ────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
        aria-hidden="true"
      />

      {/* Gradient line at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(59,122,255,0.2), rgba(139,92,246,0.2), transparent)" }}
        aria-hidden="true"
      />

      <GlowOrb
        color="purple"
        size={600}
        opacity={0.08}
        position={{ top: "-15%", right: "-10%" }}
      />
      <GlowOrb
        color="blue"
        size={600}
        opacity={0.06}
        position={{ bottom: "-10%", left: "-12%" }}
      />

      {/* ── Hero Content ──────────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 w-full py-24 md:py-28">
        <div className="flex flex-col items-center text-center">

          {/* ① Scarcity Pill */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--green)] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--green)]" />
              </span>
              <span className="font-spaceMono text-[11px] tracking-[0.03em] text-[var(--text-dim)]">
                Currently accepting 1 project for April 2026
              </span>
            </span>
          </motion.div>

          {/* ② Main Headline — word-by-word reveal */}
          <motion.h1
            className="font-syne font-extrabold tracking-tight leading-[1.15] mb-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Line 1: "Ship Your MVP in" */}
            <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-[56px] text-[var(--text)]">
              {line1Words.map((word, i) => (
                <motion.span
                  key={`l1-${i}`}
                  variants={wordVariants}
                  className="inline-block mr-[0.20em]"
                >
                  {word}
                </motion.span>
              ))}
            </span>

            {/* Line 2: "6 Weeks." — gradient */}
            <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl mt-1">
              {line2Words.map((word, i) => (
                <motion.span
                  key={`l2-${i}`}
                  variants={wordVariants}
                  className="inline-block mr-[0.20em] gradient-text"
                >
                  {word}
                </motion.span>
              ))}
            </span>

            {/* Line 3: "We Handle Tech. You Get Customers." */}
            <span className="block text-lg sm:text-xl md:text-4xl lg:text-2xl mt-3 text-[var(--text)] opacity-90">
              {line3Words.map((word, i) => (
                <motion.span
                  key={`l3-${i}`}
                  variants={wordVariants}
                  className="inline-block mr-[0.20em]"
                >
                  {word}
                </motion.span>
              ))}
            </span>
          </motion.h1>

          {/* ③ Subheadline */}
          <motion.p
            className="font-dmSans text-base md:text-lg text-[var(--text-dim)] leading-[1.7] max-w-xl mx-auto mb-8"
            variants={fadeUp(0.6)}
            initial="hidden"
            animate="visible"
          >
            We build mobile, web, and AI apps for founders who want to{" "}
            <span className="text-[var(--red)] font-medium">
              move fast without cutting corners
            </span>{" "}
            — from first sketch to live product, with real humans behind every line of code.
          </motion.p>

          {/* ④ CTA Row */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10"
            variants={staggerContainer(0.8)}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={staggerItem}>
              <Button
                variant="primary"
                onClick={() => openModal("hero")}
              >
                Get Free Estimate →
              </Button>
            </motion.div>
            <motion.div variants={staggerItem}>
              <Button
                variant="secondary"
                onClick={() => {
                  const el = document.getElementById("portfolio");
                  if (el && lenis) {
                    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
                  }
                }}
              >
                See Our Work
              </Button>
            </motion.div>
          </motion.div>

          {/* ⑤ Trust Badges */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3"
            variants={staggerContainer(1.0)}
            initial="hidden"
            animate="visible"
          >
            {TRUST_ITEMS.map((item, i) => (
              <motion.span
                key={item}
                className="flex items-center gap-2"
                variants={staggerItem}
              >
                {i > 0 && (
                  <span className="text-[var(--text-dimmer)] opacity-30 font-dmSans text-xs hidden sm:inline">
                    •
                  </span>
                )}
                <span className="font-spaceMono text-[11px] text-[var(--accent-cyan)]">
                  ✓
                </span>
                <span className="font-dmSans text-[13px] text-[var(--text-dimmer)]">
                  {item}
                </span>
              </motion.span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── Scroll Indicator ──────────────────────── */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        animate={{
          opacity: scrollIndicatorVisible ? 1 : 0,
          y: scrollIndicatorVisible ? [0, 6, 0] : 0,
        }}
        transition={
          scrollIndicatorVisible
            ? { y: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }, opacity: { duration: 0.3 } }
            : { opacity: { duration: 0.3 } }
        }
        aria-hidden="true"
      >
        <span className="font-spaceMono text-[9px] tracking-[0.15em] uppercase text-[var(--text-dimmer)]">
          Scroll
        </span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className="text-[var(--text-dimmer)]"
        >
          <path
            d="M4 6L8 10L12 6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>

    </section>
  );
}
