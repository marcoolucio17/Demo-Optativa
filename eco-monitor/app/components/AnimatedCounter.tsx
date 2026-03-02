"use client";
import { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
  target: number;
  duration?: number; // ms — used for initial 0→target animation
  decimals?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function AnimatedCounter({
  target,
  duration = 2000,
  decimals = 0,
  className,
  style,
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const prevTargetRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const startValue = prevTargetRef.current;
    prevTargetRef.current = target;

    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);

    // Initial animation: full duration. Incremental updates: shorter.
    const actualDuration = startValue === 0 ? duration : 600;

    let startTime: number | null = null;
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

    const animate = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / actualDuration, 1);
      const eased = easeOut(progress);
      const current = startValue + (target - startValue) * eased;
      setDisplayValue(current);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(target);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration]);

  const formatted =
    decimals > 0
      ? displayValue.toFixed(decimals)
      : Math.round(displayValue).toLocaleString();

  return (
    <span className={className} style={style}>
      {formatted}
    </span>
  );
}
