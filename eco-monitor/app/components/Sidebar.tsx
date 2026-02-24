"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ArrowDownToLine, Leaf, Settings, Hexagon, X } from "lucide-react";
import { useMobileMenu } from "../context/MobileMenu";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Equipos", href: "/dashboard/equipment/EQ-001", icon: Package },
  { label: "Retiros", href: "/dashboard/recovery", icon: ArrowDownToLine },
  { label: "Reporte ESG", href: "/dashboard/esg", icon: Leaf },
  { label: "Configuración", href: "/dashboard/settings", icon: Settings },
];

function NavContent({ onItemClick }: { onItemClick?: () => void }) {
  const pathname = usePathname();
  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };
  return (
    <>
      <nav style={{ flex: 1, padding: "12px 0" }}>
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onItemClick}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "11px 20px",
                borderLeft: active ? "3px solid var(--accent-primary)" : "3px solid transparent",
                color: active ? "var(--accent-primary)" : "var(--text-muted)",
                textDecoration: "none",
                fontSize: "13px",
                fontFamily: '"IBM Plex Sans", sans-serif',
                fontWeight: active ? 500 : 400,
                transition: "color 0.15s",
                justifyContent: "flex-start",
              }}
              onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)"; }}
              onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; }}
            >
              <Icon size={20} strokeWidth={1.75} style={{ flexShrink: 0 }} />
              <span className="sidebar-label">{label}</span>
            </Link>
          );
        })}
      </nav>
      <div style={{ padding: "16px 20px", borderTop: "1px solid var(--border-subtle)" }}>
        <p className="sidebar-logo-text font-ibm" style={{ fontSize: "10px", color: "var(--text-muted)" }}>
          v1.0.0 — SEMARNAT Cert.
        </p>
      </div>
    </>
  );
}

export default function Sidebar() {
  const { isOpen, setIsOpen } = useMobileMenu();

  return (
    <>
      {/* Desktop / Tablet sticky sidebar */}
      <aside className="sidebar-shell">
        <div style={{ padding: "24px 20px", borderBottom: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", gap: "10px" }}>
          <Hexagon size={28} strokeWidth={1.5} style={{ color: "var(--accent-primary)", flexShrink: 0 }} />
          <span className="sidebar-logo-text font-space" style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)", lineHeight: "1.2" }}>
            HFC<br />TraceSystem
          </span>
        </div>
        <NavContent />
      </aside>

      {/* Mobile drawer overlay */}
      {isOpen && (
        <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />
      )}

      {/* Mobile drawer */}
      <div className={`sidebar-drawer${isOpen ? " drawer-open" : ""}`}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Hexagon size={24} strokeWidth={1.5} style={{ color: "var(--accent-primary)" }} />
            <span className="font-space" style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }}>
              HFC TraceSystem
            </span>
          </div>
          <button onClick={() => setIsOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex" }}>
            <X size={20} strokeWidth={1.75} />
          </button>
        </div>
        <NavContent onItemClick={() => setIsOpen(false)} />
      </div>
    </>
  );
}
