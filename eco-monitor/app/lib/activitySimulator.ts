export type ActivityType = "recovery" | "classification" | "batch" | "alert" | "certificate";

export interface ActivityEvent {
  id: string;
  text: string;
  type: ActivityType;
  timestamp: Date;
}

const eventPool: { text: string; type: ActivityType }[] = [
  { text: "Técnico J. Martínez registró retiro en Oxxo Apodaca #4821", type: "recovery" },
  { text: "Equipo VF-2847 clasificado como R-134a — 320g recuperados", type: "classification" },
  { text: "Centro Apodaca procesó lote de 12 equipos", type: "batch" },
  { text: "Alerta: Equipo GD-1923 supera 11 años de vida útil", type: "alert" },
  { text: "Certificado SEMARNAT generado — Folio #MX2024-8821", type: "certificate" },
  { text: "Técnico R. González completó 8 retiros hoy en Guadalupe", type: "recovery" },
  { text: "Centro Monterrey Norte recibió 6 equipos para destrucción", type: "batch" },
  { text: "Equipo EQ-0192 clasificado como R-404A — 180g recuperados", type: "classification" },
  { text: "Alerta: Centro Guadalupe al 85% de capacidad", type: "alert" },
  { text: "Certificado ESG generado — Lote #2026-441", type: "certificate" },
  { text: "Técnico L. Hernández registró retiro en Walmart Juriquilla", type: "recovery" },
  { text: "Centro CDMX Vallejo procesó lote de 18 equipos", type: "batch" },
  { text: "Equipo VF-2291 — Integridad de gas bajo 30%", type: "alert" },
  { text: "12 equipos procesados en Centro Apodaca esta mañana", type: "batch" },
  { text: "Equipo TK-0448 clasificado como R-290 — 95g recuperados", type: "classification" },
  { text: "Certificado VERRA generado — Folio #VCS-2026-MX-0192", type: "certificate" },
  { text: "Técnico A. Torres registró retiro en H-E-B Cumbres #3", type: "recovery" },
  { text: "Alerta crítica: Equipo GD-1923 supera vida útil reglamentaria", type: "alert" },
  { text: "Nuevo retiro programado — Walmart Guadalupe, 8 equipos", type: "recovery" },
  { text: "38.4 ton CO₂e evitadas este mes — meta mensual superada", type: "certificate" },
];

let counter = 0;

export function getRandomActivityEvent(): ActivityEvent {
  const pool = eventPool[Math.floor(Math.random() * eventPool.length)];
  return {
    id: `evt-${Date.now()}-${counter++}`,
    text: pool.text,
    type: pool.type,
    timestamp: new Date(),
  };
}

export const activityTypeColor: Record<ActivityType, string> = {
  recovery: "var(--accent-primary)",
  classification: "var(--accent-secondary)",
  batch: "var(--text-secondary)",
  alert: "var(--accent-danger)",
  certificate: "var(--accent-warning)",
};
