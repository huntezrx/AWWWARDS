"use client";

import { motion } from "framer-motion";
import MagneticButton from "../ui/MagneticButton";

const LINKS = {
  Work:    ["Projects", "Case Studies", "Process", "Results"],
  Studio:  ["About", "Team", "Culture", "Careers"],
  Build:   ["Design", "Development", "Motion", "3D / WebGL"],
  Connect: ["Twitter", "Dribbble", "GitHub", "LinkedIn"],
};

const SOCIALS = [
  { label: "Tw", href: "#" },
  { label: "Dr", href: "#" },
  { label: "GH", href: "#" },
  { label: "Li", href: "#" },
];

export default function Footer() {
  return (
    <footer
      className="relative pt-20 pb-8 overflow-hidden"
      style={{ background: "var(--bg)" }}
    >
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.3), transparent)" }}
      />

      {/* Subtle background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] opacity-[0.08]"
          style={{ background: "radial-gradient(ellipse, #6366f1, transparent 70%)", filter: "blur(60px)" }}
        />
      </div>

      <div className="container relative">
        {/* Top section: brand + newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-12 mb-16 pb-16"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
        >
          {/* Brand */}
          <div>
            <motion.div
              className="flex items-center gap-3 mb-5"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
              >
                <span className="text-white text-sm font-bold">L</span>
              </div>
              <span className="heading-xl text-white/80 font-light tracking-[0.1em]">LUMINA</span>
            </motion.div>

            <motion.p
              className="body-base text-white/28 max-w-xs mb-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Premium digital experiences for the world&apos;s most ambitious brands.
            </motion.p>

            {/* Socials */}
            <div className="flex items-center gap-2">
              {SOCIALS.map((s, i) => (
                <MagneticButton key={s.label} strength={0.3}>
                  <motion.a
                    href={s.href}
                    className="w-9 h-9 rounded-full glass flex items-center justify-center label text-[9px] text-white/30 hover:text-white/70 hover:border-white/12 cursor-none transition-colors"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.06 }}
                  >
                    {s.label}
                  </motion.a>
                </MagneticButton>
              ))}
            </div>
          </div>

          {/* Mini CTA */}
          <motion.div
            className="lg:text-right"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="body-sm text-white/28 mb-3">Ready to start?</p>
            <MagneticButton strength={0.2}>
              <a href="#cta" className="btn btn-primary cursor-none inline-flex">
                Book a discovery call
                <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>→</motion.span>
              </a>
            </MagneticButton>
            <div className="flex items-center gap-2 mt-4 lg:justify-end">
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="label text-[9px] text-emerald-400">2 spots available in Q1 2025</span>
            </div>
          </motion.div>
        </div>

        {/* Links grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {Object.entries(LINKS).map(([cat, links], ci) => (
            <motion.div
              key={cat}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: ci * 0.08 }}
            >
              <h4 className="label text-white/18 mb-4">{cat}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <motion.a
                      href="#"
                      className="body-sm text-white/32 hover:text-white/65 cursor-none transition-colors duration-300 flex items-center gap-2 group"
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="w-0 h-px bg-indigo-500/50 group-hover:w-3 transition-all duration-300" />
                      {link}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6"
          style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
        >
          <motion.p
            className="body-sm text-white/18"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            © 2024 Lumina Studio. All rights reserved.
          </motion.p>

          <motion.div
            className="flex items-center gap-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <a href="#" className="body-sm text-white/18 hover:text-white/40 cursor-none transition-colors">Privacy</a>
            <a href="#" className="body-sm text-white/18 hover:text-white/40 cursor-none transition-colors">Terms</a>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="label text-[9px] text-white/22">All systems operational</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Big bg wordmark */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none select-none">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <span
            className="text-[18vw] font-thin leading-none tracking-tighter"
            style={{ color: "rgba(255,255,255,0.018)" }}
          >
            LUMINA
          </span>
        </motion.div>
      </div>
    </footer>
  );
}
