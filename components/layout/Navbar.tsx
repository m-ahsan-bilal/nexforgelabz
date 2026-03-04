"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { useLenis } from "@/components/providers/SmoothScrollProvider";
import { useCtaModal } from "@/context/CTAModalContext";
import Button from "@/components/ui/Button";

/* ═══════════════════════════════════════════════════
   NAVBAR — Sticky navigation bar
   NexForge Labz Design System

   • Transparent → blurred glass on scroll
   • Smart CTA text via IntersectionObserver
   • Mobile full-screen overlay menu
   ═══════════════════════════════════════════════════ */

/* ── Types ────────────────────────────────────────── */

interface NavLink {
  label: string;
  target: string;
}

const NAV_LINKS: NavLink[] = [
  { label: "Services", target: "#services" },
  { label: "Process", target: "#process" },
  { label: "Work", target: "#portfolio" },
  { label: "FAQ", target: "#faq" },
];

/* ── Smart CTA config ─────────────────────────────── */

interface CTAState {
  section: string;
  text: string;
  mobileText: string;
}

const CTA_STATES: CTAState[] = [
  { section: "faq", text: "Get Free Estimate", mobileText: "Estimate" },
  { section: "portfolio", text: "Work With Us", mobileText: "Estimate" },
  { section: "services", text: "Start Your MVP", mobileText: "Estimate" },
];

const DEFAULT_CTA: CTAState = {
  section: "",
  text: "Get Free Estimate",
  mobileText: "Estimate",
};

/* ── Animation variants ───────────────────────────── */

const overlayVariants = {
  closed: {
    opacity: 0,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  },
  open: {
    opacity: 1,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  },
};

const mobileLinkVariants = {
  closed: { opacity: 0, x: -24 },
  open: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.1 + i * 0.08,
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

const ctaTextVariants = {
  enter: { opacity: 0, y: 6 },
  center: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.15, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: -6,
    transition: { duration: 0.15, ease: "easeIn" },
  },
};

/* ── Component ────────────────────────────────────── */

export default function Navbar() {
  const { openModal } = useCtaModal();
  const lenis = useLenis();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [ctaState, setCTAState] = useState<CTAState>(DEFAULT_CTA);
  const observerRefs = useRef<IntersectionObserver[]>([]);

  /* ── Scroll detection ──────────────────────────── */

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (y) => {
      setScrolled(y > 80);
    });
    return unsubscribe;
  }, [scrollY]);

  /* ── Smart CTA via IntersectionObserver ─────────── */

  useEffect(() => {
    // Clean up any existing observers
    observerRefs.current.forEach((obs) => obs.disconnect());
    observerRefs.current = [];

    const visibleSections = new Set<string>();

    CTA_STATES.forEach(({ section }) => {
      const el = document.getElementById(section);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            visibleSections.add(section);
          } else {
            visibleSections.delete(section);
          }

          // Choose CTA based on priority (first match in CTA_STATES order)
          const match = CTA_STATES.find((s) => visibleSections.has(s.section));
          setCTAState(match || DEFAULT_CTA);
        },
        { rootMargin: "-40% 0px -40% 0px" }
      );

      observer.observe(el);
      observerRefs.current.push(observer);
    });

    return () => {
      observerRefs.current.forEach((obs) => obs.disconnect());
    };
  }, []);

  /* ── Scroll-to handler ─────────────────────────── */

  const scrollTo = useCallback(
    (target: string) => {
      setMobileOpen(false);

      if (target === "#top") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      const el = document.querySelector(target);
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    },
    []
  );

  /* ── Lock body scroll when mobile menu open ────── */

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  /* ── Render ─────────────────────────────────────── */

  return (
    <>
      <nav
        id="navbar"
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ease-in-out ${
          scrolled
            ? "bg-[rgba(5,5,8,0.88)] backdrop-blur-[24px] border-b border-[var(--border)]"
            : "bg-transparent border-b border-transparent"
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div
          className={`max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between transition-all duration-300 ${
            scrolled ? "h-[52px]" : "h-[64px]"
          }`}
        >
          {/* ── Logo ──────────────────────────────── */}
          <button
            onClick={() => scrollTo("#top")}
            className="flex items-center gap-2 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-blue)] rounded-md"
            aria-label="Scroll to top"
          >
            {/* SVG Icon */}
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
              <defs>
                <linearGradient id="nav-g" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#3b7aff"/>
                  <stop offset="50%" stopColor="#8b5cf6"/>
                  <stop offset="100%" stopColor="#06d6d6"/>
                </linearGradient>
              </defs>
              <rect width="32" height="32" rx="8" fill="#050508"/>
              <path d="M8 24V8l5 8 5-8v16" stroke="url(#nav-g)" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 8v16" stroke="url(#nav-g)" strokeWidth="2.5" strokeLinecap="round"/>
              <circle cx="22" cy="8" r="1.5" fill="url(#nav-g)"/>
            </svg>
            {/* Full text on desktop, hidden on mobile */}
            <span className="hidden sm:flex items-center gap-0">
              <span className="font-syne font-extrabold text-lg tracking-tight gradient-text">NexForge</span>
              <span className="font-syne font-extrabold text-lg tracking-tight text-[var(--text)] opacity-80 ml-1">Labz</span>
            </span>
          </button>

          {/* ── Desktop Nav Links ─────────────────── */}
          <div className="hidden lg:flex items-center gap-8" role="menubar">
            {NAV_LINKS.map((link) => (
              <button
                key={link.target}
                onClick={() => scrollTo(link.target)}
                className="group relative font-dmSans font-medium text-sm text-[var(--text-dim)] hover:text-[var(--text)] transition-colors duration-200 cursor-pointer bg-transparent border-none py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-blue)] rounded-sm"
                role="menuitem"
              >
                {link.label}
                {/* Underline draw animation */}
                <span
                  className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] transition-all duration-200 ease-out"
                  aria-hidden="true"
                />
              </button>
            ))}
          </div>

          {/* ── Right side ────────────────────────── */}
          <div className="flex items-center gap-3">
            {/* Smart CTA — Desktop */}
            <div className="hidden md:block">
              <Button
                variant="primary"
                onClick={() => openModal("navbar")}
                className="text-sm !px-5 !py-2.5"
              >
                <AnimatePresence mode="wait">
                  <motion.span
                    key={ctaState.text}
                    variants={ctaTextVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="inline-block whitespace-nowrap"
                  >
                    {ctaState.text} →
                  </motion.span>
                </AnimatePresence>
              </Button>
            </div>

            {/* Smart CTA — Mobile (compact) */}
            <div className="block md:hidden">
              <Button
                variant="primary"
                onClick={() => openModal("navbar")}
                className="text-xs !px-4 !py-2"
              >
                <AnimatePresence mode="wait">
                  <motion.span
                    key={ctaState.mobileText}
                    variants={ctaTextVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="inline-block"
                  >
                    {ctaState.mobileText} →
                  </motion.span>
                </AnimatePresence>
              </Button>
            </div>

            {/* Hamburger — Mobile */}
            <button
              onClick={() => setMobileOpen((prev) => !prev)}
              className="lg:hidden relative w-8 h-8 flex flex-col items-center justify-center gap-[5px] cursor-pointer bg-transparent border-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-blue)] rounded-md"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              <motion.span
                className="block w-5 h-[1.5px] bg-[var(--text)] origin-center"
                animate={
                  mobileOpen
                    ? { rotate: 45, y: 6.5 }
                    : { rotate: 0, y: 0 }
                }
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              />
              <motion.span
                className="block w-5 h-[1.5px] bg-[var(--text)]"
                animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
                transition={{ duration: 0.15 }}
              />
              <motion.span
                className="block w-5 h-[1.5px] bg-[var(--text)] origin-center"
                animate={
                  mobileOpen
                    ? { rotate: -45, y: -6.5 }
                    : { rotate: 0, y: 0 }
                }
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile Overlay Menu ───────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-[99] bg-[rgba(5,5,8,0.97)] backdrop-blur-[24px] flex flex-col items-center justify-center gap-8"
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
          >
            {NAV_LINKS.map((link, i) => (
              <motion.button
                key={link.target}
                custom={i}
                variants={mobileLinkVariants}
                initial="closed"
                animate="open"
                onClick={() => scrollTo(link.target)}
                className="font-syne font-bold text-2xl text-[var(--text)] hover:text-[var(--accent-blue)] transition-colors duration-200 cursor-pointer bg-transparent border-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-blue)] rounded-md px-2 py-1"
              >
                {link.label}
              </motion.button>
            ))}

            {/* Mobile CTA */}
            <motion.div
              custom={NAV_LINKS.length}
              variants={mobileLinkVariants}
              initial="closed"
              animate="open"
              className="mt-4"
            >
              <Button
                variant="primary"
                onClick={() => openModal("navbar")}
                fullWidth
              >
                Get Free Estimate →
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
