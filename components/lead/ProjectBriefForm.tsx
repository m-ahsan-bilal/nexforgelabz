"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

/* ═══════════════════════════════════════════════════
   PROJECT BRIEF FORM — Replaces Calendly entirely
   Lead qualification via commitment escalation,
   reciprocity loop, and specificity bias.
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

/* ── Schema ───────────────────────────────────────── */

const briefSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email."),
  idea: z
    .string()
    .min(30, "Tell us a bit more — at least 30 characters.")
    .max(1000, "Please keep it under 1000 characters."),
  budget: z.enum(
    ["2k-5k", "5k-10k", "10k-20k", "20k+","unsure"],
    { required_error: "Please select a budget range." }
  ),
  source: z.string().optional(),
});

type BriefForm = z.infer<typeof briefSchema>;

/* ── Budget pills config ──────────────────────────── */

const BUDGETS: { value: BriefForm["budget"]; label: string }[] = [
  { value: "2k-5k", label: "$2k-5k" },
  { value: "5k-10k", label: "$5k-10k" },
  { value: "10k-20k", label: "$10k-20k" },
  { value: "20k+", label: "$20k+" },
  { value: "unsure", label: "Not sure yet" },
];

const SOURCES = [
  "Twitter/X",
  "LinkedIn",
  "Google",
  "Referral from someone",
  "Other",
];

/* ── Shared field classes ─────────────────────────── */

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

export default function ProjectBriefForm() {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BriefForm>({
    resolver: zodResolver(briefSchema),
    defaultValues: { source: "" },
  });

  const ideaValue = watch("idea") || "";
  const budgetValue = watch("budget");

  /* Track form start */
  useEffect(() => {
    if (!hasStarted) return;
    trackEvent("brief_form_started");
  }, [hasStarted]);

  /* Auto-grow textarea */
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    const maxH = 7 * 24; // ~7 rows
    ta.style.height = Math.min(ta.scrollHeight, maxH) + "px";
  }, [ideaValue]);

  /* ── Submit ─────────────────────────────────────── */

  const onSubmit = async (data: BriefForm) => {
    setSending(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/project-brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          timestamp: new Date().toISOString(),
        }),
      });

      if (res.status === 429) {
        setSubmitError("rate_limit");
        trackEvent("brief_form_error", { type: "rate_limit" });
        return;
      }

      if (!res.ok) {
        setSubmitError("server");
        trackEvent("brief_form_error", { type: "server" });
        return;
      }

      setSubmitted(true);
      trackEvent("brief_form_submitted");
    } catch {
      setSubmitError("server");
      trackEvent("brief_form_error", { type: "server" });
    } finally {
      setSending(false);
    }
  };

  /* ── Textarea ref merge ─────────────────────────── */
  const { ref: ideaRef, ...ideaRest } = register("idea");

  /* ── Char counter color ─────────────────────────── */
  const charColor =
    ideaValue.length >= 950
      ? "text-red-400"
      : ideaValue.length >= 800
        ? "text-yellow-400"
        : "text-[var(--text-dimmer)]";

  return (
    <section
      id="final-cta"
      className="py-16 md:py-24 relative"
      style={{ background: "#0d0d14" }}
    >
      {/* Background effects */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 50% 0%, rgba(59,122,255,0.08) 0%, transparent 55%), repeating-linear-gradient(45deg, rgba(255,255,255,0.01) 0px 1px, transparent 1px 8px)",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: "rgba(255,255,255,0.06)" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-[45%_55%] gap-12 lg:gap-16 items-start">
          {/* ══════════ LEFT COLUMN ══════════ */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Eyebrow */}
            <span className="font-spaceMono text-[9px] tracking-[0.15em] uppercase text-[var(--accent-cyan)] mb-4 block">
              GET A FREE ESTIMATE
            </span>

            {/* Headline */}
            <h2 className="font-syne font-extrabold text-[32px] md:text-[44px] tracking-[-0.03em] leading-[1.05] text-[var(--text)] mb-1">
              Not Ready
            </h2>
            <h2 className="font-syne font-extrabold text-[32px] md:text-[44px] tracking-[-0.03em] leading-[1.05] text-[var(--text)] mb-1">
              for a Call?
            </h2>
            <h2 className="font-syne font-extrabold text-[32px] md:text-[44px] tracking-[-0.03em] leading-[1.05] gradient-text mb-6">
              Tell Us Your Project.
            </h2>

            {/* Body */}
            <p className="font-dmSans font-light text-[16px] text-[var(--text-dim)] leading-[1.75] mb-6 max-w-[380px]">
              Describe your idea below and we&apos;ll send you a free scope
              estimate — tech stack, timeline, and ballpark cost — within 24
              hours. No call required. No sales pitch.
            </p>

            {/* Value props */}
            <div className="space-y-3.5 mb-5">
              {[
                {
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                    </svg>
                  ),
                  text: "Response within 24 hours, guaranteed",
                },
                {
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
                    </svg>
                  ),
                  text: "Tech stack + cost breakdown included",
                },
                {
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  ),
                  text: "Honest advice even if we're not the right fit",
                },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-2.5">
                  <span className="text-[var(--accent-cyan)] flex-shrink-0">{item.icon}</span>
                  <span className="font-dmSans text-[14px] text-[var(--text-dim)]">{item.text}</span>
                </div>
              ))}
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-2.5 mt-5">
              <div className="flex -space-x-2.5">
                {[
                  { initials: "SJ", grad: "from-blue-500 to-purple-500" },
                  { initials: "AR", grad: "from-purple-500 to-cyan-400" },
                  { initials: "MK", grad: "from-cyan-400 to-green-400" },
                ].map((a, i) => (
                  <div
                    key={a.initials}
                    className={`w-8 h-8 rounded-full bg-gradient-to-br ${a.grad} flex items-center justify-center text-[10px] font-bold text-white border-2 border-[#0d0d14]`}
                    style={{ zIndex: 3 - i }}
                  >
                    {a.initials}
                  </div>
                ))}
              </div>
              <span className="font-spaceMono text-[10px] text-[var(--text-dimmer)]">
                10+ founders got their free estimate this month
              </span>
            </div>
          </motion.div>

          {/* ══════════ RIGHT COLUMN — FORM CARD ══════════ */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          >
            <div
              data-brief-card
              className="rounded-[20px] p-7 md:p-9"
              style={{
                background: "rgba(5,5,8,0.4)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <AnimatePresence mode="wait">
                {!submitted ? (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-5"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.25 }}
                  >
                    {/* Field 1 — Name */}
                    <div>
                      <label className="font-dmSans font-medium text-[13px] text-[var(--text)] block mb-1.5">
                        What should we call you?
                      </label>
                      <input
                        {...register("name")}
                        placeholder="Alex, Sam..."
                        className={fieldBase}
                        style={fieldStyle}
                        onFocus={fieldFocus as any}
                        onBlur={(e) => {
                          fieldBlur(e);
                          if (!hasStarted) setHasStarted(true);
                        }}
                      />
                      <FieldError error={errors.name?.message} />
                    </div>

                    {/* Field 2 — Email */}
                    <div>
                      <label className="font-dmSans font-medium text-[13px] text-[var(--text)] block mb-1.5">
                        Where should we send your estimate?
                      </label>
                      <input
                        {...register("email")}
                        type="email"
                        placeholder="your@email.com"
                        className={fieldBase}
                        style={fieldStyle}
                        onFocus={fieldFocus as any}
                        onBlur={fieldBlur as any}
                      />
                      <FieldError error={errors.email?.message} />
                    </div>

                    {/* Field 3 — Project Idea */}
                    <div>
                      <label className="font-dmSans font-medium text-[13px] text-[var(--text)] block mb-0.5">
                        Describe your product idea
                      </label>
                      <span className="font-dmSans font-light text-[11px] italic text-[var(--text-dimmer)] block mb-1.5">
                        What problem does it solve and who&apos;s it for?
                      </span>
                      <div className="relative">
                        <textarea
                          {...ideaRest}
                          ref={(el) => {
                            ideaRef(el);
                            textareaRef.current = el;
                          }}
                          rows={4}
                          placeholder="Example: An app for restaurant owners to post daily specials, and customers to discover them on a map. Thinking mobile-first..."
                          className={`${fieldBase} resize-none`}
                          style={fieldStyle}
                          onFocus={fieldFocus as any}
                          onBlur={fieldBlur as any}
                        />
                        <span
                          className={`absolute bottom-2 right-3 font-spaceMono text-[9px] ${charColor} pointer-events-none`}
                        >
                          {ideaValue.length}/1000
                        </span>
                      </div>
                      <FieldError error={errors.idea?.message} />
                    </div>

                    {/* Field 4 — Budget pills */}
                    <div>
                      <label className="font-dmSans font-medium text-[13px] text-[var(--text)] block mb-0.5">
                        What&apos;s your rough budget range?
                      </label>
                      <span className="font-dmSans font-light text-[11px] italic text-[var(--text-dimmer)] block mb-2.5">
                        Helps us scope the right solution
                      </span>
                      <input type="hidden" {...register("budget")} />
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                        {BUDGETS.map((b) => {
                          const selected = budgetValue === b.value;
                          return (
                            <motion.button
                              key={b.value}
                              type="button"
                              whileTap={{ scale: 0.96 }}
                              onClick={() => {
                                setValue("budget", b.value, { shouldValidate: true });
                                trackEvent("brief_budget_selected", { budget: b.value });
                              }}
                              className={`rounded-[10px] py-2.5 px-3 font-spaceMono text-[10px] tracking-[0.02em] cursor-pointer transition-all duration-200 border ${
                                selected
                                  ? "text-white border-transparent"
                                  : "text-[var(--text-dim)] border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.16)] hover:bg-[rgba(255,255,255,0.07)]"
                              }`}
                              style={
                                selected
                                  ? {
                                      background: "var(--gradient)",
                                      boxShadow: "0 0 16px rgba(59,122,255,0.3)",
                                    }
                                  : { background: "rgba(255,255,255,0.04)" }
                              }
                            >
                              {b.label}
                            </motion.button>
                          );
                        })}
                      </div>
                      <FieldError error={errors.budget?.message} />
                    </div>

                    {/* Field 5 — Source */}
                    <div>
                      <label className="font-dmSans font-medium text-[13px] text-[var(--text)] block mb-1.5">
                        How did you find us?{" "}
                        <span className="font-light text-[var(--text-dimmer)]">(optional)</span>
                      </label>
                      <div className="relative">
                        <select
                          {...register("source")}
                          className={`${fieldBase} appearance-none pr-10 cursor-pointer`}
                          style={fieldStyle}
                          onFocus={fieldFocus as any}
                          onBlur={fieldBlur as any}
                          defaultValue=""
                        >
                          <option value="" disabled>
                            Select one...
                          </option>
                          {SOURCES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                        {/* Custom chevron */}
                        <svg
                          className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-dimmer)]"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </div>
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={sending}
                      className="w-full font-syne font-bold text-[15px] text-white py-[15px] rounded-[12px] cursor-pointer border-none transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                      style={{
                        background: submitError === "server"
                          ? "#ff4444"
                          : "var(--gradient)",
                        boxShadow: "0 0 24px rgba(59,122,255,0.3)",
                      }}
                      onMouseEnter={(e) => {
                        if (!sending) {
                          e.currentTarget.style.transform = "translateY(-1px)";
                          e.currentTarget.style.boxShadow = "0 4px 32px rgba(59,122,255,0.45)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 0 24px rgba(59,122,255,0.3)";
                      }}
                    >
                      {sending ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                            <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
                          </svg>
                          Sending your brief...
                        </span>
                      ) : submitError === "rate_limit" ? (
                        "Too many tries — chat on WhatsApp ↗"
                      ) : submitError === "server" ? (
                        "Failed — try WhatsApp ↗"
                      ) : (
                        "Send My Project Brief →"
                      )}
                    </button>

                    {/* Error WA fallback */}
                    {submitError && (
                      <p className="text-center">
                        <a
                          href="https://wa.me/923704125147?text=Hi%20NexForge%20%F0%9F%91%8B%20I%20want%20to%20discuss%20my%20project%20idea."
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-dmSans text-[12px] text-[var(--accent-cyan)] underline"
                        >
                          Or message us directly on WhatsApp →
                        </a>
                      </p>
                    )}

                    {/* Risk reversal */}
                    <p className="font-dmSans font-light text-[12px] italic text-[var(--text-dimmer)] text-center mt-3">
                      We&apos;ll reply personally within 24 hours — even if
                      we&apos;re not the right fit, you&apos;ll get clarity.
                    </p>
                  </motion.form>
                ) : (
                  /* ══════════ SUCCESS STATE ══════════ */
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="text-center py-10"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 15 }}
                      className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                      style={{ background: "rgba(34,197,94,0.15)" }}
                    >
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                    </motion.div>

                    <h3 className="font-syne font-extrabold text-[28px] text-[var(--text)] mb-2">
                      Brief Received. We&apos;re On It.
                    </h3>
                    <p className="font-dmSans text-[15px] text-[var(--text-dim)] mb-2 max-w-xs mx-auto">
                      Expect a personalized scope estimate in your inbox within
                      24 hours.
                    </p>
                    <p className="font-spaceMono text-[10px] text-[var(--text-dimmer)] mb-6">
                      Check spam if you don&apos;t see it.
                    </p>

                    <a
                      href="https://wa.me/923704125147?text=Hi%20NexForge%20%F0%9F%91%8B%20I%20just%20submitted%20a%20project%20brief."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 font-dmSans text-[13px] text-[var(--text-dim)] border border-[rgba(255,255,255,0.1)] rounded-[10px] px-5 py-2.5 hover:border-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.04)] transition-all duration-200"
                    >
                      Urgent? Chat on WhatsApp →
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ── Inline error component ───────────────────────── */

function FieldError({ error }: { error?: string }) {
  return (
    <AnimatePresence>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="font-spaceMono text-[10px] mt-1"
          style={{ color: "#ff8888" }}
        >
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  );
}
