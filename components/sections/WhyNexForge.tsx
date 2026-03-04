"use client";

import { motion } from "framer-motion";
import SectionHeader from "@/components/ui/SectionHeader";
import Tag from "@/components/ui/Tag";
import Button from "@/components/ui/Button";
import { useCtaModal } from "@/context/CTAModalContext";
import { useLenis } from "@/components/providers/SmoothScrollProvider";

/* ═══════════════════════════════════════════════════
   WHY NEXFORGE — 3-card trust builder
   NexForge Labz Design System
   ═══════════════════════════════════════════════════ */

/* ── Animation ────────────────────────────────────── */

const cardContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

/* ── SVG Icons ────────────────────────────────────── */

function DollarIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════ */

export default function WhyNexForge() {
  const { openModal } = useCtaModal();
  const lenis = useLenis();

  const scrollTo = (target: string) => {
    const el = document.getElementById(target);
    if (el && lenis) {
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
    }
  };

  return (
    <section id="why-nexforge" className="py-12 md:py-20 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* ── Section Header ──────────────────────── */}
        <SectionHeader
          eyebrow="WHY NEXFORGE LABZ"
          title="Built for Founders Who Can't Afford Mistakes"
          titleHighlight="Can't Afford Mistakes"
          subtitle="Three commitments we make to every founder before they sign anything."
          align="center"
        />

        {/* ── Cards Grid ──────────────────────────── */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={cardContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {/* ── CARD 01: Cost Architecture ─────────── */}
          <motion.div
            variants={cardVariants}
            whileHover={{
              y: -8,
              borderColor: "rgba(255,255,255,0.16)",
              transition: { type: "spring", stiffness: 300, damping: 20 },
            }}
            className="group relative bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-7 overflow-hidden"
          >
            {/* Accent bar */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-[var(--accent-blue)] transition-all duration-300 group-hover:shadow-[0_0_12px_rgba(59,122,255,0.4)]" aria-hidden="true" />

            {/* Icon */}
            <div className="w-12 h-12 rounded-full bg-[rgba(59,122,255,0.12)] flex items-center justify-center text-[var(--accent-blue)] mb-5">
              <DollarIcon />
            </div>

            {/* Tag */}
            <div className="mb-4">
              <Tag color="blue">SMART TECH CHOICES</Tag>
            </div>

            {/* Title */}
            <h3 className="font-syne font-bold text-xl text-[var(--text)] mb-3">
              Cost-Effective at Scale
            </h3>

            {/* Body */}
            <p className="font-dmSans text-[15px] text-[var(--text-dim)] leading-[1.75] mb-5">
              Firebase charges $5,000/month when you hit 100k users. Supabase gives you the same features for $200. We always recommend the stack your business can afford to grow with — not the one that maximizes our billable hours.
            </p>

            {/* Comparison visual */}
            <div className="bg-[var(--bg)] border border-[var(--border)] rounded-lg p-3 mb-5">
              <div className="flex items-center justify-between font-spaceMono text-[11px] mb-2">
                <span className="text-[var(--text-dimmer)]">Firebase at scale</span>
                <span className="text-[var(--red)] font-bold">$5,000/mo</span>
              </div>
              <div className="flex items-center justify-between font-spaceMono text-[11px]">
                <span className="text-[var(--text-dimmer)]">Supabase (our choice)</span>
                <span className="text-[var(--green)] font-bold">$200/mo</span>
              </div>
            </div>

            {/* CTA */}
            <Button variant="ghost" onClick={() => scrollTo("tech-stack")} className="text-xs !px-4 !py-2">
              See Our Tech Stack →
            </Button>
          </motion.div>

          {/* ── CARD 02: Zero Ghost Policy ─────────── */}
          <motion.div
            variants={cardVariants}
            whileHover={{
              y: -8,
              borderColor: "rgba(255,255,255,0.16)",
              transition: { type: "spring", stiffness: 300, damping: 20 },
            }}
            className="group relative bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-7 overflow-hidden"
          >
            {/* Accent bar — gradient */}
            <div
              className="absolute top-0 left-0 right-0 h-[3px] transition-all duration-300 group-hover:shadow-[0_0_12px_rgba(255,68,68,0.3)]"
              style={{ background: "linear-gradient(90deg, #ff4444, #8b5cf6)" }}
              aria-hidden="true"
            />

            {/* Icon */}
            <div className="w-12 h-12 rounded-full bg-[rgba(255,68,68,0.1)] flex items-center justify-center text-[var(--red)] mb-5">
              <ShieldIcon />
            </div>

            {/* Tag */}
            <div className="mb-4">
              <Tag color="red">0 ABANDONED PROJECTS</Tag>
            </div>

            {/* Title */}
            <h3 className="font-syne font-bold text-xl text-[var(--text)] mb-3">
              We Don&apos;t Ghost. Ever.
            </h3>

            {/* Body */}
            <p className="font-dmSans text-[15px] text-[var(--text-dim)] leading-[1.75] mb-5">
              We&apos;ve shipped 10+ products. Not one was abandoned. Every week of development, you get a live staging URL — not a vague Slack update. You can click through your product, test it, and give real feedback. No black box. No excuses.
            </p>

            {/* Timeline visual */}
            <div className="bg-[var(--bg)] border border-[var(--border)] rounded-lg p-3 mb-5">
              <div className="flex items-center justify-between font-spaceMono text-[11px] text-[var(--accent-cyan)]">
                <span>Week 1</span>
                <span className="text-[var(--text-dimmer)]">→</span>
                <span>Week 6</span>
                <span className="text-[var(--text-dimmer)]">→</span>
                <span>🚀 Launched</span>
              </div>
            </div>

            {/* CTA */}
            <Button variant="ghost" onClick={() => scrollTo("process")} className="text-xs !px-4 !py-2">
              Our Process →
            </Button>
          </motion.div>

          {/* ── CARD 03: Consultation Value ─────────── */}
          <motion.div
            variants={cardVariants}
            whileHover={{
              y: -8,
              borderColor: "rgba(255,255,255,0.16)",
              transition: { type: "spring", stiffness: 300, damping: 20 },
            }}
            className="group relative bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-7 overflow-hidden"
          >
            {/* Accent bar */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-[var(--accent-cyan)] transition-all duration-300 group-hover:shadow-[0_0_12px_rgba(6,214,214,0.4)]" aria-hidden="true" />

            {/* Icon */}
            <div className="w-12 h-12 rounded-full bg-[rgba(6,214,214,0.12)] flex items-center justify-center text-[var(--accent-cyan)] mb-5">
              <UsersIcon />
            </div>

            {/* Tag */}
            <div className="mb-4">
              <Tag color="cyan">FREE SCOPE ESTIMATE</Tag>
            </div>

            {/* Title */}
            <h3 className="font-syne font-extrabold text-xl leading-[1.1] tracking-[-0.02em] text-[var(--text)] mb-2 mt-3">
              A Brief That Actually Helps
            </h3>

            {/* Body */}
            <p className="font-dmSans font-light text-[14px] text-[var(--text-dim)] leading-[1.7] mb-6">
              Our free estimate isn&apos;t a sales pitch. You&apos;ll get a tech stack recommendation, a realistic timeline, and a clear cost estimate — even if you choose not to hire us. That&apos;s our commitment to every founder who writes.
            </p>

            {/* Bullet list */}
            <div className="space-y-2 mb-5">
              {[
                "Honest feasibility assessment",
                "Tech stack recommendation",
                "Timeline & budget estimate",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <span className="text-[var(--green)] font-spaceMono text-[12px]">✓</span>
                  <span className="font-dmSans text-[13px] text-[var(--text-dim)]">{item}</span>
                </div>
              ))}
            </div>

            {/* CTA — Primary for this card */}
            <Button variant="primary" onClick={() => openModal("why")} className="text-xs !px-5 !py-2.5 w-full">
              Get Free Estimate →
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
