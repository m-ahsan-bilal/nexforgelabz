"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

/* ═══════════════════════════════════════════════════
   WHATSAPP FLOATING BUTTON — Lead capture via chat
   Shows after scroll, hides in #final-cta, context-
   aware labels per section, mobile first-visit pill.
   ═══════════════════════════════════════════════════ */

/* ── Config ───────────────────────────────────────── */

const config = {
  phone: "923704125147",
  prefilledMsg:
    "Hi NexForge 👋 I want to discuss my project idea. I found you on your website.",
  tooltip: "Chat with us on WhatsApp",
  replyTime: "Typically replies within 2 hours",
  badge: "1 slot open" as string | null,
  showAfterPx: 300,
};

/* ── Context labels per section ───────────────────── */

const SECTION_LABELS: Record<string, string> = {
  services: "Get a Quote →",
  portfolio: "Start a Project →",
  process: "How It Works →",
};

/* eslint-disable @typescript-eslint/no-explicit-any */
function trackEvent(name: string, params?: Record<string, unknown>) {
  try {
    if (typeof window !== "undefined" && "gtag" in window) {
      (window as any).gtag("event", name, params);
    }
  } catch {
    /* noop */
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/* ── Component ────────────────────────────────────── */

export default function WhatsAppFloat() {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [inFinalCTA, setInFinalCTA] = useState(false);
  const [contextLabel, setContextLabel] = useState<string | null>(null);
  const [mobileLabel, setMobileLabel] = useState(false);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const shownLabels = useRef<Set<string>>(new Set());
  const contextTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const reducedMotion = useReducedMotion();

  /* ── Scroll visibility ──────────────────────────── */

  useEffect(() => {
    const handler = () => setVisible(window.scrollY > config.showAfterPx);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  /* ── Hide in #final-cta ─────────────────────────── */

  useEffect(() => {
    const el = document.getElementById("final-cta");
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => setInFinalCTA(entry.isIntersecting),
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* ── Context-aware labels ───────────────────────── */

  useEffect(() => {
    const sectionIds = Object.keys(SECTION_LABELS);
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (!elements.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id;
          if (
            entry.isIntersecting &&
            SECTION_LABELS[id] &&
            !shownLabels.current.has(id)
          ) {
            shownLabels.current.add(id);
            setContextLabel(SECTION_LABELS[id]);

            clearTimeout(contextTimer.current);
            contextTimer.current = setTimeout(
              () => setContextLabel(null),
              4000
            );
          }
        }
      },
      { threshold: 0.3 }
    );

    elements.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  /* ── Mobile first-visit label ───────────────────── */

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isMobile = window.innerWidth < 768;
    if (!isMobile) return;
    if (sessionStorage.getItem("nfl_wa_label_shown") === "true") return;

    const timer = setTimeout(() => {
      if (visible) {
        setMobileLabel(true);
        sessionStorage.setItem("nfl_wa_label_shown", "true");
        setTimeout(() => setMobileLabel(false), 3500);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [visible]);

  /* ── Hide on mobile keyboard open ───────────────── */

  useEffect(() => {
    let prevHeight = window.innerHeight;

    const handler = () => {
      const h = window.innerHeight;
      setKeyboardOpen(h < 500 && prevHeight > 500);
      prevHeight = h;
    };

    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  /* ── Click ──────────────────────────────────────── */

  const handleClick = useCallback(() => {
    trackEvent("whatsapp_button_click", {
      section: Array.from(shownLabels.current).pop() || "unknown",
    });
    localStorage.setItem("nfl_whatsapp_clicked", "true");

    window.open(
      `https://wa.me/${config.phone}?text=${encodeURIComponent(config.prefilledMsg)}`,
      "_blank",
      "noopener,noreferrer"
    );
  }, []);

  /* ── Should render? ─────────────────────────────── */

  const show = visible && !inFinalCTA && !keyboardOpen;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed bottom-6 right-6 z-[80] flex items-center gap-3"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {/* ── Context label pill (left of button) ─── */}
          <AnimatePresence>
            {contextLabel && (
              <motion.span
                className="hidden md:block font-spaceMono text-[10px] text-[var(--text-dim)] rounded-full px-3 py-1.5 whitespace-nowrap"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                {contextLabel}
              </motion.span>
            )}
          </AnimatePresence>

          {/* ── Mobile first-visit pill ────────────── */}
          <AnimatePresence>
            {mobileLabel && (
              <motion.span
                className="md:hidden font-spaceMono text-[10px] text-white rounded-full px-3 py-1.5 whitespace-nowrap"
                style={{
                  background: "rgba(37,211,102,0.15)",
                  border: "1px solid rgba(37,211,102,0.3)",
                }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.25 }}
              >
                💬 Chat with us
              </motion.span>
            )}
          </AnimatePresence>

          {/* ── Main button container ─────────────── */}
          <div
            className="relative"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            {/* Desktop tooltip */}
            <AnimatePresence>
              {hovered && (
                <motion.div
                  className="hidden md:block absolute right-[calc(100%+12px)] top-1/2 -translate-y-1/2 rounded-[10px] px-3.5 py-2.5 whitespace-nowrap pointer-events-none"
                  style={{
                    background: "#0d0d14",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.15 }}
                >
                  <p className="font-dmSans font-medium text-[13px] text-[var(--text)]">
                    {config.tooltip}
                  </p>
                  <p className="font-spaceMono text-[9px] text-[var(--text-dimmer)] mt-0.5">
                    {config.replyTime}
                  </p>
                  {/* Caret arrow */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 -right-[5px] w-2.5 h-2.5 rotate-45"
                    style={{
                      background: "#0d0d14",
                      borderRight: "1px solid rgba(255,255,255,0.1)",
                      borderTop: "1px solid rgba(255,255,255,0.1)",
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Scarcity badge */}
            {config.badge && (
              <span
                className="absolute -top-1 -left-1 z-10 font-spaceMono text-[9px] text-white tracking-[0.04em] rounded-full px-2 py-[2px]"
                style={{
                  background: "#f59e0b",
                  border: "2px solid #050508",
                  animation: reducedMotion
                    ? "none"
                    : "waBadgePulse 2.5s ease infinite",
                }}
              >
                {config.badge}
              </span>
            )}

            {/* WhatsApp button */}
            <motion.button
              onClick={handleClick}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="w-[60px] h-[60px] rounded-full flex items-center justify-center cursor-pointer border-none"
              style={{
                background: "#25d366",
                animation: reducedMotion
                  ? "none"
                  : "waRipple 2s infinite",
              }}
              aria-label="Chat with NexForge on WhatsApp"
            >
              {/* WhatsApp SVG icon */}
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="white"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
