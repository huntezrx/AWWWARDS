"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import SectionLabel from "../ui/SectionLabel";
import TextReveal from "../ui/TextReveal";

const STEPS = [
  {
    n: "01",
    title: "Discovery Sprint",
    duration: "Day 1–2",
    desc: "We go deep into your brand, audience, and goals. Competitive audit, moodboard, and a signed scope before we touch the keyboard.",
    accent: "#6366f1",
    deliverable: "Strategy doc + moodboard",
  },
  {
    n: "02",
    title: "Architecture & Design",
    duration: "Day 3–7",
    desc: "Figma-first design with real content, not lorem ipsum. Component library, motion system, and interactive prototype — all reviewed live with you.",
    accent: "#8b5cf6",
    deliverable: "Figma prototype + motion spec",
  },
  {
    n: "03",
    title: "Production Build",
    duration: "Day 8–18",
    desc: "Next.js App Router, custom shaders, GSAP timelines. We build exactly what was designed — pixel perfect, animation perfect, performance perfect.",
    accent: "#06b6d4",
    deliverable: "Production-ready code",
  },
  {
    n: "04",
    title: "QA & Polish",
    duration: "Day 19–24",
    desc: "Cross-browser, cross-device, cross-speed-connection testing. Every interaction reviewed. Lighthouse scores verified. Edge cases hunted down.",
    accent: "#ec4899",
    deliverable: "Lighthouse 99 + QA report",
  },
  {
    n: "05",
    title: "Launch & Handoff",
    duration: "Day 25–28",
    desc: "Staged deploy, DNS cutover, monitoring setup. Full source handoff with a 1-hour walkthrough so your team is never lost.",
    accent: "#10b981",
    deliverable: "Live site + source code",
  },
];

function TimelineStep({ step, index, totalSteps, scrollProgress }: {
  step: typeof STEPS[0];
  index: number;
  totalSteps: number;
  scrollProgress: import("framer-motion").MotionValue<number>;
}) {
  // Each step activates as scroll passes through its range
  const start = (index - 0.3) / totalSteps;
  const end   = (index + 0.5) / totalSteps;
  const opacity = useTransform(scrollProgress, [Math.max(0, start), end], [0.25, 1]);
  const lineH   = useTransform(scrollProgress, [start, end], ["0%", "100%"]);

  return (
    <motion.div
      className="relative grid grid-cols-[80px_1fr] md:grid-cols-[120px_1fr] gap-6 md:gap-10 pb-14"
      style={{ opacity }}
    >
      {/* Left: number + line */}
      <div className="flex flex-col items-center">
        {/* Step number */}
        <motion.div
          className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shrink-0 mb-3 relative"
          style={{
            background: `${step.accent}15`,
            border: `1px solid ${step.accent}35`,
          }}
          whileInView={{ scale: [0.8, 1.1, 1] }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <span className="label text-[10px]" style={{ color: step.accent }}>{step.n}</span>
          {/* Glow dot */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ background: `${step.accent}20` }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 3, repeat: Infinity, delay: index * 0.3 }}
          />
        </motion.div>

        {/* Vertical line — animated fill */}
        {index < totalSteps - 1 && (
          <div className="relative w-px flex-1 bg-white/[0.05] overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 w-full origin-top"
              style={{ background: step.accent, height: lineH }}
            />
          </div>
        )}
      </div>

      {/* Right: content */}
      <motion.div
        className="pb-2"
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-5%" }}
        transition={{ duration: 0.8, delay: index * 0.1, ease: [0.23, 1, 0.32, 1] }}
      >
        {/* Duration badge */}
        <span
          className="label text-[9px] px-2.5 py-1 rounded-full mb-3 inline-block"
          style={{ background: `${step.accent}12`, color: step.accent, border: `1px solid ${step.accent}25` }}
        >
          {step.duration}
        </span>

        <h3 className="heading-xl text-white/88 mb-2">{step.title}</h3>
        <p className="body-base text-white/38 mb-4 max-w-lg">{step.desc}</p>

        {/* Deliverable */}
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <span className="text-[11px]" style={{ color: step.accent }}>✓</span>
          <span className="body-sm text-white/40">{step.deliverable}</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Timeline() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.3"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-3%", "3%"]);

  return (
    <section ref={ref} className="section relative overflow-hidden" style={{ background: "var(--bg)" }}>
      {/* Bg */}
      <motion.div className="absolute inset-0 pointer-events-none" style={{ y: bgY }}>
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 w-[400px] h-[600px] opacity-[0.07]"
          style={{ background: "radial-gradient(ellipse, #6366f1, transparent 70%)", filter: "blur(80px)" }}
        />
      </motion.div>

      <div className="container relative">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.8fr] gap-16 items-start">
          {/* Header */}
          <div className="lg:sticky lg:top-24">
            <SectionLabel>Process</SectionLabel>
            <TextReveal
              text="28 days from hello to live."
              className="display-md text-white/90 mb-5"
            />
            <motion.p
              className="body-base text-white/38"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              We don&apos;t do 6-month timelines. We sprint, we ship, we celebrate together.
            </motion.p>
          </div>

          {/* Steps */}
          <div className="pt-2">
            {STEPS.map((s, i) => (
              <TimelineStep
                key={s.n}
                step={s}
                index={i}
                totalSteps={STEPS.length}
                scrollProgress={scrollYProgress}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
