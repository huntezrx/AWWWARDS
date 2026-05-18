"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import SectionLabel from "../ui/SectionLabel";

const TESTIMONIALS = [
  {
    id: 1,
    quote: "Lumina didn't just redesign our product — they rewrote the ceiling of what we thought was possible. Our conversion rate went from 2.1% to 8.9% in 30 days.",
    author: "Sarah Chen",
    role: "CPO",
    company: "Nexus AI",
    metric: { v: "8.9%", l: "Conversion Rate" },
    avatar: "SC",
    accent: "#6366f1",
  },
  {
    id: 2,
    quote: "I've worked with agencies in SF, NYC, and London. None of them shipped anything close to what Lumina delivered in 4 weeks. The WebGL environment alone is worth the price.",
    author: "Marcus Reeves",
    role: "CEO",
    company: "Aurora Finance",
    metric: { v: "$4.2M", l: "Revenue Month 1" },
    avatar: "MR",
    accent: "#06b6d4",
  },
  {
    id: 3,
    quote: "They asked better questions than our own team. The discovery session alone clarified 6 months of internal confusion. Then they built it in 3 weeks.",
    author: "Elena Vasquez",
    role: "Design Director",
    company: "Phantom Labs",
    metric: { v: "SOTD", l: "Awwwards Winner" },
    avatar: "EV",
    accent: "#8b5cf6",
  },
  {
    id: 4,
    quote: "We gave them a napkin sketch and a brand deck. We got a site that made our Series B investors ask if we were already a unicorn.",
    author: "James Park",
    role: "Founder",
    company: "Stellar Commerce",
    metric: { v: "210%", l: "Investor Interest" },
    avatar: "JP",
    accent: "#ec4899",
  },
];

function TestimonialCard({ t, isActive }: { t: typeof TESTIMONIALS[0]; isActive: boolean }) {
  return (
    <motion.div
      className="relative rounded-[28px] p-7 md:p-9 h-full"
      style={{
        background: isActive
          ? `linear-gradient(135deg, ${t.accent}12, rgba(255,255,255,0.02))`
          : "var(--surface)",
        border: `1px solid ${isActive ? t.accent + "30" : "var(--border)"}`,
        boxShadow: isActive ? `0 20px 60px ${t.accent}15` : "none",
      }}
      transition={{ duration: 0.5 }}
    >
      {/* Top bar accent */}
      <motion.div
        className="absolute top-0 left-8 right-8 h-px rounded-full"
        style={{ background: t.accent }}
        animate={{ opacity: isActive ? 0.6 : 0.15 }}
        transition={{ duration: 0.4 }}
      />

      {/* Quote mark */}
      <div className="text-5xl font-serif leading-none mb-4 select-none" style={{ color: `${t.accent}25` }}>&ldquo;</div>

      {/* Quote */}
      <blockquote className="body-lg text-white/65 leading-relaxed mb-8">
        {t.quote}
      </blockquote>

      {/* Footer */}
      <div className="flex items-center justify-between gap-4">
        {/* Author */}
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center label text-[10px]"
            style={{ background: `${t.accent}20`, border: `1px solid ${t.accent}35`, color: t.accent }}
          >
            {t.avatar}
          </div>
          <div>
            <div className="body-sm text-white/80 font-medium">{t.author}</div>
            <div className="label text-[9px] text-white/30">{t.role} · {t.company}</div>
          </div>
        </div>

        {/* Metric */}
        <div className="text-right shrink-0">
          <div className="text-xl font-light" style={{ color: t.accent }}>{t.metric.v}</div>
          <div className="label text-[9px] text-white/25">{t.metric.l}</div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-3%", "3%"]);

  const paginate = (dir: number) => {
    setDirection(dir);
    setActive((a) => (a + dir + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  return (
    <section ref={ref} className="section relative overflow-hidden" style={{ background: "var(--bg)" }}>
      {/* Bg */}
      <motion.div className="absolute inset-0 pointer-events-none" style={{ y }}>
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] opacity-[0.06]"
          style={{ background: "radial-gradient(ellipse, #6366f1, transparent 70%)", filter: "blur(80px)" }}
        />
      </motion.div>

      <div className="container relative">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <SectionLabel>Client results</SectionLabel>
            <motion.h2
              className="display-md text-white/90"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            >
              Words from the{" "}
              <span className="gradient-text">people we moved.</span>
            </motion.h2>
          </div>

          {/* Nav arrows */}
          <div className="flex items-center gap-2 shrink-0">
            <motion.button
              onClick={() => paginate(-1)}
              className="w-10 h-10 rounded-full glass flex items-center justify-center text-white/40 hover:text-white/80 cursor-none transition-colors"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.93 }}
            >←</motion.button>

            <div className="flex gap-1.5 px-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setDirection(i > active ? 1 : -1); setActive(i); }}
                  className="h-px cursor-none transition-all duration-400"
                  style={{
                    width: i === active ? 28 : 12,
                    background: i === active ? TESTIMONIALS[active].accent : "rgba(255,255,255,0.15)",
                  }}
                  aria-label={`Testimonial ${i + 1}`}
                />
              ))}
            </div>

            <motion.button
              onClick={() => paginate(1)}
              className="w-10 h-10 rounded-full glass flex items-center justify-center text-white/40 hover:text-white/80 cursor-none transition-colors"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.93 }}
            >→</motion.button>
          </div>
        </div>

        {/* Cards — show 1 active + previews */}
        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={active}
              custom={direction}
              initial={{ opacity: 0, x: direction * 80, scale: 0.97 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: direction * -80, scale: 0.97 }}
              transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
            >
              <TestimonialCard t={TESTIMONIALS[active]} isActive={true} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Preview cards row */}
        <div className="grid grid-cols-3 gap-3 mt-3">
          {TESTIMONIALS.filter((_, i) => i !== active).slice(0, 3).map((t) => (
            <motion.button
              key={t.id}
              onClick={() => { setDirection(TESTIMONIALS.indexOf(t) > active ? 1 : -1); setActive(TESTIMONIALS.indexOf(t)); }}
              className="relative rounded-2xl p-4 text-left cursor-none transition-all duration-300 overflow-hidden"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
              whileHover={{ scale: 1.02, borderColor: "rgba(255,255,255,0.12)" }}
            >
              <p className="body-sm text-white/28 line-clamp-2 mb-3">{t.quote}</p>
              <div className="flex items-center gap-2">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-medium"
                  style={{ background: `${t.accent}20`, color: t.accent }}
                >
                  {t.avatar}
                </div>
                <span className="label text-[9px] text-white/25">{t.author}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
