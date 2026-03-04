"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";

/* ═══════════════════════════════════════════════════
   TECH STACK — Tabbed technology showcase
   NexForge Labz Design System
   ═══════════════════════════════════════════════════ */

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

const gridStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

/* ── Tech Data ────────────────────────────────────── */

interface TechItem {
  name: string;
  initial: string;
  description: string;
}

interface Category {
  id: string;
  label: string;
  items: TechItem[];
}

const CATEGORIES: Category[] = [
  {
    id: "frontend", label: "Frontend",
    items: [
      { name: "Next.js 15", initial: "N", description: "SSR + SEO. Your web app ranks AND loads fast." },
      { name: "React 19", initial: "R", description: "Component architecture. Maintainable at any scale." },
      { name: "Flutter", initial: "F", description: "One codebase → iOS + Android. 60fps native performance." },
      { name: "Tailwind CSS", initial: "T", description: "Ship UI 3× faster. Consistent design system." },
    ],
  },
  {
    id: "backend", label: "Backend",
    items: [
      { name: "Node.js", initial: "N", description: "Fast, event-driven. Handles 10 users or 1M." },
      { name: "Python (FastAPI)", initial: "P", description: "AI/ML workloads, data processing, async APIs." },
      { name: "Supabase", initial: "S", description: "PostgreSQL + Auth + Storage. Firebase killer." },
      { name: "PostgreSQL", initial: "P", description: "Battle-tested relational DB. Never hits a wall." },
    ],
  },
  {
    id: "ai", label: "AI & ML",
    items: [
      { name: "OpenAI GPT-4o", initial: "O", description: "Best-in-class language model for AI features." },
      { name: "Google Gemini", initial: "G", description: "Multimodal AI: text, image, video understanding." },
      { name: "Pinecone", initial: "P", description: "Vector database for semantic search + RAG systems." },
      { name: "LangChain", initial: "L", description: "LLM orchestration. AI workflows made manageable." },
    ],
  },
  {
    id: "deployment", label: "Deployment",
    items: [
      { name: "Vercel", initial: "V", description: "Zero-config deploys. Edge network. 99.99% uptime." },
      { name: "AWS", initial: "A", description: "Enterprise-grade when you need custom infrastructure." },
      { name: "Docker", initial: "D", description: "Reproducible environments. No more 'works on my machine'." },
      { name: "GitHub Actions", initial: "G", description: "Automated CI/CD. Code ships tested, every time." },
    ],
  },
  {
    id: "tools", label: "Tools",
    items: [
      { name: "TypeScript", initial: "T", description: "Type safety. Fewer bugs. Better developer experience." },
      { name: "Figma", initial: "F", description: "UI/UX design and prototyping before a line is coded." },
      { name: "Linear", initial: "L", description: "Sprint tracking. You always know what's being built." },
      { name: "Stripe", initial: "S", description: "Payments, subscriptions, invoices. PCI compliant." },
    ],
  },
];

/* ── Tech Card ────────────────────────────────────── */

function TechCard({ item }: { item: TechItem }) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ borderColor: "rgba(255,255,255,0.14)", transition: { duration: 0.2 } }}
      className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5"
    >
      <div className="w-8 h-8 rounded-full bg-[rgba(255,255,255,0.06)] flex items-center justify-center mb-3">
        <span className="font-syne font-bold text-sm gradient-text">{item.initial}</span>
      </div>
      <h4 className="font-syne font-bold text-[15px] text-[var(--text)] mb-1">{item.name}</h4>
      <p className="font-dmSans text-[13px] text-[var(--text-dim)] leading-[1.6]">{item.description}</p>
    </motion.div>
  );
}

/* ── Main Component ───────────────────────────────── */

export default function TechStack() {
  const [activeTab, setActiveTab] = useState("frontend");
  const activeCategory = CATEGORIES.find((c) => c.id === activeTab)!;

  return (
    <section id="tech-stack" className="py-12 md:py-20 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <SectionHeader
          eyebrow="TECH STACK"
          title="We Choose Tech That Saves You Money at Scale"
          titleHighlight="Saves You Money at Scale"
          subtitle="Not trendy. Not what we're comfortable with. What your business needs."
          align="center"
        />

        {/* ── Tabs ─────────────────────────────────── */}
        <div className="flex justify-center gap-1 mb-10 overflow-x-auto pb-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`font-spaceMono text-[11px] tracking-[0.05em] px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer border-none bg-transparent whitespace-nowrap ${
                activeTab === cat.id
                  ? "text-[var(--text)] bg-[rgba(255,255,255,0.06)]"
                  : "text-[var(--text-dimmer)] hover:text-[var(--text-dim)]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* ── Tab Content ──────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8"
              variants={gridStagger}
              initial="hidden"
              animate="visible"
            >
              {activeCategory.items.map((item) => (
                <TechCard key={item.name} item={item} />
              ))}
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* ── Supabase vs Firebase highlight ────────── */}
        {activeTab === "backend" && (
          <motion.div
            className="border border-[rgba(34,197,94,0.2)] bg-[rgba(34,197,94,0.03)] rounded-2xl p-6 md:p-8 mb-8"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-center">
              <div>
                <p className="font-spaceMono text-[10px] tracking-[0.1em] uppercase text-[var(--text-dimmer)] mb-1">Firebase at 100k users</p>
                <p className="font-syne font-extrabold text-2xl text-[var(--red)]">$5,000/month</p>
              </div>
              <span className="font-spaceMono text-[var(--text-dimmer)] text-sm">vs</span>
              <div>
                <p className="font-spaceMono text-[10px] tracking-[0.1em] uppercase text-[var(--text-dimmer)] mb-1">Supabase at 100k users</p>
                <p className="font-syne font-extrabold text-2xl text-[var(--green)]">$200/month</p>
                <p className="font-spaceMono text-[10px] text-[var(--green)] mt-1">✓ Our recommendation</p>
              </div>
            </div>
            <p className="font-dmSans text-[13px] text-[var(--text-dim)] text-center mt-4 max-w-lg mx-auto">
              Same features. Same reliability. 96% cheaper. We always recommend what&apos;s right for YOUR business.
            </p>
          </motion.div>
        )}

        {/* ── Bottom copy ──────────────────────────── */}
        <motion.div
          className="text-center mt-12"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <p className="font-dmSans font-light text-base text-[var(--text-dim)] max-w-2xl mx-auto mb-6 leading-[1.7]">
            We don&apos;t chase trends. Every technology choice is justified by your product requirements, team capabilities, and long-term cost. We&apos;ll explain every decision in your free consultation.
          </p>
          <Button variant="ghost" onClick={() => { const el = document.getElementById("final-cta"); if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" }); }}>Discuss Your Tech Stack →</Button>
        </motion.div>
      </div>
    </section>
  );
}
