"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

export function useCounter(
  end: number,
  duration: number = 2000,
  decimals: number = 0,
  prefix: string = "",
  suffix: string = ""
) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const startedRef = useRef(false);

  useEffect(() => {
    if (!isInView || startedRef.current) return;
    startedRef.current = true;

    const startTime = performance.now();
    const startValue = 0;

    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = startValue + (end - startValue) * easeOut(progress);
      setValue(parseFloat(current.toFixed(decimals)));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [isInView, end, duration, decimals]);

  const formatted = decimals > 0 ? value.toFixed(decimals) : Math.floor(value).toLocaleString();

  return { ref, display: `${prefix}${formatted}${suffix}` };
}
