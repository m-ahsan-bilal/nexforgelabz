/* ═══════════════════════════════════════════════════
   ANIMATION VARIANTS — Framer Motion
   NexForge Labz Design System

   All entry animations use ease-out-expo: [0.16, 1, 0.3, 1]
   All interactions use spring: stiffness 300, damping 20
   Max duration: 600ms
   ═══════════════════════════════════════════════════ */

/* ── Entry Animations ─────────────────────────────── */

export const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    },
};

export const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.4 },
    },
};

export const scaleIn = {
    hidden: { opacity: 0, scale: 0.92 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
    },
};

export const slideLeft = {
    hidden: { opacity: 0, x: 40 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    },
};

export const popIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { type: "spring", stiffness: 400, damping: 20 },
    },
};

export const drawLine = {
    hidden: { scaleX: 0, originX: 0 },
    visible: {
        scaleX: 1,
        transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1] },
    },
};

/* ── Stagger Containers ───────────────────────────── */

export const staggerContainer = (
    delay = 0.08,
    staggerChildren = 0.08,
) => ({
    hidden: {},
    visible: {
        transition: { staggerChildren, delayChildren: delay },
    },
});

/* ── Hover Animations ─────────────────────────────── */

export const hoverCard = {
    rest: { y: 0, borderColor: "rgba(255,255,255,0.06)" },
    hover: {
        y: -6,
        borderColor: "rgba(255,255,255,0.14)",
        transition: { type: "spring", stiffness: 300, damping: 20 },
    },
};

export const hoverButton = {
    rest: { y: 0, boxShadow: "0 0 24px rgba(59,122,255,0.35)" },
    hover: {
        y: -2,
        boxShadow: "0 8px 32px rgba(59,122,255,0.5)",
        transition: { duration: 0.2 },
    },
};

/* ── Helpers ──────────────────────────────────────── */

/** Generate a fadeUp variant with a custom delay */
export const fadeUpDelay = (delay: number) => ({
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1], delay },
    },
});

/** Reduced motion fallback — instant show, no transforms */
export const reducedMotion = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.01 } },
};
