"use client";

import { useState, useEffect, useRef } from "react";
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
  ReferenceLine,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Share2, Award, RefreshCw } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

/* ── static style helpers ─────────────────────────────────────────────────── */
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

const TICKER_ITEMS = [
  { text: "🌱 40,683 ton CO₂e evitadas este año" },
  { text: "⚡ Equivalente a retirar 8,844 autos de circulación" },
  { text: "🧊 28,450 kg de HFC recuperados y certificados" },
  { text: "📋 Cumplimiento NOM-161 activo en 6 regiones" },
  { text: "💰 $2,034,150 USD en créditos de carbono generados" },
  { text: "🔄 3 centros de acopio operando en ZMM" },
  { text: "📊 Meta anual 2026: 67% completada" },
];

const CREDIT_DAILY_GOAL = 150;

/* ── types ────────────────────────────────────────────────────────────────── */
interface ComplianceRow {
  region: string;
  equipmentCount: number;
  gasInField: number;
  equipmentRetired: number;
  gasRecovered: number;
  creditsGenerated: number;
  status: "active" | "warning" | "critical" | "pending";
  nomCompliance: string;
}

export default function ESGPage() {
  /* ── Feature 1: Live hero metrics ─────────────────────────────────────── */
  const [hfcKg, setHfcKg] = useState(28450);
  const [co2eTon, setCo2eTon] = useState(40683);
  const [creditosCarbono, setCreditosCarbono] = useState(40683);
  const [valorUSD, setValorUSD] = useState(2034150);
  const [hfcFlashKey, setHfcFlashKey] = useState(0);
  const [co2eFlashKey, setCo2eFlashKey] = useState(0);
  const [creditosFlashKey, setCreditosFlashKey] = useState(0);
  const [usdFlashKey, setUsdFlashKey] = useState(0);

  /* ── Feature 2: Live monthly chart ────────────────────────────────────── */
  const [liveMonthKg, setLiveMonthKg] = useState(1240);
  const [annotationKey, setAnnotationKey] = useState(0);
  const [showAnnotation, setShowAnnotation] = useState(false);

  /* ── Feature 3: Live compliance table ─────────────────────────────────── */
  const [rows, setRows] = useState<ComplianceRow[]>(() =>
    regionalCompliance.map((r) => ({ ...r } as ComplianceRow))
  );
  const [flashRowIndex, setFlashRowIndex] = useState<number | null>(null);
  const [arrowInfo, setArrowInfo] = useState<{
    rowIndex: number;
    key: number;
  } | null>(null);

  /* ── Feature 5: Last updated timestamp ────────────────────────────────── */
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [now, setNow] = useState<Date>(new Date());

  /* ── Feature 6: Carbon credit widget ──────────────────────────────────── */
  const [creditsHoy, setCreditsHoy] = useState<number>(() =>
    Math.round(80 + Math.random() * 40)
  );
  const [creditBarMounted, setCreditBarMounted] = useState(false);

  /* ── Refs for clearTimeout calls ──────────────────────────────────────── */
  const flashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const annotationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // ── 10-second interval: metrics + credit widget ─────────────────────
    const metricInterval = setInterval(() => {
      setHfcKg((v) => parseFloat((v + 0.3).toFixed(1)));
      setHfcFlashKey((k) => k + 1);

      setCo2eTon((v) => parseFloat((v + 0.43).toFixed(2)));
      setCo2eFlashKey((k) => k + 1);

      setCreditosCarbono((v) => parseFloat((v + 0.43).toFixed(2)));
      setCreditosFlashKey((k) => k + 1);

      setValorUSD((v) => parseFloat((v + 6.45).toFixed(2)));
      setUsdFlashKey((k) => k + 1);

      setCreditsHoy((v) => parseFloat((v + 0.43).toFixed(2)));

      setLastUpdated(new Date());
    }, 10000);

    // ── 20-second interval: monthly chart bar ───────────────────────────
    const chartInterval = setInterval(() => {
      setLiveMonthKg((v) => v + 8);
      setAnnotationKey((k) => k + 1);
      setShowAnnotation(true);
      if (annotationTimerRef.current) clearTimeout(annotationTimerRef.current);
      annotationTimerRef.current = setTimeout(
        () => setShowAnnotation(false),
        3000
      );
    }, 20000);

    // ── 12-second interval: compliance table ────────────────────────────
    const tableInterval = setInterval(() => {
      const idx = Math.floor(Math.random() * rows.length);
      setRows((prev) =>
        prev.map((r, i) =>
          i === idx
            ? {
                ...r,
                equipmentRetired: r.equipmentRetired + 1,
                gasRecovered: parseFloat((r.gasRecovered + 0.3).toFixed(1)),
                creditsGenerated: parseFloat(
                  (r.creditsGenerated + 0.43).toFixed(2)
                ),
              }
            : r
        )
      );
      setFlashRowIndex(idx);
      setArrowInfo({ rowIndex: idx, key: Date.now() });
      if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
      flashTimerRef.current = setTimeout(() => setFlashRowIndex(null), 1200);
    }, 12000);

    // ── 1-second interval: current time for relative timestamp ──────────
    const clockInterval = setInterval(() => setNow(new Date()), 1000);

    // ── Progress bar mount animation ────────────────────────────────────
    const barTimer = setTimeout(() => setCreditBarMounted(true), 400);

    return () => {
      clearInterval(metricInterval);
      clearInterval(chartInterval);
      clearInterval(tableInterval);
      clearInterval(clockInterval);
      clearTimeout(barTimer);
      if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
      if (annotationTimerRef.current) clearTimeout(annotationTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── derived values ───────────────────────────────────────────────────── */
  const chartData = [
    ...esgMetrics.monthlyRecovery,
    { month: "Est mes", kg: liveMonthKg, live: true },
  ];

  const creditProgressPct = Math.min(
    (creditsHoy / CREDIT_DAILY_GOAL) * 100,
    100
  );

  const relativeTime = formatDistanceToNow(lastUpdated, {
    includeSeconds: true,
    locale: es,
    addSuffix: true,
  });

  /* ── ticker items duplicated for seamless loop ────────────────────────── */
  const tickerDouble = [...TICKER_ITEMS, ...TICKER_ITEMS];

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
        {/* ── Top Banner ──────────────────────────────────────────────────── */}
        <div
          style={{
            background: "var(--surface-card)",
            borderBottom: "1px solid var(--border-subtle)",
            padding: "14px 32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h2
              style={{
                margin: "0 0 4px 0",
                fontSize: "20px",
                fontFamily: '"Space Mono", monospace',
                color: "var(--text-primary)",
                fontWeight: 700,
              }}
            >
              Reporte de Impacto Ambiental 2026
            </h2>
            {/* Feature 5: Last updated */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <RefreshCw
                size={12}
                strokeWidth={1.75}
                style={{
                  color: "var(--text-muted)",
                  animation: "spin-slow 3s linear infinite",
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: "12px",
                  fontFamily: '"IBM Plex Sans", sans-serif',
                  color: "var(--text-muted)",
                }}
              >
                Última actualización: {relativeTime}
              </span>
            </div>
          </div>
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

        {/* ── Main flex row: content (flex:1) + sticky widget (200px) ─────── */}
        <div
          style={{
            display: "flex",
            gap: "20px",
            padding: "24px 28px",
            alignItems: "flex-start",
          }}
        >
          {/* ── Left: All content ─────────────────────────────────────────── */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              minWidth: 0,
            }}
          >
            {/* ── Feature 1: Hero Metrics ─────────────────────────────────── */}
            <div
              style={{
                background: "var(--surface-card)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "6px",
                overflow: "hidden",
              }}
            >
              {/* EN VIVO badge header */}
              <div
                style={{
                  padding: "10px 20px",
                  borderBottom: "1px solid var(--border-subtle)",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span
                  style={{
                    fontSize: "11px",
                    fontFamily: '"Space Mono", monospace',
                    color: "var(--text-muted)",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  Métricas de impacto
                </span>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    marginLeft: "8px",
                  }}
                >
                  <span
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: "var(--accent-danger)",
                      display: "inline-block",
                      animation: "live-pulse 1.2s infinite",
                    }}
                  />
                  <span
                    style={{
                      fontSize: "11px",
                      fontFamily: '"IBM Plex Sans", sans-serif',
                      color: "var(--accent-danger)",
                      fontWeight: 600,
                      letterSpacing: "0.06em",
                    }}
                  >
                    EN VIVO
                  </span>
                </div>
              </div>

              {/* 4 metrics */}
              <div className="esg-hero-grid">
                {/* HFC Recuperado */}
                <div
                  style={{
                    padding: "28px 20px",
                    textAlign: "center",
                    borderRight: "1px solid var(--border-subtle)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <motion.span
                    key={hfcFlashKey}
                    initial={{ color: "#00e5a0" }}
                    animate={{
                      color: ["#00e5a0", "#e8edf5", "#00e5a0"],
                    }}
                    transition={{ duration: 0.8, times: [0, 0.4, 1] }}
                    className="mono-data"
                    style={{
                      fontSize: "36px",
                      fontWeight: 700,
                      lineHeight: 1,
                      letterSpacing: "-0.02em",
                      display: "block",
                    }}
                  >
                    {hfcKg.toLocaleString("es-MX", {
                      minimumFractionDigits: 1,
                      maximumFractionDigits: 1,
                    })}
                  </motion.span>
                  <span
                    style={{
                      fontSize: "12px",
                      fontFamily: '"IBM Plex Sans", sans-serif',
                      color: "var(--text-secondary)",
                    }}
                  >
                    kg
                  </span>
                  <span
                    style={{
                      fontSize: "10px",
                      fontFamily: '"IBM Plex Sans", sans-serif',
                      color: "var(--text-muted)",
                      textTransform: "uppercase",
                      letterSpacing: "0.07em",
                    }}
                  >
                    HFC Recuperado
                  </span>
                </div>

                {/* CO₂e Evitado */}
                <div
                  style={{
                    padding: "28px 20px",
                    textAlign: "center",
                    borderRight: "1px solid var(--border-subtle)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <motion.span
                    key={co2eFlashKey}
                    initial={{ color: "#00e5a0" }}
                    animate={{
                      color: ["#00e5a0", "#e8edf5", "#00e5a0"],
                    }}
                    transition={{ duration: 0.8, times: [0, 0.4, 1] }}
                    className="mono-data"
                    style={{
                      fontSize: "36px",
                      fontWeight: 700,
                      lineHeight: 1,
                      letterSpacing: "-0.02em",
                      display: "block",
                    }}
                  >
                    {co2eTon.toLocaleString("es-MX", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </motion.span>
                  <span
                    style={{
                      fontSize: "12px",
                      fontFamily: '"IBM Plex Sans", sans-serif',
                      color: "var(--text-secondary)",
                    }}
                  >
                    ton
                  </span>
                  <span
                    style={{
                      fontSize: "10px",
                      fontFamily: '"IBM Plex Sans", sans-serif',
                      color: "var(--text-muted)",
                      textTransform: "uppercase",
                      letterSpacing: "0.07em",
                    }}
                  >
                    CO₂e Evitado
                  </span>
                </div>

                {/* Créditos de Carbono */}
                <div
                  style={{
                    padding: "28px 20px",
                    textAlign: "center",
                    borderRight: "1px solid var(--border-subtle)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <motion.span
                    key={creditosFlashKey}
                    initial={{ color: "#00e5a0" }}
                    animate={{
                      color: ["#00e5a0", "#e8edf5", "#00e5a0"],
                    }}
                    transition={{ duration: 0.8, times: [0, 0.4, 1] }}
                    className="mono-data"
                    style={{
                      fontSize: "36px",
                      fontWeight: 700,
                      lineHeight: 1,
                      letterSpacing: "-0.02em",
                      display: "block",
                    }}
                  >
                    {creditosCarbono.toLocaleString("es-MX", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </motion.span>
                  <span
                    style={{
                      fontSize: "12px",
                      fontFamily: '"IBM Plex Sans", sans-serif',
                      color: "var(--text-secondary)",
                    }}
                  >
                    créditos
                  </span>
                  <span
                    style={{
                      fontSize: "10px",
                      fontFamily: '"IBM Plex Sans", sans-serif',
                      color: "var(--text-muted)",
                      textTransform: "uppercase",
                      letterSpacing: "0.07em",
                    }}
                  >
                    Créditos de Carbono
                  </span>
                </div>

                {/* Valor Estimado */}
                <div
                  style={{
                    padding: "28px 20px",
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <motion.span
                    key={usdFlashKey}
                    initial={{ color: "#00e5a0" }}
                    animate={{
                      color: ["#00e5a0", "#e8edf5", "#00e5a0"],
                    }}
                    transition={{ duration: 0.8, times: [0, 0.4, 1] }}
                    className="mono-data"
                    style={{
                      fontSize: "36px",
                      fontWeight: 700,
                      lineHeight: 1,
                      letterSpacing: "-0.02em",
                      display: "block",
                    }}
                  >
                    $
                    {valorUSD.toLocaleString("es-MX", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </motion.span>
                  <span
                    style={{
                      fontSize: "12px",
                      fontFamily: '"IBM Plex Sans", sans-serif',
                      color: "var(--text-secondary)",
                    }}
                  >
                    USD
                  </span>
                  <span
                    style={{
                      fontSize: "10px",
                      fontFamily: '"IBM Plex Sans", sans-serif',
                      color: "var(--text-muted)",
                      textTransform: "uppercase",
                      letterSpacing: "0.07em",
                    }}
                  >
                    Valor Estimado
                  </span>
                </div>
              </div>
            </div>

            {/* ── Feature 4: Scrolling Ticker ─────────────────────────────── */}
            <div
              style={{
                background: "var(--surface-card)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "6px",
                height: "40px",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  whiteSpace: "nowrap",
                  animation: "ticker-scroll 30s linear infinite",
                  cursor: "default",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.animationPlayState =
                    "paused")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.animationPlayState =
                    "running")
                }
              >
                {tickerDouble.map((item, i) => (
                  <span
                    key={i}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      fontSize: "12px",
                      fontFamily: '"IBM Plex Sans", sans-serif',
                      color: "var(--text-secondary)",
                    }}
                  >
                    {item.text}
                    {i < tickerDouble.length - 1 && (
                      <span
                        style={{
                          color: "var(--accent-primary)",
                          margin: "0 20px",
                          fontSize: "11px",
                        }}
                      >
                        ◆
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </div>

            {/* ── Feature 2 + 9: Charts Row ───────────────────────────────── */}
            <div className="esg-charts-grid">
              {/* Monthly Recovery Bar Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                style={{
                  background: "var(--surface-card)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "6px",
                  padding: "24px",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "20px",
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
                    Recuperación mensual (kg)
                  </h3>

                  {/* Feature 2: "+8 kg ahora" annotation */}
                  <AnimatePresence>
                    {showAnnotation && (
                      <motion.span
                        key={annotationKey}
                        initial={{ opacity: 1, y: 0 }}
                        animate={{ opacity: 0, y: -8 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 2, delay: 0.5 }}
                        style={{
                          fontSize: "11px",
                          fontFamily: '"IBM Plex Sans", sans-serif',
                          color: "var(--accent-primary)",
                          fontWeight: 600,
                        }}
                      >
                        ▲ +8 kg ahora
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>

                <ResponsiveContainer width="100%" height={220}>
                  <BarChart
                    data={chartData}
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
                        fontSize: 9,
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
                    {/* Feature 2: reference line */}
                    <ReferenceLine
                      y={2000}
                      stroke="var(--border-active)"
                      strokeDasharray="4 4"
                      label={{
                        value: "Meta mensual",
                        position: "right",
                        fill: "var(--text-muted)",
                        fontSize: 10,
                        fontFamily: '"IBM Plex Sans", sans-serif',
                      }}
                    />
                    <Tooltip
                      contentStyle={tooltipStyle}
                      formatter={(value) => [`${value} kg`, "Recuperado"]}
                      cursor={{ fill: "rgba(0,229,160,0.06)" }}
                    />
                    <Bar
                      dataKey="kg"
                      radius={[2, 2, 0, 0]}
                      isAnimationActive={true}
                      animationDuration={800}
                      animationBegin={200}
                      fill="var(--accent-primary)"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Gas Type Pie Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
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
                      isAnimationActive={true}
                      animationDuration={1000}
                      animationBegin={300}
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
              </motion.div>
            </div>

            {/* ── Feature 3: Live Compliance Table ────────────────────────── */}
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
                  padding: "14px 24px",
                  borderBottom: "1px solid var(--border-subtle)",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
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
                  Cumplimiento por región
                </h3>
                <span
                  style={{
                    fontSize: "10px",
                    fontFamily: '"IBM Plex Sans", sans-serif',
                    color: "var(--accent-primary)",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <span
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: "var(--accent-primary)",
                      display: "inline-block",
                      animation: "live-pulse 1.2s infinite",
                    }}
                  />
                  Actualizando en tiempo real
                </span>
              </div>
              <div style={{ overflowX: "auto" }}>
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
                            padding: "11px 20px",
                            textAlign: "left",
                            fontSize: "10px",
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
                    {rows.map((row, i) => (
                      <tr
                        key={row.region}
                        style={{
                          background:
                            flashRowIndex === i
                              ? "rgba(0, 229, 160, 0.08)"
                              : i % 2 === 0
                              ? "var(--surface-card)"
                              : "var(--bg-secondary)",
                          transition: "background-color 1s ease",
                        }}
                      >
                        <td
                          style={{
                            padding: "12px 20px",
                            fontSize: "13px",
                            fontFamily: '"IBM Plex Sans", sans-serif',
                            color: "var(--text-primary)",
                            borderBottom: "1px solid var(--border-subtle)",
                            fontWeight: 500,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {row.region}
                        </td>
                        <td
                          style={{
                            padding: "12px 20px",
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
                            {row.equipmentRetired.toLocaleString("es-MX")}
                          </span>
                          {/* Feature 3: animated arrow */}
                          {arrowInfo?.rowIndex === i && (
                            <motion.span
                              key={arrowInfo.key}
                              initial={{ opacity: 1, y: 0 }}
                              animate={{ opacity: 0, y: -8 }}
                              transition={{ duration: 2, delay: 0.5 }}
                              style={{
                                color: "var(--accent-primary)",
                                fontSize: "12px",
                                marginLeft: "4px",
                                display: "inline-block",
                              }}
                            >
                              ↑
                            </motion.span>
                          )}
                        </td>
                        <td
                          style={{
                            padding: "12px 20px",
                            borderBottom: "1px solid var(--border-subtle)",
                          }}
                        >
                          <span
                            className="mono-data"
                            style={{
                              fontSize: "13px",
                              color: "var(--accent-primary)",
                            }}
                          >
                            {Number(row.gasRecovered).toLocaleString("es-MX", {
                              minimumFractionDigits: 1,
                              maximumFractionDigits: 1,
                            })}
                          </span>
                        </td>
                        <td
                          style={{
                            padding: "12px 20px",
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
                            {Number(row.creditsGenerated).toLocaleString(
                              "es-MX",
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }
                            )}
                          </span>
                        </td>
                        <td
                          style={{
                            padding: "12px 20px",
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
            </div>

            {/* ── Bottom Action Row ────────────────────────────────────────── */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "16px",
              }}
            >
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {certBadges.map((badge) => (
                  <div
                    key={badge.id}
                    style={{
                      height: "32px",
                      padding: "0 14px",
                      background: "var(--surface-elevated)",
                      border: "1px solid var(--border-active)",
                      display: "flex",
                      alignItems: "center",
                      gap: "7px",
                    }}
                  >
                    <Award
                      size={13}
                      strokeWidth={1.75}
                      style={{
                        color: "var(--accent-primary)",
                        flexShrink: 0,
                      }}
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

              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  style={{
                    height: "40px",
                    padding: "0 22px",
                    background: "transparent",
                    color: "var(--accent-primary)",
                    border: "1px solid var(--accent-primary)",
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
                    ((e.currentTarget as HTMLElement).style.background =
                      "rgba(0,229,160,0.08)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.background =
                      "transparent")
                  }
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

          {/* ── Feature 6: Sticky Carbon Credit Widget ───────────────────── */}
          <div style={{ width: "200px", flexShrink: 0 }}>
            <div
              style={{
                position: "sticky",
                top: "24px",
                background: "var(--surface-elevated)",
                border: "1px solid rgba(0, 229, 160, 0.4)",
                borderLeft: "3px solid var(--accent-primary)",
                borderRadius: "6px",
                padding: "14px",
              }}
            >
              {/* Title */}
              <p
                style={{
                  margin: "0 0 10px 0",
                  fontFamily: '"Space Mono", monospace',
                  fontSize: "10px",
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                  lineHeight: 1.4,
                }}
              >
                Créditos generados hoy
              </p>

              {/* Large counter */}
              <p
                className="mono-data"
                style={{
                  margin: "0 0 12px 0",
                  fontSize: "28px",
                  fontWeight: 700,
                  color: "var(--accent-primary)",
                  lineHeight: 1,
                }}
              >
                {creditsHoy.toLocaleString("es-MX", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>

              {/* Progress bar toward daily goal */}
              <div>
                <div
                  style={{
                    width: "100%",
                    height: "6px",
                    background: "var(--border-subtle)",
                    borderRadius: "3px",
                    overflow: "hidden",
                    marginBottom: "5px",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: creditBarMounted
                        ? `${creditProgressPct}%`
                        : "0%",
                      background:
                        "linear-gradient(to right, var(--accent-secondary), var(--accent-primary))",
                      borderRadius: "3px",
                      transition: creditBarMounted
                        ? "width 1.2s ease-out"
                        : "none",
                    }}
                  />
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: "10px",
                    fontFamily: '"IBM Plex Sans", sans-serif',
                    color: "var(--text-muted)",
                  }}
                >
                  {creditsHoy.toLocaleString("es-MX", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}{" "}
                  / {CREDIT_DAILY_GOAL} créditos hoy
                </p>
              </div>

              {/* Divider */}
              <div
                style={{
                  height: "1px",
                  background: "var(--border-subtle)",
                  margin: "12px 0",
                }}
              />

              {/* VERRA sync indicator */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span
                  style={{
                    width: "7px",
                    height: "7px",
                    borderRadius: "50%",
                    background: "var(--accent-primary)",
                    display: "inline-block",
                    animation: "live-pulse 1.2s infinite",
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: "10px",
                    fontFamily: '"IBM Plex Sans", sans-serif',
                    color: "var(--text-muted)",
                  }}
                >
                  Sincronizado con VERRA
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
