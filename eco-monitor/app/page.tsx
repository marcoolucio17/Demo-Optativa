"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Hexagon, Eye, EyeOff, Lock } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const isEnabled = email.trim().length > 0 && password.trim().length > 0;

  const handleLogin = () => {
    if (isEnabled) router.push("/dashboard");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background: "var(--bg-base)",
      }}
    >
      {/* Main two-column layout */}
      <div style={{ display: "flex", flex: 1 }}>
        {/* ── Left Column (60%) ─────────────────────────────────────────────── */}
        <div
          style={{
            flex: "0 0 60%",
            background: "var(--bg-base)",
            padding: "60px 64px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Circuit-board SVG pattern overlay */}
          <svg
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              opacity: 0.15,
              pointerEvents: "none",
            }}
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="circuit"
                x="0"
                y="0"
                width="80"
                height="80"
                patternUnits="userSpaceOnUse"
              >
                {/* Horizontal lines */}
                <line
                  x1="0" y1="20" x2="30" y2="20"
                  stroke="#2a4060" strokeWidth="1"
                />
                <line
                  x1="50" y1="20" x2="80" y2="20"
                  stroke="#2a4060" strokeWidth="1"
                />
                <line
                  x1="0" y1="60" x2="80" y2="60"
                  stroke="#2a4060" strokeWidth="1"
                />
                {/* Vertical lines */}
                <line
                  x1="20" y1="0" x2="20" y2="80"
                  stroke="#2a4060" strokeWidth="1"
                />
                <line
                  x1="60" y1="0" x2="60" y2="40"
                  stroke="#2a4060" strokeWidth="1"
                />
                <line
                  x1="60" y1="60" x2="60" y2="80"
                  stroke="#2a4060" strokeWidth="1"
                />
                {/* Nodes */}
                <circle cx="20" cy="20" r="3" fill="#2a4060" />
                <circle cx="60" cy="60" r="3" fill="#2a4060" />
                <circle cx="20" cy="60" r="2" fill="#2a4060" />
                <circle cx="60" cy="20" r="2" fill="#2a4060" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#circuit)" />
          </svg>

          {/* Content over pattern */}
          <div style={{ position: "relative", zIndex: 1 }}>
            {/* Logo */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "64px",
              }}
            >
              <Hexagon
                size={32}
                strokeWidth={1.5}
                style={{ color: "var(--accent-primary)" }}
              />
              <span
                className="font-space"
                style={{
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  letterSpacing: "-0.02em",
                }}
              >
                HFC TraceSystem
              </span>
            </div>

            {/* Headline */}
            <h1
              style={{
                fontSize: "clamp(36px, 4vw, 48px)",
                fontWeight: 700,
                color: "var(--text-primary)",
                lineHeight: "1.1",
                margin: "0 0 20px 0",
                fontFamily: '"Space Mono", monospace',
                letterSpacing: "-0.03em",
              }}
            >
              Control total sobre
              <br />
              tus refrigerantes.
            </h1>

            {/* Subheadline */}
            <p
              style={{
                fontSize: "16px",
                fontFamily: '"IBM Plex Sans", sans-serif',
                color: "var(--text-secondary)",
                lineHeight: "1.65",
                maxWidth: "480px",
                margin: 0,
              }}
            >
              Trazabilidad certificada, recuperación inteligente y cumplimiento
              ESG en una sola plataforma.
            </p>
          </div>

          {/* Stat pills row */}
          <div
            style={{
              position: "relative",
              zIndex: 1,
              display: "flex",
              gap: "16px",
              flexWrap: "wrap",
            }}
          >
            {[
              { value: "847K", label: "equipos registrados" },
              { value: "40K ton", label: "CO₂e evitado" },
              { value: "9", label: "centros certificados" },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  background: "var(--surface-card)",
                  borderLeft: "3px solid var(--accent-primary)",
                  padding: "14px 18px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                  flex: "1 1 140px",
                  minWidth: "140px",
                }}
              >
                <span
                  className="font-space"
                  style={{
                    fontSize: "22px",
                    fontWeight: 700,
                    color: "var(--accent-primary)",
                    lineHeight: 1,
                  }}
                >
                  {stat.value}
                </span>
                <span
                  style={{
                    fontSize: "11px",
                    fontFamily: '"IBM Plex Sans", sans-serif',
                    color: "var(--text-secondary)",
                  }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right Column (40%) ────────────────────────────────────────────── */}
        <div
          style={{
            flex: "0 0 40%",
            background: "var(--surface-card)",
            border: "1px solid var(--border-subtle)",
            borderTop: "2px solid var(--accent-primary)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "48px 48px",
          }}
        >
          {/* Form header */}
          <div style={{ marginBottom: "36px" }}>
            <h2
              style={{
                fontSize: "24px",
                fontFamily: '"Space Mono", monospace',
                fontWeight: 700,
                color: "var(--text-primary)",
                margin: "0 0 8px 0",
              }}
            >
              Iniciar sesión
            </h2>
            <p
              style={{
                fontSize: "14px",
                fontFamily: '"IBM Plex Sans", sans-serif',
                color: "var(--text-secondary)",
                margin: 0,
              }}
            >
              Accede con tus credenciales corporativas.
            </p>
          </div>

          {/* Email field */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                fontSize: "12px",
                fontFamily: '"IBM Plex Sans", sans-serif',
                color: "var(--text-secondary)",
                marginBottom: "6px",
                fontWeight: 500,
              }}
            >
              Correo corporativo
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              placeholder="usuario@empresa.com"
              style={{
                width: "100%",
                height: "44px",
                background: "var(--bg-base)",
                border: `1px solid ${emailFocused ? "var(--accent-primary)" : "var(--border-active)"}`,
                borderRadius: "0",
                padding: "0 14px",
                color: "var(--text-primary)",
                fontSize: "14px",
                fontFamily: '"IBM Plex Sans", sans-serif',
                outline: "none",
                boxSizing: "border-box",
                transition: "border-color 0.15s",
              }}
            />
          </div>

          {/* Password field */}
          <div style={{ marginBottom: "28px" }}>
            <label
              style={{
                display: "block",
                fontSize: "12px",
                fontFamily: '"IBM Plex Sans", sans-serif',
                color: "var(--text-secondary)",
                marginBottom: "6px",
                fontWeight: 500,
              }}
            >
              Contraseña
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                placeholder="••••••••"
                style={{
                  width: "100%",
                  height: "44px",
                  background: "var(--bg-base)",
                  border: `1px solid ${passwordFocused ? "var(--accent-primary)" : "var(--border-active)"}`,
                  borderRadius: "0",
                  padding: "0 44px 0 14px",
                  color: "var(--text-primary)",
                  fontSize: "14px",
                  fontFamily: '"IBM Plex Sans", sans-serif',
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border-color 0.15s",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-muted)",
                  display: "flex",
                  alignItems: "center",
                  padding: 0,
                }}
              >
                {showPassword ? (
                  <EyeOff size={16} strokeWidth={1.75} />
                ) : (
                  <Eye size={16} strokeWidth={1.75} />
                )}
              </button>
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={handleLogin}
            disabled={!isEnabled}
            style={{
              width: "100%",
              height: "48px",
              borderRadius: "0",
              border: "none",
              background: isEnabled ? "var(--accent-primary)" : "var(--surface-elevated)",
              color: isEnabled ? "var(--bg-base)" : "var(--text-muted)",
              fontSize: "14px",
              fontFamily: '"Space Mono", monospace',
              fontWeight: 700,
              cursor: isEnabled ? "pointer" : "not-allowed",
              letterSpacing: "0.03em",
              transition: "background 0.15s, color 0.15s",
              marginBottom: "16px",
            }}
          >
            Entrar al sistema
          </button>

          {/* Forgot password */}
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <button
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "12px",
                fontFamily: '"IBM Plex Sans", sans-serif',
                color: "var(--text-muted)",
                textDecoration: "none",
                padding: 0,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.textDecoration = "underline";
                (e.currentTarget as HTMLElement).style.color = "var(--accent-primary)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.textDecoration = "none";
                (e.currentTarget as HTMLElement).style.color = "var(--text-muted)";
              }}
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          {/* Card footer */}
          <div
            style={{
              borderTop: "1px solid var(--border-subtle)",
              paddingTop: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <Lock
              size={13}
              strokeWidth={1.75}
              style={{ color: "var(--text-muted)", flexShrink: 0 }}
            />
            <span
              style={{
                fontSize: "11px",
                fontFamily: '"IBM Plex Sans", sans-serif',
                color: "var(--text-muted)",
                textAlign: "center",
              }}
            >
              Acceso restringido a operadores certificados
            </span>
          </div>
        </div>
      </div>

      {/* Page footer strip */}
      <footer
        style={{
          height: "40px",
          background: "var(--bg-secondary)",
          borderTop: "1px solid var(--border-subtle)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 40px",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontSize: "11px",
            fontFamily: '"IBM Plex Sans", sans-serif',
            color: "var(--text-muted)",
          }}
        >
          © 2025 HFC TraceSystem
        </span>
        <span
          style={{
            fontSize: "11px",
            fontFamily: '"IBM Plex Sans", sans-serif',
            color: "var(--text-muted)",
          }}
        >
          SEMARNAT | NOM-161 | VERRA Certified
        </span>
        <span
          style={{
            fontSize: "11px",
            fontFamily: '"IBM Plex Sans", sans-serif',
            color: "var(--text-muted)",
          }}
        >
          v1.0.0
        </span>
      </footer>
    </div>
  );
}
