"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TextReveal from "../ui/TextReveal";

const testimonials = [
  {
    id: 1,
    quote:
      "Working with Lumina transformed our product entirely. The attention to detail and visual sophistication they brought to our platform set us apart from every competitor in the market.",
    author: "Sarah Chen",
    role: "CPO at Nexus",
    avatar: "SC",
    accent: "#6366f1",
  },
  {
    id: 2,
    quote:
      "The experience they created is unlike anything I've seen. Users consistently tell us our platform feels like the future. Our conversion rate increased 340% post-launch.",
    author: "Marcus Reeves",
    role: "CEO at Aurora Finance",
    avatar: "MR",
    accent: "#06b6d4",
  },
  {
    id: 3,
    quote:
      "Not just designers — they're digital artists. Every scroll, every hover, every transition has been meticulously crafted. It's the most impressive work I've seen in 15 years.",
    author: "Elena Vasquez",
    role: "Design Director at Phantom",
    avatar: "EV",
    accent: "#8b5cf6",
  },
];

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setActive((prev) => (prev + newDirection + testimonials.length) % testimonials.length);
  };

  return (
    <section
      className="relative py-32 md:py-48 overflow-hidden"
      style={{ background: "#020206" }}
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute left-1/2 top-1/2 w-[800px] h-[400px] rounded-full opacity-15"
          style={{
            background: "radial-gradient(ellipse, rgba(99,102,241,0.4) 0%, transparent 70%)",
            filter: "blur(80px)",
            translateX: "-50%",
            translateY: "-50%",
          }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            className="flex items-center justify-center gap-3 mb-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="w-8 h-px bg-indigo-500" />
            <span className="text-xs text-indigo-400/80 tracking-[0.4em] uppercase font-light">
              Testimonials
            </span>
            <div className="w-8 h-px bg-indigo-500" />
          </motion.div>
          <TextReveal
            text="What our clients say"
            className="text-4xl md:text-5xl font-thin text-white/90 justify-center"
          />
        </div>

        {/* Testimonial card */}
        <div className="relative">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={active}
              custom={direction}
              initial={{ opacity: 0, x: direction * 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -60 }}
              transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
              className="glass-strong rounded-3xl p-10 md:p-16 text-center relative overflow-hidden"
            >
              {/* Accent glow */}
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-1 rounded-full opacity-60"
                style={{ background: testimonials[active].accent }}
              />

              {/* Quote mark */}
              <div className="text-8xl text-white/5 font-serif leading-none mb-6 -mt-4">&ldquo;</div>

              <blockquote className="text-xl md:text-2xl text-white/70 font-light leading-relaxed mb-10 max-w-3xl mx-auto">
                {testimonials[active].quote}
              </blockquote>

              {/* Author */}
              <div className="flex items-center justify-center gap-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium text-white"
                  style={{ background: `${testimonials[active].accent}40`, border: `1px solid ${testimonials[active].accent}50` }}
                >
                  {testimonials[active].avatar}
                </div>
                <div className="text-left">
                  <div className="text-white/80 text-sm font-medium">{testimonials[active].author}</div>
                  <div className="text-white/30 text-xs tracking-wider">{testimonials[active].role}</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-6 mt-8">
            <motion.button
              className="w-10 h-10 rounded-full glass flex items-center justify-center text-white/40 hover:text-white hover:border-white/20 transition-all duration-300 cursor-none"
              onClick={() => paginate(-1)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              ←
            </motion.button>

            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <motion.button
                  key={i}
                  className="h-px cursor-none transition-all duration-500"
                  style={{
                    background: i === active ? testimonials[active].accent : "rgba(255,255,255,0.1)",
                    width: i === active ? 32 : 16,
                  }}
                  onClick={() => {
                    setDirection(i > active ? 1 : -1);
                    setActive(i);
                  }}
                />
              ))}
            </div>

            <motion.button
              className="w-10 h-10 rounded-full glass flex items-center justify-center text-white/40 hover:text-white hover:border-white/20 transition-all duration-300 cursor-none"
              onClick={() => paginate(1)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              →
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
}
