"use client";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function LiveClock() {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const tick = () => {
      setTime(
        format(new Date(), "EEE dd MMM yyyy '—' HH:mm:ss", { locale: es })
      );
    };
    tick(); // run immediately
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!time) return null;

  return (
    <span
      style={{
        fontSize: "13px",
        fontFamily: '"IBM Plex Sans", sans-serif',
        color: "var(--text-secondary)",
        whiteSpace: "nowrap",
        letterSpacing: "0.01em",
      }}
    >
      {time}
    </span>
  );
}
