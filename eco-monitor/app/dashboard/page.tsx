"use client";

import { useState, useEffect } from "react";
import Topbar from "../components/Topbar";
import StatusPill from "../components/StatusPill";
import AnimatedCounter from "../components/AnimatedCounter";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import {
  getRandomActivityEvent,
  activityTypeColor,
  ActivityEvent,
} from "../lib/activitySimulator";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  esgMetrics,
  fleetStatusDistribution,
  fleetBreakdown,
  regionalCompliance,
  equipment,
} from "../lib/data";

const gasBarColors: Record<string, string> = {
  "R-134a": "var(--accent-primary)",
  "R-404A": "var(--accent-warning)",
  "R-290": "var(--accent-secondary)",
  "R-600a": "var(--accent-danger)",
};

const GOAL_TOTAL = 20000;
const PROGRESS_BASE = 13420;

export default function DashboardPage() {
  // ── Feature 1: Animated KPI counters with auto-increment ───────────────────
  const [equiposCount, setEquiposCount] = useState(esgMetrics.totalEquipment);
  const [gasHFCKg, setGasHFCKg] = useState(esgMetrics.totalHFCInField);
  const [co2eAvoided, setCo2eAvoided] = useState(esgMetrics.co2eAvoided);
  const [processedCount, setProcessedCount] = useState(PROGRESS_BASE);

  useEffect(() => {
    const interval = setInterval(() => {
      setEquiposCount((v) => v + 1);
      setGasHFCKg((v) => parseFloat((v + 0.3).toFixed(1)));
      setCo2eAvoided((v) => parseFloat((v + 0.43).toFixed(2)));
      setProcessedCount((v) => v + 1);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // ── Feature 5: Real-time CO₂e live counter ─────────────────────────────────
  const [liveCO2e, setLiveCO2e] = useState(8.42);
  const [co2PulseKey, setCo2PulseKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCO2e((v) => parseFloat((v + 0.0014).toFixed(4)));
      setCo2PulseKey((k) => k + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // ── Feature 2: Live activity feed ─────────────────────────────────────────
  const [feed, setFeed] = useState<ActivityEvent[]>(() => [
    getRandomActivityEvent(),
    getRandomActivityEvent(),
    getRandomActivityEvent(),
  ]);
  const [, setTick] = useState(0); // force re-render for "hace X segundos"

  useEffect(() => {
    const feedInterval = setInterval(() => {
      setFeed((prev) => {
        const newEvent = getRandomActivityEvent();
        return [newEvent, ...prev].slice(0, 8);
      });
    }, 6000);
    const clockInterval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => {
      clearInterval(feedInterval);
      clearInterval(clockInterval);
    };
  }, []);

  // ── Feature 8: Progress bar mount animation ────────────────────────────────
  const [barMounted, setBarMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setBarMounted(true), 500);
    return () => clearTimeout(t);
  }, []);

  const progressPercent = Math.round((processedCount / GOAL_TOTAL) * 100);
  const carEquivalent = Math.round(liveCO2e / 4.6);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minHeight: 0,
      }}
    >
      <Topbar breadcrumb={["HFC TraceSystem", "Dashboard"]} />

      <main
        style={{
          flex: 1,
          padding: "28px",
          background: "var(--bg-base)",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        {/* ── Feature 1: KPI Row with AnimatedCounters ─────────────────────── */}
        <div className="kpi-grid">
          {/* KPI 1 */}
          <div
            style={{
              background: "var(--surface-card)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "6px",
              borderTop: "2px solid var(--accent-primary)",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <p
              style={{
                fontSize: "11px",
                fontFamily: '"IBM Plex Sans", sans-serif',
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                fontWeight: 500,
                margin: 0,
              }}
            >
              Total equipos activos
            </p>
            <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
              <AnimatedCounter
                target={equiposCount}
                duration={2000}
                className="mono-data kpi-value-size"
                style={{
                  fontSize: "32px",
                  fontWeight: 700,
                  color: "var(--accent-primary)",
                  lineHeight: 1,
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                marginTop: "4px",
              }}
            >
              <span
                style={{
                  fontSize: "11px",
                  fontFamily: '"IBM Plex Sans", sans-serif',
                  color: "var(--accent-primary)",
                }}
              >
                ↑ +2.3% vs año anterior
              </span>
            </div>
          </div>

          {/* KPI 2 */}
          <div
            style={{
              background: "var(--surface-card)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "6px",
              borderTop: "2px solid var(--accent-secondary)",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <p
              style={{
                fontSize: "11px",
                fontFamily: '"IBM Plex Sans", sans-serif',
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                fontWeight: 500,
                margin: 0,
              }}
            >
              Gas HFC en campo
            </p>
            <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
              <AnimatedCounter
                target={gasHFCKg}
                duration={2000}
                className="mono-data kpi-value-size"
                style={{
                  fontSize: "32px",
                  fontWeight: 700,
                  color: "var(--accent-secondary)",
                  lineHeight: 1,
                }}
              />
              <span
                style={{
                  fontSize: "13px",
                  fontFamily: '"IBM Plex Sans", sans-serif',
                  color: "var(--text-secondary)",
                }}
              >
                kg
              </span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                marginTop: "4px",
              }}
            >
              <span
                style={{
                  fontSize: "11px",
                  fontFamily: '"IBM Plex Sans", sans-serif',
                  color: "var(--accent-danger)",
                }}
              >
                ↓ -8.1% recuperado
              </span>
            </div>
          </div>

          {/* KPI 3 */}
          <div
            style={{
              background: "var(--surface-card)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "6px",
              borderTop: "2px solid var(--accent-danger)",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <p
              style={{
                fontSize: "11px",
                fontFamily: '"IBM Plex Sans", sans-serif',
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                fontWeight: 500,
                margin: 0,
              }}
            >
              Equipos críticos &gt;10 años
            </p>
            <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
              <AnimatedCounter
                target={12847}
                duration={2000}
                className="mono-data kpi-value-size"
                style={{
                  fontSize: "32px",
                  fontWeight: 700,
                  color: "var(--accent-danger)",
                  lineHeight: 1,
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                marginTop: "4px",
              }}
            >
              <span
                style={{
                  fontSize: "11px",
                  fontFamily: '"IBM Plex Sans", sans-serif',
                  color: "var(--accent-primary)",
                }}
              >
                ↑ +341 este mes
              </span>
            </div>
          </div>

          {/* KPI 4 */}
          <div
            style={{
              background: "var(--surface-card)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "6px",
              borderTop: "2px solid var(--accent-primary)",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <p
              style={{
                fontSize: "11px",
                fontFamily: '"IBM Plex Sans", sans-serif',
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                fontWeight: 500,
                margin: 0,
              }}
            >
              CO₂e evitado 2026
            </p>
            <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
              <AnimatedCounter
                target={co2eAvoided}
                duration={2000}
                className="mono-data kpi-value-size"
                style={{
                  fontSize: "32px",
                  fontWeight: 700,
                  color: "var(--accent-primary)",
                  lineHeight: 1,
                }}
              />
              <span
                style={{
                  fontSize: "13px",
                  fontFamily: '"IBM Plex Sans", sans-serif',
                  color: "var(--text-secondary)",
                }}
              >
                ton
              </span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                marginTop: "4px",
              }}
            >
              <span
                style={{
                  fontSize: "11px",
                  fontFamily: '"IBM Plex Sans", sans-serif',
                  color: "var(--accent-primary)",
                }}
              >
                ↑ +12.4% vs 2023
              </span>
            </div>
          </div>
        </div>

        {/* ── Feature 5: CO₂e Live Metric Banner ───────────────────────────── */}
        <div
          style={{
            background:
              "linear-gradient(to right, var(--surface-card), transparent)",
            border: "1px solid var(--border-subtle)",
            borderLeft: "3px solid var(--accent-primary)",
            borderRadius: "6px",
            padding: "16px 28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "24px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <p
              style={{
                margin: 0,
                fontFamily: '"Space Mono", monospace',
                fontSize: "12px",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              Impacto en tiempo real
            </p>
          </div>

          <motion.span
            key={co2PulseKey}
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{
              fontFamily: '"Roboto Mono", monospace',
              fontSize: "36px",
              fontWeight: 700,
              color: "var(--accent-primary)",
              lineHeight: 1,
              display: "inline-block",
            }}
          >
            {liveCO2e.toFixed(2)}
          </motion.span>

          <div style={{ textAlign: "right" }}>
            <p
              style={{
                margin: "0 0 4px 0",
                fontSize: "13px",
                fontFamily: '"IBM Plex Sans", sans-serif',
                color: "var(--text-secondary)",
              }}
            >
              ton CO₂e evitadas hoy
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "11px",
                fontFamily: '"IBM Plex Sans", sans-serif',
                color: "var(--text-muted)",
              }}
            >
              equivalente a {carEquivalent} autos fuera de circulación
            </p>
          </div>
        </div>

        {/* ── Main Content Row ──────────────────────────────────────────────── */}
        <div className="dashboard-cols" style={{ flex: 1 }}>
          {/* Left 70% */}
          <div className="dashboard-left">
            {/* Mexico Map — Feature 7: Pulsing dots */}
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
              </div>

              <div
                className="map-height"
                style={{
                  background: "var(--surface-elevated)",
                  border: "1px solid var(--border-active)",
                  borderRadius: "4px",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
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
                  <path
                    d="M 50 80 L 180 60 L 320 50 L 420 70 L 480 100 L 540 130 L 560 160 L 540 200 L 500 230 L 460 260 L 420 280 L 380 320 L 340 340 L 300 350 L 260 340 L 240 360 L 200 340 L 180 320 L 160 300 L 140 280 L 100 260 L 70 230 L 50 200 L 40 160 L 50 80 Z"
                    fill="var(--border-subtle)"
                    stroke="var(--border-active)"
                    strokeWidth="1.5"
                  />

                  {equipment.map((eq) => {
                    const dotColor =
                      eq.status === "active"
                        ? "#00e5a0"
                        : eq.status === "warning"
                        ? "#ff6b35"
                        : "#ff3b5c";
                    const x =
                      ((eq.coordinates.lng + 118) / 22) * 520 + 30;
                    const y =
                      ((32.8 - eq.coordinates.lat) / 18) * 300 + 40;
                    return (
                      <g key={eq.id}>
                        {/* Animated pulse ring */}
                        {eq.status === "critical" && (
                          <circle
                            cx={x}
                            cy={y}
                            r="7"
                            fill="#ff3b5c"
                            className="dot-critical-pulse"
                          />
                        )}
                        {eq.status === "warning" && (
                          <circle
                            cx={x}
                            cy={y}
                            r="7"
                            fill="#ff6b35"
                            className="dot-warning-pulse"
                          />
                        )}
                        {/* Solid inner dot */}
                        <circle
                          cx={x}
                          cy={y}
                          r="5"
                          fill={dotColor}
                          opacity="0.9"
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

              {/* Feature 7: Legend */}
              <div
                style={{
                  display: "flex",
                  gap: "20px",
                  marginTop: "12px",
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                {[
                  {
                    color: "#ff3b5c",
                    label: "Crítico (pulso rápido)",
                  },
                  { color: "#ff6b35", label: "Atención" },
                  { color: "#00e5a0", label: "Activo" },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "7px",
                    }}
                  >
                    <div
                      style={{
                        width: "9px",
                        height: "9px",
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

            {/* Gas Type Breakdown + Feature 8: Progress Bar */}
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

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {fleetBreakdown.map((item) => (
                  <div
                    key={item.gasType}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
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
                        style={{
                          fontSize: "12px",
                          fontFamily: '"IBM Plex Sans", sans-serif',
                          color: "var(--text-secondary)",
                        }}
                      >
                        {item.gasType}
                      </span>
                      <div
                        style={{
                          display: "flex",
                          gap: "16px",
                          alignItems: "center",
                        }}
                      >
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

              {/* Feature 8: Annual Recovery Goal */}
              <div
                style={{
                  marginTop: "24px",
                  paddingTop: "20px",
                  borderTop: "1px solid var(--border-subtle)",
                }}
              >
                <p
                  style={{
                    margin: "0 0 10px 0",
                    fontSize: "13px",
                    fontFamily: '"Space Mono", monospace',
                    color: "var(--text-muted)",
                  }}
                >
                  Meta anual de recuperación 2026
                </p>

                <div
                  style={{
                    width: "100%",
                    height: "8px",
                    background: "var(--surface-elevated)",
                    borderRadius: "4px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: barMounted ? `${progressPercent}%` : "0%",
                      background:
                        "linear-gradient(to right, var(--accent-secondary), var(--accent-primary))",
                      borderRadius: "4px",
                      transition: barMounted
                        ? "width 1.5s ease-out"
                        : "none",
                    }}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "7px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "12px",
                      fontFamily: '"IBM Plex Sans", sans-serif',
                      color: "var(--text-secondary)",
                    }}
                  >
                    <AnimatedCounter
                      target={processedCount}
                      duration={2000}
                      style={{
                        fontFamily: '"Roboto Mono", monospace',
                        fontWeight: 600,
                        color: "var(--text-primary)",
                        fontSize: "12px",
                      }}
                    />{" "}
                    / 20,000 equipos — {progressPercent}% completado
                  </span>
                  <span
                    style={{
                      fontSize: "12px",
                      fontFamily: '"IBM Plex Sans", sans-serif',
                      color: "var(--text-muted)",
                    }}
                  >
                    Meta: Dic 2026
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right 30% */}
          <div className="dashboard-right">
            {/* Fleet Status Donut — Feature 9: chart animation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
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
                    isAnimationActive={true}
                    animationDuration={1000}
                    animationBegin={300}
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
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
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
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
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
                      style={{
                        fontSize: "13px",
                        color: item.color,
                        fontWeight: 600,
                      }}
                    >
                      {item.value}%
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Feature 2: Live Activity Feed */}
            <div
              style={{
                background: "var(--surface-card)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "6px",
                padding: "24px",
                flex: 1,
                overflow: "hidden",
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
                  Actividad reciente
                </h3>
                <span
                  style={{
                    fontSize: "10px",
                    fontFamily: '"IBM Plex Sans", sans-serif',
                    color: "var(--accent-primary)",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <span
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: "var(--accent-primary)",
                      display: "inline-block",
                      animation: "live-blink 1.5s infinite",
                    }}
                  />
                  En vivo
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <AnimatePresence initial={false}>
                  {feed.map((event) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.4 }}
                      style={{
                        display: "flex",
                        gap: "10px",
                        alignItems: "flex-start",
                      }}
                    >
                      <div
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background: activityTypeColor[event.type],
                          flexShrink: 0,
                          marginTop: "4px",
                        }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p
                          style={{
                            margin: "0 0 2px 0",
                            fontSize: "11px",
                            fontFamily: '"IBM Plex Sans", sans-serif',
                            color: "var(--text-secondary)",
                            lineHeight: "1.4",
                            wordBreak: "break-word",
                          }}
                        >
                          {event.text}
                        </p>
                        <span
                          style={{
                            fontSize: "10px",
                            fontFamily: '"Roboto Mono", monospace',
                            color: "var(--text-muted)",
                          }}
                        >
                          {formatDistanceToNow(event.timestamp, {
                            includeSeconds: true,
                            locale: es,
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
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
              <tr style={{ background: "var(--surface-elevated)" }}>
                {[
                  "Región",
                  "Equipos",
                  "Gas en Campo",
                  "Críticos",
                  "Estado",
                ].map((col) => (
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
                ))}
              </tr>
            </thead>
            <tbody>
              {regionalCompliance.map((row, i) => (
                <tr
                  key={row.region}
                  style={{
                    background:
                      i % 2 === 0
                        ? "var(--surface-card)"
                        : "var(--bg-secondary)",
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
                      style={{
                        fontSize: "13px",
                        color: "var(--text-primary)",
                      }}
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
                      style={{
                        fontSize: "13px",
                        color: "var(--text-secondary)",
                      }}
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
