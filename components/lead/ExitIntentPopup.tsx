"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

/* eslint-disable @typescript-eslint/no-explicit-any */
function trackEvent(name: string, params?: Record<string, unknown>) {
  try {
    if (typeof window !== "undefined" && "gtag" in window) {
      (window as any).gtag("event", name, params);
    }
  } catch { /* noop */ }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/* ═══════════════════════════════════════════════════
   EXIT INTENT POPUP — Lead capture on exit signals
   Triggers: mouseleave (desktop), rapid scroll-up
   (mobile), idle timeout. Shows once per session.
   ═══════════════════════════════════════════════════ */

/* ── Schema ───────────────────────────────────────── */

const exitLeadSchema = z.object({
  idea: z.string().min(10, "Tell us a bit more — at least 10 characters."),
  email: z.string().email("Please enter a valid email."),
});

type ExitLeadForm = z.infer<typeof exitLeadSchema>;

/* ── Constants ────────────────────────────────────── */

const SESSION_KEY = "nfl_exit_shown";
const LOCAL_KEY = "nfl_lead_captured";
const MIN_TIME_ON_PAGE = 15_000; // 15s
const IDLE_TIMEOUT = 90_000; // 90s
const TRIGGER_DELAY = 800; // ms
const SCROLL_DELTA_THRESHOLD = 50;
const SCROLL_TIME_WINDOW = 200;

/* ── Headline words for stagger ───────────────────── */

const HEADLINE_PARTS: { text: string; gradient?: boolean }[] = [
  { text: "Before " },
  { text: "you " },
  { text: "go " },
  { text: "— " },
  { text: "tell " },
  { text: "us " },
  { text: "your ", gradient: true },
  { text: "idea ", gradient: true },
  { text: "in " },
  { text: "one " },
  { text: "sentence." },
];

/* ── Component ────────────────────────────────────── */

export default function ExitIntentPopup() {
  const [visible, setVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [triggerSource, setTriggerSource] = useState<string>("mouseleave");
  const triggered = useRef(false);
  const mountTime = useRef(Date.now());
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ExitLeadForm>({
    resolver: zodResolver(exitLeadSchema),
  });

  /* ── Should we even try? ────────────────────────── */

  const canTrigger = useCallback(() => {
    if (triggered.current) return false;
    if (typeof window === "undefined") return false;
    if (sessionStorage.getItem(SESSION_KEY) === "true") return false;
    if (localStorage.getItem(LOCAL_KEY) === "true") return false;
    if (Date.now() - mountTime.current < MIN_TIME_ON_PAGE) return false;
    return true;
  }, []);

  const fire = useCallback(
    (source: string) => {
      if (!canTrigger()) return;
      triggered.current = true;
      setTriggerSource(source);

      setTimeout(() => {
        setVisible(true);
        sessionStorage.setItem(SESSION_KEY, "true");

        // Analytics
        trackEvent("exit_popup_shown", { trigger: source });
      }, TRIGGER_DELAY);
    },
    [canTrigger]
  );

  /* ── 1. Desktop mouseleave ──────────────────────── */

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (e.clientY < 20) fire("mouseleave");
    };
    document.addEventListener("mouseleave", handler);
    return () => document.removeEventListener("mouseleave", handler);
  }, [fire]);

  /* ── 2. Mobile rapid scroll-up ──────────────────── */

  useEffect(() => {
    let lastY = window.scrollY;
    let lastTime = Date.now();

    const handler = () => {
      const now = Date.now();
      const deltaY = lastY - window.scrollY; // positive = scrolling up
      const deltaT = now - lastTime;

      if (deltaY > SCROLL_DELTA_THRESHOLD && deltaT < SCROLL_TIME_WINDOW) {
        fire("scroll_up");
      }

      lastY = window.scrollY;
      lastTime = now;
    };

    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [fire]);

  /* ── 3. Idle timeout ────────────────────────────── */

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const reset = () => {
      clearTimeout(timer);
      timer = setTimeout(() => fire("idle"), IDLE_TIMEOUT);
    };

    const events = ["mousemove", "scroll", "click", "keydown", "touchstart"];
    events.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    reset(); // start first timer

    return () => {
      clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, reset));
    };
  }, [fire]);

  /* ── Focus textarea when popup opens ────────────── */

  useEffect(() => {
    if (visible && textareaRef.current) {
      setTimeout(() => textareaRef.current?.focus(), 350);
    }
  }, [visible]);

  /* ── Escape key closes ──────────────────────────── */

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && visible) close("escape");
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [visible]);

  /* ── Close handler ──────────────────────────────── */

  const close = (method: string) => {
    setVisible(false);
    const event = method === "overlay" ? "exit_popup_ignored" : "exit_popup_dismissed";
    trackEvent(event, { method });
  };

  /* ── Submit ─────────────────────────────────────── */

  const onSubmit = async (data: ExitLeadForm) => {
    setSending(true);

    try {
      await fetch("/api/exit-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idea: data.idea,
          email: data.email,
          source: "exit_intent",
          trigger: triggerSource,
          timestamp: new Date().toISOString(),
        }),
      });

      localStorage.setItem(LOCAL_KEY, "true");
      setSubmitted(true);
      trackEvent("exit_popup_submitted");

      setTimeout(() => setVisible(false), 2500);
    } catch {
      // silently fail — don't block user
    } finally {
      setSending(false);
    }
  };

  /* ── Textarea ref merge ─────────────────────────── */

  const { ref: ideaRef, ...ideaRest } = register("idea");

  /* ── Render ─────────────────────────────────────── */

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ background: "rgba(5,5,8,0.78)", backdropFilter: "blur(8px)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28 }}
          onClick={() => close("overlay")}
          role="dialog"
          aria-modal="true"
          aria-labelledby="exit-headline"
        >
          <motion.div
            className="relative w-[420px] max-w-[90vw] rounded-[20px] overflow-hidden"
            style={{
              background: "#0d0d14",
              border: "1px solid rgba(255,68,68,0.25)",
              boxShadow: "0 0 60px rgba(255,68,68,0.08), 0 24px 80px rgba(0,0,0,0.6)",
            }}
            initial={{ scale: 0.88, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.88, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 280, damping: 22 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Accent bar */}
            <div
              className="h-[3px] w-full"
              style={{ background: "linear-gradient(90deg, #ff4444, #f97316, #f59e0b)" }}
            />

            {/* Close button */}
            <button
              onClick={() => close("x_button")}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer border-none transition-colors duration-150"
              style={{ background: "rgba(255,255,255,0.04)" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
              aria-label="Close popup"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-[var(--text-dimmer)] hover:text-[var(--text)]" />
              </svg>
            </button>

            <div className="p-8">
              {!submitted ? (
                <>
                  {/* Eyebrow */}
                  <span className="font-spaceMono text-[9px] tracking-[0.18em] uppercase block mb-3" style={{ color: "#ff8888" }}>
                    WAIT — FREE OFFER
                  </span>

                  {/* Headline — word stagger */}
                  <h2 id="exit-headline" className="font-syne font-extrabold text-[26px] tracking-[-0.025em] leading-[1.05] mb-3">
                    {HEADLINE_PARTS.map((part, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 + i * 0.06, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className={`inline-block mr-[0.12em] ${part.gradient ? "gradient-text" : "text-[var(--text)]"}`}
                      >
                        {part.text}
                      </motion.span>
                    ))}
                  </h2>

                  {/* Subtext */}
                  <p className="font-dmSans font-light text-[14px] text-[var(--text-dim)] leading-[1.7] mb-2.5">
                    We&apos;ll reply with a{" "}
                    <span className="font-medium" style={{ color: "#22c55e" }}>free tech recommendation</span>
                    {" "}within 24 hours.{" "}
                    <span className="text-[var(--text)]">No pitch. No pressure.</span>
                    {" "}Just honest advice from engineers who&apos;ve shipped 10+ products.
                  </p>

                  {/* Trust row */}
                  <div className="flex gap-4 mb-5">
                    {["✓ Free", "✓ 24hr reply", "✓ No obligations"].map((t) => (
                      <span key={t} className="font-spaceMono text-[9px] text-[var(--green)]">{t}</span>
                    ))}
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                    {/* Idea textarea */}
                    <div>
                      <textarea
                        {...ideaRest}
                        ref={(el) => {
                          ideaRef(el);
                          textareaRef.current = el;
                        }}
                        rows={2}
                        placeholder="An app where founders can validate ideas before building..."
                        className="w-full resize-none rounded-[10px] px-[14px] py-3 font-dmSans text-[14px] text-[var(--text)] placeholder:font-spaceMono placeholder:text-[10px] placeholder:text-[var(--text-dimmer)] outline-none transition-all duration-200"
                        style={{
                          background: "#131320",
                          border: "1px solid rgba(255,255,255,0.08)",
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = "rgba(59,122,255,0.45)";
                          e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59,122,255,0.1)";
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      />
                      <AnimatePresence>
                        {errors.idea && (
                          <motion.p
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="font-spaceMono text-[10px] mt-1" style={{ color: "#ff8888" }}
                          >
                            {errors.idea.message}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Email */}
                    <div>
                      <input
                        {...register("email")}
                        type="email"
                        placeholder="your@email.com"
                        className="w-full rounded-[10px] px-[14px] py-3 font-dmSans text-[14px] text-[var(--text)] placeholder:font-spaceMono placeholder:text-[10px] placeholder:text-[var(--text-dimmer)] outline-none transition-all duration-200"
                        style={{
                          background: "#131320",
                          border: "1px solid rgba(255,255,255,0.08)",
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = "rgba(59,122,255,0.45)";
                          e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59,122,255,0.1)";
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      />
                      <AnimatePresence>
                        {errors.email && (
                          <motion.p
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="font-spaceMono text-[10px] mt-1" style={{ color: "#ff8888" }}
                          >
                            {errors.email.message}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={sending}
                      className="w-full font-syne font-bold text-[14px] text-white py-[13px] rounded-[10px] cursor-pointer border-none transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                      style={{
                        background: "var(--gradient)",
                        boxShadow: "0 0 20px rgba(59,122,255,0.3)",
                      }}
                      onMouseEnter={(e) => {
                        if (!sending) {
                          e.currentTarget.style.transform = "translateY(-1px)";
                          e.currentTarget.style.boxShadow = "0 4px 28px rgba(59,122,255,0.45)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 0 20px rgba(59,122,255,0.3)";
                      }}
                    >
                      {sending ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                            <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
                          </svg>
                          Sending...
                        </span>
                      ) : (
                        "Send My Idea →"
                      )}
                    </button>
                  </form>

                  {/* Dismiss */}
                  <p
                    className="font-dmSans font-light text-[12px] italic text-[var(--text-dimmer)] text-center mt-3 cursor-pointer hover:text-[var(--text-dim)] transition-colors duration-150"
                    onClick={() => close("dismiss_text")}
                  >
                    No thanks, I&apos;ll figure it out myself
                  </p>
                </>
              ) : (
                /* ── Success State ────────────────────── */
                <div className="text-center py-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ background: "rgba(34,197,94,0.15)" }}
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M5 10l3.5 3.5L15 7" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </motion.div>
                  <h3 className="font-syne font-extrabold text-[22px] text-[var(--text)] mb-2">Got it.</h3>
                  <p className="font-dmSans text-[14px] text-[var(--text-dim)] mb-2">
                    Expect our reply within 24 hours.
                  </p>
                  <p className="font-dmSans font-light text-[13px] italic text-[var(--text-dimmer)]">
                    Honest advice — even if your idea needs pivoting.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
