"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

/* ═══════════════════════════════════════════════════
   CTA MODAL CONTEXT — Global modal state
   Any CTA button calls openModal(source) to trigger
   the 3-path chooser modal.
   ═══════════════════════════════════════════════════ */

export type CTASource =
  | "hero"
  | "navbar"
  | "services"
  | "why"
  | "process"
  | "portfolio"
  | "faq"
  | "final_cta";

interface CTAModalState {
  isOpen: boolean;
  source: CTASource | null;
  openModal: (source: CTASource) => void;
  closeModal: () => void;
}

const CTAModalContext = createContext<CTAModalState>({
  isOpen: false,
  source: null,
  openModal: () => {},
  closeModal: () => {},
});

export function useCtaModal() {
  return useContext(CTAModalContext);
}

export function CTAModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [source, setSource] = useState<CTASource | null>(null);

  const openModal = useCallback((src: CTASource) => {
    setSource(src);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setSource(null);
  }, []);

  return (
    <CTAModalContext.Provider value={{ isOpen, source, openModal, closeModal }}>
      {children}
    </CTAModalContext.Provider>
  );
}
