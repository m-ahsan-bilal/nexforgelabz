"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCtaModal } from "@/context/CTAModalContext";

/* ═══════════════════════════════════════════════════
   CTA MODAL — 3-path lead chooser
   A: Quick message  B: Project Brief  C: WhatsApp
   ═══════════════════════════════════════════════════ */

/* eslint-disable @typescript-eslint/no-explicit-any */
function trackEvent(name: string, params?: Record<string, unknown>) {
  try {
    if (typeof window !== "undefined" && "gtag" in window) {
      (window as any).gtag("event", name, params);
    }
  } catch { /* noop */ }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

const WA_URL =
  "https://wa.me/923704125147?text=" +
  encodeURIComponent(
    "Hi NexForge 👋 I want to discuss my project idea. I found you on your website."
  );

/* ── Quick message schema ─────────────────────────── */

const quickSchema = z.object({
  idea: z.string().min(10, "Tell us a bit more — at least 10 characters."),
  email: z.string().email("Please enter a valid email."),
});
type QuickForm = z.infer<typeof quickSchema>;

/* ── Field helpers ────────────────────────────────── */

const fieldBase =
  "w-full rounded-[10px] px-4 py-3 font-dmSans text-[14px] text-[var(--text)] placeholder:text-[var(--text-dimmer)] outline-none transition-all duration-200";
const fieldStyle = {
  background: "rgba(5,5,8,0.55)",
  border: "1px solid rgba(255,255,255,0.08)",
};
function fieldFocus(e: React.FocusEvent<HTMLElement>) {
  e.currentTarget.style.borderColor = "rgba(59,122,255,0.5)";
  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59,122,255,0.1)";
}
function fieldBlur(e: React.FocusEvent<HTMLElement>) {
  e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
  e.currentTarget.style.boxShadow = "none";
}

/* ── Component ────────────────────────────────────── */

export default function CTAModal() {
  const { isOpen, source, closeModal } = useCtaModal();
  const [view, setView] = useState<"chooser" | "quick">("chooser");
  const [quickSent, setQuickSent] = useState(false);
  const [sending, setSending] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<QuickForm>({ resolver: zodResolver(quickSchema) });

  /* Reset on open */
  useEffect(() => {
    if (isOpen) {
      setView("chooser");
      setQuickSent(false);
      reset();
      trackEvent("cta_modal_opened", { source });
    }
  }, [isOpen, source, reset]);

  /* Escape key */
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, closeModal]);

  /* Lock body */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [isOpen]);

  /* ── Quick message submit ───────────────────────── */

  const onQuickSubmit = async (data: QuickForm) => {
    setSending(true);
    try {
      await fetch("/api/exit-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idea: data.idea,
          email: data.email,
          source: "cta_modal_quick",
          trigger: source,
          timestamp: new Date().toISOString(),
        }),
      });
      setQuickSent(true);
      trackEvent("cta_modal_quick_submitted");
      setTimeout(() => closeModal(), 2500);
    } catch { /* noop */ }
    finally { setSending(false); }
  };

  /* ── Option B: scroll to brief ──────────────────── */

  const goToBrief = () => {
    trackEvent("cta_modal_path_selected", { path: "project_brief" });
    closeModal();
    setTimeout(() => {
      const el = document.getElementById("final-cta");
      if (el) {
        window.scrollTo({
          top: el.getBoundingClientRect().top + window.scrollY - 80,
          behavior: "smooth",
        });
        // Highlight pulse
        const card = el.querySelector("[data-brief-card]");
        if (card) {
          card.classList.add("highlight-pulse");
          setTimeout(() => card.classList.remove("highlight-pulse"), 2000);
        }
      }
    }, 150);
  };

  /* ── Option C: WhatsApp ─────────────────────────── */

  const goToWhatsApp = () => {
    trackEvent("cta_modal_path_selected", { path: "whatsapp" });
    trackEvent("cta_modal_whatsapp_click", { source });
    window.open(WA_URL, "_blank", "noopener,noreferrer");
    closeModal();
  };

  /* ── Close with analytics ───────────────────────── */

  const handleClose = () => {
    trackEvent("cta_modal_closed_no_action");
    closeModal();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[1000] flex items-center justify-center"
          style={{ background: "rgba(5,5,8,0.82)", backdropFilter: "blur(10px)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={handleClose}
        >
          <motion.div
            className="relative w-[560px] max-w-[92vw] max-h-[90vh] overflow-y-auto rounded-[24px]"
            style={{
              background: "#0d0d14",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow:
                "0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)",
            }}
            initial={{ scale: 0.92, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 16 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top gradient line */}
            <div
              className="h-[3px] w-full rounded-t-[24px]"
              style={{ background: "var(--gradient)" }}
            />

            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer border-none transition-colors duration-150 z-10"
              style={{ background: "rgba(255,255,255,0.04)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.09)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.04)";
              }}
              aria-label="Close modal"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M4 4L12 12M12 4L4 12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  className="text-[var(--text-dimmer)]"
                />
              </svg>
            </button>

            <div className="p-9">
              <AnimatePresence mode="wait">
                {view === "chooser" && !quickSent && (
                  <motion.div
                    key="chooser"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Header */}
                    <span className="font-spaceMono text-[9px] tracking-[0.15em] uppercase text-[var(--accent-cyan)] block mb-3">
                      FREE — NO COMMITMENT
                    </span>
                    <h2 className="font-syne font-extrabold text-[28px] tracking-[-0.025em] leading-[1.05] mb-1">
                      <span className="text-[var(--text)]">Let&apos;s Find the Right Way to </span>
                      <span className="gradient-text">Connect.</span>
                    </h2>
                    <p className="font-dmSans font-light text-[14px] text-[var(--text-dim)] mb-6">
                      3 ways to start. All free. Pick what works best for you.
                    </p>

                    {/* Options */}
                    <div className="space-y-2.5">
                      {/* Option A — Quick Message */}
                      <motion.button
                        whileHover={{ scale: 1.008 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          trackEvent("cta_modal_path_selected", { path: "quick_message" });
                          setView("quick");
                        }}
                        className="w-full flex items-center gap-4 rounded-[14px] p-[18px_20px] text-left cursor-pointer border transition-all duration-200"
                        style={{
                          background: "rgba(255,255,255,0.025)",
                          borderColor: "rgba(255,255,255,0.07)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                          e.currentTarget.style.borderColor = "rgba(255,255,255,0.13)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "rgba(255,255,255,0.025)";
                          e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                        }}
                      >
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ background: "rgba(6,214,214,0.1)" }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-dmSans font-semibold text-[15px] text-[var(--text)]">Send a Quick Message</p>
                          <p className="font-dmSans font-light text-[12px] text-[var(--text-dim)]">Tell us your idea in one sentence. Reply within 24hrs.</p>
                          <p className="font-spaceMono text-[9px] text-[var(--text-dimmer)] mt-1">Best for: Early ideas & quick questions</p>
                        </div>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--text-dimmer)] flex-shrink-0">
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </motion.button>

                      {/* Option B — Project Brief (FEATURED) */}
                      <motion.button
                        whileHover={{ scale: 1.008 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={goToBrief}
                        className="w-full relative flex items-center gap-4 rounded-[14px] p-[18px_20px] text-left cursor-pointer border transition-all duration-200"
                        style={{
                          background: "rgba(59,122,255,0.07)",
                          borderColor: "rgba(59,122,255,0.25)",
                          boxShadow: "0 0 24px rgba(59,122,255,0.06)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "rgba(59,122,255,0.4)";
                          e.currentTarget.style.boxShadow = "0 0 32px rgba(59,122,255,0.12)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "rgba(59,122,255,0.25)";
                          e.currentTarget.style.boxShadow = "0 0 24px rgba(59,122,255,0.06)";
                        }}
                      >
                        {/* MOST POPULAR badge */}
                        <motion.span
                          className="absolute -top-[9px] left-[18px] font-spaceMono text-[9px] text-white px-2.5 py-[2px] rounded-full"
                          style={{
                            background: "var(--gradient)",
                            boxShadow: "0 0 12px rgba(59,122,255,0.4)",
                          }}
                          animate={{ y: [0, -2, 0] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                          MOST POPULAR
                        </motion.span>

                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ background: "rgba(59,122,255,0.15)" }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-dmSans font-semibold text-[15px] text-[var(--text)]">Submit Your Project Brief</p>
                          <p className="font-dmSans font-light text-[12px] text-[var(--text-dim)]">Describe your product. Get a free scope, stack & cost estimate in 24hrs.</p>
                          <p className="font-spaceMono text-[9px] text-[var(--green)] mt-1">Best for: Founders ready to build in 1–3 months</p>
                        </div>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--text-dimmer)] flex-shrink-0">
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </motion.button>

                      {/* Option C — WhatsApp */}
                      <motion.button
                        whileHover={{ scale: 1.008 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={goToWhatsApp}
                        className="w-full flex items-center gap-4 rounded-[14px] p-[18px_20px] text-left cursor-pointer border transition-all duration-200"
                        style={{
                          background: "rgba(37,211,102,0.04)",
                          borderColor: "rgba(37,211,102,0.15)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "rgba(37,211,102,0.3)";
                          e.currentTarget.style.background = "rgba(37,211,102,0.07)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "rgba(37,211,102,0.15)";
                          e.currentTarget.style.background = "rgba(37,211,102,0.04)";
                        }}
                      >
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ background: "rgba(37,211,102,0.12)" }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="#25d366">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-dmSans font-semibold text-[15px] text-[var(--text)]">Chat on WhatsApp</p>
                          <p className="font-dmSans font-light text-[12px] text-[var(--text-dim)]">Tap to open WhatsApp with a pre-filled message. Fast replies.</p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="relative flex h-1.5 w-1.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25d366] opacity-75" />
                              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#25d366]" />
                            </span>
                            <span className="font-spaceMono text-[10px] text-[var(--text-dimmer)]">Usually online · Fast response</span>
                          </div>
                        </div>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--text-dimmer)] flex-shrink-0">
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </motion.button>
                    </div>

                    {/* Footer */}
                    <div
                      className="mt-6 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2"
                      style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
                    >
                      <span className="font-spaceMono text-[9px] text-[var(--text-dimmer)]">
                        ✓ Free &nbsp;· &nbsp;✓ No sales pitch &nbsp;· &nbsp;✓ Reply in 24hrs
                      </span>
                      <a
                        href="mailto:nexforge.labz@gmail.com"
                        className="font-dmSans text-[12px] text-[var(--text-dimmer)] hover:text-[var(--accent-cyan)] hover:underline transition-colors duration-150"
                      >
                        nexforge.labz@gmail.com
                      </a>
                    </div>
                  </motion.div>
                )}

                {/* ══════════ QUICK MESSAGE VIEW ══════════ */}
                {view === "quick" && !quickSent && (
                  <motion.div
                    key="quick"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Back button */}
                    <button
                      onClick={() => setView("chooser")}
                      className="font-dmSans text-[13px] text-[var(--text-dim)] hover:text-[var(--text)] flex items-center gap-1 mb-4 cursor-pointer border-none bg-transparent transition-colors duration-150"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6" />
                      </svg>
                      Back
                    </button>

                    <h2 className="font-syne font-extrabold text-[26px] tracking-[-0.025em] leading-[1.05] text-[var(--text)] mb-2">
                      Tell Us Your Idea
                    </h2>
                    <p className="font-dmSans font-light text-[14px] text-[var(--text-dim)] mb-5">
                      One sentence is enough. We&apos;ll reply with honest advice within 24 hours.
                    </p>

                    <form onSubmit={handleSubmit(onQuickSubmit)} className="space-y-3">
                      <div>
                        <textarea
                          {...register("idea")}
                          rows={2}
                          placeholder="Your idea in one sentence..."
                          className={`${fieldBase} resize-none`}
                          style={fieldStyle}
                          onFocus={fieldFocus as any}
                          onBlur={fieldBlur as any}
                        />
                        <AnimatePresence>
                          {errors.idea && (
                            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="font-spaceMono text-[10px] mt-1" style={{ color: "#ff8888" }}>
                              {errors.idea.message}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                      <div>
                        <input
                          {...register("email")}
                          type="email"
                          placeholder="your@email.com"
                          className={fieldBase}
                          style={fieldStyle}
                          onFocus={fieldFocus as any}
                          onBlur={fieldBlur as any}
                        />
                        <AnimatePresence>
                          {errors.email && (
                            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="font-spaceMono text-[10px] mt-1" style={{ color: "#ff8888" }}>
                              {errors.email.message}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                      <button
                        type="submit"
                        disabled={sending}
                        className="w-full font-syne font-bold text-[14px] text-white py-[13px] rounded-[10px] cursor-pointer border-none transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                        style={{
                          background: "var(--gradient)",
                          boxShadow: "0 0 20px rgba(59,122,255,0.3)",
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
                          "Send →"
                        )}
                      </button>
                    </form>
                  </motion.div>
                )}

                {/* ══════════ QUICK SUCCESS ══════════ */}
                {quickSent && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 15 }}
                      className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                      style={{ background: "rgba(34,197,94,0.15)" }}
                    >
                      <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
                        <path d="M5 10l3.5 3.5L15 7" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </motion.div>
                    <h3 className="font-syne font-extrabold text-[22px] text-[var(--text)] mb-2">Sent!</h3>
                    <p className="font-dmSans text-[14px] text-[var(--text-dim)]">
                      Expect our reply within 24 hours.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
