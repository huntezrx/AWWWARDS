"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface MarqueeProps {
  items: string[];
  speed?: number;
  direction?: "left" | "right";
  className?: string;
}

export default function Marquee({
  items,
  speed = 25,
  direction = "left",
  className = "",
}: MarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const x = useTransform(
    scrollYProgress,
    [0, 1],
    direction === "left" ? ["0%", "-5%"] : ["-5%", "0%"]
  );

  const duplicated = [...items, ...items, ...items];

  return (
    <div ref={containerRef} className={`overflow-hidden ${className}`}>
      <motion.div
        style={{ x }}
        className="flex"
      >
        <motion.div
          className="flex gap-8 items-center whitespace-nowrap"
          animate={{
            x: direction === "left" ? [0, -(100 / 3) + "%"] : [-(100 / 3) + "%", 0],
          }}
          transition={{
            duration: speed,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{ width: "max-content" }}
        >
          {duplicated.map((item, i) => (
            <span
              key={i}
              className="text-4xl md:text-6xl font-thin tracking-widest text-white/20 uppercase inline-flex items-center gap-8"
            >
              {item}
              <span className="w-2 h-2 rounded-full bg-indigo-500/40 inline-block flex-shrink-0" />
            </span>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
