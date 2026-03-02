interface StatusPillProps {
  status?: "active" | "warning" | "critical" | "pending";
  label?: string;
  value?: number;
  type?: "age" | "integrity" | "capacity";
}

const statusConfig = {
  active: {
    color: "var(--accent-primary)",
    bg: "rgba(0, 229, 160, 0.12)",
    label: "Activo",
  },
  warning: {
    color: "var(--accent-warning)",
    bg: "rgba(255, 107, 53, 0.12)",
    label: "Advertencia",
  },
  critical: {
    color: "var(--accent-danger)",
    bg: "rgba(255, 59, 92, 0.12)",
    label: "Crítico",
  },
  pending: {
    color: "var(--accent-secondary)",
    bg: "rgba(0, 150, 255, 0.12)",
    label: "Pendiente",
  },
};

function getDynamicStatus(
  value: number,
  type: "age" | "integrity" | "capacity"
): "active" | "warning" | "critical" {
  if (type === "age") {
    if (value < 8) return "active";
    if (value <= 10) return "warning";
    return "critical";
  }
  if (type === "integrity") {
    if (value > 60) return "active";
    if (value >= 30) return "warning";
    return "critical";
  }
  // capacity
  if (value < 70) return "active";
  if (value <= 90) return "warning";
  return "critical";
}

export default function StatusPill({ status, label, value, type }: StatusPillProps) {
  // Determine resolved status
  const resolvedStatus: "active" | "warning" | "critical" | "pending" =
    value !== undefined && type !== undefined
      ? getDynamicStatus(value, type)
      : status ?? "active";

  const config = statusConfig[resolvedStatus];

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "3px 10px 3px 8px",
        borderRadius: "4px",
        background: config.bg,
        borderLeft: `3px solid ${config.color}`,
        color: config.color,
        fontSize: "11px",
        fontFamily: '"IBM Plex Sans", sans-serif',
        fontWeight: 500,
        whiteSpace: "nowrap",
        transition:
          "background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease",
      }}
    >
      {label ?? config.label}
    </span>
  );
}
