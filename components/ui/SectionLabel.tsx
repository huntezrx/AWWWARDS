"use client";

import { motion } from "framer-motion";

interface SectionLabelProps {
  children: string;
  className?: string;
  align?: "left" | "center";
}

export default function SectionLabel({ children, className = "", align = "left" }: SectionLabelProps) {
  return (
    <motion.div
      className={`flex items-center gap-3 mb-6 ${align === "center" ? "justify-center" : ""} ${className}`}
      initial={{ opacity: 0, x: align === "center" ? 0 : -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-5%" }}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
    >
      {align === "center" && <div className="w-6 h-px bg-gradient-to-r from-transparent to-indigo-500" />}
      {align !== "center" && <div className="w-6 h-px bg-indigo-500" />}
      <span className="label text-indigo-400/70">{children}</span>
      {align === "center" && <div className="w-6 h-px bg-gradient-to-l from-transparent to-indigo-500" />}
    </motion.div>
  );
}
