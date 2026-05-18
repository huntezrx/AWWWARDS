"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import TextReveal from "../ui/TextReveal";

const projects = [
  {
    id: 1,
    title: "Nexus Platform",
    category: "Product Design",
    year: "2024",
    tags: ["UI/UX", "Branding", "Motion"],
    gradient: "from-indigo-900/60 via-violet-900/40 to-slate-900/60",
    accent: "#6366f1",
    number: "01",
  },
  {
    id: 2,
    title: "Aurora Finance",
    category: "Web Application",
    year: "2024",
    tags: ["Dashboard", "Data Viz", "R3F"],
    gradient: "from-cyan-900/60 via-blue-900/40 to-slate-900/60",
    accent: "#06b6d4",
    number: "02",
  },
  {
    id: 3,
    title: "Phantom AI",
    category: "Landing Page",
    year: "2024",
    tags: ["WebGL", "Shaders", "GSAP"],
    gradient: "from-violet-900/60 via-purple-900/40 to-slate-900/60",
    accent: "#8b5cf6",
    number: "03",
  },
  {
    id: 4,
    title: "Stellar Commerce",
    category: "E-Commerce",
    year: "2023",
    tags: ["Next.js", "3D", "Animation"],
    gradient: "from-pink-900/60 via-rose-900/40 to-slate-900/60",
    accent: "#ec4899",
    number: "04",
  },
];

function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[0];
  index: number;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={ref}
      className="group relative cursor-none"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 1, delay: index * 0.15, ease: [0.23, 1, 0.32, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card */}
      <motion.div
        className="relative aspect-[4/3] md:aspect-[16/10] rounded-3xl overflow-hidden"
        animate={{ scale: isHovered ? 1.02 : 1 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      >
        {/* Background gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient}`} />

        {/* Animated mesh */}
        <motion.div
          className="absolute inset-0"
          animate={{
            opacity: isHovered ? 1 : 0.6,
          }}
          transition={{ duration: 0.4 }}
        >
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
              `,
              backgroundSize: "40px 40px",
            }}
          />
        </motion.div>

        {/* Project number */}
        <div className="absolute top-6 left-6">
          <span className="text-8xl md:text-9xl font-thin text-white/[0.04] select-none">
            {project.number}
          </span>
        </div>

        {/* Floating orbs */}
        <motion.div
          className="absolute w-64 h-64 rounded-full"
          style={{
            background: `radial-gradient(circle, ${project.accent}30 0%, transparent 70%)`,
            filter: "blur(40px)",
            right: "10%",
            bottom: "10%",
          }}
          animate={{
            scale: isHovered ? [1, 1.3, 1] : 1,
            opacity: isHovered ? [0.5, 1, 0.5] : 0.5,
          }}
          transition={{ duration: 3, repeat: isHovered ? Infinity : 0, ease: "easeInOut" }}
        />

        {/* Tags */}
        <div className="absolute top-6 right-6 flex gap-2">
          {project.tags.map((tag) => (
            <motion.span
              key={tag}
              className="text-xs px-3 py-1 rounded-full glass text-white/40"
              animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : -10 }}
              transition={{ duration: 0.4 }}
            >
              {tag}
            </motion.span>
          ))}
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <motion.div
            className="flex items-end justify-between"
            animate={{ y: isHovered ? -4 : 0 }}
            transition={{ duration: 0.4 }}
          >
            <div>
              <p className="text-xs text-white/30 tracking-widest uppercase mb-2">
                {project.category} · {project.year}
              </p>
              <h3 className="text-2xl md:text-3xl font-light text-white/90">
                {project.title}
              </h3>
            </div>

            <motion.div
              className="w-10 h-10 rounded-full glass flex items-center justify-center text-white/60"
              animate={{
                scale: isHovered ? 1.2 : 1,
                background: isHovered
                  ? `${project.accent}30`
                  : "rgba(255,255,255,0.05)",
              }}
              transition={{ duration: 0.3 }}
            >
              →
            </motion.div>
          </motion.div>

          {/* Progress line */}
          <div className="mt-4 h-px bg-white/10 relative overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0"
              style={{ background: project.accent }}
              animate={{ width: isHovered ? "100%" : "0%" }}
              transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Showcase() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  return (
    <section
      ref={ref}
      id="showcase"
      className="relative py-32 md:py-48 overflow-hidden"
      style={{ background: "#020206" }}
    >
      {/* Background */}
      <motion.div
        className="absolute right-0 top-1/2 w-[500px] h-[500px] rounded-full opacity-10 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(99,102,241,0.6) 0%, transparent 70%)",
          filter: "blur(100px)",
          y: backgroundY,
        }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <motion.div
              className="flex items-center gap-3 mb-6"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="w-8 h-px bg-indigo-500" />
              <span className="text-xs text-indigo-400/80 tracking-[0.4em] uppercase font-light">
                Selected Work
              </span>
            </motion.div>
            <TextReveal
              text="Projects that push the boundaries of digital experience."
              className="text-4xl md:text-5xl font-thin text-white/90 max-w-xl leading-tight"
            />
          </div>

          <motion.a
            href="#"
            className="group flex items-center gap-3 text-sm text-white/40 hover:text-white/70 transition-colors duration-300 cursor-none shrink-0"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <span className="tracking-widest uppercase text-xs">View All</span>
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              →
            </motion.span>
          </motion.a>
        </div>

        {/* Projects grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
