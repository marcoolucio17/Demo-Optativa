"use client";
import { createContext, useContext, useState } from "react";

interface MobileMenuCtx {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
}

const MobileMenuContext = createContext<MobileMenuCtx>({
  isOpen: false,
  setIsOpen: () => {},
});

export function MobileMenuProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <MobileMenuContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </MobileMenuContext.Provider>
  );
}

export function useMobileMenu() {
  return useContext(MobileMenuContext);
}
