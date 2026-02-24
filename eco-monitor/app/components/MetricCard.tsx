import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string;
  unit?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  accentColor?: string;
}

export default function MetricCard({
  label,
  value,
  unit,
  trend,
  trendValue,
  accentColor = "var(--accent-primary)",
}: MetricCardProps) {
  const TrendIcon =
    trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;

  const trendColor =
    trend === "up"
      ? "var(--accent-primary)"
      : trend === "down"
      ? "var(--accent-danger)"
      : "var(--text-muted)";

  return (
    <div
      style={{
        background: "var(--surface-card)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "6px",
        borderTop: `2px solid ${accentColor}`,
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        flex: 1,
      }}
    >
      {/* Label */}
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
        {label}
      </p>

      {/* Value */}
      <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
        <span
          className="mono-data"
          style={{
            fontSize: "32px",
            fontWeight: 700,
            color: accentColor,
            lineHeight: 1,
          }}
        >
          {value}
        </span>
        {unit && (
          <span
            style={{
              fontSize: "13px",
              fontFamily: '"IBM Plex Sans", sans-serif',
              color: "var(--text-secondary)",
            }}
          >
            {unit}
          </span>
        )}
      </div>

      {/* Trend */}
      {trend && trendValue && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            marginTop: "4px",
          }}
        >
          <TrendIcon size={13} style={{ color: trendColor }} />
          <span
            style={{
              fontSize: "11px",
              fontFamily: '"IBM Plex Sans", sans-serif',
              color: trendColor,
            }}
          >
            {trendValue}
          </span>
        </div>
      )}
    </div>
  );
}
