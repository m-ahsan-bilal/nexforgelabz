"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";
import { useCtaModal } from "@/context/CTAModalContext";
import { useLenis } from "@/components/providers/SmoothScrollProvider";

/* ═══════════════════════════════════════════════════
   PROCESS — 6-Week Timeline
   NexForge Labz Design System
   ═══════════════════════════════════════════════════ */

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

const nodeStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.3 } },
};

const nodeVariant = {
  hidden: { opacity: 0, scale: 0.6 },
  visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300, damping: 20 } },
};

/* ── Week Data ────────────────────────────────────── */

interface Week {
  week: string;
  label: string;
  title: string;
  subtitle: string;
  deliverable: string;
  items: string[];
  color: string;
}

const WEEKS: Week[] = [
  {
    week: "01", label: "WEEK 1", title: "Discovery & Architecture",
    subtitle: "We map every decision before writing a line of code.",
    deliverable: "📄 Project roadmap + UI mockups",
    items: ["Kickoff call (2 hours, recorded)", "Requirements documentation", "Tech stack finalization", "Database schema design", "UI/UX wireframes in Figma", "Timeline confirmation"],
    color: "#3b7aff",
  },
  {
    week: "02", label: "WEEK 2", title: "Foundation Build",
    subtitle: "Core infrastructure goes live. You get your first staging URL.",
    deliverable: "🔗 Live staging environment",
    items: ["Authentication system", "Database deployed (Supabase)", "Core API endpoints", "Base UI components", "CI/CD pipeline configured", "First staging deploy"],
    color: "#5b6af5",
  },
  {
    week: "03", label: "WEEK 3", title: "Core Features",
    subtitle: "Your main features are built. Weekly demo call happens here.",
    deliverable: "🎥 Live demo call #1",
    items: ["Primary user flows built", "Main screens implemented", "API integrations (Stripe, etc.)", "Weekly 1-hour demo call", "Feedback loop begins", "Iteration list created"],
    color: "#7b5cf6",
  },
  {
    week: "04", label: "WEEK 4", title: "Iteration Sprint",
    subtitle: "We refine based on your feedback. Second demo call.",
    deliverable: "🎥 Live demo call #2",
    items: ["Feedback implemented", "Secondary screens built", "Edge case handling", "Performance optimization", "Mobile responsiveness", "Second weekly demo"],
    color: "#964fe8",
  },
  {
    week: "05", label: "WEEK 5", title: "Polish & QA",
    subtitle: "Bugs squashed. Performance tuned. Everything tested.",
    deliverable: "✅ QA-approved staging build",
    items: ["Full QA testing", "Performance audit (Lighthouse 95+)", "Security review", "Analytics integration", "SEO setup (Next.js)", "Documentation draft"],
    color: "#a842d4",
  },
  {
    week: "06", label: "WEEK 6", title: "Launch 🚀",
    subtitle: "Your product goes live. Source code delivered.",
    deliverable: "🌐 Live production URL",
    items: ["Production deployment", "Domain & DNS setup", "Full source code handoff", "Technical documentation", "2 weeks free support begins", "Celebration call 🎉"],
    color: "#06d6d6",
  },
];

/* ── Week Node ────────────────────────────────────── */

function WeekNode({ week, isExpanded, onToggle }: { week: Week; isExpanded: boolean; onToggle: () => void }) {
  return (
    <motion.div variants={nodeVariant} className="flex-shrink-0 w-[220px] lg:w-[200px]">
      {/* Circle + Label */}
      <div className="flex flex-col items-center mb-4 cursor-pointer" onClick={onToggle}>
        <span className="font-spaceMono text-[9px] tracking-[0.1em] text-[var(--accent-cyan)] mb-2">{week.label}</span>
        <div
          className="w-5 h-5 rounded-full border-2 transition-all duration-300"
          style={{
            borderColor: week.color,
            background: isExpanded ? week.color : "transparent",
            boxShadow: isExpanded ? `0 0 12px ${week.color}80` : "none",
          }}
        />
      </div>

      {/* Content */}
      <div className="text-center px-2">
        <h4 className="font-syne font-bold text-sm text-[var(--text)] mb-1">{week.title}</h4>
        <p className="font-dmSans text-[12px] text-[var(--text-dim)] leading-[1.5] mb-2">{week.subtitle}</p>
        <span className="inline-block font-spaceMono text-[10px] text-[var(--text-dimmer)] bg-[rgba(255,255,255,0.04)] border border-[var(--border)] rounded-full px-2.5 py-1">
          {week.deliverable}
        </span>
      </div>

      {/* Expandable items */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-4 space-y-1.5 px-2">
              {week.items.map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <span className="font-spaceMono text-[10px] mt-0.5" style={{ color: week.color }}>✓</span>
                  <span className="font-dmSans text-[12px] text-[var(--text-dim)]">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── Mobile Week ──────────────────────────────────── */

function MobileWeekNode({ week, isExpanded, onToggle }: { week: Week; isExpanded: boolean; onToggle: () => void }) {
  return (
    <motion.div variants={fadeUp} className="flex gap-4 relative">
      {/* Vertical line + circle */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div
          className="w-4 h-4 rounded-full border-2 z-10 bg-[var(--bg)]"
          style={{ borderColor: week.color, background: isExpanded ? week.color : "var(--bg)" }}
        />
        <div className="w-px flex-1 bg-gradient-to-b from-[rgba(59,122,255,0.2)] to-[rgba(6,214,214,0.2)]" />
      </div>

      {/* Content */}
      <div className="pb-8 flex-1 cursor-pointer" onClick={onToggle}>
        <span className="font-spaceMono text-[9px] tracking-[0.1em] text-[var(--accent-cyan)] mb-1 block">{week.label}</span>
        <h4 className="font-syne font-bold text-base text-[var(--text)] mb-1">{week.title}</h4>
        <p className="font-dmSans text-[13px] text-[var(--text-dim)] leading-[1.6] mb-2">{week.subtitle}</p>
        <span className="inline-block font-spaceMono text-[10px] text-[var(--text-dimmer)] bg-[rgba(255,255,255,0.04)] border border-[var(--border)] rounded-full px-2.5 py-1 mb-2">
          {week.deliverable}
        </span>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-3 space-y-1.5">
                {week.items.map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <span className="font-spaceMono text-[10px] mt-0.5" style={{ color: week.color }}>✓</span>
                    <span className="font-dmSans text-[12px] text-[var(--text-dim)]">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ── Main Component ───────────────────────────────── */

export default function Process() {
  const { openModal } = useCtaModal();
  const [expandedWeek, setExpandedWeek] = useState<string | null>(null);
  const lenis = useLenis();

  const toggle = (week: string) => {
    setExpandedWeek((prev) => (prev === week ? null : week));
  };

  return (
    <section id="process" className="py-12 md:py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <SectionHeader
          eyebrow="THE PROCESS"
          title="Here's Exactly How 6 Weeks Works"
          titleHighlight="6 Weeks Works"
          subtitle="No black box. Every week has a concrete deliverable you can see, click, and verify."
          align="center"
        />

        {/* ── Desktop: Horizontal Timeline ─────────── */}
        <div className="hidden md:block">
          {/* Timeline container */}
          <div className="relative">
            {/* Connecting line */}
            <motion.div
              className="absolute top-[42px] left-[110px] right-[110px] h-[2px]"
              style={{ background: "linear-gradient(90deg, #3b7aff, #8b5cf6, #06d6d6)" }}
              initial={{ scaleX: 0, originX: 0, opacity: 0.3 }}
              whileInView={{ scaleX: 1, opacity: 0.3 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
              aria-hidden="true"
            />

            <motion.div
              className="flex justify-between"
              variants={nodeStagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
            >
              {WEEKS.map((w) => (
                <WeekNode
                  key={w.week}
                  week={w}
                  isExpanded={expandedWeek === w.week}
                  onToggle={() => toggle(w.week)}
                />
              ))}
            </motion.div>
          </div>
        </div>

        {/* ── Mobile: Vertical Timeline ────────────── */}
        <motion.div
          className="md:hidden"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
        >
          {WEEKS.map((w) => (
            <MobileWeekNode
              key={w.week}
              week={w}
              isExpanded={expandedWeek === w.week}
              onToggle={() => toggle(w.week)}
            />
          ))}
        </motion.div>

        {/* ── Bottom CTA ──────────────────────────── */}
        <motion.div
          className="text-center mt-16"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <p className="font-syne font-bold text-xl text-[var(--text)] mb-4">
            Ready to start Week 1?
          </p>
          <Button variant="primary" onClick={() => {
            openModal("process");
          }}>
            Send Your Brief →
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
