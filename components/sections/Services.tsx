"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeader from "@/components/ui/SectionHeader";
import Tag from "@/components/ui/Tag";
import Button from "@/components/ui/Button";
import { useLenis } from "@/components/providers/SmoothScrollProvider";

/* ═══════════════════════════════════════════════════
   SERVICES — What we build
   NexForge Labz Design System
   ═══════════════════════════════════════════════════ */

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

/* ── Icons ────────────────────────────────────────── */
function RocketIcon() {
  return (<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>);
}
function SmartphoneIcon() {
  return (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>);
}
function MonitorIcon() {
  return (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>);
}
function ZapIcon() {
  return (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>);
}
function LayersIcon() {
  return (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22.54 12.43-1.42-.65-8.28 3.78a2 2 0 0 1-1.66 0l-8.29-3.78-1.42.65a1 1 0 0 0 0 1.82l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22.54 17.43-1.42-.65-8.28 3.78a2 2 0 0 1-1.66 0l-8.29-3.78-1.42.65a1 1 0 0 0 0 1.82l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/></svg>);
}

/* ── Service Data ─────────────────────────────────── */

interface ServiceItem {
  icon: React.ReactNode;
  title: string;
  outcome: string;
  tagline: string;
  timeline: string;
  price: string;
  badge?: { text: string; color: "red" | "purple" | "yellow" | "blue" | "cyan" | "green" };
  checks: string[];
  cta: string;
  tech: string[];
}

const GRID_SERVICES: ServiceItem[] = [
  {
    icon: <SmartphoneIcon />,
    title: "Mobile Apps",
    outcome: "One App. Every iPhone and Android.",
    tagline: "Flutter cross-platform. Native 60fps performance. App Store + Play Store launch included.",
    timeline: "8–10 weeks",
    price: "From $12,000",
    checks: ["Flutter iOS + Android", "Push notifications", "Offline-first", "App store launch"],
    cta: "Build My App →",
    tech: ["Flutter", "Firebase", "Node.js"],
  },
  {
    icon: <MonitorIcon />,
    title: "Web Applications",
    outcome: "Your SaaS, Marketplace, or Dashboard — Built Right.",
    tagline: "Next.js web apps with SSR, real-time features, SEO optimization, and responsive design.",
    timeline: "6–10 weeks",
    price: "From $10,000",
    checks: ["Next.js + TypeScript", "Real-time features", "SEO optimized", "Admin dashboard"],
    cta: "Build My Web App →",
    tech: ["Next.js", "Supabase", "Vercel"],
  },
  {
    icon: <ZapIcon />,
    title: "AI Integration",
    outcome: "Your Product With a Brain.",
    tagline: "Custom AI features, chatbots, content generation, or full AI products. GPT-4, Gemini, custom models.",
    timeline: "8–12 weeks",
    price: "From $15,000",
    badge: { text: "HOT", color: "red" },
    checks: ["OpenAI/Gemini API", "Custom AI workflows", "Vector DB integration", "AI automation"],
    cta: "Add AI to My Product →",
    tech: ["OpenAI", "LangChain", "Pinecone"],
  },
  {
    icon: <LayersIcon />,
    title: "Full-Stack Engineering",
    outcome: "The Complete Ecosystem. End to End.",
    tagline: "Mobile + Web + Backend + Admin. For funded startups that need everything built right the first time.",
    timeline: "10–16 weeks",
    price: "Custom ($25k–$50k)",
    badge: { text: "FOR FUNDED STARTUPS", color: "purple" },
    checks: ["Mobile + Web + Backend", "Admin panel", "API documentation", "Scalable architecture"],
    cta: "Discuss My Project →",
    tech: ["Next.js", "Flutter", "AWS"],
  },
];

/* ── Expandable Card ──────────────────────────────── */

function ServiceCard({ service, index }: { service: ServiceItem; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const lenis = useLenis();

  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -6, borderColor: "rgba(255,255,255,0.14)", transition: { type: "spring", stiffness: 300, damping: 20 } }}
      className="group relative bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 overflow-hidden cursor-pointer"
      onClick={() => setExpanded(!expanded)}
    >
      {/* Hover glow */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(59,122,255,0.05), transparent 70%)" }} aria-hidden="true" />

      <div className="relative z-10">
        {/* Icon + Badge */}
        <div className="flex items-start justify-between mb-4">
          <div className="w-11 h-11 rounded-xl bg-[rgba(59,122,255,0.1)] flex items-center justify-center text-[var(--accent-blue)]">
            {service.icon}
          </div>
          {service.badge && <Tag color={service.badge.color}>{service.badge.text}</Tag>}
        </div>

        {/* Title & outcome */}
        <h3 className="font-syne font-bold text-lg text-[var(--text)] mb-1">{service.title}</h3>
        <p className="font-syne font-semibold text-sm gradient-text mb-2">{service.outcome}</p>
        <p className="font-dmSans text-[13px] text-[var(--text-dim)] leading-[1.7] mb-4">{service.tagline}</p>

        {/* Timeline & Price */}
        <div className="flex items-center gap-4 mb-4 font-spaceMono text-[10px] tracking-[0.05em] text-[var(--text-dimmer)]">
          <span>⏱ {service.timeline}</span>
          <span>💰 {service.price}</span>
        </div>

        {/* Checkmarks */}
        <div className="space-y-1.5 mb-5">
          {service.checks.map((c) => (
            <div key={c} className="flex items-center gap-2">
              <span className="text-[var(--green)] font-spaceMono text-[11px]">✓</span>
              <span className="font-dmSans text-[13px] text-[var(--text-dim)]">{c}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Button variant="ghost" onClick={(e: React.MouseEvent) => { e.stopPropagation(); const el = document.getElementById("final-cta"); if (el) { window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" }); } }} className="text-xs !px-4 !py-2">
          {service.cta}
        </Button>
      </div>

      {/* Expanded detail */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden relative z-10"
          >
            <div className="pt-5 mt-5 border-t border-[var(--border)]">
              <p className="font-spaceMono text-[9px] tracking-[0.15em] uppercase text-[var(--text-dimmer)] mb-3">TECH STACK</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {service.tech.map((t) => (
                  <span key={t} className="font-spaceMono text-[10px] text-[var(--text-dimmer)] bg-[rgba(255,255,255,0.04)] border border-[var(--border)] rounded px-2 py-1">{t}</span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── Main Component ───────────────────────────────── */

export default function Services() {
  const lenis = useLenis();

  return (
    <section id="services" className="py-12 md:py-20 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <SectionHeader
          eyebrow="SERVICES"
          title="What Would You Like to Launch?"
          titleHighlight="Launch?"
          subtitle="Every service ends the same way: you go live with real users. Here's how we get there."
          align="center"
        />

        {/* ── Featured: MVP Development ────────────── */}
        <motion.div
          className="mb-8 bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8 md:p-10 overflow-hidden relative"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {/* Accent bar */}
          <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: "var(--gradient)" }} aria-hidden="true" />

          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Left: Icon */}
            <div className="flex-shrink-0">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[rgba(59,122,255,0.15)] to-[rgba(139,92,246,0.15)] flex items-center justify-center text-[var(--accent-blue)] shadow-[0_0_24px_rgba(59,122,255,0.15)]">
                <RocketIcon />
              </div>
              <div className="mt-3">
                <Tag color="yellow">MOST POPULAR</Tag>
              </div>
            </div>

            {/* Right: Content */}
            <div className="flex-1">
              <h3 className="font-syne font-extrabold text-2xl md:text-3xl text-[var(--text)] mb-2">
                Your Idea → Live Product in <span className="gradient-text">6 Weeks</span>
              </h3>
              <p className="font-dmSans text-[15px] text-[var(--text-dim)] leading-[1.7] mb-6 max-w-2xl">
                Full product from idea to launch. Backend, frontend, database, deployment. You focus on customers — we handle every line of code.
              </p>

              {/* Info row */}
              <div className="flex flex-wrap gap-6 mb-6">
                {[
                  { icon: "⏱", label: "Timeline", value: "6–8 weeks" },
                  { icon: "💰", label: "Starting", value: "From $8,000" },
                  { icon: "📦", label: "Deliverables", value: "Mobile or Web + Backend" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <span className="text-base">{item.icon}</span>
                    <div>
                      <span className="font-spaceMono text-[9px] tracking-[0.1em] uppercase text-[var(--text-dimmer)] block">{item.label}</span>
                      <span className="font-dmSans text-sm text-[var(--text)]">{item.value}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Perfect for tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {["Pre-seed Startups", "First-time Founders", "Idea Validation", "Tight Runway"].map((tag) => (
                  <span key={tag} className="font-spaceMono text-[10px] text-[var(--text-dimmer)] bg-[rgba(255,255,255,0.04)] border border-[var(--border)] rounded-full px-3 py-1">{tag}</span>
                ))}
              </div>

              {/* Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 mb-6">
                {[
                  "Custom mobile or web app", "Database + backend API", "Authentication system",
                  "Payment integration (Stripe)", "Cloud deployment (Vercel/AWS)", "2 weeks post-launch support",
                  "Full source code ownership", "Staging environment from Week 2",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <span className="text-[var(--green)] font-spaceMono text-[11px]">✓</span>
                    <span className="font-dmSans text-[13px] text-[var(--text-dim)]">{item}</span>
                  </div>
                ))}
              </div>

              <Button variant="primary" onClick={() => {
                const el = document.getElementById("final-cta");
                if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
              }}>
                Start Your MVP →
              </Button>
            </div>
          </div>
        </motion.div>

        {/* ── Grid Services ───────────────────────── */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {GRID_SERVICES.map((s, i) => (
            <ServiceCard key={s.title} service={s} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
