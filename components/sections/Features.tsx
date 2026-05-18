"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import SectionLabel from "../ui/SectionLabel";
import TextReveal from "../ui/TextReveal";

const FEATURES = [
  {
    id: "perf",
    icon: "⚡",
    title: "Absurd Performance",
    desc: "Every kilobyte earns its place. Lazy loading, tree shaking, edge caching. Lighthouse 99 isn't a target — it's the floor.",
    tags: ["Core Web Vitals", "Edge Runtime", "ISR"],
    col: "md:col-span-2",
    accent: "#6366f1",
    metric: { v: "99", l: "Lighthouse" },
  },
  {
    id: "anim",
    icon: "◊",
    title: "GPU Motion",
    desc: "60fps animations driven by the GPU. Physics-based springs, custom GSAP timelines, and Three.js environments running butter smooth.",
    tags: ["GSAP", "Framer", "Three.js"],
    col: "md:col-span-1",
    accent: "#8b5cf6",
    metric: { v: "60fps", l: "Always" },
  },
  {
    id: "3d",
    icon: "⬡",
    title: "WebGL & Shaders",
    desc: "Custom GLSL shaders, post-processing pipelines, and real-time environments that make competitors look like websites from 2010.",
    tags: ["WebGL 2", "GLSL", "R3F"],
    col: "md:col-span-1",
    accent: "#06b6d4",
    metric: { v: "SOTD", l: "Awwwards" },
  },
  {
    id: "conv",
    icon: "✦",
    title: "Conversion by Design",
    desc: "Every micro-interaction, every line of copy, every CTA position is backed by psychology and data. Beauty that converts.",
    tags: ["CRO", "A/B Testing", "Heatmaps"],
    col: "md:col-span-1",
    accent: "#ec4899",
    metric: { v: "340%", l: "Avg. Lift" },
  },
  {
    id: "brand",
    icon: "◈",
    title: "Living Design Systems",
    desc: "Tokens, components, documentation. A design system so thorough your team can move 10× faster — and it always looks on-brand.",
    tags: ["Figma", "Tokens", "Storybook"],
    col: "md:col-span-2",
    accent: "#f59e0b",
    metric: { v: "∞", l: "Scale" },
  },
];

function FeatureCard({ feat, index }: { feat: typeof FEATURES[0]; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className={`relative ${feat.col} group cursor-none`}
      initial={{ opacity: 0, y: 28, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-5%" }}
      transition={{ duration: 0.8, delay: index * 0.08, ease: [0.23, 1, 0.32, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ scale: 1.015 }}
    >
      <div
        className="relative h-full min-h-[220px] rounded-[28px] p-7 md:p-8 overflow-hidden transition-all duration-500"
        style={{
          background: hovered
            ? `linear-gradient(135deg, ${feat.accent}10, rgba(255,255,255,0.02))`
            : "var(--surface)",
          border: `1px solid ${hovered ? feat.accent + "30" : "var(--border)"}`,
          boxShadow: hovered ? `0 20px 60px ${feat.accent}18, 0 0 0 1px ${feat.accent}20` : "none",
        }}
      >
        {/* Animated bg glow */}
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-[28px]"
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          style={{ background: `radial-gradient(circle at 20% 30%, ${feat.accent}15, transparent 60%)` }}
        />

        {/* Top corner accent */}
        <motion.div
          className="absolute top-0 right-0 w-24 h-24 rounded-bl-[80px] pointer-events-none"
          animate={{ opacity: hovered ? 1 : 0.3 }}
          transition={{ duration: 0.3 }}
          style={{ background: `radial-gradient(circle at 100% 0%, ${feat.accent}20, transparent 70%)` }}
        />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-between">
          <div>
            {/* Icon row */}
            <div className="flex items-start justify-between mb-5">
              <motion.span
                className="text-2xl"
                style={{ color: feat.accent }}
                animate={{ rotate: hovered ? [0, 8, -8, 0] : 0, scale: hovered ? 1.15 : 1 }}
                transition={{ duration: 0.5 }}
              >
                {feat.icon}
              </motion.span>

              {/* Metric pill */}
              <motion.div
                className="rounded-full px-3 py-1 flex items-center gap-2"
                style={{
                  background: `${feat.accent}12`,
                  border: `1px solid ${feat.accent}25`,
                }}
                animate={{ scale: hovered ? 1.05 : 1 }}
                transition={{ duration: 0.3 }}
              >
                <span className="text-xs font-medium tabular-nums" style={{ color: feat.accent }}>
                  {feat.metric.v}
                </span>
                <span className="label text-[9px]" style={{ color: `${feat.accent}80` }}>
                  {feat.metric.l}
                </span>
              </motion.div>
            </div>

            {/* Title */}
            <h3 className="heading-lg text-white/88 mb-3 transition-colors duration-300"
              style={{ color: hovered ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.85)" }}
            >
              {feat.title}
            </h3>

            {/* Desc */}
            <p className="body-sm text-white/38 transition-colors duration-300"
              style={{ color: hovered ? "rgba(255,255,255,0.52)" : "rgba(255,255,255,0.38)" }}
            >
              {feat.desc}
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-5">
            {feat.tags.map((tag) => (
              <motion.span
                key={tag}
                className="label text-[9px] px-2.5 py-1 rounded-full transition-all duration-400"
                style={{
                  background: hovered ? `${feat.accent}10` : "rgba(255,255,255,0.04)",
                  border: `1px solid ${hovered ? feat.accent + "25" : "rgba(255,255,255,0.06)"}`,
                  color: hovered ? feat.accent : "rgba(255,255,255,0.28)",
                }}
              >
                {tag}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Shimmer on hover */}
        <motion.div
          className="absolute inset-0 shimmer rounded-[28px] pointer-events-none"
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </motion.div>
  );
}

export default function Features() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);

  return (
    <section ref={ref} className="section relative overflow-hidden" style={{ background: "var(--bg)" }}>
      {/* Dot pattern */}
      <div className="absolute inset-0 dot-pattern opacity-30 pointer-events-none" />

      {/* Glow */}
      <motion.div className="absolute inset-0 pointer-events-none" style={{ y }}>
        <div
          className="absolute left-1/4 top-1/3 w-[600px] h-[600px] opacity-[0.07]"
          style={{ background: "radial-gradient(circle, #6366f1, transparent 70%)", filter: "blur(80px)" }}
        />
        <div
          className="absolute right-1/4 bottom-1/3 w-[400px] h-[400px] opacity-[0.06]"
          style={{ background: "radial-gradient(circle, #06b6d4, transparent 70%)", filter: "blur(60px)" }}
        />
      </motion.div>

      <div className="container relative">
        {/* Header */}
        <div className="max-w-2xl mb-14 md:mb-16">
          <SectionLabel>What makes us different</SectionLabel>
          <TextReveal
            text="Everything you need to ship something extraordinary."
            className="display-md text-white/90"
          />
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-auto">
          {FEATURES.map((f, i) => <FeatureCard key={f.id} feat={f} index={i} />)}
        </div>
      </div>
    </section>
  );
}
