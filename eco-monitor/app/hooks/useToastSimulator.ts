"use client";
import { useEffect } from "react";
import { toast } from "sonner";

const toastMessages: Array<() => void> = [
  () => toast.warning("Equipo VF-2291 — Integridad de gas bajo 30%"),
  () => toast.success("12 equipos procesados en Centro Apodaca"),
  () => toast.error("Alerta crítica: Equipo GD-1923 supera vida útil"),
  () => toast.info("Nuevo retiro programado — Walmart Guadalupe"),
  () => toast.success("Certificado ESG generado — Lote #2024-441"),
  () => toast.warning("Centro Guadalupe al 85% de capacidad"),
  () => toast.info("Técnico R. González completó 8 retiros hoy"),
  () => toast.success("38.4 ton CO₂e evitadas este mes"),
];

export function useToastSimulator() {
  useEffect(() => {
    // First toast after 5 seconds
    const initialTimer = setTimeout(() => {
      const fn = toastMessages[Math.floor(Math.random() * toastMessages.length)];
      fn();
    }, 5000);

    // Subsequent toasts every 15 seconds
    const interval = setInterval(() => {
      const fn = toastMessages[Math.floor(Math.random() * toastMessages.length)];
      fn();
    }, 15000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);
}
