"use client";
import { Bell, User, Menu } from "lucide-react";
import { useMobileMenu } from "../context/MobileMenu";

interface TopbarProps {
  breadcrumb: string[];
}

export default function Topbar({ breadcrumb }: TopbarProps) {
  const { setIsOpen } = useMobileMenu();
  const currentPage = breadcrumb[breadcrumb.length - 1];

  return (
    <header className="topbar-shell">
      {/* Left: hamburger (mobile) + breadcrumb (desktop) */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <button
          className="topbar-hamburger"
          onClick={() => setIsOpen(true)}
          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-primary)", alignItems: "center" }}
        >
          <Menu size={22} strokeWidth={1.75} />
        </button>

        {/* Mobile: current page title */}
        <span className="topbar-hamburger font-space" style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)", alignItems: "center" }}>
          {currentPage}
        </span>

        {/* Desktop: breadcrumb */}
        <div className="topbar-breadcrumb">
          {breadcrumb.map((crumb, i) => (
            <span key={i} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              {i > 0 && <span style={{ color: "var(--text-muted)", fontSize: "12px", fontFamily: '"IBM Plex Sans", sans-serif' }}>/</span>}
              <span style={{
                fontSize: "13px",
                fontFamily: '"IBM Plex Sans", sans-serif',
                color: i === breadcrumb.length - 1 ? "var(--text-primary)" : "var(--text-secondary)",
                fontWeight: i === breadcrumb.length - 1 ? 500 : 400,
              }}>
                {crumb}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Right icons */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <button
          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex", alignItems: "center", position: "relative", padding: "4px" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-secondary)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-muted)")}
        >
          <Bell size={18} strokeWidth={1.75} />
          <span style={{ position: "absolute", top: "2px", right: "2px", width: "7px", height: "7px", borderRadius: "50%", background: "var(--accent-danger)", border: "1px solid var(--bg-secondary)" }} />
        </button>
        <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: "var(--surface-elevated)", border: "1px solid var(--border-active)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <User size={16} strokeWidth={1.75} style={{ color: "var(--text-secondary)" }} />
        </div>
      </div>
    </header>
  );
}
