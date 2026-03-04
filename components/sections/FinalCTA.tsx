"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";
import GlowOrb from "@/components/ui/GlowOrb";

/* ═══════════════════════════════════════════════════
   FINAL CTA — Consultation booking section
   NexForge Labz Design System
   ═══════════════════════════════════════════════════ */

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1], delay } },
});

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.3 } },
};

const checkItem = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

/* ── Checklist items ──────────────────────────────── */

const CHECKS = [
  "Honest feasibility assessment of your idea",
  "Recommended tech stack with cost breakdown",
  "Realistic timeline + budget estimate",
  "Clear next steps (even if you don't hire us)",
];

/* ── Component ────────────────────────────────────── */

export default function FinalCTA() {
  const [showForm, setShowForm] = useState(false);
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  const [showCalendly, setShowCalendly] = useState(false);

  /* ── Lazy load Calendly ─────────────────────────── */
  useEffect(() => {
    const el = calendarRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setShowCalendly(true); },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  /* ── Form submit ────────────────────────────────── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) return;
    setLoading(true);
    // Simulate API call (replace with actual Resend API)
    await new Promise((r) => setTimeout(r, 1500));
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <section
      id="final-cta"
      className="py-12 md:py-20 relative bg-[var(--surface)] border-t border-[var(--border)]"
    >
      {/* Background effects */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "repeating-linear-gradient(45deg, rgba(255,255,255,0.012) 0px, rgba(255,255,255,0.012) 1px, transparent 1px, transparent 8px)",
        }}
        aria-hidden="true"
      />
      <GlowOrb color="purple" size={500} opacity={0.08} position={{ top: "-15%", left: "30%" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* ── Left Column ────────────────────────── */}
          <motion.div
            variants={fadeUp(0)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            {/* Eyebrow */}
            <span className="font-spaceMono text-[10px] tracking-[0.15em] uppercase text-[var(--accent-cyan)] mb-4 block">
              FREE 30-MIN CONSULTATION
            </span>

            {/* Headline */}
            <h2 className="font-syne font-extrabold text-4xl md:text-5xl tracking-tight leading-[1.1] text-[var(--text)] mb-2">
              Got an Idea?
            </h2>
            <h2 className="font-syne font-extrabold text-4xl md:text-5xl tracking-tight leading-[1.1] gradient-text mb-6">
              Let&apos;s Talk About It.
            </h2>

            {/* Description */}
            <p className="font-dmSans font-light text-[17px] text-[var(--text-dim)] leading-[1.7] mb-8 max-w-lg">
              Jump on a free 30-minute call with us. No pitch, no pressure — just a real conversation about your product and what it takes to build it.
            </p>

            {/* Checklist */}
            <motion.div
              className="space-y-3 mb-6"
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {CHECKS.map((item) => (
                <motion.div key={item} variants={checkItem} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-purple)] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5L4 7L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </span>
                  <span className="font-dmSans text-[15px] text-[var(--text)] leading-[1.6]">{item}</span>
                </motion.div>
              ))}
            </motion.div>

            <p className="font-dmSans font-light text-[13px] text-[var(--text-dimmer)] italic mb-8">
                  Even if we&apos;re not the right fit, you&apos;ll walk away with something useful.
            </p>

            {/* Scarcity block */}
            <div className="border border-[rgba(245,158,11,0.2)] bg-[rgba(245,158,11,0.05)] rounded-[10px] p-4 mb-6">
              <div className="flex items-start gap-2.5">
                <span className="relative flex h-2 w-2 mt-1.5 flex-shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--yellow)] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--yellow)]" />
                </span>
                <span className="font-spaceMono text-[11px] text-[var(--yellow)] leading-[1.6]">
                  🔥 We only take on 3 projects at a time so we can give each one our best. 1 spot left for April 2026.
                </span>
              </div>
            </div>

            {/* Alternative contact */}
            <p className="font-dmSans text-[13px] text-[var(--text-dimmer)] mb-3">
              Prefer to write? Send your project details.
            </p>

            {!showForm && !submitted && (
              <Button variant="ghost" onClick={() => setShowForm(true)} className="text-xs !px-4 !py-2">
                Send Project Details →
              </Button>
            )}

            {/* Contact Form */}
            <AnimatePresence>
              {showForm && !submitted && (
                <motion.form
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden mt-4"
                  onSubmit={handleSubmit}
                >
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Your name"
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      required
                      className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg px-4 py-3 font-dmSans text-sm text-[var(--text)] placeholder:text-[var(--text-dimmer)] focus:outline-none focus:border-[var(--accent-blue)] transition-colors"
                    />
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      required
                      className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg px-4 py-3 font-dmSans text-sm text-[var(--text)] placeholder:text-[var(--text-dimmer)] focus:outline-none focus:border-[var(--accent-blue)] transition-colors"
                    />
                    <textarea
                      placeholder="Tell us about your project..."
                      rows={4}
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      required
                      className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg px-4 py-3 font-dmSans text-sm text-[var(--text)] placeholder:text-[var(--text-dimmer)] focus:outline-none focus:border-[var(--accent-blue)] transition-colors resize-none"
                    />
                    <Button variant="secondary" loading={loading}>
                      Send →
                    </Button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Success state */}
            <AnimatePresence>
              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 flex items-center gap-2"
                >
                  <span className="text-[var(--green)] font-spaceMono text-sm">✓</span>
                  <span className="font-dmSans text-sm text-[var(--green)]">Sent! We&apos;ll reply within 24 hours.</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* ── Right Column — Calendly ─────────────── */}
          <motion.div
            ref={calendarRef}
            variants={fadeUp(0.2)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            <div className="bg-[rgba(13,13,20,0.5)] border border-[var(--border)] rounded-[20px] overflow-hidden">
              <div className="px-6 py-4 border-b border-[var(--border)]">
                <p className="font-dmSans font-medium text-sm text-[var(--text-dim)]">
                  Pick a time that works for you 👇
                </p>
              </div>

              {showCalendly ? (
                <iframe
                  src="https://calendly.com/nexforgelabz/30min?hide_gdpr_banner=1&primary_color=3b7aff"
                  className="w-full border-none"
                  style={{ height: "600px" }}
                  title="Book a consultation"
                  loading="lazy"
                />
              ) : (
                <div className="h-[600px] flex items-center justify-center">
                  <span className="font-spaceMono text-[11px] text-[var(--text-dimmer)]">Loading calendar...</span>
                </div>
              )}

              <div className="px-6 py-3 border-t border-[var(--border)] text-center">
                <span className="font-spaceMono text-[10px] tracking-[0.05em] text-[var(--text-dimmer)]">
                  Response within 24 hours guaranteed
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
