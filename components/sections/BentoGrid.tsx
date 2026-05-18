"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import TextReveal from "../ui/TextReveal";

const bentoItems = [
  {
    id: 1,
    title: "Performance First",
    subtitle: "99 Lighthouse",
    description: "Every millisecond matters. We obsess over Core Web Vitals.",
    cols: "md:col-span-2",
    rows: "md:row-span-2",
    gradient: "from-indigo-600/20 via-violet-600/10 to-transparent",
    accent: "#6366f1",
    icon: "⚡",
    large: true,
  },
  {
    id: 2,
    title: "3D Immersive",
    subtitle: "WebGL Powered",
    description: "Real-time 3D that runs buttery smooth.",
    cols: "md:col-span-1",
    rows: "md:row-span-1",
    gradient: "from-cyan-600/20 via-blue-600/10 to-transparent",
    accent: "#06b6d4",
    icon: "⬡",
    large: false,
  },
  {
    id: 3,
    title: "Motion Design",
    subtitle: "60fps Always",
    description: "Choreographed animations that feel alive.",
    cols: "md:col-span-1",
    rows: "md:row-span-1",
    gradient: "from-violet-600/20 via-purple-600/10 to-transparent",
    accent: "#8b5cf6",
    icon: "◊",
    large: false,
  },
  {
    id: 4,
    title: "Accessibility",
    subtitle: "WCAG AA",
    description: "Beautiful design that works for everyone.",
    cols: "md:col-span-1",
    rows: "md:row-span-1",
    gradient: "from-emerald-600/20 via-teal-600/10 to-transparent",
    accent: "#10b981",
    icon: "◈",
    large: false,
  },
  {
    id: 5,
    title: "Premium Brand Identity",
    subtitle: "Visual Systems",
    description: "Cohesive design systems that scale beautifully across every touchpoint.",
    cols: "md:col-span-2",
    rows: "md:row-span-1",
    gradient: "from-pink-600/20 via-rose-600/10 to-transparent",
    accent: "#ec4899",
    icon: "✦",
    large: false,
  },
];

function BentoCard({
  item,
  index,
}: {
  item: (typeof bentoItems)[0];
  index: number;
}) {
  return (
    <motion.div
      className={`relative ${item.cols} ${item.rows} group cursor-none`}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-5%" }}
      transition={{
        duration: 0.8,
        delay: index * 0.1,
        ease: [0.23, 1, 0.32, 1],
      }}
      whileHover={{ scale: 1.02, transition: { duration: 0.4 } }}
    >
      <div className="relative h-full min-h-[160px] rounded-3xl overflow-hidden glass border border-white/5 group-hover:border-white/10 transition-all duration-500">
        {/* Gradient background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-60 group-hover:opacity-100 transition-opacity duration-500`} />

        {/* Animated glow on hover */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${item.accent}20 0%, transparent 70%)`,
          }}
        />

        {/* Corner accent */}
        <div
          className="absolute top-0 right-0 w-24 h-24 opacity-20 group-hover:opacity-40 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at 100% 0%, ${item.accent} 0%, transparent 70%)`,
          }}
        />

        {/* Content */}
        <div className={`relative z-10 p-6 md:p-8 h-full flex flex-col ${item.large ? "justify-between" : "justify-between"}`}>
          <div className="flex items-start justify-between">
            <motion.span
              className="text-3xl"
              style={{ color: item.accent }}
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, delay: index * 0.5 }}
            >
              {item.icon}
            </motion.span>
            <span
              className="text-xs font-mono px-2 py-1 rounded-full"
              style={{
                background: `${item.accent}15`,
                color: item.accent,
                border: `1px solid ${item.accent}30`,
              }}
            >
              {item.subtitle}
            </span>
          </div>

          <div>
            <h3 className={`font-light text-white/90 mb-2 ${item.large ? "text-3xl md:text-4xl" : "text-xl md:text-2xl"}`}>
              {item.title}
            </h3>
            <p className={`text-white/40 font-light leading-relaxed ${item.large ? "text-base" : "text-sm"}`}>
              {item.description}
            </p>
          </div>
        </div>

        {/* Shimmer on hover */}
        <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl" />
      </div>
    </motion.div>
  );
}

export default function BentoGrid() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-3%", "3%"]);

  return (
    <section
      ref={ref}
      className="relative py-32 md:py-48 overflow-hidden"
      style={{ background: "#020206" }}
    >
      {/* Background */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ y }}
      >
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="mb-16 md:mb-20 max-w-2xl">
          <motion.div
            className="flex items-center gap-3 mb-6"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-8 h-px bg-indigo-500" />
            <span className="text-xs text-indigo-400/80 tracking-[0.4em] uppercase font-light">
              Capabilities
            </span>
          </motion.div>
          <TextReveal
            text="Everything you need to ship premium digital products."
            className="text-4xl md:text-5xl font-thin text-white/90 leading-tight"
          />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[200px]">
          {bentoItems.map((item, i) => (
            <BentoCard key={item.id} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
