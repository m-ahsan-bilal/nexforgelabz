import type { Metadata } from "next";
import { Syne, Space_Mono, DM_Sans } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
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
  title: {
    default: "NexForge Labz | Ship Your MVP in 6 Weeks | Mobile, Web & AI Apps",
    template: "%s | NexForge Labz",
  },
  description:
    "Production-grade mobile, web, and AI apps for founders. MVP development in 6 weeks. Clean code, clear communication, zero technical debt. Starting at $8,000.",
  keywords: [
    "MVP development",
    "startup app development",
    "mobile app agency",
    "Next.js development",
    "Flutter development",
    "AI app development",
    "6 week MVP",
    "software development agency",
  ],
  authors: [{ name: "NexForge Labz", url: "https://nexforgelabz.com" }],
  creator: "NexForge Labz",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nexforgelabz.com",
    title: "NexForge Labz | Ship Your MVP in 6 Weeks",
    description:
      "Production-grade apps for founders who can't afford delays. 10+ MVPs shipped. Starting at $8,000.",
    siteName: "NexForge Labz",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "NexForge Labz — Ship Your MVP in 6 Weeks",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NexForge Labz | Ship Your MVP in 6 Weeks",
    description:
      "Production-grade apps for founders who can't afford delays.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
    },
  },
  verification: {
    google: "YOUR_GOOGLE_VERIFICATION_CODE",
  },
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
