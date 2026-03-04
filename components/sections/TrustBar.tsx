"use client";

import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════
   TRUST BAR — Stats + Tech Logo Ticker
   NexForge Labz Design System
   Static bar below hero (no sticky behavior)
   ═══════════════════════════════════════════════════ */

/* ── Stats config ─────────────────────────────────── */

interface Stat {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  countDown?: boolean;
  noAnimate?: boolean;
}

const STATS: Stat[] = [
  { value: 10, suffix: "+", label: "MVPs Shipped" },
  { value: 6, suffix: "wk", label: "Avg. Delivery" },
  { value: 0, prefix: "$", label: "Hidden Fees", noAnimate: true },
  { value: 0, label: "Ghosted Projects", countDown: true },
];

/* ── Tech logos ───────────────────────────────────── */

const TECH_LOGOS = [
  "Next.js", "React", "Flutter", "Supabase", "PostgreSQL", "OpenAI",
  "Vercel", "TypeScript", "Node.js", "Stripe", "Tailwind", "Firebase",
  "Figma", "AWS", "Python", "FastAPI",
];

/* ── Counter Hook ─────────────────────────────────── */

function useCountUp(
  target: number,
  duration: number,
  start: boolean,
  countDown?: boolean,
  noAnimate?: boolean,
) {
  const [current, setCurrent] = useState(noAnimate ? target : countDown ? 3 : 0);

  useEffect(() => {
    if (!start || noAnimate) return;

    const from = countDown ? 3 : 0;
    const to = target;
    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - progress) * (1 - progress);

      if (countDown) {
        setCurrent(Math.round(from - (from - to) * eased));
      } else {
        setCurrent(Math.round(from + (to - from) * eased));
      }

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  }, [start, target, duration, countDown, noAnimate]);

  return current;
}

/* ── Stat Item Component ──────────────────────────── */

function StatItem({ stat, isVisible }: { stat: Stat; isVisible: boolean }) {
  const count = useCountUp(stat.value, 1200, isVisible, stat.countDown, stat.noAnimate);

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="font-syne font-extrabold text-[22px] gradient-text">
        {stat.prefix}
        {count}
        {stat.suffix}
      </span>
      <span className="font-spaceMono text-[9px] tracking-[0.1em] uppercase text-[var(--text-dimmer)]">
        {stat.label}
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   TRUST BAR COMPONENT
   ═══════════════════════════════════════════════════ */

export default function TrustBar() {
  const [isVisible, setIsVisible] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  /* ── Visibility detection for counter animation ── */

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(bar);
    return () => observer.disconnect();
  }, []);

  const doubledLogos = [...TECH_LOGOS, ...TECH_LOGOS];

  return (
    <section
      id="trust-bar"
      ref={barRef}
      className="w-full relative bg-[var(--surface)] border-y border-[var(--border)]"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center h-[72px]">
        {/* ── Stats (desktop) ─────────────────────── */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8 flex-shrink-0">
          {STATS.map((stat, i) => (
            <div key={stat.label} className="flex items-center gap-6 lg:gap-8">
              {i > 0 && (
                <div
                  className="w-px h-8 bg-[rgba(255,255,255,0.06)]"
                  aria-hidden="true"
                />
              )}
              <StatItem stat={stat} isVisible={isVisible} />
            </div>
          ))}
        </div>

        {/* ── Stats (mobile: 4-col row) ───────────── */}
        <div className="grid grid-cols-4 gap-4 w-full md:hidden">
          {STATS.map((stat) => (
            <StatItem key={stat.label} stat={stat} isVisible={isVisible} />
          ))}
        </div>

        {/* ── Separator ───────────────────────────── */}
        <div
          className="hidden md:block w-px h-8 bg-[rgba(255,255,255,0.07)] mx-6 lg:mx-8 flex-shrink-0"
          aria-hidden="true"
        />

        {/* ── Tech Logo Ticker (desktop only) ─────── */}
        <div
          className="hidden md:block flex-1 overflow-hidden relative"
          style={{
            maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
            WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          }}
        >
          <div
            className="flex items-center gap-3 ticker-scroll hover:[animation-play-state:paused]"
            aria-label="Technologies we use"
          >
            {doubledLogos.map((logo, i) => (
              <span
                key={`${logo}-${i}`}
                className="font-spaceMono text-[11px] text-[var(--text-dimmer)] border border-[rgba(255,255,255,0.07)] rounded px-2.5 py-1 whitespace-nowrap flex-shrink-0"
              >
                {logo}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
