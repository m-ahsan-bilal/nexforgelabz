"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeader from "@/components/ui/SectionHeader";
import Tag from "@/components/ui/Tag";
import Button from "@/components/ui/Button";
import { useCtaModal } from "@/context/CTAModalContext";
import { useLenis } from "@/components/providers/SmoothScrollProvider";

/* ═══════════════════════════════════════════════════
   FAQ — Accordion with category filter
   NexForge Labz Design System
   ═══════════════════════════════════════════════════ */

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

/* ── FAQ Data ─────────────────────────────────────── */

interface FAQItem {
  category: string;
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  { category: "Pricing", question: "How much does an MVP cost?", answer: "Our MVP development starts at $8,000 for a focused web or mobile app. Most first projects land between $8k–$15k depending on scope. Funded startups with larger feature sets typically invest $15k–$30k. We give you a fixed quote during the free consultation — no 'it depends' vagueness." },
  { category: "Pricing", question: "Are there any hidden fees?", answer: "None. We quote a fixed price that includes development, deployment, and 2 weeks of post-launch support. The only extras would be third-party service costs (like your domain, Vercel hosting, or API keys) — which you pay directly to the providers, not us. We'll tell you exactly what those cost during consultation." },
  { category: "Pricing", question: "What are your payment terms?", answer: "50% upfront to begin, 50% upon launch. For larger projects ($25k+), we can do three milestones: 40% / 30% / 30%. We accept bank transfer, Wise, or PayPal. We do not take payment before the contract is signed." },
  { category: "Pricing", question: "Can I pay in installments?", answer: "We can discuss milestone-based payments for projects over $20k. Contact us during the consultation and we'll find an arrangement that works. We want to build with great founders — we're not going to let payment structure get in the way." },
  { category: "Timeline", question: "How is 6 weeks actually possible?", answer: "Focused scope. We don't try to build everything at once — we build your core value proposition first. Most agencies pad timelines to 6 months because they're juggling 20 projects and doing 2 hours of work per day on yours. We take 2–3 projects max. Your project gets real hours, every day." },
  { category: "Timeline", question: "What if my project is more complex?", answer: "Complex projects (mobile + web + backend + admin panel) typically take 10–16 weeks. We scope this clearly upfront. You always know the timeline before you sign. No surprises mid-build." },
  { category: "Timeline", question: "Can you go faster? I need this in 4 weeks.", answer: "Rush projects are possible for an additional 30% fee and require a very focused scope. We've done projects in 4 weeks before (Reel n Meal launched in 4 weeks). Tell us during the consultation — if it's doable, we'll commit. If it's not, we'll tell you that too." },
  { category: "Process", question: "Do I own the code?", answer: "100%, from day one. You get full source code, all assets, database access, and deployment credentials upon final payment. We don't hold code hostage. It's yours — even if you never want to work with us again." },
  { category: "Process", question: "How much time will I need to invest?", answer: "About 1 hour per week for our demo call. You review what was built, give feedback, and we move forward. We handle all technical decisions unless you want to be involved. No meetings about meetings. No status updates that waste your time." },
  { category: "Process", question: "What happens if I'm not happy with the work?", answer: "We iterate until you are. The staging environment exists precisely so you can give feedback before we ship anything final. We've never had a client refuse delivery — but if something isn't right, we fix it. That's what the 2 weeks post-launch support is for." },
  { category: "Process", question: "What if I need changes after launch?", answer: "Minor bug fixes are covered in the 2-week post-launch window. For new features or significant changes, we offer retainer packages starting at $3,000/month, or you can come back for a new project quote. We prioritize existing clients over new ones." },
  { category: "Getting Started", question: "What happens in the free consultation?", answer: "In 30 minutes, you'll get: (1) an honest feasibility assessment of your idea, (2) a recommended tech stack with explanation, (3) a rough timeline estimate, (4) a rough budget range. We don't pitch you. We help you — even if that means telling you the idea needs pivoting or recommending a no-code tool instead." },
  { category: "Getting Started", question: "Do I need technical knowledge to work with you?", answer: "Zero. We translate everything into plain language. You'll always know what's being built and why. The weekly demo calls are designed for non-technical founders. If you don't understand something, we haven't explained it well enough — that's on us." },
  { category: "Getting Started", question: "What do I need to prepare before the consultation?", answer: "Just your vision. A rough idea of what you want to build, who it's for, and your rough budget range. You don't need wireframes, technical specs, or a business plan. Just talk to us like you'd talk to a technical co-founder. We'll take it from there." },
];

const CATEGORIES = ["All", "Pricing", "Timeline", "Process", "Getting Started"];

const categoryColorMap: Record<string, "blue" | "purple" | "cyan" | "green" | "yellow" | "red"> = {
  Pricing: "green",
  Timeline: "blue",
  Process: "purple",
  "Getting Started": "cyan",
};

/* ── Accordion Item ───────────────────────────────── */

function AccordionItem({ faq, isOpen, onToggle }: { faq: FAQItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <motion.div
      variants={fadeUp}
      className={`border rounded-xl transition-all duration-200 overflow-hidden ${
        isOpen
          ? "border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.02)]"
          : "border-[var(--border)] bg-[var(--surface)]"
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 text-left cursor-pointer bg-transparent border-none"
      >
        <span className="font-dmSans font-medium text-[15px] text-[var(--text)] pr-4">{faq.question}</span>
        <div className="flex items-center gap-3 flex-shrink-0">
          <Tag color={categoryColorMap[faq.category] || "cyan"}>{faq.category}</Tag>
          <motion.svg
            width="16" height="16" viewBox="0 0 16 16" fill="none"
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-[var(--text-dimmer)] flex-shrink-0"
          >
            <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </motion.svg>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 font-dmSans text-[14px] text-[var(--text-dim)] leading-[1.75]">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── Main Component ───────────────────────────────── */

export default function FAQ() {
  const { openModal } = useCtaModal();
  const [activeCategory, setActiveCategory] = useState("All");
  const [openId, setOpenId] = useState<number | null>(null);
  const lenis = useLenis();

  const filtered = useMemo(
    () => activeCategory === "All" ? FAQS : FAQS.filter((f) => f.category === activeCategory),
    [activeCategory]
  );

  return (
    <section id="faq" className="py-12 md:py-20 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <SectionHeader
          eyebrow="FREQUENTLY ASKED"
          title="Every Question. Answered Honestly."
          titleHighlight="Answered Honestly."
          subtitle="If your question isn't here, email us. We'll answer within 24 hours and add it."
          align="center"
        />

        {/* ── Category Tabs ────────────────────────── */}
        <div className="flex justify-center gap-1 mb-10 overflow-x-auto pb-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setOpenId(null); }}
              className={`font-spaceMono text-[11px] tracking-[0.05em] px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer border-none bg-transparent whitespace-nowrap ${
                activeCategory === cat
                  ? "text-[var(--text)] bg-[rgba(255,255,255,0.06)]"
                  : "text-[var(--text-dimmer)] hover:text-[var(--text-dim)]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── Accordion Grid ──────────────────────── */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-16"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          key={activeCategory}
        >
          {filtered.map((faq, i) => (
            <AccordionItem
              key={`${activeCategory}-${i}`}
              faq={faq}
              isOpen={openId === i}
              onToggle={() => setOpenId(openId === i ? null : i)}
            />
          ))}
        </motion.div>

        {/* ── Bottom CTA ──────────────────────────── */}
        <motion.div
          className="text-center"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <p className="font-dmSans text-[15px] text-[var(--text-dim)] mb-4">
            Still have questions? Send us your brief and we&apos;ll answer everything.
          </p>
          <Button variant="primary" onClick={() => {
            openModal("faq");
          }}>
            Get Free Estimate →
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
