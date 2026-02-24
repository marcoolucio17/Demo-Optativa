"use client";

import Topbar from "../components/Topbar";
import MetricCard from "../components/MetricCard";
import StatusPill from "../components/StatusPill";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  esgMetrics,
  fleetStatusDistribution,
  fleetBreakdown,
  recoveryEvents,
  regionalCompliance,
  equipment,
} from "../lib/data";

const gasBarColors: Record<string, string> = {
  "R-134a": "var(--accent-primary)",
  "R-404A": "var(--accent-warning)",
  "R-290": "var(--accent-secondary)",
  "R-600a": "var(--accent-danger)",
};

export default function DashboardPage() {
  const recentEvents = recoveryEvents.slice(0, 5);

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
      <Topbar breadcrumb={["HFC TraceSystem", "Dashboard"]} />

      <main
        style={{
          flex: 1,
          padding: "28px 28px",
          background: "var(--bg-base)",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        {/* ── KPI Row ──────────────────────────────────────────────────────── */}
        <div style={{ display: "flex", gap: "16px" }}>
          <MetricCard
            label="Total equipos activos"
            value="847,392"
            trend="up"
            trendValue="+2.3% vs año anterior"
          />
          <MetricCard
            label="Gas HFC en campo"
            value="254,217"
            unit="kg"
            trend="down"
            trendValue="-8.1% recuperado"
            accentColor="var(--accent-secondary)"
          />
          <MetricCard
            label="Equipos críticos >10 años"
            value="12,847"
            trend="up"
            trendValue="+341 este mes"
            accentColor="var(--accent-danger)"
          />
          <MetricCard
            label="CO₂e evitado 2024"
            value="38,492"
            unit="ton"
            trend="up"
            trendValue="+12.4% vs 2023"
          />
        </div>

        {/* ── Main Content Row ──────────────────────────────────────────────── */}
        <div style={{ display: "flex", gap: "20px", flex: 1 }}>
          {/* Left 70% */}
          <div
            style={{
              flex: "0 0 68%",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            {/* Mexico Map Placeholder */}
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
                  marginBottom: "16px",
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
                  Mapa de flota — México
                </h3>
                <div style={{ display: "flex", gap: "16px" }}>
                  {[
                    { color: "var(--accent-primary)", label: "Activo" },
                    { color: "var(--accent-warning)", label: "Advertencia" },
                    { color: "var(--accent-danger)", label: "Crítico" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <div
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background: item.color,
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          fontSize: "11px",
                          fontFamily: '"IBM Plex Sans", sans-serif',
                          color: "var(--text-secondary)",
                        }}
                      >
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Map placeholder with equipment pins */}
              <div
                style={{
                  background: "var(--surface-elevated)",
                  border: "1px solid var(--border-active)",
                  borderRadius: "4px",
                  height: "280px",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Mexico SVG simplified outline */}
                <svg
                  viewBox="0 0 600 400"
                  style={{
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    inset: 0,
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Simplified Mexico shape */}
                  <path
                    d="M 50 80 L 180 60 L 320 50 L 420 70 L 480 100 L 540 130 L 560 160 L 540 200 L 500 230 L 460 260 L 420 280 L 380 320 L 340 340 L 300 350 L 260 340 L 240 360 L 200 340 L 180 320 L 160 300 L 140 280 L 100 260 L 70 230 L 50 200 L 40 160 L 50 80 Z"
                    fill="var(--border-subtle)"
                    stroke="var(--border-active)"
                    strokeWidth="1.5"
                  />
                  {/* Equipment dots mapped roughly to coordinates */}
                  {equipment.map((eq) => {
                    const dotColor =
                      eq.status === "active"
                        ? "#00e5a0"
                        : eq.status === "warning"
                        ? "#ff6b35"
                        : "#ff3b5c";
                    // Map lng/lat to SVG coords (rough Mexico bbox)
                    const x = ((eq.coordinates.lng + 118) / 22) * 520 + 30;
                    const y = ((32.8 - eq.coordinates.lat) / 18) * 300 + 40;
                    return (
                      <g key={eq.id}>
                        <circle
                          cx={x}
                          cy={y}
                          r="6"
                          fill={dotColor}
                          opacity="0.8"
                        />
                        <circle
                          cx={x}
                          cy={y}
                          r="10"
                          fill={dotColor}
                          opacity="0.15"
                        />
                      </g>
                    );
                  })}
                </svg>
                <div
                  style={{
                    position: "absolute",
                    bottom: "12px",
                    left: "12px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "11px",
                      fontFamily: '"IBM Plex Sans", sans-serif',
                      color: "var(--text-muted)",
                    }}
                  >
                    Mostrando {equipment.length} equipos de muestra
                  </span>
                </div>
              </div>
            </div>

            {/* Gas Type Breakdown */}
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
                Distribución por tipo de gas
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {fleetBreakdown.map((item) => (
                  <div key={item.gasType} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span
                        style={{
                          fontSize: "12px",
                          fontFamily: '"IBM Plex Sans", sans-serif',
                          color: "var(--text-secondary)",
                        }}
                      >
                        {item.gasType}
                      </span>
                      <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                        <span
                          className="mono-data"
                          style={{
                            fontSize: "11px",
                            color: "var(--text-muted)",
                          }}
                        >
                          {item.equipmentCount.toLocaleString()} equipos
                        </span>
                        <span
                          className="mono-data"
                          style={{
                            fontSize: "12px",
                            color: gasBarColors[item.gasType],
                            fontWeight: 600,
                            minWidth: "34px",
                            textAlign: "right",
                          }}
                        >
                          {item.percentage}%
                        </span>
                      </div>
                    </div>
                    <div
                      style={{
                        height: "6px",
                        background: "var(--surface-elevated)",
                        borderRadius: "2px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${item.percentage}%`,
                          background: gasBarColors[item.gasType],
                          borderRadius: "2px",
                          transition: "width 0.6s ease",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right 30% */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            {/* Fleet Status Donut */}
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
                  margin: "0 0 4px 0",
                  fontSize: "14px",
                  fontFamily: '"Space Mono", monospace',
                  color: "var(--text-primary)",
                }}
              >
                Estado de flota
              </h3>
              <p
                style={{
                  margin: "0 0 16px 0",
                  fontSize: "11px",
                  fontFamily: '"IBM Plex Sans", sans-serif',
                  color: "var(--text-muted)",
                }}
              >
                {esgMetrics.totalEquipment.toLocaleString()} equipos totales
              </p>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={fleetStatusDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {fleetStatusDistribution.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "var(--surface-elevated)",
                      border: "1px solid var(--border-active)",
                      borderRadius: "4px",
                      fontSize: "12px",
                      fontFamily: '"IBM Plex Sans", sans-serif',
                      color: "var(--text-primary)",
                    }}
                    formatter={(value) => [`${value}%`, ""]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                {fleetStatusDistribution.map((item) => (
                  <div
                    key={item.name}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: "8px" }}
                    >
                      <div
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background: item.color,
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          fontSize: "12px",
                          fontFamily: '"IBM Plex Sans", sans-serif',
                          color: "var(--text-secondary)",
                        }}
                      >
                        {item.name}
                      </span>
                    </div>
                    <span
                      className="mono-data"
                      style={{ fontSize: "13px", color: item.color, fontWeight: 600 }}
                    >
                      {item.value}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div
              style={{
                background: "var(--surface-card)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "6px",
                padding: "24px",
                flex: 1,
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
                Actividad reciente
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {recentEvents.map((event) => (
                  <div
                    key={event.id}
                    style={{
                      borderLeft: "2px solid var(--border-active)",
                      paddingLeft: "12px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "3px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span
                        className="mono-data"
                        style={{
                          fontSize: "11px",
                          color: "var(--accent-primary)",
                          fontWeight: 600,
                        }}
                      >
                        {event.equipmentId}
                      </span>
                      <span
                        style={{
                          fontSize: "10px",
                          fontFamily: '"IBM Plex Sans", sans-serif',
                          color: "var(--text-muted)",
                        }}
                      >
                        {event.date}
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: "11px",
                        fontFamily: '"IBM Plex Sans", sans-serif',
                        color: "var(--text-secondary)",
                      }}
                    >
                      {event.technicianName}
                    </span>
                    <span
                      className="mono-data"
                      style={{ fontSize: "11px", color: "var(--text-muted)" }}
                    >
                      {event.gasRecoveredKg} kg recuperados
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Regional Table ──────────────────────────────────────────────────── */}
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
                fontSize: "14px",
                fontFamily: '"Space Mono", monospace',
                color: "var(--text-primary)",
              }}
            >
              Regiones por volumen de equipos
            </h3>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr
                style={{ background: "var(--surface-elevated)" }}
              >
                {["Región", "Equipos", "Gas en Campo", "Críticos", "Estado"].map(
                  (col) => (
                    <th
                      key={col}
                      style={{
                        padding: "10px 24px",
                        textAlign: "left",
                        fontSize: "11px",
                        fontFamily: '"Space Mono", monospace',
                        color: "var(--text-muted)",
                        textTransform: "uppercase",
                        letterSpacing: "0.07em",
                        fontWeight: 400,
                        borderBottom: "1px solid var(--border-subtle)",
                      }}
                    >
                      {col}
                    </th>
                  )
                )}
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
                      padding: "12px 24px",
                      fontSize: "13px",
                      fontFamily: '"IBM Plex Sans", sans-serif',
                      color: "var(--text-primary)",
                      borderBottom: "1px solid var(--border-subtle)",
                    }}
                  >
                    {row.region}
                  </td>
                  <td
                    style={{
                      padding: "12px 24px",
                      borderBottom: "1px solid var(--border-subtle)",
                    }}
                  >
                    <span
                      className="mono-data"
                      style={{ fontSize: "13px", color: "var(--text-primary)" }}
                    >
                      {row.equipmentCount.toLocaleString()}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "12px 24px",
                      borderBottom: "1px solid var(--border-subtle)",
                    }}
                  >
                    <span
                      className="mono-data"
                      style={{ fontSize: "13px", color: "var(--text-secondary)" }}
                    >
                      {row.gasInField.toLocaleString()} kg
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "12px 24px",
                      borderBottom: "1px solid var(--border-subtle)",
                    }}
                  >
                    <span
                      className="mono-data"
                      style={{
                        fontSize: "13px",
                        color:
                          row.equipmentRetired < 300
                            ? "var(--accent-danger)"
                            : "var(--text-secondary)",
                      }}
                    >
                      {row.equipmentRetired.toLocaleString()}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "12px 24px",
                      borderBottom: "1px solid var(--border-subtle)",
                    }}
                  >
                    <StatusPill status={row.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
