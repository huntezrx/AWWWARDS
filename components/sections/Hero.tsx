"use client";

import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import MagneticButton from "../ui/MagneticButton";

function MeshBackground() {
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 30 });

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, [mouseX, mouseY]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Primary orb */}
      <motion.div
        className="absolute w-[900px] h-[900px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(99,102,241,0.2) 0%, rgba(139,92,246,0.1) 40%, transparent 70%)",
          x: useTransform(springX, [0, 1], ["-20%", "20%"]),
          y: useTransform(springY, [0, 1], ["-20%", "20%"]),
          left: "50%",
          top: "50%",
          translateX: "-50%",
          translateY: "-50%",
          filter: "blur(60px)",
        }}
        animate={{
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Secondary orb */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)",
          right: "10%",
          top: "20%",
          filter: "blur(80px)",
          x: useTransform(springX, [0, 1], ["10%", "-10%"]),
          y: useTransform(springY, [0, 1], ["-10%", "10%"]),
        }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      {/* Pink accent */}
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(236,72,153,0.12) 0%, transparent 70%)",
          left: "5%",
          bottom: "20%",
          filter: "blur(60px)",
        }}
        animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />
    </div>
  );
}

const PARTICLES = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  x: (i * 37.3) % 100,
  y: (i * 61.7) % 100,
  size: (i % 3) + 1,
  duration: 8 + (i % 5) * 2,
  delay: (i % 6) * 0.8,
}));

function FloatingParticles() {
  const particles = PARTICLES;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-indigo-400/30"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -60, 0],
            opacity: [0, 0.7, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);

  const words = ["Surreal.", "Cinematic.", "Premium."];

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "#020206" }}
    >
      <MeshBackground />
      <FloatingParticles />

      <motion.div
        style={{ y, opacity, scale }}
        className="relative z-10 text-center px-6 max-w-6xl mx-auto"
      >
        {/* Eyebrow */}
        <motion.div
          className="flex items-center justify-center gap-3 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.8, ease: [0.23, 1, 0.32, 1] }}
        >
          <div className="w-8 h-px bg-gradient-to-r from-transparent to-indigo-500" />
          <span className="text-xs text-indigo-400/80 tracking-[0.4em] uppercase font-light">
            Digital Experience
          </span>
          <div className="w-8 h-px bg-gradient-to-l from-transparent to-indigo-500" />
        </motion.div>

        {/* Main headline */}
        <div className="overflow-hidden mb-4">
          <motion.h1
            className="text-6xl sm:text-8xl md:text-[10rem] lg:text-[12rem] font-thin tracking-tight text-white leading-none"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2, delay: 3, ease: [0.23, 1, 0.32, 1] }}
          >
            LUMINA
          </motion.h1>
        </div>

        {/* Rotating words */}
        <div className="h-12 md:h-16 overflow-hidden mb-8">
          {words.map((word, i) => (
            <motion.div
              key={word}
              className="text-2xl md:text-4xl font-thin gradient-text"
              initial={{ y: 60, opacity: 0 }}
              animate={{
                y: [60, 0, 0, -60],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: 3,
                delay: 3.5 + i * 3,
                times: [0, 0.15, 0.85, 1],
                ease: [0.23, 1, 0.32, 1],
                repeat: Infinity,
                repeatDelay: words.length * 3 - 3,
              }}
            >
              {word}
            </motion.div>
          ))}
        </div>

        {/* Subtitle */}
        <motion.p
          className="text-base md:text-lg text-white/40 max-w-xl mx-auto mb-12 leading-relaxed font-light tracking-wide"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 3.4, ease: [0.23, 1, 0.32, 1] }}
        >
          Where digital artistry meets human emotion. Crafting premium experiences
          that transcend the ordinary.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 3.6, ease: [0.23, 1, 0.32, 1] }}
        >
          <MagneticButton>
            <button className="group relative px-8 py-4 rounded-full overflow-hidden cursor-none">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-violet-400 opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
              <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative z-10 text-sm font-medium tracking-widest uppercase text-white">
                Explore Work
              </span>
            </button>
          </MagneticButton>

          <MagneticButton>
            <button className="group px-8 py-4 rounded-full border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-all duration-500 cursor-none text-sm tracking-widest uppercase font-light">
              <span className="flex items-center gap-2">
                Watch Reel
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  →
                </motion.span>
              </span>
            </button>
          </MagneticButton>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4, duration: 1 }}
      >
        <span className="text-[10px] text-white/30 tracking-[0.4em] uppercase">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-white/30 to-transparent relative overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 w-full h-1/2 bg-indigo-500"
            animate={{ y: ["0%", "200%"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#020206] to-transparent pointer-events-none" />
    </section>
  );
}
