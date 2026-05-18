"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  once?: boolean;
  type?: "words" | "chars" | "lines";
}

export default function TextReveal({
  text,
  className = "",
  delay = 0,
  once = true,
  type = "words",
}: TextRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: "-10% 0px" });

  if (type === "chars") {
    const chars = text.split("");
    return (
      <div ref={ref} className={`flex flex-wrap ${className}`} aria-label={text}>
        {chars.map((char, i) => (
          <span key={i} className="overflow-hidden inline-block">
            <motion.span
              className="inline-block"
              initial={{ y: "110%", opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : { y: "110%", opacity: 0 }}
              transition={{
                duration: 0.6,
                delay: delay + i * 0.02,
                ease: [0.23, 1, 0.32, 1],
              }}
            >
              {char === " " ? " " : char}
            </motion.span>
          </span>
        ))}
      </div>
    );
  }

  const words = text.split(" ");
  return (
    <div ref={ref} className={`flex flex-wrap gap-x-[0.25em] ${className}`} aria-label={text}>
      {words.map((word, i) => (
        <span key={i} className="overflow-hidden inline-block">
          <motion.span
            className="inline-block"
            initial={{ y: "110%", opacity: 0, rotateX: -20 }}
            animate={
              isInView
                ? { y: 0, opacity: 1, rotateX: 0 }
                : { y: "110%", opacity: 0, rotateX: -20 }
            }
            transition={{
              duration: 0.8,
              delay: delay + i * 0.06,
              ease: [0.23, 1, 0.32, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </div>
  );
}
