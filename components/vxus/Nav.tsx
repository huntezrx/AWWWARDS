"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import VXUSLogo from "./VXUSLogo";

const LINKS = [
  { label: "Platform",  href: "#features" },
  { label: "Solutions", href: "#solutions" },
  { label: "Pricing",   href: "#pricing" },
  { label: "Docs",      href: "#docs" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progressScaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => setScrolled(v > 0.01));
    return unsub;
  }, [scrollYProgress]);

  return (
    <>
      {/* Progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-px z-[1000] origin-left"
        style={{
          scaleX: progressScaleX,
          background: "linear-gradient(90deg, #7C5AF3, #00CFFF)",
        }}
      />

      <motion.nav
        className="fixed top-0 left-0 right-0 z-[999] flex items-center justify-between px-6 lg:px-10"
        style={{ height: scrolled ? 64 : 80 }}
        animate={{ height: scrolled ? 64 : 80 }}
        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
      >
        {/* Glass background */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background: scrolled
              ? "rgba(7,6,26,0.85)"
              : "rgba(7,6,26,0)",
            backdropFilter: scrolled ? "blur(28px) saturate(180%)" : "blur(0px)",
          }}
          transition={{ duration: 0.4 }}
          style={{
            borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
          }}
        />

        {/* Logo */}
        <div className="relative z-10">
          <VXUSLogo size={30} />
        </div>

        {/* Desktop links */}
        <div className="relative z-10 hidden md:flex items-center gap-8">
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-xs font-light tracking-widest uppercase transition-colors duration-200"
              style={{ color: "rgba(237,233,255,0.45)" }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#EDE9FF")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "rgba(237,233,255,0.45)")}
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* CTAs */}
        <div className="relative z-10 hidden md:flex items-center gap-3">
          <a href="#" className="btn-ghost" style={{ padding: "0.55rem 1.2rem", fontSize: "0.72rem" }}>
            Sign in
          </a>
          <a href="#" className="btn-primary" style={{ padding: "0.6rem 1.4rem", fontSize: "0.72rem" }}>
            Get access
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="relative z-10 md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="block h-px rounded-full"
              style={{ background: "rgba(237,233,255,0.6)" }}
              animate={{
                width: i === 1 ? (menuOpen ? 16 : 24) : 24,
                opacity: i === 1 ? (menuOpen ? 0 : 1) : 1,
                y: menuOpen ? (i === 0 ? 7 : i === 2 ? -7 : 0) : 0,
                rotate: menuOpen ? (i === 0 ? 45 : i === 2 ? -45 : 0) : 0,
              }}
              transition={{ duration: 0.25 }}
            />
          ))}
        </button>

        {/* Mobile menu */}
        <motion.div
          className="absolute top-full left-0 right-0 glass md:hidden overflow-hidden"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: menuOpen ? "auto" : 0, opacity: menuOpen ? 1 : 0 }}
          transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
        >
          <div className="p-6 flex flex-col gap-4">
            {LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="label"
                style={{ color: "rgba(237,233,255,0.55)" }}
                onClick={() => setMenuOpen(false)}
              >
                {l.label}
              </a>
            ))}
            <div className="divider my-2" />
            <a href="#" className="btn-primary text-center justify-center">Get access →</a>
          </div>
        </motion.div>
      </motion.nav>
    </>
  );
}
