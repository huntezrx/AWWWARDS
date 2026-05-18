"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const SECTIONS = [
  { id: "top",        label: "Home" },
  { id: "about",      label: "About" },
  { id: "showcase",   label: "Work" },
  { id: "pricing",    label: "Pricing" },
  { id: "faq",        label: "FAQ" },
  { id: "cta",        label: "Contact" },
];

export default function PageProgress() {
  const [activeIdx, setActiveIdx]   = useState(0);
  const [visible,   setVisible]     = useState(false);
  const { scrollYProgress }         = useScroll();
  const lineH = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  // Show after hero
  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => {
      setVisible(v > 0.04);
    });
    return unsub;
  }, [scrollYProgress]);

  // Track active section via IntersectionObserver
  useEffect(() => {
    const els = SECTIONS.map((s) =>
      s.id === "top" ? document.body : document.getElementById(s.id)
    ).filter(Boolean) as Element[];

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = els.indexOf(entry.target);
            if (idx !== -1) setActiveIdx(idx);
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px" }
    );

    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <motion.div
      className="fixed right-5 top-1/2 -translate-y-1/2 z-[990] flex flex-col items-end gap-0 pointer-events-none"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: visible ? 1 : 0, x: visible ? 0 : 20 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
    >
      {/* Vertical progress line */}
      <div className="absolute right-0 top-0 bottom-0 w-px bg-white/[0.04]">
        <motion.div
          className="absolute top-0 left-0 w-full bg-indigo-500/40"
          style={{ height: lineH }}
        />
      </div>

      {/* Section dots */}
      {SECTIONS.map((s, i) => {
        const isActive = i === activeIdx;
        return (
          <div
            key={s.id}
            className="flex items-center gap-3 pointer-events-auto cursor-none py-2.5"
            onClick={() => {
              if (s.id === "top") window.scrollTo({ top: 0, behavior: "smooth" });
              else document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            {/* Label */}
            <motion.span
              className="text-[9px] font-light tracking-widest uppercase text-right"
              animate={{
                opacity: isActive ? 0.6 : 0,
                x: isActive ? 0 : 6,
              }}
              transition={{ duration: 0.3 }}
              style={{ color: "#818cf8" }}
            >
              {s.label}
            </motion.span>

            {/* Dot */}
            <motion.div
              className="rounded-full flex-shrink-0 relative"
              animate={{
                width:  isActive ? 8 : 3,
                height: isActive ? 8 : 3,
                background: isActive ? "#6366f1" : "rgba(255,255,255,0.2)",
              }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            >
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ background: "#6366f1" }}
                  animate={{ scale: [1, 2, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.div>
          </div>
        );
      })}
    </motion.div>
  );
}
