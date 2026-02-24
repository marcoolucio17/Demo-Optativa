"use client";

import { use } from "react";
import Topbar from "../../../components/Topbar";
import StatusPill from "../../../components/StatusPill";
import { equipment, temperatureHistory, alertHistory } from "../../../lib/data";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  RadialBarChart,
  RadialBar,
} from "recharts";
import { Camera, AlertTriangle, AlertCircle, Info, Calendar } from "lucide-react";

const gasTypeColor: Record<string, string> = {
  "R-404A": "var(--accent-danger)",
  "R-134a": "var(--accent-warning)",
  "R-290": "var(--accent-primary)",
  "R-600a": "var(--accent-primary)",
};

function getIntegrityColor(pct: number): string {
  if (pct > 60) return "var(--accent-primary)";
  if (pct >= 30) return "var(--accent-warning)";
  return "var(--accent-danger)";
}

function getLifeColor(pct: number): string {
  if (pct > 50) return "var(--accent-primary)";
  if (pct >= 25) return "var(--accent-warning)";
  return "var(--accent-danger)";
}

const alertIconMap = {
  critical: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const alertColorMap = {
  critical: "var(--accent-danger)",
  warning: "var(--accent-warning)",
  info: "var(--accent-secondary)",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EquipmentDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const eq = equipment.find((e) => e.id === id) ?? equipment[0];

  const integrityColor = getIntegrityColor(eq.integrityPercent);
  const radialData = [{ value: eq.integrityPercent, fill: integrityColor }];

  const tooltipStyle = {
    background: "var(--surface-elevated)",
    border: "1px solid var(--border-active)",
    borderRadius: "4px",
    fontSize: "12px",
    fontFamily: '"IBM Plex Sans", sans-serif',
    color: "var(--text-primary)",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <Topbar breadcrumb={["Dashboard", "Equipos", eq.id]} />

      <main
        style={{
          flex: 1,
          padding: "28px",
          background: "var(--bg-base)",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        {/* ── Header Bar ─────────────────────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontFamily: '"Space Mono", monospace',
              fontSize: "18px",
              fontWeight: 700,
              color: "var(--accent-primary)",
              background: "var(--surface-elevated)",
              padding: "6px 14px",
              borderRadius: "4px",
              border: "1px solid var(--border-active)",
            }}
          >
            {eq.id}
          </span>
          <StatusPill status={eq.status} />
          <span
            style={{
              fontSize: "14px",
              fontFamily: '"IBM Plex Sans", sans-serif',
              color: "var(--text-secondary)",
            }}
          >
            {eq.location} — {eq.city}, {eq.state}
          </span>
        </div>

        {/* ── Two-column layout ──────────────────────────────────────────────── */}
        <div style={{ display: "flex", gap: "20px" }}>
          {/* Left Card — Equipment Info */}
          <div
            style={{
              flex: 1,
              background: "var(--surface-card)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "6px",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: "14px",
                fontFamily: '"Space Mono", monospace',
                color: "var(--text-primary)",
              }}
            >
              Información del equipo
            </h3>

            {/* Photo placeholder */}
            <div
              style={{
                background: "var(--surface-elevated)",
                border: "1px solid var(--border-active)",
                borderRadius: "4px",
                height: "160px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <Camera
                size={32}
                strokeWidth={1.5}
                style={{ color: "var(--text-muted)" }}
              />
              <span
                style={{
                  fontSize: "12px",
                  fontFamily: '"IBM Plex Sans", sans-serif',
                  color: "var(--text-muted)",
                }}
              >
                Foto del equipo
              </span>
            </div>

            {/* Info rows */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0",
              }}
            >
              {[
                { label: "Modelo", value: eq.model },
                { label: "Marca", value: eq.brand },
                { label: "Fecha de instalación", value: eq.installationDate },
                { label: "Antigüedad", value: `${eq.age} años` },
                {
                  label: "Tipo de gas",
                  value: eq.gasType,
                  colored: true,
                },
                { label: "Carga de gas", value: `${eq.gasCharge} kg` },
                { label: "Último servicio", value: eq.lastServiceDate },
                { label: "Técnico asignado", value: eq.technician },
                {
                  label: "Coordenadas",
                  value: `${eq.coordinates.lat}, ${eq.coordinates.lng}`,
                },
              ].map((row, i) => (
                <div
                  key={row.label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 0",
                    borderBottom:
                      i < 8 ? "1px solid var(--border-subtle)" : "none",
                  }}
                >
                  <span
                    style={{
                      fontSize: "12px",
                      fontFamily: '"IBM Plex Sans", sans-serif',
                      color: "var(--text-muted)",
                    }}
                  >
                    {row.label}
                  </span>
                  <span
                    style={{
                      fontSize: "14px",
                      fontFamily: '"IBM Plex Sans", sans-serif',
                      color: row.colored
                        ? gasTypeColor[row.value] ?? "var(--text-primary)"
                        : "var(--text-primary)",
                      fontWeight: row.colored ? 600 : 400,
                    }}
                  >
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Card — Monitoring Panel */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            {/* Gas Integrity Gauge */}
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
                Integridad del sistema
              </h3>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "24px",
                }}
              >
                <div style={{ position: "relative", width: "120px", height: "120px", flexShrink: 0 }}>
                  <ResponsiveContainer width={120} height={120}>
                    <RadialBarChart
                      innerRadius={36}
                      outerRadius={54}
                      data={radialData}
                      startAngle={90}
                      endAngle={-270}
                    >
                      <RadialBar
                        dataKey="value"
                        cornerRadius={4}
                        background={{ fill: "var(--surface-elevated)" }}
                      />
                    </RadialBarChart>
                  </ResponsiveContainer>
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span
                      className="mono-data"
                      style={{
                        fontSize: "18px",
                        fontWeight: 700,
                        color: integrityColor,
                      }}
                    >
                      {eq.integrityPercent}%
                    </span>
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      margin: "0 0 8px 0",
                      fontSize: "13px",
                      fontFamily: '"IBM Plex Sans", sans-serif',
                      color: "var(--text-secondary)",
                    }}
                  >
                    {eq.integrityPercent > 60
                      ? "Sistema operando dentro de parámetros normales."
                      : eq.integrityPercent >= 30
                      ? "Integridad reducida. Requiere atención preventiva."
                      : "Estado crítico. Programar retiro inmediato."}
                  </p>
                </div>
              </div>
            </div>

            {/* Temperature History */}
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
                  margin: "0 0 16px 0",
                  fontSize: "14px",
                  fontFamily: '"Space Mono", monospace',
                  color: "var(--text-primary)",
                }}
              >
                Historial de temperatura (12 meses)
              </h3>
              <ResponsiveContainer width="100%" height={160}>
                <LineChart
                  data={temperatureHistory}
                  margin={{ top: 4, right: 8, bottom: 4, left: -16 }}
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
                    domain={[-22, -12]}
                  />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Line
                    type="monotone"
                    dataKey="temp"
                    stroke="var(--accent-secondary)"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "var(--accent-secondary)", strokeWidth: 0 }}
                    activeDot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Remaining Life */}
            <div
              style={{
                background: "var(--surface-card)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "6px",
                padding: "24px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "12px",
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    fontSize: "14px",
                    fontFamily: '"Space Mono", monospace',
                    color: "var(--text-primary)",
                  }}
                >
                  Vida útil estimada restante
                </h3>
                <span
                  className="mono-data"
                  style={{
                    fontSize: "18px",
                    fontWeight: 700,
                    color: getLifeColor(eq.remainingLifePercent),
                  }}
                >
                  {eq.remainingLifePercent}%
                </span>
              </div>
              <div
                style={{
                  height: "10px",
                  background: "var(--surface-elevated)",
                  borderRadius: "3px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${eq.remainingLifePercent}%`,
                    background: getLifeColor(eq.remainingLifePercent),
                    borderRadius: "3px",
                    transition: "width 0.6s ease",
                  }}
                />
              </div>
              <p
                style={{
                  margin: "8px 0 0 0",
                  fontSize: "11px",
                  fontFamily: '"IBM Plex Sans", sans-serif',
                  color: "var(--text-muted)",
                }}
              >
                Instalado: {eq.installationDate} · {eq.age} años en servicio
              </p>
            </div>

            {/* Alert History */}
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
                  margin: "0 0 16px 0",
                  fontSize: "14px",
                  fontFamily: '"Space Mono", monospace',
                  color: "var(--text-primary)",
                }}
              >
                Historial de alertas
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {alertHistory.map((alert) => {
                  const Icon = alertIconMap[alert.type];
                  const color = alertColorMap[alert.type];
                  return (
                    <div
                      key={alert.id}
                      style={{
                        display: "flex",
                        gap: "12px",
                        alignItems: "flex-start",
                      }}
                    >
                      <Icon
                        size={16}
                        strokeWidth={1.75}
                        style={{ color, flexShrink: 0, marginTop: "1px" }}
                      />
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: "3px",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "11px",
                              fontFamily: '"IBM Plex Sans", sans-serif',
                              color,
                              fontWeight: 600,
                            }}
                          >
                            {alert.type === "critical"
                              ? "Crítico"
                              : alert.type === "warning"
                              ? "Advertencia"
                              : "Info"}
                          </span>
                          <span
                            style={{
                              fontSize: "10px",
                              fontFamily: '"Roboto Mono", monospace',
                              color: "var(--text-muted)",
                            }}
                          >
                            {alert.timestamp}
                          </span>
                        </div>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "12px",
                            fontFamily: '"IBM Plex Sans", sans-serif',
                            color: "var(--text-secondary)",
                            lineHeight: "1.5",
                          }}
                        >
                          {alert.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── Action Bar ─────────────────────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            padding: "20px 0 4px 0",
            borderTop: "1px solid var(--border-subtle)",
          }}
        >
          <button
            style={{
              height: "42px",
              padding: "0 24px",
              background: "var(--accent-primary)",
              color: "var(--bg-base)",
              border: "none",
              borderRadius: "0",
              fontSize: "13px",
              fontFamily: '"Space Mono", monospace',
              fontWeight: 700,
              cursor: "pointer",
              letterSpacing: "0.03em",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.opacity = "0.85")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.opacity = "1")
            }
          >
            <Calendar size={15} strokeWidth={1.75} />
            Programar Retiro
          </button>

          <button
            style={{
              height: "42px",
              padding: "0 24px",
              background: "transparent",
              color: "var(--accent-primary)",
              border: "1px solid var(--accent-primary)",
              borderRadius: "0",
              fontSize: "13px",
              fontFamily: '"Space Mono", monospace',
              fontWeight: 700,
              cursor: "pointer",
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
            Registrar Servicio
          </button>

          <button
            style={{
              height: "42px",
              padding: "0 20px",
              background: "transparent",
              color: "var(--text-secondary)",
              border: "none",
              borderRadius: "0",
              fontSize: "13px",
              fontFamily: '"IBM Plex Sans", sans-serif',
              cursor: "pointer",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.color = "var(--text-primary)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.color = "var(--text-secondary)")
            }
          >
            Ver Historial
          </button>
        </div>
      </main>
    </div>
  );
}
