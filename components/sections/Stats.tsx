"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useCounter } from "@/hooks/useCounter";

const STATS = [
  { end: 340,  suffix: "%", label: "Avg. conversion lift",      sub: "across all projects" },
  { end: 99,   suffix: "",  label: "Lighthouse score",          sub: "on every delivery" },
  { end: 200,  suffix: "+", label: "Premium projects shipped",  sub: "since 2012" },
  { end: 4.9,  suffix: "",  label: "Client satisfaction",       sub: "out of 5.0", decimals: 1 },
];

function StatItem({ stat, index }: { stat: typeof STATS[0]; index: number }) {
  const { ref, display } = useCounter(stat.end, 2200, stat.decimals ?? 0, "", stat.suffix);

  return (
    <motion.div
      className="relative group"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 0.9, delay: index * 0.1, ease: [0.23, 1, 0.32, 1] }}
    >
      {/* Vertical separator */}
      {index !== 0 && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-16 bg-gradient-to-b from-transparent via-white/8 to-transparent hidden md:block" />
      )}

      <div className="px-8 py-2 text-center md:text-left">
        {/* Number */}
        <div className="flex items-end gap-1 justify-center md:justify-start mb-2">
          <span
            ref={ref}
            className="display-xl gradient-text tabular-nums"
            style={{ lineHeight: 1 }}
          >
            {display}
          </span>
        </div>

        {/* Label */}
        <p className="body-base text-white/70 font-light mb-0.5">{stat.label}</p>
        <p className="body-sm text-white/28">{stat.sub}</p>
      </div>

      {/* Hover glow */}
      <motion.div
        className="absolute inset-0 rounded-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: "radial-gradient(circle at 50% 60%, rgba(99,102,241,0.06), transparent 70%)" }}
      />
    </motion.div>
  );
}

export default function Stats() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-3%", "3%"]);

  return (
    <section ref={ref} className="section-sm relative overflow-hidden" style={{ background: "var(--bg)" }}>
      {/* Grid background */}
      <div className="absolute inset-0 grid-pattern opacity-40 pointer-events-none" />

      {/* Radial glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ y }}
      >
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] opacity-[0.12]"
          style={{
            background: "radial-gradient(ellipse, rgba(99,102,241,1) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
      </motion.div>

      <div className="container relative">
        {/* Divider top */}
        <div className="divider mb-12 md:mb-16" />

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-0">
          {STATS.map((s, i) => <StatItem key={s.label} stat={s} index={i} />)}
        </div>

        {/* Divider bottom */}
        <div className="divider mt-12 md:mt-16" />
      </div>
    </section>
  );
}
