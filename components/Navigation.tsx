"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import MagneticButton from "./ui/MagneticButton";

const NAV_LINKS = [
  { label: "Work",    href: "#showcase" },
  { label: "Process", href: "#faq" },
  { label: "Pricing", href: "#pricing" },
  { label: "About",   href: "#about" },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const unsubScroll = scrollYProgress.on("change", (v) => {
      setScrolled(v > 0.01);
      setScrollPct(v * 100);
    });
    return unsubScroll;
  }, [scrollYProgress]);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      {/* Scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-px z-[1002] origin-left"
        style={{
          background: "linear-gradient(90deg, #6366f1, #8b5cf6, #06b6d4)",
          scaleX: scrollYProgress,
        }}
      />

      <motion.nav
        className="fixed top-0 left-0 right-0 z-[1001] px-4 md:px-6 pt-4"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 2.6, ease: [0.23, 1, 0.32, 1] }}
      >
        <div
          className="max-w-6xl mx-auto flex items-center justify-between rounded-2xl px-5 py-3 transition-all duration-500"
          style={{
            background: scrolled ? "rgba(2,2,6,0.75)" : "transparent",
            backdropFilter: scrolled ? "blur(28px) saturate(150%)" : "none",
            border: scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
            boxShadow: scrolled ? "0 4px 32px rgba(0,0,0,0.4)" : "none",
          }}
        >
          {/* Logo */}
          <motion.a
            href="#"
            className="flex items-center gap-2.5 cursor-none group"
            whileHover={{ opacity: 0.8 }}
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
            >
              <span className="text-white text-xs font-bold">L</span>
            </div>
            <span className="text-sm font-medium tracking-[0.15em] text-white/80 uppercase">
              Lumina
            </span>
          </motion.a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                className="relative px-4 py-2 body-sm text-white/40 hover:text-white/80 transition-colors duration-300 cursor-none rounded-lg hover:bg-white/[0.04] group"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.7 + i * 0.08 }}
              >
                {link.label}
              </motion.a>
            ))}
          </div>

          {/* Right CTA */}
          <div className="hidden md:flex items-center gap-3">
            {/* Availability indicator */}
            <motion.div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.15)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3 }}
            >
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="label text-[9px] text-emerald-400">2 spots open</span>
            </motion.div>

            <MagneticButton strength={0.25}>
              <motion.a
                href="#cta"
                className="btn btn-primary cursor-none text-[11px] py-2.5 px-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                Start a project
              </motion.a>
            </MagneticButton>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 cursor-none"
            aria-label="Toggle menu"
          >
            <div className="w-5 flex flex-col gap-1.5">
              <motion.span className="w-full h-px bg-white/60 block" animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 6 : 0 }} transition={{ duration: 0.3 }} />
              <motion.span className="w-full h-px bg-white/60 block" animate={{ opacity: menuOpen ? 0 : 1 }} transition={{ duration: 0.2 }} />
              <motion.span className="w-3/4 h-px bg-white/60 block" animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -6 : 0, width: menuOpen ? "100%" : "75%" }} transition={{ duration: 0.3 }} />
            </div>
          </button>
        </div>
      </motion.nav>

      {/* Mobile fullscreen menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[1000] flex flex-col"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            style={{ background: "rgba(2,2,6,0.98)", backdropFilter: "blur(40px)" }}
          >
            <div className="flex flex-col items-center justify-center flex-1 gap-6 px-8">
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="display-md text-white/60 hover:text-white cursor-none transition-colors"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 24 }}
                  transition={{ delay: 0.1 + i * 0.07, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                >
                  {link.label}
                </motion.a>
              ))}

              <motion.a
                href="#cta"
                onClick={() => setMenuOpen(false)}
                className="btn btn-primary mt-6 cursor-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
              >
                Start a project →
              </motion.a>
            </div>

            {/* Bottom bar */}
            <div className="p-8 flex items-center justify-between border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
              <span className="label text-white/20">LUMINA © 2024</span>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="label text-[9px] text-emerald-400">Available for projects</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
