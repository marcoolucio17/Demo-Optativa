"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ArrowDownToLine,
  Leaf,
  Settings,
  Hexagon,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Equipos", href: "/dashboard/equipment/EQ-001", icon: Package },
  { label: "Retiros", href: "/dashboard/recovery", icon: ArrowDownToLine },
  { label: "Reporte ESG", href: "/dashboard/esg", icon: Leaf },
  { label: "Configuración", href: "/dashboard/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <aside
      style={{
        width: "220px",
        minWidth: "220px",
        background: "var(--bg-secondary)",
        borderRight: "1px solid var(--border-subtle)",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        position: "sticky",
        top: 0,
        overflowY: "auto",
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "24px 20px",
          borderBottom: "1px solid var(--border-subtle)",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <Hexagon
          size={28}
          strokeWidth={1.5}
          style={{ color: "var(--accent-primary)", flexShrink: 0 }}
        />
        <span
          className="font-space"
          style={{
            fontSize: "13px",
            fontWeight: 700,
            color: "var(--text-primary)",
            lineHeight: "1.2",
          }}
        >
          HFC
          <br />
          TraceSystem
        </span>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: "12px 0" }}>
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "11px 20px",
                borderLeft: active
                  ? "3px solid var(--accent-primary)"
                  : "3px solid transparent",
                color: active ? "var(--accent-primary)" : "var(--text-muted)",
                textDecoration: "none",
                fontSize: "13px",
                fontFamily: '"IBM Plex Sans", sans-serif',
                fontWeight: active ? 500 : 400,
                transition: "color 0.15s, border-color 0.15s",
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.color =
                    "var(--text-secondary)";
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.color =
                    "var(--text-muted)";
                }
              }}
            >
              <Icon size={20} strokeWidth={1.75} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div
        style={{
          padding: "16px 20px",
          borderTop: "1px solid var(--border-subtle)",
        }}
      >
        <p
          className="font-ibm"
          style={{ fontSize: "10px", color: "var(--text-muted)" }}
        >
          v1.0.0 — SEMARNAT Cert.
        </p>
      </div>
    </aside>
  );
}
