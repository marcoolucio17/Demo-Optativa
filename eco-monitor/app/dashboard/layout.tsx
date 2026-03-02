"use client";
import { MobileMenuProvider } from "../context/MobileMenu";
import Sidebar from "../components/Sidebar";
import { useToastSimulator } from "../hooks/useToastSimulator";

function DashboardInner({ children }: { children: React.ReactNode }) {
  useToastSimulator();
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-base)" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
        {children}
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <MobileMenuProvider>
      <DashboardInner>{children}</DashboardInner>
    </MobileMenuProvider>
  );
}
