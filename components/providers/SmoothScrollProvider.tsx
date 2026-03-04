"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useCallback,
  useMemo,
} from "react";



interface ScrollAPI {
  scrollTo: (target: HTMLElement | number, options?: { offset?: number; duration?: number }) => void;
}

const LenisContext = createContext<ScrollAPI | null>(null);

export function useLenis(): ScrollAPI | null {
  return useContext(LenisContext);
}

interface SmoothScrollProviderProps {
  children: ReactNode;
}

export default function SmoothScrollProvider({
  children,
}: SmoothScrollProviderProps) {
  const scrollTo = useCallback(
    (target: HTMLElement | number, options?: { offset?: number; duration?: number }) => {
      const offset = options?.offset ?? 0;

      if (typeof target === "number") {
        window.scrollTo({ top: target, behavior: "smooth" });
        return;
      }

      const y = target.getBoundingClientRect().top + window.scrollY + offset;
      window.scrollTo({ top: y, behavior: "smooth" });
    },
    []
  );

  const api = useMemo(() => ({ scrollTo }), [scrollTo]);

  return (
    <LenisContext.Provider value={api}>{children}</LenisContext.Provider>
  );
}
