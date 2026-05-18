"use client";

import { motion } from "framer-motion";

const footerLinks = {
  Work: ["Projects", "Case Studies", "Archive", "Process"],
  Studio: ["About", "Team", "Culture", "Careers"],
  Services: ["Design", "Development", "Motion", "3D"],
  Connect: ["Twitter", "Dribbble", "GitHub", "LinkedIn"],
};

export default function Footer() {
  return (
    <footer
      className="relative pt-24 pb-8 overflow-hidden"
      style={{ background: "#020206" }}
    >
      {/* Top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />

      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] opacity-20"
          style={{
            background: "radial-gradient(ellipse, rgba(99,102,241,0.3) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Big logo */}
        <div className="mb-20 overflow-hidden">
          <motion.div
            className="text-[15vw] font-thin text-white/[0.04] leading-none tracking-tighter select-none"
            initial={{ y: "30%", opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
          >
            LUMINA
          </motion.div>
        </div>

        {/* Links grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-20 pb-16 border-b border-white/5">
          {Object.entries(footerLinks).map(([category, links], catIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: catIndex * 0.1, duration: 0.6 }}
            >
              <h4 className="text-xs text-white/20 tracking-[0.4em] uppercase font-light mb-5">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <motion.a
                      href="#"
                      className="text-sm text-white/40 hover:text-white/80 transition-colors duration-300 cursor-none group flex items-center gap-2"
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="w-0 group-hover:w-3 h-px bg-indigo-500 transition-all duration-300 overflow-hidden" />
                      {link}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <motion.div
            className="flex items-center gap-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <span className="text-sm font-thin tracking-[0.2em] text-white/40">LUMINA</span>
            <span className="text-xs text-white/20">©2024 All rights reserved.</span>
          </motion.div>

          <motion.div
            className="flex items-center gap-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <span className="text-xs text-white/20 hover:text-white/40 cursor-none transition-colors duration-300">
              Privacy Policy
            </span>
            <span className="text-xs text-white/20 hover:text-white/40 cursor-none transition-colors duration-300">
              Terms of Use
            </span>
            <div className="flex items-center gap-2 text-xs text-white/20">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Available for projects
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
