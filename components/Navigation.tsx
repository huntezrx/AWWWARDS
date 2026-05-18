"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import MagneticButton from "./ui/MagneticButton";

const navLinks = [
  { label: "Work", href: "#showcase" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#cta" },
];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();


  useEffect(() => {
    const unsubscribe = scrollY.on("change", (v) => {
      setIsScrolled(v > 50);
    });
    return unsubscribe;
  }, [scrollY]);

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-[1000] px-6 md:px-10 py-5"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 2.5, ease: [0.23, 1, 0.32, 1] }}
      >
        <motion.div
          className="max-w-7xl mx-auto flex items-center justify-between rounded-2xl px-6 py-3 transition-all duration-500"
          style={{
            background: isScrolled ? "rgba(2,2,6,0.7)" : "transparent",
            backdropFilter: isScrolled ? "blur(20px)" : "none",
            border: isScrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
          }}
        >
          {/* Logo */}
          <motion.a
            href="#"
            className="text-xl font-thin tracking-[0.3em] text-white/90 cursor-none"
            whileHover={{ letterSpacing: "0.4em" }}
            transition={{ duration: 0.3 }}
          >
            LUMINA
          </motion.a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                className="text-sm text-white/50 hover:text-white/90 transition-colors duration-300 tracking-widest uppercase cursor-none relative group"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.6 + i * 0.1 }}
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-indigo-500 group-hover:w-full transition-all duration-300" />
              </motion.a>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-4">
            <MagneticButton>
              <motion.button
                className="px-6 py-2.5 rounded-full text-sm font-light tracking-widest uppercase border border-white/10 text-white/70 hover:border-indigo-500/50 hover:text-white hover:bg-indigo-500/10 transition-all duration-300"
                whileTap={{ scale: 0.97 }}
              >
                Get Started
              </motion.button>
            </MagneticButton>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col gap-1.5 cursor-none p-2"
          >
            <motion.span
              className="w-6 h-px bg-white/70 block"
              animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 8 : 0 }}
            />
            <motion.span
              className="w-6 h-px bg-white/70 block"
              animate={{ opacity: menuOpen ? 0 : 1 }}
            />
            <motion.span
              className="w-6 h-px bg-white/70 block"
              animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -8 : 0 }}
            />
          </button>
        </motion.div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[999] flex flex-col items-center justify-center"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            style={{ background: "rgba(2,2,6,0.97)", backdropFilter: "blur(40px)" }}
          >
            <div className="flex flex-col items-center gap-8">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-4xl font-thin tracking-widest text-white/70 hover:text-white uppercase cursor-none"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                >
                  {link.label}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
