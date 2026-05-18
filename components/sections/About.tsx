"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import TextReveal from "../ui/TextReveal";

const stats = [
  { value: "200+", label: "Projects" },
  { value: "98%", label: "Satisfaction" },
  { value: "12+", label: "Years" },
  { value: "40+", label: "Awards" },
];

export default function About() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const textX = useTransform(scrollYProgress, [0, 1], ["-3%", "3%"]);

  return (
    <section
      ref={ref}
      id="about"
      className="relative py-32 md:py-48 overflow-hidden"
      style={{ background: "#020206" }}
    >
      {/* Background elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute right-0 top-1/2 w-[600px] h-[600px] rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)",
            filter: "blur(80px)",
            y: useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]),
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Left: Visual */}
          <motion.div className="relative order-2 lg:order-1" style={{ y: imageY }}>
            {/* Main card */}
            <div className="relative">
              <motion.div
                className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden glass-strong"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
              >
                {/* Animated gradient background */}
                <motion.div
                  className="absolute inset-0"
                  animate={{
                    background: [
                      "radial-gradient(ellipse at 30% 30%, rgba(99,102,241,0.4) 0%, rgba(6,182,212,0.2) 50%, transparent 70%)",
                      "radial-gradient(ellipse at 70% 70%, rgba(139,92,246,0.4) 0%, rgba(236,72,153,0.2) 50%, transparent 70%)",
                      "radial-gradient(ellipse at 30% 70%, rgba(6,182,212,0.4) 0%, rgba(99,102,241,0.2) 50%, transparent 70%)",
                      "radial-gradient(ellipse at 30% 30%, rgba(99,102,241,0.4) 0%, rgba(6,182,212,0.2) 50%, transparent 70%)",
                    ],
                  }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Grid lines */}
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: `
                      linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)
                    `,
                    backgroundSize: "40px 40px",
                  }}
                />

                {/* Center orb */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    className="w-48 h-48 rounded-full"
                    style={{
                      background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                    animate={{ scale: [1, 1.1, 1], rotate: [0, 180, 360] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                  />
                  <motion.div
                    className="absolute w-32 h-32 rounded-full"
                    style={{
                      border: "1px solid rgba(99,102,241,0.4)",
                    }}
                    animate={{ scale: [1, 1.2, 1], rotate: [0, -180, -360] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  />
                  <div className="absolute text-center">
                    <div className="text-4xl font-thin text-white/80 mb-1">∞</div>
                    <div className="text-xs text-white/40 tracking-widest">INFINITE</div>
                  </div>
                </div>

                {/* Corner decorations */}
                <div className="absolute top-4 left-4 w-8 h-8 border-l border-t border-white/20" />
                <div className="absolute top-4 right-4 w-8 h-8 border-r border-t border-white/20" />
                <div className="absolute bottom-4 left-4 w-8 h-8 border-l border-b border-white/20" />
                <div className="absolute bottom-4 right-4 w-8 h-8 border-r border-b border-white/20" />
              </motion.div>

              {/* Floating badge */}
              <motion.div
                className="absolute -right-6 top-1/4 glass rounded-2xl px-5 py-4"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                style={{ boxShadow: "0 20px 60px rgba(99,102,241,0.2)" }}
              >
                <div className="text-2xl font-light text-white/90">99</div>
                <div className="text-xs text-white/40 tracking-widest">Lighthouse</div>
              </motion.div>

              {/* Award badge */}
              <motion.div
                className="absolute -left-6 bottom-1/4 glass rounded-2xl px-5 py-4"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                style={{ boxShadow: "0 20px 60px rgba(236,72,153,0.15)" }}
              >
                <div className="text-indigo-400 text-sm font-light mb-1">✦ SOTD</div>
                <div className="text-xs text-white/40 tracking-widest">Awwwards</div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right: Content */}
          <motion.div className="order-1 lg:order-2" style={{ x: textX }}>
            <motion.div
              className="flex items-center gap-3 mb-6"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-8 h-px bg-indigo-500" />
              <span className="text-xs text-indigo-400/80 tracking-[0.4em] uppercase font-light">
                About
              </span>
            </motion.div>

            <div className="mb-8">
              <TextReveal
                text="We craft digital"
                className="text-4xl md:text-5xl lg:text-6xl font-thin text-white/90 leading-tight"
                delay={0.1}
              />
              <TextReveal
                text="experiences that"
                className="text-4xl md:text-5xl lg:text-6xl font-thin text-white/90 leading-tight"
                delay={0.2}
              />
              <TextReveal
                text="move people."
                className="text-4xl md:text-5xl lg:text-6xl font-thin gradient-text leading-tight"
                delay={0.3}
              />
            </div>

            <motion.p
              className="text-white/40 font-light leading-relaxed text-base md:text-lg mb-10 max-w-md"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              We are a collective of designers, engineers, and storytellers obsessed
              with the intersection of beauty and technology. Every pixel is intentional.
              Every interaction is emotional.
            </motion.p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 0.6, delay: 0.5 + i * 0.1 }}
                >
                  <div className="text-3xl md:text-4xl font-thin text-white/90 mb-1 group-hover:gradient-text transition-all duration-500">
                    {stat.value}
                  </div>
                  <div className="text-xs text-white/30 tracking-widest uppercase">
                    {stat.label}
                  </div>
                  <div className="mt-3 h-px bg-white/10 group-hover:bg-indigo-500/50 transition-colors duration-500" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
