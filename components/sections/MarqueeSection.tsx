"use client";

import { motion } from "framer-motion";
import Marquee from "../ui/Marquee";

const brands = [
  "AWWWARDS SOTD",
  "CSS DESIGN AWARDS",
  "FWA",
  "WEBBY AWARDS",
  "BEHANCE",
  "DRIBBBLE",
];

const techStack = [
  "Next.js",
  "Three.js",
  "GSAP",
  "Framer Motion",
  "WebGL",
  "TypeScript",
  "TailwindCSS",
  "React Three Fiber",
];

export default function MarqueeSection() {
  return (
    <section
      className="relative py-20 overflow-hidden"
      style={{ background: "#020206" }}
    >
      {/* Top line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      {/* Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `repeating-linear-gradient(
              90deg,
              rgba(255,255,255,0.1) 0px,
              rgba(255,255,255,0.1) 1px,
              transparent 1px,
              transparent 80px
            )`,
          }}
        />
      </div>

      <div className="space-y-8">
        {/* First marquee */}
        <Marquee items={brands} speed={30} direction="left" />

        {/* Separator */}
        <div className="flex items-center justify-center">
          <motion.div
            className="w-2 h-2 rounded-full bg-indigo-500/40"
            animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>

        {/* Second marquee */}
        <Marquee items={techStack} speed={20} direction="right" />
      </div>

      {/* Bottom line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
    </section>
  );
}
