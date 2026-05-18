"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface SectionTransitionProps {
  from?: string;
  to?: string;
  variant?: "blur" | "rays" | "wave" | "fade";
}

export default function SectionTransition({
  from  = "transparent",
  to    = "transparent",
  variant = "fade",
}: SectionTransitionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);
  const scaleX  = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);
  const y       = useTransform(scrollYProgress, [0, 1], ["-30%", "30%"]);

  if (variant === "rays") {
    return (
      <div ref={ref} className="relative h-32 overflow-hidden pointer-events-none" style={{ background: to }}>
        <motion.div
          className="absolute inset-0"
          style={{ opacity, background: "radial-gradient(ellipse at 50% 50%, rgba(99,102,241,0.15), transparent 60%)" }}
        />
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"
          style={{ scaleX, width: "100%" }}
        />
      </div>
    );
  }

  if (variant === "wave") {
    return (
      <div ref={ref} className="relative h-24 overflow-hidden pointer-events-none" style={{ background: to }}>
        <motion.div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom, ${from}, ${to})`,
            y,
          }}
        />
      </div>
    );
  }

  // Default fade
  return (
    <div
      ref={ref}
      className="relative h-16 pointer-events-none"
      style={{
        background: `linear-gradient(to bottom, ${from}, ${to})`,
      }}
    />
  );
}
