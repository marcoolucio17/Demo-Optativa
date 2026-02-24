"use client";
import { useState } from "react";
import Topbar from "../../components/Topbar";
import { User, Bell, Users, Building2, SlidersHorizontal, Shield } from "lucide-react";

const tabs = [
  { id: 0, label: "Perfil de usuario", icon: User },
  { id: 1, label: "Notificaciones", icon: Bell },
  { id: 2, label: "Operadores", icon: Users },
  { id: 3, label: "Centros de recuperación", icon: Building2 },
  { id: 4, label: "Parámetros del sistema", icon: SlidersHorizontal },
  { id: 5, label: "Seguridad", icon: Shield },
];

const field = (label: string, value: string, readOnly?: boolean) => (
  <div key={label}>
    <label style={{ display: "block", fontSize: "12px", fontFamily: '"IBM Plex Sans", sans-serif', color: "var(--text-secondary)", marginBottom: "6px" }}>{label}</label>
    <input defaultValue={value} readOnly={readOnly} style={{ width: "100%", height: "42px", background: readOnly ? "var(--surface-elevated)" : "var(--bg-base)", border: "1px solid var(--border-active)", borderLeft: readOnly ? "3px solid var(--border-active)" : undefined, padding: "0 12px", color: readOnly ? "var(--text-secondary)" : "var(--text-primary)", fontSize: "13px", fontFamily: '"IBM Plex Sans", sans-serif', outline: "none", boxSizing: "border-box" as const }} />
  </div>
);

const sectionTitle = (text: string) => (
  <h3 style={{ margin: "0 0 20px 0", fontSize: "16px", fontFamily: '"Space Mono", monospace', color: "var(--text-primary)" }}>{text}</h3>
);

const saveBtn = (label: string) => (
  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "24px" }}>
    <button style={{ height: "42px", padding: "0 24px", background: "var(--accent-primary)", color: "var(--bg-base)", border: "none", fontSize: "13px", fontFamily: '"Space Mono", monospace', fontWeight: 700, cursor: "pointer" }}>{label}</button>
  </div>
);

// ── Toggle helper ────────────────────────────────────────────────────────────
function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <div onClick={onChange} style={{ width: "40px", height: "22px", borderRadius: "11px", background: on ? "var(--accent-primary)" : "var(--border-active)", position: "relative", cursor: "pointer", flexShrink: 0, transition: "background 0.2s" }}>
      <div style={{ position: "absolute", top: "3px", left: on ? "21px" : "3px", width: "16px", height: "16px", borderRadius: "50%", background: "#fff", transition: "left 0.2s" }} />
    </div>
  );
}

// ── TAB 1: Profile ───────────────────────────────────────────────────────────
function TabProfile() {
  return (
    <div>
      {sectionTitle("Información personal")}
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "28px" }}>
        <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "var(--surface-elevated)", border: "1px solid var(--border-active)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <User size={28} strokeWidth={1.5} style={{ color: "var(--text-muted)" }} />
        </div>
        <a href="#" style={{ fontSize: "12px", fontFamily: '"IBM Plex Sans", sans-serif', color: "var(--accent-primary)", textDecoration: "none" }}>Cambiar foto</a>
      </div>
      <div className="settings-form-grid">
        {field("Nombre completo", "Carlos Mendoza")}
        {field("Correo electrónico", "c.mendoza@arcacontinental.mx")}
        {field("Cargo", "Gestor de Flota")}
        {field("Empresa", "Arca Continental", true)}
        {field("Teléfono", "+52 81 1234 5678")}
        <div>
          <label style={{ display: "block", fontSize: "12px", fontFamily: '"IBM Plex Sans", sans-serif', color: "var(--text-secondary)", marginBottom: "6px" }}>Región asignada</label>
          <select style={{ width: "100%", height: "42px", background: "var(--bg-base)", border: "1px solid var(--border-active)", padding: "0 12px", color: "var(--text-primary)", fontSize: "13px", fontFamily: '"IBM Plex Sans", sans-serif', outline: "none", boxSizing: "border-box" as const }}>
            {["Nacional","Norte","Centro","Sur","Occidente","Noreste"].map(r => <option key={r} style={{ background: "var(--surface-elevated)" }}>{r}</option>)}
          </select>
        </div>
      </div>
      <div style={{ marginTop: "32px", paddingTop: "24px", borderTop: "1px solid var(--border-subtle)" }}>
        <h4 style={{ margin: "0 0 16px 0", fontSize: "14px", fontFamily: '"Space Mono", monospace', color: "var(--text-primary)" }}>Certificaciones</h4>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          {[{ label: "NOM-161 Técnico Certificado", exp: "Dic 2025" }, { label: "SEMARNAT Gestor Autorizado", exp: "Mar 2026" }].map(c => (
            <div key={c.label} style={{ flex: "1 1 240px", padding: "14px 16px", background: "var(--surface-elevated)", borderLeft: "3px solid var(--accent-primary)", borderTop: "1px solid var(--border-subtle)", borderRight: "1px solid var(--border-subtle)", borderBottom: "1px solid var(--border-subtle)", borderRadius: "0 4px 4px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ margin: "0 0 4px 0", fontSize: "13px", fontFamily: '"IBM Plex Sans", sans-serif', color: "var(--text-primary)", fontWeight: 500 }}>{c.label}</p>
                <p style={{ margin: 0, fontSize: "11px", fontFamily: '"IBM Plex Sans", sans-serif', color: "var(--text-muted)" }}>Vigente hasta: {c.exp}</p>
              </div>
              <span style={{ fontSize: "11px", fontFamily: '"IBM Plex Sans", sans-serif', color: "var(--accent-primary)", background: "rgba(0,229,160,0.1)", padding: "2px 8px", border: "1px solid var(--accent-primary)" }}>Vigente</span>
            </div>
          ))}
        </div>
      </div>
      {saveBtn("Guardar cambios")}
    </div>
  );
}

// ── TAB 2: Notifications ─────────────────────────────────────────────────────
function TabNotifications() {
  const [toggles, setToggles] = useState([true, true, true, true, false, false]);
  const notifs = [
    { emoji: "🔴", label: "Equipos en estado crítico", desc: "Alerta inmediata cuando un equipo supera 10 años" },
    { emoji: "🟠", label: "Fugas de gas detectadas", desc: "Notificación cuando la integridad baja de 30%" },
    { emoji: "📋", label: "Retiros programados", desc: "Recordatorio 7 días antes de retiro programado" },
    { emoji: "📊", label: "Reporte ESG mensual", desc: "Resumen automático el primer lunes de cada mes" },
    { emoji: "🔵", label: "Actualizaciones del sistema", desc: "Nuevas versiones y cambios de plataforma" },
    { emoji: "📧", label: "Resumen semanal por correo", desc: "Email cada lunes con métricas de la semana" },
  ];
  return (
    <div>
      {sectionTitle("Preferencias de alertas")}
      <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
        {notifs.map((n, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", borderBottom: i < notifs.length - 1 ? "1px solid var(--border-subtle)" : "none" }}>
            <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
              <span style={{ fontSize: "18px", lineHeight: 1, marginTop: "1px" }}>{n.emoji}</span>
              <div>
                <p style={{ margin: "0 0 3px 0", fontSize: "14px", fontFamily: '"IBM Plex Sans", sans-serif', color: "var(--text-primary)", fontWeight: 500 }}>{n.label}</p>
                <p style={{ margin: 0, fontSize: "12px", fontFamily: '"IBM Plex Sans", sans-serif', color: "var(--text-muted)" }}>{n.desc}</p>
              </div>
            </div>
            <Toggle on={toggles[i]} onChange={() => setToggles(t => t.map((v, j) => j === i ? !v : v))} />
          </div>
        ))}
      </div>
      <div style={{ marginTop: "28px", paddingTop: "24px", borderTop: "1px solid var(--border-subtle)" }}>
        <h4 style={{ margin: "0 0 16px 0", fontSize: "14px", fontFamily: '"Space Mono", monospace', color: "var(--text-primary)" }}>Canales de notificación</h4>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {[{ label: "Email", val: "c.mendoza@arcacontinental.mx", on: true }, { label: "WhatsApp", val: "+52 81 1234 5678", on: false }, { label: "SMS", val: "+52 81 1234 5678", on: false }].map((ch, i) => (
            <div key={i} style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <span style={{ fontSize: "12px", fontFamily: '"IBM Plex Sans", sans-serif', color: "var(--text-secondary)", width: "70px", flexShrink: 0 }}>{ch.label}</span>
              <input defaultValue={ch.val} style={{ flex: 1, height: "38px", background: "var(--bg-base)", border: "1px solid var(--border-active)", padding: "0 12px", color: "var(--text-primary)", fontSize: "13px", fontFamily: '"IBM Plex Sans", sans-serif', outline: "none" }} />
              <Toggle on={ch.on} onChange={() => {}} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── TAB 6: Security ──────────────────────────────────────────────────────────
function TabSecurity() {
  const sessions = [
    { device: "Chrome / Windows 11", location: "Monterrey, NL", ip: "192.168.1.12", time: "Ahora — activo", current: true },
    { device: "Safari / iPhone 14", location: "Monterrey, NL", ip: "192.168.1.45", time: "Hace 2 horas", current: false },
    { device: "Chrome / MacBook Pro", location: "Ciudad de México", ip: "10.0.1.22", time: "Hace 1 día", current: false },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      <div>
        {sectionTitle("Cambiar contraseña")}
        <div style={{ maxWidth: "480px", display: "flex", flexDirection: "column", gap: "16px" }}>
          {field("Contraseña actual", "", false)}
          {field("Nueva contraseña", "", false)}
          {field("Confirmar nueva contraseña", "", false)}
          <div>
            <div style={{ height: "6px", background: "var(--surface-elevated)", borderRadius: "2px", overflow: "hidden", marginBottom: "6px" }}>
              <div style={{ height: "100%", width: "33%", background: "var(--accent-danger)", borderRadius: "2px" }} />
            </div>
            <p style={{ margin: 0, fontSize: "11px", fontFamily: '"IBM Plex Sans", sans-serif', color: "var(--text-muted)" }}>La contraseña debe tener mínimo 12 caracteres, mayúsculas y un símbolo.</p>
          </div>
        </div>
        {saveBtn("Actualizar contraseña")}
      </div>
      <div style={{ paddingTop: "24px", borderTop: "1px solid var(--border-subtle)" }}>
        <h4 style={{ margin: "0 0 16px 0", fontSize: "14px", fontFamily: '"Space Mono", monospace', color: "var(--text-primary)" }}>Autenticación de dos factores</h4>
        <div style={{ display: "flex", gap: "16px", alignItems: "center", padding: "16px 20px", background: "var(--surface-elevated)", border: "1px solid var(--border-active)", borderLeft: "3px solid var(--accent-secondary)" }}>
          <Shield size={24} strokeWidth={1.5} style={{ color: "var(--accent-secondary)", flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <p style={{ margin: "0 0 3px 0", fontSize: "14px", fontFamily: '"IBM Plex Sans", sans-serif', color: "var(--text-primary)", fontWeight: 500 }}>2FA activado — Authenticator App</p>
            <p style={{ margin: 0, fontSize: "12px", fontFamily: '"IBM Plex Sans", sans-serif', color: "var(--text-muted)" }}>Código de verificación requerido en cada inicio de sesión</p>
          </div>
          <span style={{ fontSize: "11px", color: "var(--accent-primary)", background: "rgba(0,229,160,0.1)", padding: "2px 8px", border: "1px solid var(--accent-primary)", fontFamily: '"IBM Plex Sans", sans-serif', flexShrink: 0 }}>Activo</span>
        </div>
      </div>
      <div style={{ paddingTop: "24px", borderTop: "1px solid var(--border-subtle)" }}>
        <h4 style={{ margin: "0 0 16px 0", fontSize: "14px", fontFamily: '"Space Mono", monospace', color: "var(--text-primary)" }}>Sesiones activas</h4>
        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {sessions.map((s, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: i < sessions.length - 1 ? "1px solid var(--border-subtle)" : "none" }}>
              <div>
                <p style={{ margin: "0 0 3px 0", fontSize: "13px", fontFamily: '"IBM Plex Sans", sans-serif', color: "var(--text-primary)", fontWeight: 500, display: "flex", alignItems: "center", gap: "8px" }}>
                  {s.device}
                  {s.current && <span style={{ fontSize: "10px", color: "var(--accent-primary)", background: "rgba(0,229,160,0.1)", padding: "1px 6px", border: "1px solid var(--accent-primary)" }}>Esta sesión</span>}
                </p>
                <p style={{ margin: 0, fontSize: "11px", fontFamily: '"Roboto Mono", monospace', color: "var(--text-muted)" }}>{s.location} · {s.ip} · {s.time}</p>
              </div>
              {!s.current && (
                <button style={{ height: "30px", padding: "0 14px", background: "transparent", border: "1px solid var(--accent-danger)", color: "var(--accent-danger)", fontSize: "11px", fontFamily: '"IBM Plex Sans", sans-serif', cursor: "pointer", flexShrink: 0 }}>Cerrar</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main Shell ───────────────────────────────────────────────────────────────
const tabComponents = [TabProfile, TabNotifications, TabOperators, TabCenters, TabParameters, TabSecurity];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState(0);
  const ActiveComponent = tabComponents[activeTab];
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <Topbar breadcrumb={["Dashboard", "Configuración"]} />
      <main style={{ flex: 1, background: "var(--bg-base)", overflowY: "auto" }}>
        {/* Tab header */}
        <div style={{ background: "var(--bg-secondary)", borderBottom: "1px solid var(--border-subtle)", padding: "0 32px", display: "flex", gap: "0", overflowX: "auto" }}>
          {tabs.map(({ id, label, icon: Icon }) => {
            const active = activeTab === id;
            return (
              <button key={id} onClick={() => setActiveTab(id)} style={{ display: "flex", alignItems: "center", gap: "8px", height: "52px", padding: "0 18px", background: "none", border: "none", borderBottom: active ? "2px solid var(--accent-primary)" : "2px solid transparent", color: active ? "var(--text-primary)" : "var(--text-muted)", fontSize: "13px", fontFamily: '"IBM Plex Sans", sans-serif', fontWeight: active ? 500 : 400, cursor: "pointer", whiteSpace: "nowrap", transition: "color 0.15s" }}
                onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)"; }}
                onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; }}>
                <Icon size={15} strokeWidth={1.75} style={{ flexShrink: 0 }} />
                {label}
              </button>
            );
          })}
        </div>
        {/* Tab content */}
        <div style={{ padding: "32px", maxWidth: "900px" }}>
          <ActiveComponent />
        </div>
      </main>
    </div>
  );
}
// ── TAB 4: Centers ───────────────────────────────────────────────────────────
const centers = [
  { name: "Centro Monterrey Norte", code: "MNT-01", city: "Monterrey, NL", capacity: "500 kg", status: "Operativo" },
  { name: "Centro CDMX Vallejo", code: "CDM-01", city: "CDMX", capacity: "800 kg", status: "Operativo" },
  { name: "Centro Guadalajara Sur", code: "GDL-01", city: "Guadalajara, JAL", capacity: "400 kg", status: "Operativo" },
  { name: "Centro Puebla Central", code: "PUE-01", city: "Puebla, PUE", capacity: "300 kg", status: "Mantenimiento" },
  { name: "Centro Tijuana", code: "TIJ-01", city: "Tijuana, BC", capacity: "350 kg", status: "Operativo" },
  { name: "Centro Veracruz", code: "VER-01", city: "Veracruz, VER", capacity: "280 kg", status: "Operativo" },
];
function TabCenters() {
  return (
    <div>
      {sectionTitle("Centros de recuperación autorizados")}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
        {centers.map((c) => (
          <div key={c.code} style={{ background: "var(--surface-elevated)", border: "1px solid var(--border-subtle)", borderTop: `3px solid ${c.status === "Operativo" ? "var(--accent-primary)" : "var(--accent-warning)"}`, borderRadius: "0 0 4px 4px", padding: "18px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
              <div>
                <p style={{ margin: "0 0 4px 0", fontSize: "14px", fontFamily: '"IBM Plex Sans", sans-serif', color: "var(--text-primary)", fontWeight: 600 }}>{c.name}</p>
                <p style={{ margin: 0, fontSize: "11px", fontFamily: '"Roboto Mono", monospace', color: "var(--accent-primary)" }}>{c.code}</p>
              </div>
              <span style={{ fontSize: "11px", color: c.status === "Operativo" ? "var(--accent-primary)" : "var(--accent-warning)", background: c.status === "Operativo" ? "rgba(0,229,160,0.1)" : "rgba(255,107,53,0.1)", padding: "2px 8px", border: `1px solid ${c.status === "Operativo" ? "var(--accent-primary)" : "var(--accent-warning)"}`, fontFamily: '"IBM Plex Sans", sans-serif', flexShrink: 0 }}>{c.status}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {[{ l: "Ciudad", v: c.city }, { l: "Capacidad", v: c.capacity }].map(row => (
                <div key={row.l} style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "12px", fontFamily: '"IBM Plex Sans", sans-serif', color: "var(--text-muted)" }}>{row.l}</span>
                  <span style={{ fontSize: "12px", fontFamily: '"IBM Plex Sans", sans-serif', color: "var(--text-secondary)" }}>{row.v}</span>
                </div>
              ))}
            </div>
            <button style={{ width: "100%", height: "32px", marginTop: "14px", background: "transparent", border: "1px solid var(--border-active)", color: "var(--text-secondary)", fontSize: "12px", fontFamily: '"IBM Plex Sans", sans-serif', cursor: "pointer" }}>Ver detalles</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── TAB 5: Parameters ────────────────────────────────────────────────────────
function TabParameters() {
  const [vals, setVals] = useState({ age: "10", integrity: "30", critThreshold: "7", autoReport: true, gps: true, semarnat: true });
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      {sectionTitle("Umbrales operativos")}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        {[
          { key: "age", label: "Años máximos de vida útil", suffix: "años", desc: "Equipos por encima de este umbral se marcan como críticos" },
          { key: "integrity", label: "Umbral de integridad crítica", suffix: "%", desc: "Porcentaje mínimo antes de activar alerta crítica" },
          { key: "critThreshold", label: "% flota crítica — alerta regional", suffix: "%", desc: "Porcentaje de flota crítica que dispara reporte regional" },
        ].map((p) => (
          <div key={p.key}>
            <label style={{ display: "block", fontSize: "12px", fontFamily: '"IBM Plex Sans", sans-serif', color: "var(--text-secondary)", marginBottom: "6px" }}>{p.label}</label>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input value={vals[p.key as keyof typeof vals] as string} onChange={e => setVals(v => ({ ...v, [p.key]: e.target.value }))} style={{ width: "100px", height: "42px", background: "var(--bg-base)", border: "1px solid var(--border-active)", padding: "0 12px", color: "var(--accent-primary)", fontSize: "18px", fontFamily: '"Roboto Mono", monospace', fontWeight: 700, outline: "none", textAlign: "center" }} />
              <span style={{ fontSize: "14px", fontFamily: '"IBM Plex Sans", sans-serif', color: "var(--text-muted)" }}>{p.suffix}</span>
            </div>
            <p style={{ margin: "8px 0 0 0", fontSize: "11px", fontFamily: '"IBM Plex Sans", sans-serif', color: "var(--text-muted)" }}>{p.desc}</p>
          </div>
        ))}
      </div>
      <div style={{ paddingTop: "24px", borderTop: "1px solid var(--border-subtle)" }}>
        <h4 style={{ margin: "0 0 20px 0", fontSize: "14px", fontFamily: '"Space Mono", monospace', color: "var(--text-primary)" }}>Integraciones y automatización</h4>
        {[
          { key: "autoReport", label: "Reportes ESG automáticos", desc: "Generar y enviar reporte el primer lunes de cada mes" },
          { key: "gps", label: "Sincronización GPS activa", desc: "Actualizar coordenadas de equipos móviles en tiempo real" },
          { key: "semarnat", label: "Envío automático a SEMARNAT", desc: "Transmitir manifiestos de recuperación al RETC automáticamente" },
        ].map((p, i) => (
          <div key={p.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", borderBottom: i < 2 ? "1px solid var(--border-subtle)" : "none" }}>
            <div>
              <p style={{ margin: "0 0 3px 0", fontSize: "14px", fontFamily: '"IBM Plex Sans", sans-serif', color: "var(--text-primary)", fontWeight: 500 }}>{p.label}</p>
              <p style={{ margin: 0, fontSize: "12px", fontFamily: '"IBM Plex Sans", sans-serif', color: "var(--text-muted)" }}>{p.desc}</p>
            </div>
            <Toggle on={vals[p.key as keyof typeof vals] as boolean} onChange={() => setVals(v => ({ ...v, [p.key]: !v[p.key as keyof typeof vals] }))} />
          </div>
        ))}
      </div>
      {saveBtn("Guardar parámetros")}
    </div>
  );
}

// ── TAB 3: Operators ─────────────────────────────────────────────────────────
const operators = [
  { name: "Carlos Mendoza Reyes", role: "Gestor de Flota", region: "Centro", cert: "active", access: "Admin", last: "hace 2 horas" },
  { name: "Alejandro Torres Vega", role: "Técnico de Campo", region: "Noreste", cert: "active", access: "Operador", last: "hace 3 horas" },
  { name: "Sandra Viveros Peña", role: "Supervisora Regional", region: "Centro", cert: "active", access: "Operador", last: "ayer" },
  { name: "Héctor Ramírez Cruz", role: "Técnico de Campo", region: "Occidente", cert: "active", access: "Operador", last: "hace 2 días" },
  { name: "Fernanda Castillo Ruíz", role: "Analista ESG", region: "Sureste", cert: "active", access: "Solo lectura", last: "hace 3 días" },
  { name: "Miguel Ángel Fuentes", role: "Técnico de Campo", region: "Sureste", cert: "warning", access: "Operador", last: "hace 1 semana" },
];
const accessColor: Record<string, string> = { "Admin": "var(--accent-secondary)", "Operador": "var(--accent-primary)", "Solo lectura": "var(--text-muted)" };

function TabOperators() {
  return (
    <div>
      {sectionTitle("Equipo de operadores")}
      <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
        <input placeholder="Buscar operador..." style={{ flex: 1, minWidth: "200px", height: "38px", background: "var(--bg-secondary)", border: "1px solid var(--border-active)", padding: "0 12px", color: "var(--text-primary)", fontSize: "13px", fontFamily: '"IBM Plex Sans", sans-serif', outline: "none" }} />
        <button style={{ height: "38px", padding: "0 20px", background: "var(--accent-primary)", color: "var(--bg-base)", border: "none", fontSize: "12px", fontFamily: '"Space Mono", monospace', fontWeight: 700, cursor: "pointer", flexShrink: 0 }}>Agregar operador</button>
      </div>
      <div className="table-scroll">
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "600px" }}>
          <thead>
            <tr style={{ background: "var(--surface-elevated)" }}>
              {["Operador","Cargo","Región","Acceso","Certificación","Último acceso","Acciones"].map(c => (
                <th key={c} style={{ padding: "10px 16px", textAlign: "left", fontSize: "11px", fontFamily: '"Space Mono", monospace', color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 400, borderBottom: "1px solid var(--border-subtle)", whiteSpace: "nowrap" }}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {operators.map((op, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? "var(--surface-card)" : "var(--bg-secondary)" }}>
                <td style={{ padding: "12px 16px", borderBottom: "1px solid var(--border-subtle)" }}>
                  <p style={{ margin: "0 0 2px 0", fontSize: "13px", fontFamily: '"IBM Plex Sans", sans-serif', color: "var(--text-primary)", fontWeight: 500 }}>{op.name}</p>
                  <p style={{ margin: 0, fontSize: "11px", fontFamily: '"IBM Plex Sans", sans-serif', color: "var(--text-muted)" }}>{op.role}</p>
                </td>
                <td style={{ padding: "12px 16px", fontSize: "12px", fontFamily: '"IBM Plex Sans", sans-serif', color: "var(--text-secondary)", borderBottom: "1px solid var(--border-subtle)" }}>{op.region}</td>
                <td style={{ padding: "12px 16px", borderBottom: "1px solid var(--border-subtle)" }}>
                  <span style={{ fontSize: "11px", fontFamily: '"Space Mono", monospace', color: accessColor[op.access], background: `${accessColor[op.access]}18`, padding: "2px 8px", border: `1px solid ${accessColor[op.access]}` }}>{op.access}</span>
                </td>
                <td style={{ padding: "12px 16px", borderBottom: "1px solid var(--border-subtle)" }}>
                  <span style={{ fontSize: "11px", color: op.cert === "active" ? "var(--accent-primary)" : "var(--accent-warning)", fontFamily: '"IBM Plex Sans", sans-serif' }}>{op.cert === "active" ? "✓ Vigente" : "⚠ Vencida"}</span>
                </td>
                <td style={{ padding: "12px 16px", fontSize: "12px", fontFamily: '"Roboto Mono", monospace', color: "var(--text-muted)", borderBottom: "1px solid var(--border-subtle)" }}>{op.last}</td>
                <td style={{ padding: "12px 16px", borderBottom: "1px solid var(--border-subtle)" }}>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <span style={{ fontSize: "12px", fontFamily: '"IBM Plex Sans", sans-serif', color: "var(--text-muted)", cursor: "pointer" }} onMouseEnter={e => (e.currentTarget.style.color = "var(--accent-primary)")} onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}>Editar</span>
                    <span style={{ fontSize: "12px", fontFamily: '"IBM Plex Sans", sans-serif', color: "var(--text-muted)", cursor: "pointer" }} onMouseEnter={e => (e.currentTarget.style.color = "var(--accent-danger)")} onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}>Eliminar</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px" }}>
        <span style={{ fontSize: "12px", fontFamily: '"IBM Plex Sans", sans-serif', color: "var(--text-muted)" }}>Mostrando 6 de 24 operadores</span>
        <div style={{ display: "flex", gap: "8px" }}>
          {["Anterior","Siguiente"].map(b => <button key={b} style={{ height: "32px", padding: "0 16px", background: "transparent", border: "1px solid var(--border-active)", color: "var(--text-secondary)", fontSize: "12px", fontFamily: '"IBM Plex Sans", sans-serif', cursor: "pointer" }}>{b}</button>)}
        </div>
      </div>
    </div>
  );
}
