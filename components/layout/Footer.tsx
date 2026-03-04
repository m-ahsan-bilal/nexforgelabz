"use client";

import Button from "@/components/ui/Button";
import { useLenis } from "@/components/providers/SmoothScrollProvider";

/* ═══════════════════════════════════════════════════
   FOOTER — NexForge Labz
   All links scroll to the relevant section on page.
   ═══════════════════════════════════════════════════ */

/* ── Social Icons ─────────────────────────────────── */

function LinkedInIcon() {
  return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>);
}
function GitHubIcon() {
  return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>);
}
function XIcon() {
  return (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16h-4.267z"/><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"/></svg>);
}

/* ── Footer Scroll Link ───────────────────────────── */

function FooterScrollLink({ children, target }: { children: React.ReactNode; target: string }) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(target);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <a
      href={`#${target}`}
      onClick={handleClick}
      className="block font-dmSans text-[14px] text-[var(--text-dim)] hover:text-[var(--text)] hover:pl-1 transition-all duration-150 py-1 relative group cursor-pointer"
    >
      {children}
      <span className="absolute bottom-0 left-0 w-0 h-px bg-[var(--text-dim)] group-hover:w-full transition-all duration-200" />
    </a>
  );
}

/* ── Main Component ───────────────────────────────── */

export default function Footer() {
  const lenis = useLenis();

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <footer className="relative">
      {/* ── Pre-footer CTA bar ────────────────────── */}
      <div
        className="border-t border-b border-[var(--border)] py-10"
        style={{ background: "linear-gradient(135deg, rgba(59,122,255,0.06), rgba(139,92,246,0.06))" }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10 text-center">
          <h3 className="font-syne font-bold text-2xl md:text-[28px] text-[var(--text)] mb-2">
            Your idea deserves to exist. Let&apos;s make it real.
          </h3>
          <p className="font-dmSans text-[15px] text-[var(--text-dim)] mb-6">
            A quick call is all it takes to get moving.
          </p>
          <Button variant="primary" onClick={() => scrollToSection("final-cta")}>
            Book Free Consultation →
          </Button>
        </div>
      </div>

      {/* ── Main Footer Grid ──────────────────────── */}
      <div className="py-16 max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Column 1: Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                <defs><linearGradient id="ft-g" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#3b7aff"/><stop offset="50%" stopColor="#8b5cf6"/><stop offset="100%" stopColor="#06d6d6"/></linearGradient></defs>
                <rect width="32" height="32" rx="8" fill="#050508"/>
                <path d="M8 24V8l5 8 5-8v16" stroke="url(#ft-g)" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 8v16" stroke="url(#ft-g)" strokeWidth="2.5" strokeLinecap="round"/>
                <circle cx="22" cy="8" r="1.5" fill="url(#ft-g)"/>
              </svg>
              <span className="font-syne font-extrabold text-lg">
                Nex<span className="gradient-text">Forge</span>
              </span>
              <span className="font-syne font-extrabold text-lg text-[var(--text)] opacity-80">Labz</span>
            </div>
            <p className="font-spaceMono text-[11px] tracking-[0.1em] uppercase text-[var(--text-dimmer)] mb-3">
              SHIP MVPS IN 6 WEEKS
            </p>
            <p className="font-dmSans text-[14px] text-[var(--text-dimmer)] leading-[1.7] max-w-[240px] mb-4">
              We help founders turn ideas into real, working products. No fluff, just code that ships.
            </p>
            <a
              href="mailto:nexforge.labz@gmail.com"
              className="font-dmSans text-[14px] text-[var(--text-dim)] hover:text-[var(--accent-cyan)] transition-colors duration-150 block mb-5"
            >
              nexforge.labz@gmail.com
            </a>
            <div className="flex items-center gap-3">
              {[
                { icon: <LinkedInIcon />, label: "LinkedIn" },
                { icon: <GitHubIcon />, label: "GitHub" },
                { icon: <XIcon />, label: "X (Twitter)" },
              ].map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="text-[var(--text-dimmer)] hover:text-[var(--accent-cyan)] hover:-translate-y-0.5 transition-all duration-150"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Services — all scroll to #services */}
          <nav aria-label="Services">
            <h3 className="font-spaceMono text-[10px] tracking-[0.15em] uppercase text-[var(--text-dimmer)] mb-4">SERVICES</h3>
            <FooterScrollLink target="services">MVP Development</FooterScrollLink>
            <FooterScrollLink target="services">Mobile Apps (iOS + Android)</FooterScrollLink>
            <FooterScrollLink target="services">Web Applications</FooterScrollLink>
            <FooterScrollLink target="services">AI Integration & Development</FooterScrollLink>
            <FooterScrollLink target="services">Full-Stack Engineering</FooterScrollLink>
          </nav>

          {/* Column 3: Company — scroll to matching sections */}
          <nav aria-label="Company">
            <h3 className="font-spaceMono text-[10px] tracking-[0.15em] uppercase text-[var(--text-dimmer)] mb-4">COMPANY</h3>
            <FooterScrollLink target="hero">About</FooterScrollLink>
            <FooterScrollLink target="process">Process</FooterScrollLink>
            <FooterScrollLink target="portfolio">Portfolio</FooterScrollLink>
            <FooterScrollLink target="faq">FAQ</FooterScrollLink>
            <FooterScrollLink target="final-cta">Contact</FooterScrollLink>
          </nav>

          {/* Column 4: Resources */}
          <nav aria-label="Resources">
            <h3 className="font-spaceMono text-[10px] tracking-[0.15em] uppercase text-[var(--text-dimmer)] mb-4">RESOURCES</h3>
            <FooterScrollLink target="faq">Privacy Policy</FooterScrollLink>
            <FooterScrollLink target="faq">Terms of Service</FooterScrollLink>
            <FooterScrollLink target="portfolio">Case Studies</FooterScrollLink>
            <FooterScrollLink target="tech-stack">Tech Stack</FooterScrollLink>
            <FooterScrollLink target="hero">Back to Top</FooterScrollLink>
          </nav>
        </div>
      </div>

      {/* ── Bottom Bar ────────────────────────────── */}
      <div className="border-t border-[rgba(255,255,255,0.04)] py-5">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-center">
          <p className="font-dmSans text-[12px] text-[var(--text-dimmer)]">
            © 2026 NexForge Labz. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
