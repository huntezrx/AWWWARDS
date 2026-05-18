"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import MagneticButton from "../ui/MagneticButton";
import TextReveal from "../ui/TextReveal";

export default function CTA() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section
      ref={ref}
      id="cta"
      className="relative py-32 md:py-48 overflow-hidden"
      style={{ background: "#020206" }}
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              "radial-gradient(ellipse at 30% 50%, rgba(99,102,241,0.15) 0%, transparent 60%)",
              "radial-gradient(ellipse at 70% 50%, rgba(139,92,246,0.15) 0%, transparent 60%)",
              "radial-gradient(ellipse at 50% 30%, rgba(6,182,212,0.15) 0%, transparent 60%)",
              "radial-gradient(ellipse at 30% 50%, rgba(99,102,241,0.15) 0%, transparent 60%)",
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-10">
        <motion.div
          style={{ scale, opacity }}
          className="relative glass-strong rounded-[40px] p-12 md:p-20 overflow-hidden text-center"
        >
          {/* Border glow */}
          <div className="absolute inset-0 rounded-[40px] overflow-hidden">
            <motion.div
              className="absolute inset-[-1px] rounded-[40px]"
              style={{
                background: "linear-gradient(135deg, rgba(99,102,241,0.4) 0%, rgba(139,92,246,0.2) 50%, rgba(6,182,212,0.4) 100%)",
                mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                maskComposite: "exclude",
                padding: "1px",
              }}
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
          </div>

          {/* Top decoration */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-indigo-500 to-transparent" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-indigo-500 -translate-y-1" />

          {/* Corner decorations */}
          <div className="absolute top-6 left-6 w-6 h-6 border-l border-t border-white/10" />
          <div className="absolute top-6 right-6 w-6 h-6 border-r border-t border-white/10" />
          <div className="absolute bottom-6 left-6 w-6 h-6 border-l border-b border-white/10" />
          <div className="absolute bottom-6 right-6 w-6 h-6 border-r border-b border-white/10" />

          {/* Background glow */}
          <motion.div
            className="absolute inset-0 opacity-30"
            animate={{
              background: [
                "radial-gradient(circle at 50% 50%, rgba(99,102,241,0.2) 0%, transparent 60%)",
                "radial-gradient(circle at 50% 50%, rgba(139,92,246,0.2) 0%, transparent 60%)",
                "radial-gradient(circle at 50% 50%, rgba(99,102,241,0.2) 0%, transparent 60%)",
              ],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="relative z-10">
            <motion.div
              className="flex items-center justify-center gap-3 mb-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <div className="w-6 h-px bg-indigo-500" />
              <span className="text-xs text-indigo-400/80 tracking-[0.4em] uppercase font-light">
                Start a Project
              </span>
              <div className="w-6 h-px bg-indigo-500" />
            </motion.div>

            <TextReveal
              text="Ready to create something"
              className="text-4xl md:text-6xl lg:text-7xl font-thin text-white/90 justify-center mb-2"
            />
            <TextReveal
              text="extraordinary?"
              className="text-4xl md:text-6xl lg:text-7xl font-thin gradient-text justify-center mb-8"
              delay={0.2}
            />

            <motion.p
              className="text-white/40 font-light max-w-md mx-auto mb-12 text-base md:text-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              Let&apos;s collaborate on your next digital masterpiece. We bring
              vision, craft, and obsession to every project.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <MagneticButton>
                <button className="group relative px-10 py-5 rounded-full overflow-hidden cursor-none">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600" />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-violet-400 opacity-0 group-hover:opacity-30 transition-opacity duration-500"
                  />
                  <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <span className="relative z-10 text-sm font-medium tracking-widest uppercase text-white flex items-center gap-3">
                    Let&apos;s Talk
                    <motion.span
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </span>
                </button>
              </MagneticButton>

              <MagneticButton>
                <a
                  href="mailto:hello@lumina.design"
                  className="group px-8 py-5 text-sm text-white/40 hover:text-white/80 transition-colors duration-300 cursor-none tracking-widest uppercase font-light"
                >
                  hello@lumina.design
                </a>
              </MagneticButton>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
