"use client";

import Topbar from "../../components/Topbar";
import StatusPill from "../../components/StatusPill";
import {
  esgMetrics,
  regionalCompliance,
  gasTypePieData,
} from "../../lib/data";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Download, Share2, Award } from "lucide-react";

const tooltipStyle = {
  background: "var(--surface-elevated)",
  border: "1px solid var(--border-active)",
  borderRadius: "4px",
  fontSize: "12px",
  fontFamily: '"IBM Plex Sans", sans-serif',
  color: "var(--text-primary)",
};

const certBadges = [
  { id: "SEMARNAT", label: "SEMARNAT" },
  { id: "NOM-161", label: "NOM-161" },
  { id: "VERRA", label: "VERRA Certified" },
];

export default function ESGPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <Topbar breadcrumb={["Dashboard", "Reporte ESG"]} />

      <main
        style={{
          flex: 1,
          background: "var(--bg-base)",
          overflowY: "auto",
        }}
      >
        {/* ── Top Banner ────────────────────────────────────────────────────── */}
        <div
          style={{
            background: "var(--surface-card)",
            borderBottom: "1px solid var(--border-subtle)",
            padding: "18px 32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "20px",
              fontFamily: '"Space Mono", monospace',
              color: "var(--text-primary)",
              fontWeight: 700,
            }}
          >
            Reporte de Impacto Ambiental 2024
          </h2>
          <span
            style={{
              fontSize: "14px",
              fontFamily: '"IBM Plex Sans", sans-serif',
              color: "var(--text-secondary)",
            }}
          >
            Arca Continental — Flota México
          </span>
        </div>

        <div style={{ padding: "28px 32px", display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* ── Hero Metrics ──────────────────────────────────────────────────── */}
          <div
            className="esg-hero-grid"
            style={{
              gap: "0",
              background: "var(--surface-card)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "6px",
              overflow: "hidden",
            }}
          >
            {[
              { label: "HFC Recuperado", value: "28,450", unit: "kg" },
              { label: "CO₂e Evitado", value: "40,683", unit: "ton" },
              { label: "Créditos de Carbono", value: "40,683", unit: "créditos" },
              { label: "Valor Estimado", value: "$2,034,150", unit: "USD" },
            ].map((metric, i) => (
              <div
                key={metric.label}
                style={{
                  padding: "32px 24px",
                  textAlign: "center",
                  borderRight:
                    i < 3 ? "1px solid var(--border-subtle)" : "none",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span
                  className="mono-data"
                  style={{
                    fontSize: "40px",
                    fontWeight: 700,
                    color: "var(--accent-primary)",
                    lineHeight: 1,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {metric.value}
                </span>
                <span
                  style={{
                    fontSize: "13px",
                    fontFamily: '"IBM Plex Sans", sans-serif',
                    color: "var(--text-secondary)",
                  }}
                >
                  {metric.unit}
                </span>
                <span
                  style={{
                    fontSize: "11px",
                    fontFamily: '"IBM Plex Sans", sans-serif',
                    color: "var(--text-muted)",
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                    marginTop: "2px",
                  }}
                >
                  {metric.label}
                </span>
              </div>
            ))}
          </div>

          {/* ── Charts Row ──────────────────────────────────────────────────────── */}
          <div className="esg-charts-grid">
            {/* Monthly Recovery Bar Chart */}
            <div
              style={{
                background: "var(--surface-card)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "6px",
                padding: "24px",
              }}
            >
              <h3
                style={{
                  margin: "0 0 20px 0",
                  fontSize: "14px",
                  fontFamily: '"Space Mono", monospace',
                  color: "var(--text-primary)",
                }}
              >
                Recuperación mensual (kg)
              </h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart
                  data={esgMetrics.monthlyRecovery}
                  margin={{ top: 4, right: 4, bottom: 4, left: -20 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border-subtle)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    tick={{
                      fontSize: 10,
                      fill: "var(--text-muted)",
                      fontFamily: '"IBM Plex Sans", sans-serif',
                    }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{
                      fontSize: 10,
                      fill: "var(--text-muted)",
                      fontFamily: '"Roboto Mono", monospace',
                    }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(value) => [`${value} kg`, "Recuperado"]}
                    cursor={{ fill: "rgba(0,229,160,0.06)" }}
                  />
                  <Bar
                    dataKey="kg"
                    fill="var(--accent-primary)"
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Gas Type Pie Chart */}
            <div
              style={{
                background: "var(--surface-card)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "6px",
                padding: "24px",
              }}
            >
              <h3
                style={{
                  margin: "0 0 8px 0",
                  fontSize: "14px",
                  fontFamily: '"Space Mono", monospace',
                  color: "var(--text-primary)",
                }}
              >
                Distribución por tipo de gas
              </h3>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={gasTypePieData}
                    cx="50%"
                    cy="45%"
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {gasTypePieData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(value) => [`${value}%`, ""]}
                  />
                  <Legend
                    formatter={(value) => (
                      <span
                        style={{
                          fontSize: "11px",
                          fontFamily: '"IBM Plex Sans", sans-serif',
                          color: "var(--text-secondary)",
                        }}
                      >
                        {value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ── Compliance Table ─────────────────────────────────────────────── */}
          <div
            style={{
              background: "var(--surface-card)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "6px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "16px 24px",
                borderBottom: "1px solid var(--border-subtle)",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: "16px",
                  fontFamily: '"Space Mono", monospace',
                  color: "var(--text-primary)",
                }}
              >
                Cumplimiento por región
              </h3>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "var(--surface-elevated)" }}>
                  {[
                    "Región",
                    "Equipos Retirados",
                    "Gas Recuperado (kg)",
                    "Créditos Generados",
                    "Estado NOM-161",
                  ].map((col) => (
                    <th
                      key={col}
                      style={{
                        padding: "11px 24px",
                        textAlign: "left",
                        fontSize: "11px",
                        fontFamily: '"Space Mono", monospace',
                        color: "var(--text-muted)",
                        textTransform: "uppercase",
                        letterSpacing: "0.07em",
                        fontWeight: 400,
                        borderBottom: "1px solid var(--border-subtle)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {regionalCompliance.map((row, i) => (
                  <tr
                    key={row.region}
                    style={{
                      background:
                        i % 2 === 0 ? "var(--surface-card)" : "var(--bg-secondary)",
                    }}
                  >
                    <td
                      style={{
                        padding: "13px 24px",
                        fontSize: "13px",
                        fontFamily: '"IBM Plex Sans", sans-serif',
                        color: "var(--text-primary)",
                        borderBottom: "1px solid var(--border-subtle)",
                        fontWeight: 500,
                      }}
                    >
                      {row.region}
                    </td>
                    <td
                      style={{
                        padding: "13px 24px",
                        borderBottom: "1px solid var(--border-subtle)",
                      }}
                    >
                      <span
                        className="mono-data"
                        style={{ fontSize: "13px", color: "var(--text-primary)" }}
                      >
                        {row.equipmentRetired.toLocaleString()}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "13px 24px",
                        borderBottom: "1px solid var(--border-subtle)",
                      }}
                    >
                      <span
                        className="mono-data"
                        style={{ fontSize: "13px", color: "var(--accent-primary)" }}
                      >
                        {row.gasRecovered.toLocaleString()}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "13px 24px",
                        borderBottom: "1px solid var(--border-subtle)",
                      }}
                    >
                      <span
                        className="mono-data"
                        style={{ fontSize: "13px", color: "var(--text-secondary)" }}
                      >
                        {row.creditsGenerated.toLocaleString()}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "13px 24px",
                        borderBottom: "1px solid var(--border-subtle)",
                      }}
                    >
                      <StatusPill
                        status={row.status}
                        label={row.nomCompliance}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Bottom Action Row ──────────────────────────────────────────────── */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "16px",
              paddingTop: "4px",
            }}
          >
            {/* Certification badges */}
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {certBadges.map((badge) => (
                <div
                  key={badge.id}
                  style={{
                    height: "32px",
                    padding: "0 14px",
                    background: "var(--surface-elevated)",
                    border: "1px solid var(--border-active)",
                    borderRadius: "0",
                    display: "flex",
                    alignItems: "center",
                    gap: "7px",
                  }}
                >
                  <Award
                    size={13}
                    strokeWidth={1.75}
                    style={{ color: "var(--accent-primary)", flexShrink: 0 }}
                  />
                  <span
                    style={{
                      fontSize: "12px",
                      fontFamily: '"IBM Plex Sans", sans-serif',
                      color: "var(--text-secondary)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {badge.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                style={{
                  height: "40px",
                  padding: "0 22px",
                  background: "transparent",
                  color: "var(--accent-primary)",
                  border: "1px solid var(--accent-primary)",
                  borderRadius: "0",
                  fontSize: "13px",
                  fontFamily: '"Space Mono", monospace',
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  letterSpacing: "0.03em",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background =
                    "rgba(0,229,160,0.08)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                }}
              >
                <Download size={15} strokeWidth={1.75} />
                Exportar PDF
              </button>

              <button
                style={{
                  height: "40px",
                  padding: "0 22px",
                  background: "var(--accent-primary)",
                  color: "var(--bg-base)",
                  border: "none",
                  borderRadius: "0",
                  fontSize: "13px",
                  fontFamily: '"Space Mono", monospace',
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  letterSpacing: "0.03em",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.opacity = "0.88")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.opacity = "1")
                }
              >
                <Share2 size={15} strokeWidth={1.75} />
                Compartir con Inversionistas
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
