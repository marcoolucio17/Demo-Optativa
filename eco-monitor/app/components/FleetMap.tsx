"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  ZoomControl,
} from "react-leaflet";
import L from "leaflet";
// @ts-ignore – CSS side-effect import
import "leaflet/dist/leaflet.css";
import type { Equipment } from "../lib/types";

/* ── Fix Leaflet default icon issue in Next.js ──────────────────────────── */
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "",
  iconUrl: "",
  shadowUrl: "",
});

/* ── Marker factories ───────────────────────────────────────────────────── */
function createMarkerIcon(status: string): L.DivIcon {
  const styles: Record<string, { bg: string; border: string; glow: string }> = {
    active: {
      bg: "#00E5A0",
      border: "#00FFB3",
      glow: "rgba(0,229,160,0.4)",
    },
    warning: {
      bg: "#FF6B35",
      border: "#FF8C5A",
      glow: "rgba(255,107,53,0.4)",
    },
    critical: {
      bg: "#FF3B5C",
      border: "#FF6080",
      glow: "rgba(255,59,92,0.4)",
    },
  };

  const s = styles[status] ?? styles.active;

  const pulseHtml =
    status === "critical"
      ? `<div class="marker-pulse"></div>`
      : "";

  return L.divIcon({
    className: "",
    html: `
      <div style="
        position: relative;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: ${s.bg};
        border: 2px solid ${s.border};
        box-shadow: 0 0 6px ${s.glow};
      " ${status === "critical" ? 'class="marker-critical"' : ""}>
        ${pulseHtml}
      </div>
    `,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
    popupAnchor: [0, -8],
  });
}

function buildPopupHTML(eq: Equipment): string {
  return `
    <div style="
      background: #141D2B;
      border: 1px solid #1E2D42;
      border-radius: 6px;
      padding: 12px;
      min-width: 200px;
      font-family: IBM Plex Sans, sans-serif;
    ">
      <div style="font-family: Space Mono, monospace; color: #00E5A0;
        font-size: 12px; margin-bottom: 8px; font-weight: 700;">
        ${eq.id}
      </div>
      <div style="color: #E8EDF5; font-size: 13px;">
        ${eq.model}
      </div>
      <div style="color: #7A90AA; font-size: 12px; margin-top: 4px;">
        ${eq.location}
      </div>
      <div style="color: #7A90AA; font-size: 12px;">
        Gas: ${eq.gasType} — ${eq.gasCharge}kg
      </div>
      <div style="margin-top: 8px;">
        <a href="/dashboard/equipment/${eq.id}"
          style="color: #00E5A0; font-size: 12px;
          font-family: Space Mono, monospace; text-decoration: none;">
          Ver detalle →
        </a>
      </div>
    </div>
  `;
}

/* ── Component ──────────────────────────────────────────────────────────── */
interface FleetMapProps {
  equipment: Equipment[];
}

export default function FleetMap({ equipment }: FleetMapProps) {
  return (
    <MapContainer
      center={[23.6345, -102.5528]}
      zoom={5}
      minZoom={4}
      maxZoom={8}
      scrollWheelZoom={false}
      zoomControl={false}
      style={{
        width: "100%",
        height: "100%",
        background: "var(--bg-base)",
        borderRadius: "6px",
      }}
    >
      <ZoomControl position="bottomright" />
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
      />

      {equipment.map((eq) => (
        <Marker
          key={eq.id}
          position={[eq.coordinates.lat, eq.coordinates.lng]}
          icon={createMarkerIcon(eq.status)}
        >
          <Popup>
            <div
              dangerouslySetInnerHTML={{ __html: buildPopupHTML(eq) }}
            />
          </Popup>
        </Marker>
      ))}

      {/* Custom overlays rendered as absolute-positioned divs */}
      <MapOverlays equipmentCount={equipment.length} />
    </MapContainer>
  );
}

/* ── In-map overlays (legend + count) ───────────────────────────────────── */
function MapOverlays({ equipmentCount }: { equipmentCount: number }) {
  return (
    <>
      {/* Legend — bottom-left */}
      <div
        style={{
          position: "absolute",
          bottom: "12px",
          left: "12px",
          zIndex: 1000,
          background: "var(--surface-elevated)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "4px",
          padding: "8px 12px",
          display: "flex",
          flexDirection: "column",
          gap: "5px",
        }}
      >
        {[
          { color: "#00E5A0", label: "Activo" },
          { color: "#FF6B35", label: "Atención" },
          { color: "#FF3B5C", label: "Crítico" },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
            }}
          >
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: item.color,
                display: "inline-block",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: "11px",
                fontFamily: '"Space Mono", monospace',
                color: "var(--text-secondary)",
                whiteSpace: "nowrap",
              }}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Equipment count — top-right */}
      <div
        style={{
          position: "absolute",
          top: "12px",
          right: "12px",
          zIndex: 1000,
          background: "var(--surface-elevated)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "4px",
          padding: "6px 12px",
        }}
      >
        <span
          style={{
            fontSize: "11px",
            fontFamily: '"Space Mono", monospace',
            color: "var(--text-secondary)",
          }}
        >
          847,392 equipos monitoreados
        </span>
      </div>
    </>
  );
}
