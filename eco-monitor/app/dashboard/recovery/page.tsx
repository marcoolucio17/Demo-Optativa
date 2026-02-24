"use client";

import { useState } from "react";
import Topbar from "../../components/Topbar";
import { equipment, authorizedCenters } from "../../lib/data";
import { ScanLine, Upload, CheckCircle, ChevronLeft, ChevronRight, FileCheck } from "lucide-react";

const steps = [
  { num: 1, label: "Identificación" },
  { num: 2, label: "Detalles" },
  { num: 3, label: "Documentación" },
];

function StepBar({ current }: { current: number }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0",
        marginBottom: "32px",
      }}
    >
      {steps.map((step, i) => {
        const done = current > step.num;
        const active = current === step.num;
        return (
          <div
            key={step.num}
            style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : "none" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: done || active ? "var(--accent-primary)" : "var(--surface-elevated)",
                  border: `2px solid ${done || active ? "var(--accent-primary)" : "var(--border-active)"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {done ? (
                  <CheckCircle size={16} style={{ color: "var(--bg-base)" }} />
                ) : (
                  <span
                    className="mono-data"
                    style={{
                      fontSize: "13px",
                      fontWeight: 700,
                      color: active ? "var(--bg-base)" : "var(--text-muted)",
                    }}
                  >
                    {step.num}
                  </span>
                )}
              </div>
              <span
                style={{
                  fontSize: "13px",
                  fontFamily: '"IBM Plex Sans", sans-serif',
                  color: active ? "var(--text-primary)" : done ? "var(--accent-primary)" : "var(--text-muted)",
                  fontWeight: active ? 500 : 400,
                  whiteSpace: "nowrap",
                }}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                style={{
                  flex: 1,
                  height: "2px",
                  background: done ? "var(--accent-primary)" : "var(--border-subtle)",
                  margin: "0 12px",
                  minWidth: "40px",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

const inputStyle = (focused: boolean, readOnly?: boolean): React.CSSProperties => {
  const borderColor = focused ? "var(--accent-primary)" : readOnly ? "var(--accent-primary)" : "var(--border-active)";
  return {
    width: "100%",
    height: "44px",
    background: readOnly ? "var(--surface-elevated)" : "var(--bg-base)",
    borderTop: `1px solid ${borderColor}`,
    borderRight: `1px solid ${borderColor}`,
    borderBottom: `1px solid ${borderColor}`,
    borderLeft: readOnly ? `3px solid var(--accent-primary)` : `1px solid ${borderColor}`,
    borderRadius: "0",
    padding: "0 14px",
    color: readOnly ? "var(--text-secondary)" : "var(--text-primary)",
    fontSize: "14px",
    fontFamily: '"IBM Plex Sans", sans-serif',
    outline: "none",
    boxSizing: "border-box",
    cursor: readOnly ? "default" : "text",
  };
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "12px",
  fontFamily: '"IBM Plex Sans", sans-serif',
  color: "var(--text-secondary)",
  marginBottom: "6px",
  fontWeight: 500,
};

export default function RecoveryPage() {
  const [step, setStep] = useState(1);
  const [equipmentId, setEquipmentId] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Step 2 fields
  const [techName, setTechName] = useState("");
  const [certNum, setCertNum] = useState("");
  const [recoverySerial, setRecoverySerial] = useState("");
  const [gasKg, setGasKg] = useState("");
  const [gasCondition, setGasCondition] = useState<"reusable" | "treatment" | "destroy">("reusable");
  const [destinationCenter, setDestinationCenter] = useState("");

  // Step 3 fields
  const [semarnatNum, setSemarnatNum] = useState("");
  const [retcNum, setRetcNum] = useState("");

  const foundEquipment = equipment.find(
    (e) => e.id.toLowerCase() === equipmentId.toLowerCase()
  );

  const canProceedStep1 = equipmentId.trim().length > 0;
  const canProceedStep2 = techName && certNum && recoverySerial && gasKg && destinationCenter;

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <Topbar breadcrumb={["Dashboard", "Retiros", "Nuevo Retiro"]} />

      <main
        style={{
          flex: 1,
          padding: "32px 40px",
          background: "var(--bg-base)",
          overflowY: "auto",
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          {/* Step bar */}
          <StepBar current={step} />

          {/* ── STEP 1 ──────────────────────────────────────────────────────── */}
          {step === 1 && (
            <div
              style={{
                background: "var(--surface-card)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "6px",
                padding: "32px",
              }}
            >
              <h2
                style={{
                  margin: "0 0 6px 0",
                  fontSize: "18px",
                  fontFamily: '"Space Mono", monospace',
                  color: "var(--text-primary)",
                }}
              >
                Identificación del equipo
              </h2>
              <p
                style={{
                  margin: "0 0 28px 0",
                  fontSize: "13px",
                  fontFamily: '"IBM Plex Sans", sans-serif',
                  color: "var(--text-muted)",
                }}
              >
                Ingresa o escanea el ID del equipo para cargar sus datos.
              </p>

              {/* Equipment ID input with QR button */}
              <div style={{ marginBottom: "24px" }}>
                <label style={labelStyle}>ID del Equipo</label>
                <div style={{ display: "flex", gap: "0" }}>
                  <input
                    value={equipmentId}
                    onChange={(e) => setEquipmentId(e.target.value.toUpperCase())}
                    onFocus={() => setFocusedField("equipmentId")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="EQ-001"
                    style={{
                      ...inputStyle(focusedField === "equipmentId"),
                      flex: 1,
                      fontSize: "18px",
                      fontFamily: '"Space Mono", monospace',
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                    }}
                  />
                  <button
                    style={{
                      height: "44px",
                      padding: "0 18px",
                      background: "var(--surface-elevated)",
                      border: "1px solid var(--border-active)",
                      borderLeft: "none",
                      color: "var(--accent-primary)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: "12px",
                      fontFamily: '"IBM Plex Sans", sans-serif',
                      flexShrink: 0,
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLElement).style.background = "var(--border-active)")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLElement).style.background = "var(--surface-elevated)")
                    }
                  >
                    <ScanLine size={16} strokeWidth={1.75} />
                    Escanear QR
                  </button>
                </div>
              </div>

              {/* Auto-filled fields */}
              {foundEquipment ? (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "16px",
                    padding: "20px",
                    background: "var(--surface-elevated)",
                    border: "1px solid var(--border-active)",
                    borderLeft: "3px solid var(--accent-primary)",
                    borderRadius: "0 4px 4px 0",
                    marginBottom: "24px",
                  }}
                >
                  <div>
                    <label style={{ ...labelStyle, color: "var(--text-muted)" }}>Ubicación</label>
                    <p style={{ margin: 0, fontSize: "13px", fontFamily: '"IBM Plex Sans", sans-serif', color: "var(--text-secondary)" }}>
                      {foundEquipment.location}
                    </p>
                  </div>
                  <div>
                    <label style={{ ...labelStyle, color: "var(--text-muted)" }}>Modelo</label>
                    <p style={{ margin: 0, fontSize: "13px", fontFamily: '"IBM Plex Sans", sans-serif', color: "var(--text-secondary)" }}>
                      {foundEquipment.model} — {foundEquipment.brand}
                    </p>
                  </div>
                  <div>
                    <label style={{ ...labelStyle, color: "var(--text-muted)" }}>Tipo de Gas</label>
                    <p style={{ margin: 0, fontSize: "13px", fontFamily: '"Space Mono", monospace', color: "var(--accent-primary)", fontWeight: 700 }}>
                      {foundEquipment.gasType}
                    </p>
                  </div>
                  <div>
                    <label style={{ ...labelStyle, color: "var(--text-muted)" }}>Carga estimada</label>
                    <p style={{ margin: 0, fontSize: "13px", fontFamily: '"Roboto Mono", monospace', color: "var(--accent-primary)", fontWeight: 700 }}>
                      {foundEquipment.gasCharge} kg
                    </p>
                  </div>
                </div>
              ) : equipmentId.length > 0 ? (
                <div
                  style={{
                    padding: "16px",
                    background: "rgba(255,59,92,0.08)",
                    border: "1px solid var(--accent-danger)",
                    borderRadius: "4px",
                    marginBottom: "24px",
                  }}
                >
                  <p style={{ margin: 0, fontSize: "13px", fontFamily: '"IBM Plex Sans", sans-serif', color: "var(--accent-danger)" }}>
                    Equipo no encontrado. Verifica el ID e intenta de nuevo.
                  </p>
                </div>
              ) : null}

              <div
                style={{
                  padding: "14px 16px",
                  background: "rgba(0,150,255,0.08)",
                  border: "1px solid var(--accent-secondary)",
                  borderRadius: "4px",
                  marginBottom: "32px",
                }}
              >
                <p style={{ margin: 0, fontSize: "12px", fontFamily: '"IBM Plex Sans", sans-serif', color: "var(--accent-secondary)" }}>
                  💡 Ingresa un ID de la lista: EQ-001, EQ-004, EQ-007, EQ-010, EQ-017...
                </p>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  onClick={() => canProceedStep1 && setStep(2)}
                  style={{
                    height: "44px",
                    padding: "0 28px",
                    background: canProceedStep1 ? "var(--accent-primary)" : "var(--surface-elevated)",
                    color: canProceedStep1 ? "var(--bg-base)" : "var(--text-muted)",
                    border: "none",
                    borderRadius: "0",
                    fontSize: "13px",
                    fontFamily: '"Space Mono", monospace',
                    fontWeight: 700,
                    cursor: canProceedStep1 ? "pointer" : "not-allowed",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  Siguiente <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 2 ──────────────────────────────────────────────────────── */}
          {step === 2 && (
            <div
              style={{
                background: "var(--surface-card)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "6px",
                padding: "32px",
              }}
            >
              <h2
                style={{
                  margin: "0 0 6px 0",
                  fontSize: "18px",
                  fontFamily: '"Space Mono", monospace',
                  color: "var(--text-primary)",
                }}
              >
                Detalles de recuperación
              </h2>
              <p
                style={{
                  margin: "0 0 28px 0",
                  fontSize: "13px",
                  fontFamily: '"IBM Plex Sans", sans-serif',
                  color: "var(--text-muted)",
                }}
              >
                Equipo: <span style={{ color: "var(--accent-primary)", fontFamily: '"Space Mono", monospace' }}>{equipmentId}</span>
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                {/* Technician */}
                <div>
                  <label style={labelStyle}>Nombre del técnico</label>
                  <input
                    value={techName}
                    onChange={(e) => setTechName(e.target.value)}
                    onFocus={() => setFocusedField("tech")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Ej. Carlos Mendoza"
                    style={inputStyle(focusedField === "tech")}
                  />
                </div>

                {/* Cert number */}
                <div>
                  <label style={labelStyle}>Número de certificación</label>
                  <input
                    value={certNum}
                    onChange={(e) => setCertNum(e.target.value)}
                    onFocus={() => setFocusedField("cert")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="CERT-NOM-XXXXXX"
                    style={inputStyle(focusedField === "cert")}
                  />
                </div>

                {/* Recovery serial */}
                <div>
                  <label style={labelStyle}>Serie del equipo recuperador</label>
                  <input
                    value={recoverySerial}
                    onChange={(e) => setRecoverySerial(e.target.value)}
                    onFocus={() => setFocusedField("serial")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="REC-MX-XXXX"
                    style={inputStyle(focusedField === "serial")}
                  />
                </div>

                {/* Gas KG */}
                <div>
                  <label style={labelStyle}>Gas recuperado (kg)</label>
                  <input
                    type="number"
                    value={gasKg}
                    onChange={(e) => setGasKg(e.target.value)}
                    onFocus={() => setFocusedField("gaskg")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="0.00"
                    step="0.01"
                    style={{
                      ...inputStyle(focusedField === "gaskg"),
                      fontSize: "24px",
                      fontFamily: '"Space Mono", monospace',
                      fontWeight: 700,
                      color: "var(--accent-primary)",
                    }}
                  />
                </div>
              </div>

              {/* Gas condition radio */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ ...labelStyle, marginBottom: "10px" }}>Condición del gas</label>
                <div style={{ display: "flex", gap: "12px" }}>
                  {[
                    { value: "reusable", label: "Reutilizable" },
                    { value: "treatment", label: "Requiere Tratamiento" },
                    { value: "destroy", label: "Destrucción" },
                  ].map((opt) => {
                    const selected = gasCondition === opt.value;
                    return (
                      <label
                        key={opt.value}
                        style={{
                          flex: 1,
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          padding: "12px 16px",
                          background: selected ? "rgba(0,229,160,0.08)" : "var(--surface-card)",
                          border: `1px solid ${selected ? "var(--accent-primary)" : "var(--border-active)"}`,
                          borderRadius: "0",
                          cursor: "pointer",
                          transition: "all 0.15s",
                        }}
                        onClick={() => setGasCondition(opt.value as typeof gasCondition)}
                      >
                        <div
                          style={{
                            width: "16px",
                            height: "16px",
                            borderRadius: "50%",
                            border: `2px solid ${selected ? "var(--accent-primary)" : "var(--border-active)"}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          {selected && (
                            <div
                              style={{
                                width: "8px",
                                height: "8px",
                                borderRadius: "50%",
                                background: "var(--accent-primary)",
                              }}
                            />
                          )}
                        </div>
                        <span
                          style={{
                            fontSize: "12px",
                            fontFamily: '"IBM Plex Sans", sans-serif',
                            color: selected ? "var(--accent-primary)" : "var(--text-secondary)",
                            fontWeight: selected ? 500 : 400,
                          }}
                        >
                          {opt.label}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Destination center */}
              <div style={{ marginBottom: "20px" }}>
                <label style={labelStyle}>Centro de destino certificado</label>
                <select
                  value={destinationCenter}
                  onChange={(e) => setDestinationCenter(e.target.value)}
                  style={{
                    width: "100%",
                    height: "44px",
                    background: "var(--bg-base)",
                    border: `1px solid ${destinationCenter ? "var(--accent-primary)" : "var(--border-active)"}`,
                    borderRadius: "0",
                    padding: "0 14px",
                    color: destinationCenter ? "var(--text-primary)" : "var(--text-muted)",
                    fontSize: "14px",
                    fontFamily: '"IBM Plex Sans", sans-serif',
                    outline: "none",
                    cursor: "pointer",
                    boxSizing: "border-box",
                  }}
                >
                  <option value="" style={{ background: "var(--surface-elevated)" }}>
                    — Selecciona un centro —
                  </option>
                  {authorizedCenters.map((center) => (
                    <option
                      key={center.id}
                      value={center.name}
                      style={{ background: "var(--surface-elevated)" }}
                    >
                      {center.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Photo upload */}
              <div style={{ marginBottom: "32px" }}>
                <label style={labelStyle}>Fotografías del equipo</label>
                <div
                  style={{
                    border: "1px dashed var(--border-active)",
                    borderRadius: "4px",
                    padding: "32px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "12px",
                    cursor: "pointer",
                    background: "var(--bg-base)",
                    transition: "border-color 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.borderColor = "var(--accent-primary)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.borderColor = "var(--border-active)")
                  }
                >
                  <Upload size={28} strokeWidth={1.5} style={{ color: "var(--text-muted)" }} />
                  <span
                    style={{
                      fontSize: "13px",
                      fontFamily: '"IBM Plex Sans", sans-serif',
                      color: "var(--text-muted)",
                    }}
                  >
                    Subir fotos del equipo
                  </span>
                  <span
                    style={{
                      fontSize: "11px",
                      fontFamily: '"IBM Plex Sans", sans-serif',
                      color: "var(--text-muted)",
                    }}
                  >
                    JPG, PNG — hasta 10 MB
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button
                  onClick={() => setStep(1)}
                  style={{
                    height: "44px",
                    padding: "0 24px",
                    background: "transparent",
                    color: "var(--text-secondary)",
                    border: "1px solid var(--border-active)",
                    borderRadius: "0",
                    fontSize: "13px",
                    fontFamily: '"IBM Plex Sans", sans-serif',
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <ChevronLeft size={16} /> Anterior
                </button>
                <button
                  onClick={() => canProceedStep2 && setStep(3)}
                  style={{
                    height: "44px",
                    padding: "0 28px",
                    background: canProceedStep2 ? "var(--accent-primary)" : "var(--surface-elevated)",
                    color: canProceedStep2 ? "var(--bg-base)" : "var(--text-muted)",
                    border: "none",
                    borderRadius: "0",
                    fontSize: "13px",
                    fontFamily: '"Space Mono", monospace',
                    fontWeight: 700,
                    cursor: canProceedStep2 ? "pointer" : "not-allowed",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  Siguiente <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3 ──────────────────────────────────────────────────────── */}
          {step === 3 && (
            <div
              style={{
                background: "var(--surface-card)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "6px",
                padding: "32px",
              }}
            >
              <h2
                style={{
                  margin: "0 0 6px 0",
                  fontSize: "18px",
                  fontFamily: '"Space Mono", monospace',
                  color: "var(--text-primary)",
                }}
              >
                Documentación legal
              </h2>
              <p
                style={{
                  margin: "0 0 28px 0",
                  fontSize: "13px",
                  fontFamily: '"IBM Plex Sans", sans-serif',
                  color: "var(--text-muted)",
                }}
              >
                Completa los números de manifiesto y firma para certificar el retiro.
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px" }}>
                <div>
                  <label style={labelStyle}>No. Manifiesto SEMARNAT</label>
                  <input
                    value={semarnatNum}
                    onChange={(e) => setSemarnatNum(e.target.value)}
                    onFocus={() => setFocusedField("sema")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="SEMA-2024-MX-XXXXX"
                    style={inputStyle(focusedField === "sema")}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Registro RETC</label>
                  <input
                    value={retcNum}
                    onChange={(e) => setRetcNum(e.target.value)}
                    onFocus={() => setFocusedField("retc")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="RETC-2024-XXX-XX"
                    style={inputStyle(focusedField === "retc")}
                  />
                </div>
              </div>

              {/* Signature pad */}
              <div style={{ marginBottom: "24px" }}>
                <label style={labelStyle}>Firma digital</label>
                <div
                  style={{
                    background: "var(--surface-elevated)",
                    border: "1px dashed var(--border-active)",
                    borderRadius: "4px",
                    height: "120px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: "13px",
                      fontFamily: '"IBM Plex Sans", sans-serif',
                      color: "var(--text-muted)",
                    }}
                  >
                    Firma digital aquí
                  </span>
                </div>
              </div>

              {/* Certificate preview */}
              <div
                style={{
                  background: "var(--surface-card)",
                  border: "1px solid var(--border-active)",
                  borderRadius: "4px",
                  padding: "20px",
                  marginBottom: "32px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                  <FileCheck size={18} style={{ color: "var(--accent-primary)" }} strokeWidth={1.75} />
                  <h3
                    style={{
                      margin: 0,
                      fontSize: "13px",
                      fontFamily: '"Space Mono", monospace',
                      color: "var(--accent-primary)",
                    }}
                  >
                    Vista previa del certificado
                  </h3>
                  <div
                    style={{
                      marginLeft: "auto",
                      padding: "3px 10px",
                      background: "rgba(0,229,160,0.1)",
                      border: "1px solid var(--accent-primary)",
                      borderRadius: "2px",
                      fontSize: "10px",
                      fontFamily: '"Space Mono", monospace',
                      color: "var(--accent-primary)",
                    }}
                  >
                    SEMARNAT CERT.
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  {[
                    { label: "Equipo ID", value: equipmentId || "—" },
                    { label: "Técnico", value: techName || "—" },
                    { label: "Gas recuperado", value: gasKg ? `${gasKg} kg` : "—" },
                    { label: "Condición", value: gasCondition || "—" },
                    { label: "Centro destino", value: destinationCenter ? destinationCenter.split("—")[0] : "—" },
                    { label: "Manifiesto", value: semarnatNum || "—" },
                  ].map((item) => (
                    <div key={item.label} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "6px" }}>
                      <span style={{ fontSize: "11px", fontFamily: '"IBM Plex Sans", sans-serif', color: "var(--text-muted)" }}>
                        {item.label}
                      </span>
                      <span style={{ fontSize: "11px", fontFamily: '"Space Mono", monospace', color: "var(--text-secondary)" }}>
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button
                  onClick={() => setStep(2)}
                  style={{
                    height: "44px",
                    padding: "0 24px",
                    background: "transparent",
                    color: "var(--text-secondary)",
                    border: "1px solid var(--border-active)",
                    borderRadius: "0",
                    fontSize: "13px",
                    fontFamily: '"IBM Plex Sans", sans-serif',
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <ChevronLeft size={16} /> Anterior
                </button>
                <button
                  style={{
                    height: "56px",
                    padding: "0 40px",
                    background: "var(--accent-primary)",
                    color: "var(--bg-base)",
                    border: "none",
                    borderRadius: "0",
                    fontSize: "14px",
                    fontFamily: '"Space Mono", monospace',
                    fontWeight: 700,
                    cursor: "pointer",
                    letterSpacing: "0.04em",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.opacity = "0.88")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.opacity = "1")
                  }
                >
                  Finalizar y Certificar
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
