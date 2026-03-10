import type { Metadata } from "next";
import { Syne, Space_Mono, DM_Sans } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import { CTAModalProvider } from "@/context/CTAModalContext";
import CTAModal from "@/components/lead/CTAModal";
import "./globals.css";

/* ═══════════════════════════════════════════════════
   FONT CONFIGURATION
   Zero layout shift with next/font/google
   ═══════════════════════════════════════════════════ */

const syne = Syne({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  weight: ["400", "600", "700", "800"],
  variable: "--font-syne",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  weight: ["400", "700"],
  variable: "--font-space-mono",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  weight: ["300", "400", "500", "600"],
  variable: "--font-dm-sans",
});

/* ═══════════════════════════════════════════════════
   METADATA
   ═══════════════════════════════════════════════════ */

export const metadata: Metadata = {
  metadataBase: new URL("https://nexforgelabz.com"),

  /* ── Core ─────────────────────────────────────────── */
  title: {
    default: "NexForge Labz | MVP Development Agency | Mobile, Web & AI Apps",
    template: "%s | NexForge Labz",
  },
  description:
    "NexForge Labz builds production-grade mobile, web, and AI apps for startups and founders. Ship your MVP in 6 weeks — fixed price, full code ownership, zero technical debt. Starting at $2,000.",

  /* ── Keywords ─────────────────────────────────────── */
  keywords: [
    // Buyer-intent
    "hire app developer",
    "MVP development agency",
    "startup app development",
    "app development for startups",
    "build my app",
    "MVP development cost",
    "how to build an MVP",
    // Service-specific
    "mobile app development agency",
    "web app development agency",
    "AI app development",
    "Next.js development agency",
    "Flutter app development",
    "React Native development",
    "SaaS development agency",
    // Pain-point
    "fast MVP development",
    "affordable app development",
    "no technical debt",
    "fixed price app development",
    "offshore app development agency",
    // Brand
    "NexForge Labz",
    "NexForge",
  ],

  /* ── Authorship ───────────────────────────────────── */
  authors: [{ name: "NexForge Labz", url: "https://nexforgelabz.com" }],
  creator: "NexForge Labz",
  publisher: "NexForge Labz",

  /* ── Canonical & alternates ───────────────────────── */
  alternates: {
    canonical: "https://nexforgelabz.com",
  },

  /* ── Open Graph ───────────────────────────────────── */
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nexforgelabz.com",
    title: "NexForge Labz | Ship Your MVP in 6 Weeks",
    description:
      "Production-grade mobile, web & AI apps for founders. 10+ MVPs shipped. Fixed price. Full code ownership. Starting at $2,000.",
    siteName: "NexForge Labz",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "NexForge Labz — Ship Your MVP in 6 Weeks",
        type: "image/png",
      },
    ],
  },

  /* ── Twitter / X ──────────────────────────────────── */
  twitter: {
    card: "summary_large_image",
    title: "NexForge Labz | Ship Your MVP in 6 Weeks",
    description:
      "Production-grade mobile, web & AI apps for founders. Fixed price, full code ownership, zero technical debt.",
    images: ["/opengraph-image"],
    creator: "@nexforgelabz",
  },

  /* ── Robots ───────────────────────────────────────── */
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  /* ── Google verification ──────────────────────────── */
  verification: {
    google: "Azq1kjSQpKsLipnykae9dB8o_LnkeLHsxZ8dvpuF3Jk",
  },

  /* ── App metadata ─────────────────────────────────── */
  applicationName: "NexForge Labz",
  referrer: "origin-when-cross-origin",
  category: "technology",
};

/* ═══════════════════════════════════════════════════
   ROOT LAYOUT
   ═══════════════════════════════════════════════════ */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${spaceMono.variable} ${dmSans.variable}`}
    >
      <body suppressHydrationWarning>
        {/* Skip to content — accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[var(--accent-blue)] focus:text-white focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)] focus:ring-offset-2 focus:ring-offset-[var(--bg)] font-dmSans text-sm"
        >
          Skip to main content
        </a>

        <CTAModalProvider>
          <SmoothScrollProvider>
            {children}
          </SmoothScrollProvider>
          <CTAModal />
        </CTAModalProvider>

        <Analytics />

        {/* GA4 — afterInteractive strategy */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA4_ID || "G-XXXXXXXXXX"}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA4_ID || "G-XXXXXXXXXX"}');
          `}
        </Script>
      </body>
    </html>
  );
}
