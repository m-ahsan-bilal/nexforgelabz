import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        screens: {
            xs: "375px",
            sm: "640px",
            md: "768px",
            lg: "1024px",
            xl: "1280px",
            "2xl": "1400px",
        },
        extend: {
            colors: {
                bg: "var(--bg)",
                surface: "var(--surface)",
                "surface-2": "var(--surface-2)",
                text: "var(--text)",
                "text-dim": "var(--text-dim)",
                "text-dimmer": "var(--text-dimmer)",
                border: "var(--border)",
                "border-bright": "var(--border-bright)",
                "accent-blue": "var(--accent-blue)",
                "accent-purple": "var(--accent-purple)",
                "accent-cyan": "var(--accent-cyan)",
                green: "var(--green)",
                yellow: "var(--yellow)",
                red: "var(--red)",
            },
            fontFamily: {
                syne: ["var(--font-syne)", "sans-serif"],
                spaceMono: ["var(--font-space-mono)", "monospace"],
                dmSans: ["var(--font-dm-sans)", "sans-serif"],
            },
            borderRadius: {
                "3xl-custom": "20px",
            },
            keyframes: {
                fadeUp: {
                    "0%": { opacity: "0", transform: "translateY(24px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                "glow-pulse": {
                    "0%, 100%": { boxShadow: "0 0 24px rgba(59,122,255,0.35)" },
                    "50%": { boxShadow: "0 0 48px rgba(59,122,255,0.55)" },
                },
                shimmer: {
                    "0%": { backgroundPosition: "-200% 0" },
                    "100%": { backgroundPosition: "200% 0" },
                },
                "slide-left": {
                    "0%": { transform: "translateX(100%)" },
                    "100%": { transform: "translateX(0)" },
                },
            },
            animation: {
                "fade-up": "fadeUp 400ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
                "glow-pulse": "glow-pulse 3s ease-in-out infinite",
                shimmer: "shimmer 2s linear infinite",
                "slide-left": "slide-left 400ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
            },
        },
    },
    plugins: [],
};

export default config;
