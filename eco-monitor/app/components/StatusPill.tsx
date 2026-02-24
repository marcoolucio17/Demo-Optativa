interface StatusPillProps {
  status: "active" | "warning" | "critical" | "pending";
  label?: string;
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

export default function StatusPill({ status, label }: StatusPillProps) {
  const config = statusConfig[status];
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
      }}
    >
      {label ?? config.label}
    </span>
  );
}
