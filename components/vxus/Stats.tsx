"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

function Counter({ end, suffix = "", prefix = "", decimals = 0 }: {
  end: number; suffix?: string; prefix?: string; decimals?: number;
}) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  useEffect(() => {
    if (!inView) return;
    const duration = 2200;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const t = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setVal(end * ease);
      if (t < 1) requestAnimationFrame(tick);
      else setVal(end);
    };
    requestAnimationFrame(tick);
  }, [inView, end]);

  return (
    <span ref={ref}>
      {prefix}{decimals > 0 ? val.toFixed(decimals) : Math.floor(val).toLocaleString()}{suffix}
    </span>
  );
}

const STATS = [
  { value: 500,  suffix: "M+",   label: "API calls today",         accent: "#7C5AF3" },
  { value: 99.99,suffix: "%",    label: "Uptime SLA",              accent: "#00E5A0", decimals: 2 },
  { value: 48,   suffix: "ms",   label: "Average response time",   accent: "#00CFFF" },
  { value: 10000,suffix: "+",    label: "Enterprise deployments",  accent: "#A68FFF" },
];

export default function Stats() {
  return (
    <section className="py-20 px-6 lg:px-10 relative overflow-hidden">
      {/* Background stripe */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to bottom, rgba(7,6,26,0), rgba(7,6,26,0.6), rgba(7,6,26,0))",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      />

      <div className="container relative">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-5%" }}
              transition={{ duration: 0.7, delay: i * 0.12, ease: [0.23, 1, 0.32, 1] }}
            >
              <div
                className="text-4xl lg:text-5xl font-bold mb-2 tabular-nums"
                style={{
                  fontFamily: "var(--font-syne)",
                  background: `linear-gradient(135deg, ${s.accent}, #EDE9FF)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                <Counter end={s.value} suffix={s.suffix} decimals={s.decimals ?? 0} />
              </div>
              <div className="label" style={{ color: "rgba(237,233,255,0.35)" }}>{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
