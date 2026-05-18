"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import MagneticButton from "../ui/MagneticButton";
import TextReveal from "../ui/TextReveal";

const TRUST_ITEMS = [
  { icon: "🔐", label: "NDA on day one" },
  { icon: "⚡", label: "28-day delivery" },
  { icon: "✓",  label: "IP fully yours" },
  { icon: "↩",  label: "Cancel anytime" },
];

export default function CTA() {
  const ref = useRef<HTMLElement>(null);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale   = useTransform(scrollYProgress, [0, 0.4, 0.8, 1], [0.94, 1, 1, 0.94]);
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.includes("@")) setSubmitted(true);
  };

  return (
    <section
      ref={ref}
      id="cta"
      className="section relative overflow-hidden"
      style={{ background: "var(--bg)" }}
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              "radial-gradient(ellipse at 30% 50%, rgba(99,102,241,0.12) 0%, transparent 60%)",
              "radial-gradient(ellipse at 70% 50%, rgba(139,92,246,0.12) 0%, transparent 60%)",
              "radial-gradient(ellipse at 50% 30%, rgba(6,182,212,0.10) 0%, transparent 60%)",
              "radial-gradient(ellipse at 30% 50%, rgba(99,102,241,0.12) 0%, transparent 60%)",
            ],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute inset-0 grid-pattern opacity-20" />
      </div>

      <div className="container relative">
        <motion.div
          style={{ scale, opacity }}
          className="relative rounded-[40px] overflow-hidden"
        >
          {/* Animated border */}
          <div
            className="absolute inset-0 rounded-[40px] pointer-events-none"
            style={{ padding: "1px", background: "linear-gradient(135deg, rgba(99,102,241,0.4), rgba(139,92,246,0.2), rgba(6,182,212,0.4))" }}
          >
            <div className="w-full h-full rounded-[39px]" style={{ background: "var(--bg)" }} />
          </div>

          {/* Inner content */}
          <div
            className="relative rounded-[40px] px-8 py-16 md:px-20 md:py-24"
            style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.06), rgba(2,2,6,0.8), rgba(139,92,246,0.04))" }}
          >
            {/* Corner accents */}
            {[["top-6","left-6","border-l border-t"], ["top-6","right-6","border-r border-t"], ["bottom-6","left-6","border-l border-b"], ["bottom-6","right-6","border-r border-b"]].map(([v, h, cls], i) => (
              <div key={i} className={`absolute ${v} ${h} w-6 h-6 ${cls}`} style={{ borderColor: "rgba(255,255,255,0.08)" }} />
            ))}

            {/* Pulsing orb */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-1 rounded-full blur-sm"
              style={{ background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.8), transparent)" }}
            />

            <div className="text-center max-w-3xl mx-auto">
              {/* Eyebrow */}
              <motion.div
                className="flex items-center justify-center gap-3 mb-8"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <div className="w-6 h-px bg-indigo-500/50" />
                <span className="label text-indigo-400/60">Ready to ship?</span>
                <div className="w-6 h-px bg-indigo-500/50" />
              </motion.div>

              {/* Headline */}
              <div className="mb-4">
                <TextReveal
                  text="Let's build something"
                  className="display-xl text-white/92 justify-center"
                />
                <TextReveal
                  text="the world hasn't seen."
                  className="display-xl gradient-text justify-center"
                  delay={0.15}
                />
              </div>

              <motion.p
                className="body-lg text-white/38 max-w-md mx-auto mb-12"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                Drop your email and we&apos;ll reply within 4 hours — with actual ideas, not a sales deck.
              </motion.p>

              {/* Email form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="mb-8"
              >
                {!submitted ? (
                  <form
                    onSubmit={handleSubmit}
                    className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
                  >
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      required
                      className="flex-1 px-5 py-3.5 rounded-full body-sm text-white/80 placeholder-white/20 outline-none transition-all duration-300 cursor-none"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                      onFocus={(e) => { e.currentTarget.style.border = "1px solid rgba(99,102,241,0.4)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.08)"; }}
                      onBlur={(e) => { e.currentTarget.style.border = "1px solid rgba(255,255,255,0.08)"; e.currentTarget.style.boxShadow = "none"; }}
                    />
                    <MagneticButton strength={0.2}>
                      <button type="submit" className="btn btn-primary shrink-0 cursor-none">
                        Get started
                        <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>→</motion.span>
                      </button>
                    </MagneticButton>
                  </form>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center justify-center gap-3 py-3.5"
                  >
                    <motion.div
                      className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 0.5 }}
                    >
                      <span className="text-emerald-400 text-sm">✓</span>
                    </motion.div>
                    <span className="body-base text-white/70">We&apos;ll be in touch within 4 hours.</span>
                  </motion.div>
                )}
              </motion.div>

              {/* Trust signals */}
              <motion.div
                className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                {TRUST_ITEMS.map((t) => (
                  <div key={t.label} className="flex items-center gap-2">
                    <span className="text-sm text-white/30">{t.icon}</span>
                    <span className="body-sm text-white/28">{t.label}</span>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Floating availability badge */}
        <motion.div
          className="flex items-center justify-center mt-10 gap-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          <motion.div
            className="w-2 h-2 rounded-full bg-emerald-400"
            animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="body-sm text-white/28">
            Currently accepting <span className="text-white/50">2 new projects</span> for Q1 2025
          </span>
        </motion.div>
      </div>
    </section>
  );
}
