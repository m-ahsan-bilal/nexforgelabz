"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeader from "@/components/ui/SectionHeader";
import Tag from "@/components/ui/Tag";
import Button from "@/components/ui/Button";
import { useCtaModal } from "@/context/CTAModalContext";
import { useLenis } from "@/components/providers/SmoothScrollProvider";

/* ═══════════════════════════════════════════════════
   PORTFOLIO — Shipped products
   NexForge Labz Design System
   ═══════════════════════════════════════════════════ */

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
};

/* ── Project Data ─────────────────────────────────── */

interface Project {
  id: string;
  name: string;
  tagline: string;
  category: string[];
  industry: string;
  problem: string;
  solution: string;
  tech: string[];
  timeline: string;
  metric: string;
  metricLabel: string;
  demoUrl: string;
  accentColor: string;
}

const PROJECTS: Project[] = [
  {
    id: "reel-n-meal",
    name: "Reel n Meal",
    tagline: "Launched in 4 weeks",
    category: ["B2C", "AI-Powered", "Mobile + Web"],
    industry: "Food & Hospitality",
    problem: "Users waste 20+ minutes trying to find restaurants they see in Instagram/TikTok videos.",
    solution: "Paste any video link → AI extracts restaurant location → Instant info + Google Maps directions.",
    tech: ["Next.js", "OpenAI API", "Google Maps API", "Vercel"],
    timeline: "4 weeks",
    metric: "4 weeks",
    metricLabel: "from idea to launch",
    demoUrl: "#",
    accentColor: "#f97316",
  },
  {
    id: "portikon",
    name: "Portikon",
    tagline: "60-second portfolio generation",
    category: ["B2B", "AI-Powered", "Web"],
    industry: "Developer Tools",
    problem: "Developers spend weeks building portfolios instead of coding actual products.",
    solution: "Upload resume → AI parses + generates live portfolio site → Free hosting on custom subdomain.",
    tech: ["Next.js", "OpenAI", "Vercel", "Custom Design System"],
    timeline: "5 weeks",
    metric: "60 sec",
    metricLabel: "to live portfolio",
    demoUrl: "#",
    accentColor: "#3b7aff",
  },
];

/* ── Case Study Modal ─────────────────────────────── */

function CaseStudyModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const { openModal } = useCtaModal();
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-[rgba(5,5,8,0.85)] backdrop-blur-md" onClick={onClose} />
      <motion.div
        className="relative bg-[var(--surface)] border border-[var(--border)] rounded-3xl max-w-2xl w-full mx-auto p-8 md:p-10 overflow-y-auto"
        style={{ maxHeight: "85vh" }}
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[rgba(255,255,255,0.08)] text-[var(--text-dim)] hover:text-[var(--text)] cursor-pointer bg-transparent border-none">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
        </button>

        <span className="font-spaceMono text-[9px] tracking-[0.15em] uppercase text-[var(--text-dimmer)] mb-2 block">{project.industry}</span>
        <h3 className="font-syne font-extrabold text-2xl text-[var(--text)] mb-1">{project.name}</h3>
        <p className="font-spaceMono text-[12px] mb-6" style={{ color: project.accentColor }}>{project.tagline}</p>

        <div className="space-y-6">
          <div>
            <p className="font-spaceMono text-[9px] tracking-[0.15em] uppercase text-[var(--text-dimmer)] mb-2">THE PROBLEM</p>
            <p className="font-dmSans text-[15px] text-[var(--text-dim)] leading-[1.7]">{project.problem}</p>
          </div>
          <div>
            <p className="font-spaceMono text-[9px] tracking-[0.15em] uppercase text-[var(--text-dimmer)] mb-2">OUR SOLUTION</p>
            <p className="font-dmSans text-[15px] text-[var(--text-dim)] leading-[1.7]">{project.solution}</p>
          </div>
          <div>
            <p className="font-spaceMono text-[9px] tracking-[0.15em] uppercase text-[var(--text-dimmer)] mb-2">TECH STACK</p>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span key={t} className="font-spaceMono text-[10px] text-[var(--text-dimmer)] bg-[rgba(255,255,255,0.04)] border border-[var(--border)] rounded px-2 py-1">{t}</span>
              ))}
            </div>
          </div>
          <div className="text-center pt-4 border-t border-[var(--border)]">
            <p className="font-dmSans text-sm text-[var(--text-dim)] mb-3">Interested in something similar?</p>
            <Button variant="primary" onClick={() => { onClose(); openModal("portfolio"); }}>Get Free Estimate →</Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Project Card ─────────────────────────────────── */

function ProjectCard({ project }: { project: Project }) {
  const [showCase, setShowCase] = useState(false);
  const { openModal } = useCtaModal();

  return (
    <>
      <motion.div
        variants={fadeUp}
        whileHover={{ y: -6, transition: { type: "spring", stiffness: 300, damping: 20 } }}
        className="group bg-[var(--surface)] border border-[var(--border)] rounded-[20px] overflow-hidden"
      >
        {/* Accent line */}
        <div className="h-[3px] transition-shadow duration-300" style={{ backgroundColor: project.accentColor, boxShadow: `0 0 0px ${project.accentColor}00` }} />

        <div className="p-8">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-2">
            {project.category.map((c) => (<Tag key={c} color="blue">{c}</Tag>))}
          </div>
          <span className="font-spaceMono text-[10px] tracking-[0.1em] uppercase text-[var(--text-dimmer)] block mb-3">{project.industry}</span>

          {/* Name & tagline */}
          <h3 className="font-syne font-extrabold text-2xl md:text-3xl text-[var(--text)] mb-1">{project.name}</h3>
          <p className="font-spaceMono text-[12px] mb-4" style={{ color: project.accentColor }}>{project.tagline}</p>

          {/* Problem & Solution */}
          <div className="space-y-4 mb-6">
            <div>
              <p className="font-spaceMono text-[9px] tracking-[0.15em] uppercase text-[var(--text-dimmer)] mb-1">THE PROBLEM</p>
              <p className="font-dmSans text-[14px] text-[var(--text-dim)] leading-[1.7]">{project.problem}</p>
            </div>
            <div>
              <p className="font-spaceMono text-[9px] tracking-[0.15em] uppercase text-[var(--text-dimmer)] mb-1">THE SOLUTION</p>
              <p className="font-dmSans text-[14px] text-[var(--text-dim)] leading-[1.7]">{project.solution}</p>
            </div>
          </div>

          {/* Tech badges */}
          <div className="flex flex-wrap gap-2 mb-6">
            {project.tech.map((t) => (
              <span key={t} className="font-spaceMono text-[10px] text-[var(--text-dimmer)] bg-[rgba(255,255,255,0.04)] border border-[var(--border)] rounded px-2 py-1">{t}</span>
            ))}
          </div>

          {/* Metric */}
          <div className="bg-[rgba(255,255,255,0.03)] border border-[var(--border)] rounded-xl p-5 mb-6 text-center">
            <span className="font-syne font-extrabold text-4xl gradient-text block">{project.metric}</span>
            <span className="font-spaceMono text-[10px] tracking-[0.1em] uppercase text-[var(--text-dimmer)]">{project.metricLabel}</span>
          </div>

          {/* CTAs */}
          <div className="flex gap-3">
            <Button variant="primary" onClick={() => openModal("portfolio")}>View Live Demo →</Button>
            <Button variant="ghost" onClick={() => setShowCase(true)}>Case Study ↗</Button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showCase && <CaseStudyModal project={project} onClose={() => setShowCase(false)} />}
      </AnimatePresence>
    </>
  );
}

/* ── Main Component ───────────────────────────────── */

export default function Portfolio() {
  const { openModal } = useCtaModal();
  return (
    <section id="portfolio" className="py-12 md:py-20 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <SectionHeader
          eyebrow="PORTFOLIO"
          title="Real Products. Live Links. Real Numbers."
          titleHighlight="Live Links. Real Numbers."
          subtitle="Not mockups. Not case study PDFs. Actual shipped products you can open right now."
          align="center"
        />

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {PROJECTS.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </motion.div>

        {/* Upcoming section */}
        <motion.div
          className="text-center"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <p className="font-dmSans text-sm text-[var(--text-dimmer)] mb-6">More projects launching in 2026.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {["E-commerce Platform", "Health & Wellness App", "EdTech Dashboard"].map((name) => (
              <div key={name} className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 opacity-40 blur-[1px]">
                <Tag color="purple">UPCOMING</Tag>
                <p className="font-syne font-bold text-sm text-[var(--text)] mt-3">{name}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
