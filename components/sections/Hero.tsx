"use client";

import { useRef, useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import MagneticButton from "../ui/MagneticButton";
import LightRays from "../ui/LightRays";

// ─── Letter-by-letter reveal ───────────────────────────────────────────────
function SplitText({
  text,
  className = "",
  delay = 0,
  stagger = 0.03,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  return (
    <span className={`inline-flex flex-wrap ${className}`} aria-label={text}>
      {text.split("").map((ch, i) => (
        <span key={i} className="overflow-hidden inline-block" style={{ lineHeight: 1.1 }}>
          <motion.span
            className="inline-block"
            initial={{ y: "110%", opacity: 0, rotateX: -60 }}
            animate={{ y: 0, opacity: 1, rotateX: 0 }}
            transition={{
              duration: 0.9,
              delay: delay + i * stagger,
              ease: [0.23, 1, 0.32, 1],
            }}
          >
            {ch === " " ? " " : ch}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

// ─── Rotating word carousel ────────────────────────────────────────────────
const WORDS = ["Surreal", "Cinematic", "Immersive", "Premium"];

function WordCarousel() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % WORDS.length), 2800);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative h-[1.1em] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.span
          key={idx}
          className="absolute inset-0 flex items-center"
          initial={{ y: "100%", opacity: 0, filter: "blur(8px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: "-100%", opacity: 0, filter: "blur(8px)" }}
          transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
        >
          <span className="gradient-text">{WORDS[idx]}</span>
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

// ─── Depth layers that react to mouse ─────────────────────────────────────
function DepthLayer({
  depth,
  mouseX,
  mouseY,
  children,
  className = "",
}: {
  depth: number;
  mouseX: ReturnType<typeof useMotionValue<number>>;
  mouseY: ReturnType<typeof useMotionValue<number>>;
  children: React.ReactNode;
  className?: string;
}) {
  const x = useTransform(mouseX, [-1, 1], [-depth * 18, depth * 18]);
  const y = useTransform(mouseY, [-1, 1], [-depth * 12, depth * 12]);
  const sx = useSpring(x, { stiffness: 60, damping: 18 });
  const sy = useSpring(y, { stiffness: 60, damping: 18 });

  return (
    <motion.div style={{ x: sx, y: sy }} className={`absolute inset-0 ${className}`}>
      {children}
    </motion.div>
  );
}

// ─── Chromatic aberration CSS on headline ─────────────────────────────────
function ChromaText({ text, className = "" }: { text: string; className?: string }) {
  return (
    <span className={`relative inline-block ${className}`}>
      {/* Red channel */}
      <span
        className="absolute inset-0 text-red-400/20 select-none pointer-events-none"
        style={{ transform: "translate(-2px, 0)" }}
        aria-hidden
      >
        {text}
      </span>
      {/* Blue channel */}
      <span
        className="absolute inset-0 text-blue-400/20 select-none pointer-events-none"
        style={{ transform: "translate(2px, 0)" }}
        aria-hidden
      >
        {text}
      </span>
      {/* Main */}
      <span className="relative">{text}</span>
    </span>
  );
}

// ─── Animated orbital ring decoration ─────────────────────────────────────
function OrbitalRings({ mouseX, mouseY }: {
  mouseX: ReturnType<typeof useMotionValue<number>>;
  mouseY: ReturnType<typeof useMotionValue<number>>;
}) {
  const rotX = useTransform(mouseY, [-1, 1], [30, -30]);
  const rotY = useTransform(mouseX, [-1, 1], [-30, 30]);
  const sRX  = useSpring(rotX, { stiffness: 40, damping: 20 });
  const sRY  = useSpring(rotY, { stiffness: 40, damping: 20 });

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      style={{ perspective: 800, rotateX: sRX, rotateY: sRY }}
    >
      {[160, 240, 320, 420].map((size, i) => (
        <motion.div
          key={size}
          className="absolute rounded-full border"
          style={{
            width: size,
            height: size,
            borderColor: `rgba(99,102,241,${0.12 - i * 0.02})`,
          }}
          animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
          transition={{ duration: 16 + i * 6, repeat: Infinity, ease: "linear" }}
        />
      ))}
      {/* Center orb */}
      <motion.div
        className="absolute w-16 h-16 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(139,92,246,0.8) 0%, rgba(99,102,241,0.3) 50%, transparent 100%)",
          boxShadow: "0 0 40px rgba(99,102,241,0.6), 0 0 80px rgba(99,102,241,0.2)",
        }}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
}

// ─── Floating data pills ───────────────────────────────────────────────────
const PILLS = [
  { label: "Lighthouse 99", icon: "⚡", x: "8%",   y: "22%", depth: 1.4 },
  { label: "SOTD Awwwards", icon: "✦", x: "82%",  y: "18%", depth: 0.9 },
  { label: "WebGL 2.0",     icon: "◈", x: "88%",  y: "72%", depth: 1.2 },
  { label: "60fps Always",  icon: "◊", x: "6%",   y: "76%", depth: 0.7 },
];

function FloatingPill({
  label, icon, floatDelay, mouseX, mouseY, depth,
}: {
  label: string; icon: string; floatDelay: number;
  mouseX: ReturnType<typeof useMotionValue<number>>;
  mouseY: ReturnType<typeof useMotionValue<number>>;
  depth: number;
}) {
  const px = useTransform(mouseX, [-1, 1], [-depth * 14, depth * 14]);
  const py = useTransform(mouseY, [-1, 1], [-depth * 10, depth * 10]);
  const spx = useSpring(px, { stiffness: 50, damping: 18 });
  const spy = useSpring(py, { stiffness: 50, damping: 18 });

  return (
    <motion.div
      className="glass rounded-2xl px-4 py-2.5 flex items-center gap-2.5 select-none backdrop-glow"
      style={{ x: spx, y: spy }}
      animate={{ y: [0, -8, 0] }}
      transition={{
        y: { duration: 4 + floatDelay, repeat: Infinity, ease: "easeInOut", delay: floatDelay },
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
    >
      <span className="text-indigo-400 text-xs">{icon}</span>
      <span className="text-[11px] text-white/50 font-light tracking-wider whitespace-nowrap">{label}</span>
    </motion.div>
  );
}

// ─── Main Hero ─────────────────────────────────────────────────────────────
export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Parallax on scroll
  const contentY  = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const contentO  = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const contentS  = useTransform(scrollYProgress, [0, 1], [1, 0.88]);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      mouseX.set(( e.clientX / window.innerWidth  ) * 2 - 1);
      mouseY.set((-(e.clientY / window.innerHeight) * 2 + 1));
    };
    window.addEventListener("mousemove", handle, { passive: true });
    return () => window.removeEventListener("mousemove", handle);
  }, [mouseX, mouseY]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden"
    >
      {/* Volumetric light rays */}
      <LightRays />

      {/* Depth layers */}
      <DepthLayer depth={0.4} mouseX={mouseX} mouseY={mouseY}>
        <OrbitalRings mouseX={mouseX} mouseY={mouseY} />
      </DepthLayer>

      {/* Floating pills */}
      {PILLS.map((p, i) => (
        <div
          key={p.label}
          className="absolute pointer-events-none"
          style={{ left: p.x, top: p.y }}
        >
          <FloatingPill
            label={p.label}
            icon={p.icon}
            floatDelay={i * 0.8}
            mouseX={mouseX}
            mouseY={mouseY}
            depth={p.depth}
          />
        </div>
      ))}

      {/* ── Main content ── */}
      <motion.div
        style={{ y: contentY, opacity: contentO, scale: contentS }}
        className="relative z-10 text-center px-6 max-w-6xl mx-auto"
      >
        {/* Eyebrow */}
        <motion.div
          className="flex items-center justify-center gap-3 mb-10"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.8, ease: [0.23, 1, 0.32, 1] }}
        >
          <motion.div
            className="h-px bg-gradient-to-r from-transparent to-indigo-500"
            initial={{ width: 0 }}
            animate={{ width: 32 }}
            transition={{ delay: 3, duration: 0.6 }}
          />
          <span className="text-[10px] text-indigo-400/70 tracking-[0.5em] uppercase font-light">
            Digital Experience Studio
          </span>
          <motion.div
            className="h-px bg-gradient-to-l from-transparent to-indigo-500"
            initial={{ width: 0 }}
            animate={{ width: 32 }}
            transition={{ delay: 3, duration: 0.6 }}
          />
        </motion.div>

        {/* Headline — letter-by-letter */}
        <div className="mb-4" style={{ perspective: 1000 }}>
          <h1 className="text-[14vw] sm:text-[12vw] md:text-[10vw] font-thin tracking-tight text-white leading-[0.9] uppercase">
            <SplitText text="LUMINA" delay={3} stagger={0.06} />
          </h1>
        </div>

        {/* Rotating adjective */}
        <div className="text-3xl sm:text-4xl md:text-5xl font-thin mb-8 h-[1.2em] flex justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.5, duration: 0.8 }}
          >
            <WordCarousel />
          </motion.div>
        </div>

        {/* Subtitle */}
        <motion.p
          className="text-sm md:text-base text-white/35 max-w-lg mx-auto mb-14 leading-relaxed font-light tracking-wide"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 3.6, ease: [0.23, 1, 0.32, 1] }}
        >
          We engineer digital realities where beauty and technology converge.
          Every frame is intentional. Every interaction is unforgettable.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 3.8, ease: [0.23, 1, 0.32, 1] }}
        >
          <MagneticButton>
            <button className="group relative px-8 py-4 rounded-full overflow-hidden cursor-none">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 bg-[length:200%_100%] group-hover:bg-right transition-all duration-700" />
              <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              {/* Glow */}
              <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ boxShadow: "0 0 40px rgba(99,102,241,0.6)" }} />
              <span className="relative z-10 text-xs font-medium tracking-[0.25em] uppercase text-white flex items-center gap-3">
                Explore Work
                <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                  →
                </motion.span>
              </span>
            </button>
          </MagneticButton>

          <MagneticButton>
            <button className="group relative px-8 py-4 rounded-full border border-white/10 cursor-none overflow-hidden">
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/[0.04] transition-colors duration-500" />
              <span className="relative z-10 text-xs text-white/50 group-hover:text-white/80 tracking-[0.25em] uppercase font-light transition-colors duration-300 flex items-center gap-3">
                <motion.span
                  className="w-2 h-2 rounded-full bg-indigo-500"
                  animate={{ scale: [1, 1.4, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                Watch Reel
              </span>
            </button>
          </MagneticButton>
        </motion.div>

        {/* Stats row */}
        <motion.div
          className="flex items-center justify-center gap-10 mt-16 pt-8 border-t border-white/[0.05]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 4, duration: 1 }}
        >
          {[["200+", "Projects"], ["40+", "Awards"], ["12+", "Years"]].map(([v, l]) => (
            <div key={l} className="text-center">
              <div className="text-xl font-thin text-white/70">{v}</div>
              <div className="text-[10px] text-white/25 tracking-[0.3em] uppercase mt-0.5">{l}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4.2 }}
      >
        <span className="text-[9px] text-white/25 tracking-[0.5em] uppercase">Scroll</span>
        <div className="w-px h-14 bg-gradient-to-b from-white/20 to-transparent relative overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 w-full bg-gradient-to-b from-indigo-500 to-violet-500"
            animate={{ height: ["0%", "100%"], top: ["0%", "100%"] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#020206] to-transparent pointer-events-none" />
    </section>
  );
}
