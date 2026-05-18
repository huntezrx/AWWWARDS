"use client";

import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import dynamic from "next/dynamic";

const LiquidCanvas = dynamic(() => import("./LiquidCanvas"), { ssr: false });

/* Floating metric card */
function MetricCard({
  value, label, delay, x, y,
}: { value: string; label: string; delay: number; x: string; y: string }) {
  return (
    <motion.div
      className="absolute glass-card trim-top rounded-2xl px-5 py-3.5 hidden lg:flex flex-col gap-0.5 select-none"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 1, ease: [0.23, 1, 0.32, 1] }}
    >
      <span className="text-xl font-semibold" style={{ fontFamily: "var(--font-syne)", color: "#EDE9FF" }}>
        {value}
      </span>
      <span className="label" style={{ color: "rgba(237,233,255,0.38)" }}>{label}</span>
    </motion.div>
  );
}

/* Animated typing demo card */
function DemoCard() {
  const lines = [
    { role: "user",      text: "Analyze Q3 revenue trends and generate executive summary" },
    { role: "assistant", text: "Analyzing 847,293 data points across 12 dimensions..." },
    { role: "assistant", text: "Revenue grew 34.2% YoY with peak performance in APAC..." },
  ];

  return (
    <motion.div
      className="absolute right-0 top-1/2 -translate-y-1/2 w-[340px] xl:w-[400px] hidden xl:block"
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.2, duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
    >
      <div className="glass-card trim-top rounded-2xl overflow-hidden">
        {/* Terminal header */}
        <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/[0.06]">
          <div className="flex gap-1.5">
            {["#FF5F57","#FEBC2E","#28C840"].map(c => (
              <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c, opacity: 0.7 }} />
            ))}
          </div>
          <span className="mono ml-2" style={{ color: "rgba(237,233,255,0.3)" }}>vxus-intelligence.ai</span>
        </div>

        {/* Chat content */}
        <div className="p-5 flex flex-col gap-4">
          {lines.map((l, i) => (
            <motion.div
              key={i}
              className="flex gap-3"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6 + i * 0.4, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            >
              <div
                className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold mt-0.5"
                style={{
                  background: l.role === "user"
                    ? "rgba(124,90,243,0.2)"
                    : "rgba(0,207,255,0.12)",
                  color: l.role === "user" ? "#A68FFF" : "#00CFFF",
                  border: `1px solid ${l.role === "user" ? "rgba(124,90,243,0.3)" : "rgba(0,207,255,0.25)"}`,
                }}
              >
                {l.role === "user" ? "U" : "AI"}
              </div>
              <p
                className="text-xs leading-relaxed"
                style={{ color: l.role === "user" ? "rgba(237,233,255,0.6)" : "rgba(237,233,255,0.88)" }}
              >
                {l.text}
              </p>
            </motion.div>
          ))}

          {/* Cursor blink */}
          <motion.div
            className="flex gap-3 items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.2 }}
          >
            <div className="w-6 h-6 rounded-full" style={{ background: "rgba(0,207,255,0.12)", border: "1px solid rgba(0,207,255,0.25)" }} />
            <motion.div
              className="h-4 w-0.5 rounded-full"
              style={{ background: "#00CFFF" }}
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </motion.div>
        </div>

        {/* Status bar */}
        <div className="px-5 py-3 border-t border-white/[0.04] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <motion.div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "#00E5A0" }}
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="mono" style={{ color: "rgba(237,233,255,0.3)" }}>GPT-5 connected</span>
          </div>
          <span className="mono" style={{ color: "rgba(0,207,255,0.5)" }}>42ms</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const contentO = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const bgScale  = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  return (
    <section
      ref={ref}
      id="top"
      className="relative min-h-[100dvh] flex items-center overflow-hidden"
    >
      {/* Liquid shader background */}
      <motion.div className="absolute inset-0" style={{ scale: bgScale }}>
        <LiquidCanvas />
        {/* Gradient overlay to blend into page */}
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 80% 60% at 50% 40%, transparent 20%, rgba(3,2,14,0.6) 70%, rgba(3,2,14,0.95) 100%)",
          }}
        />
      </motion.div>

      {/* Floating ambient orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 600, height: 600,
            left: "60%", top: "10%",
            background: "radial-gradient(circle, rgba(124,90,243,0.1) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
          animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.85, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 400, height: 400,
            left: "5%", top: "40%",
            background: "radial-gradient(circle, rgba(0,207,255,0.06) 0%, transparent 70%)",
            filter: "blur(50px)",
          }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>

      {/* Content */}
      <motion.div
        className="container relative z-10 flex items-center"
        style={{ y: contentY, opacity: contentO }}
      >
        <div className="max-w-3xl xl:max-w-2xl">
          {/* Eyebrow pill */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="pill pill-violet mb-8 inline-flex">
              <motion.span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: "#A68FFF" }}
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              Now with GPT-5 Intelligence Engine
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="display-1 mb-6"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.23, 1, 0.32, 1] }}
          >
            <span style={{ color: "#EDE9FF" }}>Intelligence,</span>
            <br />
            <span className="gradient-text">Redefined.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-lg md:text-xl leading-relaxed mb-10 max-w-xl"
            style={{ color: "rgba(237,233,255,0.52)" }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: [0.23, 1, 0.32, 1] }}
          >
            The AI platform built for enterprises that refuse to compromise.
            Process, analyze, and act on intelligence at the speed of thought.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-wrap gap-4 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8, ease: [0.23, 1, 0.32, 1] }}
          >
            <button className="btn-primary">
              Start for free
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2.5 7h9M8 3.5L11.5 7 8 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="btn-ghost flex items-center gap-3">
              <motion.div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
                whileHover={{ scale: 1.1, background: "rgba(124,90,243,0.15)" }}
              >
                <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor">
                  <path d="M0 0l10 6-10 6V0z" />
                </svg>
              </motion.div>
              Watch demo
            </button>
          </motion.div>

          {/* Bottom stats row */}
          <motion.div
            className="flex flex-wrap gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 1 }}
          >
            {[
              { v: "500M+",  l: "tokens / day" },
              { v: "<50ms",  l: "avg latency" },
              { v: "99.99%", l: "uptime SLA" },
              { v: "SOC 2",  l: "certified" },
            ].map(({ v, l }) => (
              <div key={l} className="flex flex-col gap-0.5">
                <span
                  className="text-xl font-semibold"
                  style={{ fontFamily: "var(--font-syne)", color: "#EDE9FF" }}
                >
                  {v}
                </span>
                <span className="label" style={{ color: "rgba(237,233,255,0.35)" }}>{l}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Demo card — right side */}
        <div className="relative flex-1">
          <DemoCard />
        </div>
      </motion.div>

      {/* Floating metric cards */}
      <MetricCard value="10K+"     label="Enterprise clients"  delay={1.4} x="68%" y="18%" />
      <MetricCard value="↑ 340%"   label="Productivity gain"   delay={1.6} x="72%" y="72%" />

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <span className="label" style={{ color: "rgba(237,233,255,0.22)" }}>Scroll</span>
        <div className="w-px h-12 overflow-hidden relative" style={{ background: "rgba(255,255,255,0.1)" }}>
          <motion.div
            className="absolute top-0 left-0 w-full"
            style={{ background: "linear-gradient(to bottom, #7C5AF3, #00CFFF)" }}
            animate={{ height: ["0%","100%"], top: ["0%","100%"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>

      {/* Bottom fade into page */}
      <div
        className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, var(--vx-black))" }}
      />
    </section>
  );
}
