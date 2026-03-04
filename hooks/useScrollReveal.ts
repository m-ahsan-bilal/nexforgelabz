import { useState, useEffect, RefObject } from "react";

/* ═══════════════════════════════════════════════════
   useScrollReveal — IntersectionObserver-based
   visibility hook for scroll-triggered animations.
   ═══════════════════════════════════════════════════ */

interface UseScrollRevealOptions {
    threshold?: number;
    triggerOnce?: boolean;
}

export default function useScrollReveal(
    ref: RefObject<HTMLElement | null>,
    { threshold = 0.1, triggerOnce = true }: UseScrollRevealOptions = {},
): boolean {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (triggerOnce) {
                        observer.unobserve(el);
                    }
                } else if (!triggerOnce) {
                    setIsVisible(false);
                }
            },
            { threshold },
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [ref, threshold, triggerOnce]);

    return isVisible;
}
