import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  /* ── Image optimization ─────────────────────────── */
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
  },

  /* ── Performance ────────────────────────────────── */
  compress: true,
  poweredByHeader: false,

  /* ── Security + Performance Headers ─────────────── */
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        { key: "X-DNS-Prefetch-Control", value: "on" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "origin-when-cross-origin" },
      ],
    },
  ],
};

export default nextConfig;
