"use client";

import { use, useState, useEffect, useRef } from "react";
import Topbar from "../../../components/Topbar";
import StatusPill from "../../../components/StatusPill";
import { equipment } from "../../../lib/data";
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
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { format } from "date-fns";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import {
  Camera,
  AlertTriangle,
  AlertCircle,
  Info,
  Calendar,
  Radio,
  CheckCircle2,
  XCircle,
  Zap,
} from "lucide-react";

/* ── static helpers ──────────────────────────────────────────────────────── */
const gasTypeColor: Record<string, string> = {
  "R-404A": "var(--accent-danger)",
  "R-134a": "var(--accent-warning)",
  "R-290": "var(--accent-primary)",
  "R-600a": "var(--accent-primary)",
};

function getIntegrityColor(p: number) {
  return p > 60
    ? "var(--accent-primary)"
    : p >= 30
    ? "var(--accent-warning)"
    : "var(--accent-danger)";
}
function getIntegrityLabel(p: number) {
  return p > 60
    ? { text: "Óptimo", color: "var(--accent-primary)" }
    : p >= 30
    ? { text: "Revisar", color: "var(--accent-warning)" }
    : { text: "Crítico", color: "var(--accent-danger)" };
}
function getLifeColor(p: number) {
  return p > 50
    ? "var(--accent-primary)"
    : p >= 25
    ? "var(--accent-warning)"
    : "var(--accent-danger)";
}

const tooltipStyle = {
  background: "var(--surface-elevated)",
  border: "1px solid var(--border-active)",
  borderRadius: "4px",
  fontSize: "12px",
  fontFamily: '"IBM Plex Sans", sans-serif',
  color: "var(--text-primary)",
};

/* ── alert / technician templates ────────────────────────────────────────── */
interface LiveAlert {
  id: number;
  text: string;
  type: "info" | "warning" | "success";
  timestamp: Date;
}

const ALERT_TEMPLATES: { text: string; type: LiveAlert["type"] }[] = [
  { text: "Lectura de temperatura registrada", type: "info" },
  { text: "Señal de telemetría recibida — Normal", type: "success" },
  { text: "Verificación de sello completada", type: "success" },
  { text: "Ciclo de compresor registrado #4,821", type: "info" },
  { text: "Sin fugas detectadas en última lectura", type: "success" },
  { text: "Presión del sistema dentro de parámetros", type: "info" },
  { text: "Alerta preventiva: revisar sello de puerta", type: "warning" },
  { text: "Consumo eléctrico normal: 1.8 kWh", type: "info" },
];

const alertIconMap = {
  info: Info,
  warning: AlertTriangle,
  success: CheckCircle2,
  error: XCircle,
};
const alertColorMap: Record<string, string> = {
  info: "var(--accent-secondary)",
  warning: "var(--accent-warning)",
  success: "var(--accent-primary)",
  error: "var(--accent-danger)",
};

const TECH_ACTIONS = [
  "Verificación remota completada",
  "Reporte de estado enviado",
  "Diagnóstico preventivo registrado",
  "Sin anomalías reportadas",
];

/* ── component ───────────────────────────────────────────────────────────── */
interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EquipmentDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const eq = equipment.find((e) => e.id === id) ?? equipment[0];
  const alertIdRef = useRef(0);

  /* ── Hydration guard: defer dynamic dates/random values to client ─────── */
  const [mounted, setMounted] = useState(false);

  /* ── Feature 1: Live status header ─────────────────────────────────────── */
  const [lastPing, setLastPing] = useState<Date | null>(null);
  const [, setTick] = useState(0);

  /* ── Feature 2: Live gas integrity ─────────────────────────────────────── */
  const [liveIntegrity, setLiveIntegrity] = useState(eq.integrityPercent);
  const [integrityReadings, setIntegrityReadings] = useState<
    { time: Date; value: number }[]
  >([]);

  /* ── Feature 3: Live temperature ───────────────────────────────────────── */
  const baseInterior = -4.2;
  const [interiorTemp, setInteriorTemp] = useState(baseInterior);
  const [exteriorTemp, setExteriorTemp] = useState(24.8);
  const [liveTempData, setLiveTempData] = useState<{ label: string; temp: number }[]>([]);
  const [tempStats, setTempStats] = useState({ min: -4.6, max: -3.8 });

  /* ── Feature 4: Live pressure ──────────────────────────────────────────── */
  const [highP, setHighP] = useState(12.4);
  const [lowP, setLowP] = useState(3.2);
  const [highPHist, setHighPHist] = useState<number[]>([]);
  const [lowPHist, setLowPHist] = useState<number[]>([]);

  /* ── Feature 5: Live alert feed ────────────────────────────────────────── */
  const [alerts, setAlerts] = useState<LiveAlert[]>([]);

  /* ── Feature 6: Power consumption ──────────────────────────────────────── */
  const [currentKwh, setCurrentKwh] = useState(1.8);
  const [dailyKwh, setDailyKwh] = useState(43.2);

  /* ── Feature 8: Technician activity ────────────────────────────────────── */
  const [techAction, setTechAction] = useState<{ time: Date | null; text: string }>({
    time: null,
    text: "Revisión preventiva completada",
  });

  /* ── Current time for uptime calc ──────────────────────────────────────── */
  const [now, setNow] = useState<Date | null>(null);

  /* ── Gauge animation delay ─────────────────────────────────────────────── */
  const [gaugeReady, setGaugeReady] = useState(false);

  /* ── Client-side initialization (avoids hydration mismatch) ────────────── */
  useEffect(() => {
    setMounted(true);
    setLastPing(new Date());
    setNow(new Date());
    setTechAction({ time: new Date(Date.now() - 2 * 86400000), text: "Revisión preventiva completada" });
    setIntegrityReadings([{ time: new Date(), value: eq.integrityPercent }]);
    setLiveTempData(
      Array.from({ length: 12 }, (_, i) => ({
        label: `T-${12 - i}`,
        temp: parseFloat((baseInterior + (Math.random() - 0.5) * 0.8).toFixed(1)),
      }))
    );
    setHighPHist(
      Array.from({ length: 10 }, () => parseFloat((12.4 + (Math.random() - 0.5) * 0.4).toFixed(1)))
    );
    setLowPHist(
      Array.from({ length: 10 }, () => parseFloat((3.2 + (Math.random() - 0.5) * 0.2).toFixed(1)))
    );
    const t = setTimeout(() => setGaugeReady(true), 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── All intervals ─────────────────────────────────────────────────────── */
  useEffect(() => {
    // 1s tick
    const tick1 = setInterval(() => {
      setTick((t) => t + 1);
      setNow(new Date());
    }, 1000);

    // 8s — ping reset + temp fluctuate
    const tick8 = setInterval(() => {
      setLastPing(new Date());
      setInteriorTemp((v) => {
        const next = parseFloat(
          (v + (Math.random() * 0.6 - 0.3)).toFixed(1)
        );
        if (next > baseInterior + 2) {
          toast.warning(`Temperatura interior elevada — Equipo ${eq.id}`);
        }
        return next;
      });
      setExteriorTemp((v) =>
        parseFloat((v + (Math.random() * 1.0 - 0.5)).toFixed(1))
      );
    }, 8000);

    // 10s — power
    const tick10 = setInterval(() => {
      setCurrentKwh((v) =>
        parseFloat(Math.max(0.5, v + (Math.random() * 0.2 - 0.1)).toFixed(1))
      );
    }, 10000);

    // 12s — pressure
    const tick12 = setInterval(() => {
      setHighP((v) => {
        const next = parseFloat(
          Math.max(8, Math.min(17, v + (Math.random() * 0.4 - 0.2))).toFixed(1)
        );
        setHighPHist((h) => [...h.slice(-9), next]);
        return next;
      });
      setLowP((v) => {
        const next = parseFloat(
          Math.max(1, Math.min(6, v + (Math.random() * 0.2 - 0.1))).toFixed(1)
        );
        setLowPHist((h) => [...h.slice(-9), next]);
        return next;
      });
    }, 12000);

    // 15s — integrity
    const tick15 = setInterval(() => {
      setLiveIntegrity((prev) => {
        const delta = Math.random() * 0.4 - 0.3; // bias negative
        const next = parseFloat(
          Math.max(0, Math.min(100, prev + delta)).toFixed(1)
        );
        if (next < 30 && prev >= 30) {
          toast.error(`Alerta: Integridad crítica detectada en equipo ${eq.id}`);
        }
        setIntegrityReadings((r) =>
          [{ time: new Date(), value: next }, ...r].slice(0, 3)
        );
        return next;
      });
    }, 15000);

    // 20s — alerts
    const tick20 = setInterval(() => {
      const tmpl =
        ALERT_TEMPLATES[Math.floor(Math.random() * ALERT_TEMPLATES.length)];
      alertIdRef.current += 1;
      const newAlert: LiveAlert = {
        id: alertIdRef.current,
        text: tmpl.text,
        type: tmpl.type,
        timestamp: new Date(),
      };
      setAlerts((prev) => [newAlert, ...prev].slice(0, 5));
    }, 20000);

    // 30s — temp chart new point
    const tick30 = setInterval(() => {
      setLiveTempData((prev) => {
        const latest = parseFloat(
          (baseInterior + (Math.random() * 0.6 - 0.3)).toFixed(1)
        );
        const next = [
          ...prev.slice(1),
          { label: format(new Date(), "HH:mm:ss"), temp: latest },
        ];
        const temps = next.map((d) => d.temp);
        setTempStats({
          min: Math.min(...temps),
          max: Math.max(...temps),
        });
        return next;
      });
    }, 30000);

    // 45s — technician
    const tick45 = setInterval(() => {
      const action =
        TECH_ACTIONS[Math.floor(Math.random() * TECH_ACTIONS.length)];
      setTechAction({ time: new Date(), text: action });
      toast.info(`Técnico ${eq.technician} actualizó equipo ${eq.id}`);
    }, 45000);

    // 60s — daily kWh
    const tick60 = setInterval(() => {
      setDailyKwh((v) => parseFloat((v + 0.03).toFixed(2)));
    }, 60000);

    return () => {
      clearInterval(tick1);
      clearInterval(tick8);
      clearInterval(tick10);
      clearInterval(tick12);
      clearInterval(tick15);
      clearInterval(tick20);
      clearInterval(tick30);
      clearInterval(tick45);
      clearInterval(tick60);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── derived values ───────────────────────────────────────────────────── */
  const gaugeValue = gaugeReady ? liveIntegrity : 0;
  const integrityColor = getIntegrityColor(gaugeValue);
  const integrityLabel = getIntegrityLabel(liveIntegrity);
  const radialData = [{ value: gaugeValue, fill: integrityColor }];

  // Feature 7: Uptime
  const installDate = new Date(eq.installationDate);
  const uptimeMs = now ? now.getTime() - installDate.getTime() : 0;
  const uptimeDays = Math.floor(uptimeMs / 86400000);
  const uptimeHours = Math.floor((uptimeMs % 86400000) / 3600000);
  const uptimeMins = Math.floor((uptimeMs % 3600000) / 60000);
  const uptimeColor =
    eq.age < 8
      ? "var(--accent-primary)"
      : eq.age <= 10
      ? "var(--accent-warning)"
      : "var(--accent-danger)";

  // Pressure status colors
  const highPColor =
    highP >= 10 && highP <= 15
      ? "var(--accent-primary)"
      : "var(--accent-warning)";
  const lowPColor =
    lowP >= 2 && lowP <= 5
      ? "var(--accent-primary)"
      : "var(--accent-warning)";

  // Power status
  const powerColor =
    currentKwh < 2
      ? "var(--accent-primary)"
      : currentKwh <= 3
      ? "var(--accent-warning)"
      : "var(--accent-danger)";
  const powerLabel =
    currentKwh < 2
      ? "Consumo normal"
      : currentKwh <= 3
      ? "Consumo elevado"
      : "Consumo crítico";

  // Interior temp color
  const interiorTempColor =
    interiorTemp > baseInterior + 2
      ? "var(--accent-warning)"
      : "var(--accent-secondary)";

  // Temp average
  const tempAvg = (
    liveTempData.reduce((s, d) => s + d.temp, 0) / liveTempData.length
  ).toFixed(1);

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <Topbar breadcrumb={["Dashboard", "Equipos", eq.id]} />

      <main
        style={{
          flex: 1,
          padding: "24px",
          background: "var(--bg-base)",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "18px",
        }}
      >
        {/* ── Feature 1: Live Status Header ──────────────────────────────── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
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
          {/* Live badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "var(--accent-primary)",
                display: "inline-block",
                animation: "live-pulse 1.2s infinite",
              }}
            />
            <span
              style={{
                fontFamily: '"Space Mono", monospace',
                fontSize: "11px",
                color: "var(--accent-primary)",
                fontWeight: 700,
              }}
            >
              MONITOREANDO EN VIVO
            </span>
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Radio
                size={12}
                strokeWidth={2}
                style={{ color: "var(--accent-primary)" }}
              />
            </motion.span>
          </div>
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
        {/* Last ping */}
        <p
          style={{
            margin: "-10px 0 0 0",
            fontSize: "11px",
            fontFamily: '"IBM Plex Sans", sans-serif',
            color: "var(--text-muted)",
          }}
        >
          Última señal:{" "}
          {mounted && lastPing
            ? formatDistanceToNow(lastPing, {
                includeSeconds: true,
                locale: es,
                addSuffix: true,
              })
            : "conectando..."}
        </p>

        {/* ── Two-column layout ──────────────────────────────────────────── */}
        <div className="eq-cols">
          {/* ── LEFT: Equipment Info ──────────────────────────────────────── */}
          <div
            className="eq-left"
            style={{
              background: "var(--surface-card)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "6px",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
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

            <div
              style={{
                background: "var(--surface-elevated)",
                border: "1px solid var(--border-active)",
                borderRadius: "4px",
                height: "140px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
              }}
            >
              <Camera size={28} strokeWidth={1.5} style={{ color: "var(--text-muted)" }} />
              <span style={{ fontSize: "11px", fontFamily: '"IBM Plex Sans", sans-serif', color: "var(--text-muted)" }}>
                Foto del equipo
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              {[
                { label: "Modelo", value: eq.model },
                { label: "Marca", value: eq.brand },
                { label: "Instalación", value: eq.installationDate },
                { label: "Antigüedad", value: `${eq.age} años` },
                { label: "Tipo de gas", value: eq.gasType, colored: true },
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
                    padding: "9px 0",
                    borderBottom: i < 8 ? "1px solid var(--border-subtle)" : "none",
                  }}
                >
                  <span style={{ fontSize: "11px", fontFamily: '"IBM Plex Sans", sans-serif', color: "var(--text-muted)" }}>
                    {row.label}
                  </span>
                  <span
                    style={{
                      fontSize: "13px",
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

            {/* Feature 8: Technician activity */}
            <div
              style={{
                padding: "10px 12px",
                background: "var(--surface-elevated)",
                borderRadius: "4px",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <p style={{ margin: "0 0 4px 0", fontSize: "11px", fontFamily: '"IBM Plex Sans", sans-serif', color: "var(--text-muted)" }}>
                Última actividad del técnico
              </p>
              {mounted && techAction.time ? (
                <AnimatePresence mode="wait">
                  <motion.p
                    key={techAction.time.getTime()}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    style={{
                      margin: 0,
                      fontSize: "12px",
                      fontFamily: '"IBM Plex Sans", sans-serif',
                      color: "var(--text-secondary)",
                    }}
                  >
                    {formatDistanceToNow(techAction.time, { locale: es, addSuffix: true })} — {techAction.text}
                  </motion.p>
                </AnimatePresence>
              ) : (
                <p style={{ margin: 0, fontSize: "12px", fontFamily: '"IBM Plex Sans", sans-serif', color: "var(--text-muted)" }}>
                  Cargando...
                </p>
              )}
            </div>

            {/* Feature 7: Uptime counter */}
            <div
              style={{
                padding: "10px 12px",
                background: "var(--surface-elevated)",
                borderRadius: "4px",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <p style={{ margin: "0 0 4px 0", fontSize: "11px", fontFamily: '"IBM Plex Sans", sans-serif', color: "var(--text-muted)" }}>
                Tiempo en operación continua
              </p>
              <p
                className="mono-data"
                style={{
                  margin: 0,
                  fontSize: "14px",
                  color: uptimeColor,
                }}
              >
                {uptimeDays.toLocaleString("es-MX")} días, {uptimeHours} horas, {uptimeMins} minutos
              </p>
            </div>
          </div>

          {/* ── RIGHT: Monitoring Panel ───────────────────────────────────── */}
          <div className="eq-right">
            {/* Feature 2: Gas Integrity Gauge */}
            <div
              style={{
                background: "var(--surface-card)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "6px",
                padding: "20px",
              }}
            >
              <h3 style={{ margin: "0 0 6px 0", fontSize: "13px", fontFamily: '"Space Mono", monospace', color: "var(--text-primary)" }}>
                Integridad del sistema
              </h3>
              <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  style={{ position: "relative", width: "110px", height: "110px", flexShrink: 0 }}
                >
                  <ResponsiveContainer width={110} height={110}>
                    <RadialBarChart innerRadius={34} outerRadius={50} data={radialData} startAngle={90} endAngle={-270}>
                      <RadialBar dataKey="value" cornerRadius={4} background={{ fill: "var(--surface-elevated)" }} isAnimationActive={true} animationDuration={1000} animationBegin={100} />
                    </RadialBarChart>
                  </ResponsiveContainer>
                  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1px" }}>
                    <span className="mono-data" style={{ fontSize: "15px", fontWeight: 700, color: integrityColor, lineHeight: 1 }}>
                      {liveIntegrity.toFixed(1)}%
                    </span>
                    <span style={{ fontSize: "8px", fontFamily: '"IBM Plex Sans", sans-serif', color: integrityLabel.color, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                      {integrityLabel.text}
                    </span>
                  </div>
                </motion.div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: "0 0 6px 0", fontSize: "12px", fontFamily: '"IBM Plex Sans", sans-serif', color: "var(--text-secondary)" }}>
                    {liveIntegrity > 60
                      ? "Sistema operando dentro de parámetros normales."
                      : liveIntegrity >= 30
                      ? "Integridad reducida. Requiere atención."
                      : "Estado crítico. Programar retiro inmediato."}
                  </p>
                  <StatusPill value={liveIntegrity} type="integrity" />
                  {/* Reading history */}
                  <div style={{ marginTop: "8px", display: "flex", flexDirection: "column", gap: "2px" }}>
                    <AnimatePresence initial={false}>
                      {integrityReadings.map((r, i) => (
                        <motion.p
                          key={r.time.getTime()}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          style={{ margin: 0, fontSize: "10px", fontFamily: '"Roboto Mono", monospace', color: i === 0 ? "var(--text-secondary)" : "var(--text-muted)" }}
                        >
                          {format(r.time, "HH:mm:ss")} — {r.value.toFixed(1)}%
                        </motion.p>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 3: Live Temperature */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{
                background: "var(--surface-card)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "6px",
                padding: "20px",
                position: "relative",
              }}
            >
              {/* LIVE tag */}
              <span
                style={{
                  position: "absolute",
                  top: "12px",
                  right: "12px",
                  background: "var(--accent-danger)",
                  color: "#fff",
                  fontFamily: '"Space Mono", monospace',
                  fontSize: "9px",
                  fontWeight: 700,
                  padding: "2px 6px",
                  borderRadius: "2px",
                  letterSpacing: "0.06em",
                }}
              >
                LIVE
              </span>
              <h3 style={{ margin: "0 0 6px 0", fontSize: "13px", fontFamily: '"Space Mono", monospace', color: "var(--text-primary)" }}>
                Monitoreo de temperatura
              </h3>
              {/* Live readings */}
              <p className="mono-data" style={{ margin: "0 0 12px 0", fontSize: "24px", fontWeight: 700, lineHeight: 1.2 }}>
                <span style={{ color: interiorTempColor }}>{interiorTemp.toFixed(1)}°C</span>
                <span style={{ fontSize: "13px", fontFamily: '"IBM Plex Sans", sans-serif', color: "var(--text-muted)", margin: "0 8px" }}>Interior /</span>
                <span style={{ color: "var(--text-secondary)" }}>{exteriorTemp.toFixed(1)}°C</span>
                <span style={{ fontSize: "13px", fontFamily: '"IBM Plex Sans", sans-serif', color: "var(--text-muted)", marginLeft: "6px" }}>Exterior</span>
              </p>
              <ResponsiveContainer width="100%" height={130}>
                <LineChart data={liveTempData} margin={{ top: 4, right: 4, bottom: 4, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 8, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: "var(--text-muted)", fontFamily: '"Roboto Mono", monospace' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Line type="monotone" dataKey="temp" stroke="var(--accent-secondary)" strokeWidth={2} dot={{ r: 2, fill: "var(--accent-secondary)", strokeWidth: 0 }} isAnimationActive={true} animationDuration={1500} animationEasing="ease-out" />
                </LineChart>
              </ResponsiveContainer>
              <p style={{ margin: "6px 0 0 0", fontSize: "11px", fontFamily: '"IBM Plex Sans", sans-serif', color: "var(--text-muted)" }}>
                Mín: {tempStats.min.toFixed(1)}°C &nbsp;|&nbsp; Máx: {tempStats.max.toFixed(1)}°C &nbsp;|&nbsp; Promedio: {tempAvg}°C
              </p>
            </motion.div>

            {/* Feature 4: Live Pressure */}
            <div
              style={{
                background: "var(--surface-card)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "6px",
                padding: "20px",
              }}
            >
              <h3 style={{ margin: "0 0 10px 0", fontSize: "13px", fontFamily: '"Space Mono", monospace', color: "var(--text-secondary)" }}>
                Presión del sistema
              </h3>
              <div style={{ display: "flex", gap: "16px" }}>
                {/* High pressure */}
                <div style={{ flex: 1 }}>
                  <p style={{ margin: "0 0 2px 0", fontSize: "10px", fontFamily: '"IBM Plex Sans", sans-serif', color: "var(--text-muted)", textTransform: "uppercase" }}>Alta presión</p>
                  <p className="mono-data" style={{ margin: "0 0 4px 0", fontSize: "22px", fontWeight: 700, color: highPColor, lineHeight: 1 }}>
                    {highP.toFixed(1)} <span style={{ fontSize: "12px", fontWeight: 400 }}>bar</span>
                  </p>
                  <ResponsiveContainer width="100%" height={40}>
                    <LineChart data={highPHist.map((v, i) => ({ i, v }))}>
                      <Line type="monotone" dataKey="v" stroke={highPColor} strokeWidth={1.5} dot={false} isAnimationActive={true} animationDuration={500} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                {/* Low pressure */}
                <div style={{ flex: 1 }}>
                  <p style={{ margin: "0 0 2px 0", fontSize: "10px", fontFamily: '"IBM Plex Sans", sans-serif', color: "var(--text-muted)", textTransform: "uppercase" }}>Baja presión</p>
                  <p className="mono-data" style={{ margin: "0 0 4px 0", fontSize: "22px", fontWeight: 700, color: lowPColor, lineHeight: 1 }}>
                    {lowP.toFixed(1)} <span style={{ fontSize: "12px", fontWeight: 400 }}>bar</span>
                  </p>
                  <ResponsiveContainer width="100%" height={40}>
                    <LineChart data={lowPHist.map((v, i) => ({ i, v }))}>
                      <Line type="monotone" dataKey="v" stroke={lowPColor} strokeWidth={1.5} dot={false} isAnimationActive={true} animationDuration={500} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Feature 6: Power consumption */}
            <div
              style={{
                background: "var(--surface-card)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "6px",
                padding: "20px",
              }}
            >
              <p style={{ margin: "0 0 6px 0", fontSize: "12px", fontFamily: '"Space Mono", monospace', color: "var(--text-muted)" }}>
                Consumo eléctrico
              </p>
              <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
                <span className="mono-data" style={{ fontSize: "28px", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1 }}>
                  {currentKwh.toFixed(1)}
                </span>
                <span style={{ fontSize: "14px", fontFamily: '"IBM Plex Sans", sans-serif', color: "var(--text-secondary)" }}>kWh</span>
                <span style={{ fontSize: "11px", fontFamily: '"IBM Plex Sans", sans-serif', color: powerColor, fontWeight: 600, marginLeft: "auto" }}>
                  <Zap size={11} style={{ verticalAlign: "middle", marginRight: "3px" }} />
                  {powerLabel}
                </span>
              </div>
              <p style={{ margin: "8px 0 0 0", fontSize: "11px", fontFamily: '"IBM Plex Sans", sans-serif', color: "var(--text-muted)" }}>
                Hoy: {dailyKwh.toFixed(1)} kWh &nbsp;|&nbsp; Este mes: 847 kWh
              </p>
            </div>

            {/* Remaining Life */}
            <div
              style={{
                background: "var(--surface-card)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "6px",
                padding: "20px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <h3 style={{ margin: 0, fontSize: "13px", fontFamily: '"Space Mono", monospace', color: "var(--text-primary)" }}>
                  Vida útil restante
                </h3>
                <span className="mono-data" style={{ fontSize: "16px", fontWeight: 700, color: getLifeColor(eq.remainingLifePercent) }}>
                  {eq.remainingLifePercent}%
                </span>
              </div>
              <div style={{ height: "8px", background: "var(--surface-elevated)", borderRadius: "3px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${eq.remainingLifePercent}%`, background: getLifeColor(eq.remainingLifePercent), borderRadius: "3px", transition: "width 0.6s ease" }} />
              </div>
              <p style={{ margin: "6px 0 0 0", fontSize: "10px", fontFamily: '"IBM Plex Sans", sans-serif', color: "var(--text-muted)" }}>
                Instalado: {eq.installationDate} · {eq.age} años
              </p>
            </div>

            {/* Feature 5: Live Alert Feed */}
            <div
              style={{
                background: "var(--surface-card)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "6px",
                padding: "20px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                <h3 style={{ margin: 0, fontSize: "13px", fontFamily: '"Space Mono", monospace', color: "var(--text-secondary)" }}>
                  Alertas en tiempo real
                </h3>
                <span
                  style={{
                    minWidth: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    background: alerts.length > 0 ? "var(--accent-danger)" : "var(--surface-elevated)",
                    color: alerts.length > 0 ? "#fff" : "var(--text-muted)",
                    fontSize: "10px",
                    fontFamily: '"Roboto Mono", monospace',
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {alerts.length}
                </span>
              </div>
              {alerts.length === 0 && (
                <p style={{ margin: 0, fontSize: "11px", fontFamily: '"IBM Plex Sans", sans-serif', color: "var(--text-muted)" }}>
                  Esperando alertas del equipo...
                </p>
              )}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <AnimatePresence initial={false}>
                  {alerts.map((a) => {
                    const Icon = alertIconMap[a.type] ?? Info;
                    const color = alertColorMap[a.type] ?? "var(--text-muted)";
                    return (
                      <motion.div
                        key={a.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}
                      >
                        <Icon size={14} strokeWidth={1.75} style={{ color, flexShrink: 0, marginTop: "1px" }} />
                        <div style={{ flex: 1 }}>
                          <p style={{ margin: 0, fontSize: "11px", fontFamily: '"IBM Plex Sans", sans-serif', color: "var(--text-secondary)", lineHeight: 1.4 }}>
                            {a.text}
                          </p>
                          <span style={{ fontSize: "9px", fontFamily: '"Roboto Mono", monospace', color: "var(--text-muted)" }}>
                            {format(a.timestamp, "HH:mm:ss")}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* ── Action Bar ─────────────────────────────────────────────────── */}
        <div
          className="eq-actions"
          style={{ padding: "16px 0 4px 0", borderTop: "1px solid var(--border-subtle)" }}
        >
          <button
            className="eq-btn-full"
            style={{
              height: "42px",
              padding: "0 24px",
              background: "var(--accent-primary)",
              color: "var(--bg-base)",
              border: "none",
              fontSize: "13px",
              fontFamily: '"Space Mono", monospace',
              fontWeight: 700,
              cursor: "pointer",
              letterSpacing: "0.03em",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.85")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
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
              fontSize: "13px",
              fontFamily: '"Space Mono", monospace',
              fontWeight: 700,
              cursor: "pointer",
              letterSpacing: "0.03em",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(0,229,160,0.08)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
          >
            Registrar Servicio
          </button>
        </div>
      </main>
    </div>
  );
}
