"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import TextReveal from "../ui/TextReveal";
import LiquidCard from "../ui/LiquidCard";

const projects = [
  {
    id: 1,
    title: "Nexus Platform",
    category: "Product Design",
    year: "2024",
    tags: ["UI/UX", "Branding", "Motion"],
    gradient: "radial-gradient(ellipse at 30% 40%, rgba(99,102,241,0.5) 0%, rgba(67,56,202,0.3) 40%, transparent 70%)",
    accent: "#6366f1",
    number: "01",
    metric: { value: "340%", label: "Conversion Lift" },
  },
  {
    id: 2,
    title: "Aurora Finance",
    category: "Web Application",
    year: "2024",
    tags: ["Dashboard", "Data Viz", "R3F"],
    gradient: "radial-gradient(ellipse at 70% 30%, rgba(6,182,212,0.5) 0%, rgba(8,145,178,0.3) 40%, transparent 70%)",
    accent: "#06b6d4",
    number: "02",
    metric: { value: "2.1M", label: "Users Onboarded" },
  },
  {
    id: 3,
    title: "Phantom AI",
    category: "Landing Page",
    year: "2024",
    tags: ["WebGL", "Shaders", "GSAP"],
    gradient: "radial-gradient(ellipse at 50% 60%, rgba(139,92,246,0.5) 0%, rgba(109,40,217,0.3) 40%, transparent 70%)",
    accent: "#8b5cf6",
    number: "03",
    metric: { value: "SOTD", label: "Awwwards" },
  },
  {
    id: 4,
    title: "Stellar Commerce",
    category: "E-Commerce",
    year: "2023",
    tags: ["Next.js", "3D", "Animation"],
    gradient: "radial-gradient(ellipse at 40% 70%, rgba(236,72,153,0.5) 0%, rgba(190,24,93,0.3) 40%, transparent 70%)",
    accent: "#ec4899",
    number: "04",
    metric: { value: "$4.2M", label: "Revenue in Month 1" },
  },
];

function ProjectCard({ project, index }: { project: (typeof projects)[0]; index: number }) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 1.1, delay: index * 0.12, ease: [0.23, 1, 0.32, 1] }}
    >
      <LiquidCard glowColor={`${project.accent}50`} className="w-full">
        <motion.div
          className="relative aspect-[16/10] overflow-hidden rounded-3xl"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {/* Background mesh */}
          <motion.div
            className="absolute inset-0"
            style={{ background: project.gradient }}
            animate={{ opacity: hovered ? 1 : 0.7 }}
            transition={{ duration: 0.5 }}
          />

          {/* Animated grid */}
          <motion.div
            className="absolute inset-0"
            animate={{ opacity: hovered ? 0.12 : 0.05 }}
            transition={{ duration: 0.4 }}
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)
              `,
              backgroundSize: "40px 40px",
            }}
          />

          {/* Floating orb parallax */}
          <motion.div style={{ y }}>
            <motion.div
              className="absolute w-80 h-80 rounded-full"
              style={{
                background: `radial-gradient(circle, ${project.accent}40 0%, transparent 70%)`,
                filter: "blur(50px)",
                right: "-5%",
                top: "-10%",
              }}
              animate={{ scale: hovered ? [1, 1.2, 1] : 1 }}
              transition={{ duration: 3, repeat: hovered ? Infinity : 0 }}
            />
          </motion.div>

          {/* Project number */}
          <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center pointer-events-none">
            <motion.span
              className="text-[120px] md:text-[160px] font-thin select-none leading-none"
              style={{ color: `${project.accent}12` }}
              animate={{ scale: hovered ? 1.05 : 1 }}
              transition={{ duration: 0.6 }}
            >
              {project.number}
            </motion.span>
          </div>

          {/* Top row */}
          <div className="absolute top-5 left-5 right-5 flex justify-between items-start">
            <motion.div
              className="flex gap-2"
              animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : -10 }}
              transition={{ duration: 0.4, staggerChildren: 0.05 }}
            >
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-2.5 py-1 rounded-full glass text-white/50 border border-white/[0.06]"
                >
                  {tag}
                </span>
              ))}
            </motion.div>

            {/* Metric badge */}
            <motion.div
              className="glass rounded-xl px-3 py-2 text-right"
              animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.85 }}
              transition={{ duration: 0.35 }}
            >
              <div className="text-lg font-light" style={{ color: project.accent }}>
                {project.metric.value}
              </div>
              <div className="text-[9px] text-white/30 tracking-wider">{project.metric.label}</div>
            </motion.div>
          </div>

          {/* Bottom content */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <motion.div
              animate={{ y: hovered ? -4 : 0 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            >
              <div className="flex items-end justify-between mb-3">
                <div>
                  <p className="text-[10px] text-white/25 tracking-[0.3em] uppercase mb-1.5">
                    {project.category} · {project.year}
                  </p>
                  <h3 className="text-2xl md:text-3xl font-light text-white/90">
                    {project.title}
                  </h3>
                </div>

                <motion.div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm"
                  style={{
                    background: hovered ? `${project.accent}25` : "rgba(255,255,255,0.04)",
                    border: `1px solid ${hovered ? project.accent + "50" : "rgba(255,255,255,0.06)"}`,
                    color: hovered ? project.accent : "rgba(255,255,255,0.4)",
                  }}
                  animate={{ rotate: hovered ? -45 : 0 }}
                  transition={{ duration: 0.4 }}
                >
                  ↗
                </motion.div>
              </div>

              {/* Progress line */}
              <div className="h-px bg-white/[0.06] relative overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 origin-left"
                  style={{ background: project.accent }}
                  animate={{ scaleX: hovered ? 1 : 0 }}
                  transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </LiquidCard>
    </motion.div>
  );
}

export default function Showcase() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  return (
    <section ref={ref} id="showcase" className="relative py-32 md:py-48 overflow-hidden" style={{ background: "#020206" }}>
      <motion.div
        className="absolute right-0 top-1/2 w-[500px] h-[500px] rounded-full opacity-[0.08] pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(99,102,241,0.8) 0%, transparent 70%)",
          filter: "blur(100px)",
          y: bgY,
        }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <motion.div
              className="flex items-center gap-3 mb-6"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="w-8 h-px bg-indigo-500" />
              <span className="text-xs text-indigo-400/80 tracking-[0.4em] uppercase font-light">Selected Work</span>
            </motion.div>
            <TextReveal
              text="Projects that push the boundaries of digital experience."
              className="text-4xl md:text-5xl font-thin text-white/90 max-w-xl leading-tight"
            />
          </div>
          <motion.a
            href="#"
            className="group flex items-center gap-3 text-xs text-white/30 hover:text-white/60 cursor-none shrink-0 tracking-[0.3em] uppercase"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            View All
            <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 2, repeat: Infinity }}>→</motion.span>
          </motion.a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {projects.map((p, i) => <ProjectCard key={p.id} project={p} index={i} />)}
        </div>
      </div>
    </section>
  );
}
