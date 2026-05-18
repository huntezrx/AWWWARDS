"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import SectionLabel from "../ui/SectionLabel";
import TextReveal from "../ui/TextReveal";

const FAQS = [
  {
    q: "What makes Lumina different from a typical design agency?",
    a: "Most agencies separate design and engineering — we don't. Every designer at Lumina writes production code. Every engineer thinks in motion. The result is a product where design and implementation are one unified vision, not a hand-off game.",
  },
  {
    q: "How do you consistently hit Lighthouse 99?",
    a: "It starts in architecture, not optimization. We use Next.js App Router with RSC, edge functions, aggressive image optimization, and zero layout shift by construction. Performance is a design constraint, not an afterthought.",
  },
  {
    q: "Do you work with early-stage startups or only established brands?",
    a: "Both — but with different structures. Early-stage companies typically work with us on a focused Sprint model: one extraordinary landing page or product launch in 2–4 weeks. Established brands usually engage on a longer partnership basis.",
  },
  {
    q: "What does the process look like from day one?",
    a: "Week 1 is discovery and architecture. Week 2 is design sprints and prototype. Weeks 3–4 are production build. Then review, polish, and handoff. You're in every session, never waiting on updates.",
  },
  {
    q: "Will I own the code and all assets?",
    a: "Absolutely. You get full IP transfer, all source files, Figma originals, and a 30-minute handoff call. The code is yours the moment you pay. No lock-in, no proprietary CMS you can't escape.",
  },
  {
    q: "Can you work with our existing tech stack?",
    a: "Yes. We're framework-agnostic at the integration layer. Our default stack is Next.js + TypeScript, but we've shipped production code in Nuxt, Remix, Astro, and even vanilla. We meet you where your team lives.",
  },
  {
    q: "What happens if we need revisions after launch?",
    a: "Pro and Elite plans include ongoing support. Studio plans include 2 revision rounds pre-launch and 30 days of bug fixes post-launch. After that, we offer monthly retainer support at a flat rate — no surprise invoices.",
  },
];

function FAQItem({ item, index }: { item: typeof FAQS[0]; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      className="border-b cursor-none"
      style={{ borderColor: "var(--border)" }}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-3%" }}
      transition={{ duration: 0.6, delay: index * 0.06, ease: [0.23, 1, 0.32, 1] }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-6 py-6 text-left group cursor-none"
        aria-expanded={open}
      >
        <span
          className="body-lg transition-colors duration-300"
          style={{ color: open ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.62)" }}
        >
          {item.q}
        </span>

        <motion.div
          className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
          style={{
            background: open ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.04)",
            border: `1px solid ${open ? "rgba(99,102,241,0.3)" : "rgba(255,255,255,0.06)"}`,
          }}
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
        >
          <span className="text-sm" style={{ color: open ? "#818cf8" : "rgba(255,255,255,0.3)" }}>+</span>
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-6 pr-14">
              <p className="body-base text-white/42 leading-relaxed">{item.a}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);

  return (
    <section ref={ref} id="faq" className="section relative overflow-hidden" style={{ background: "var(--bg)" }}>
      {/* Bg glow */}
      <motion.div className="absolute inset-0 pointer-events-none" style={{ y }}>
        <div
          className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[600px] opacity-[0.07]"
          style={{ background: "radial-gradient(ellipse, #8b5cf6, transparent 70%)", filter: "blur(80px)" }}
        />
      </motion.div>

      <div className="container relative">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-16 items-start">
          {/* Left sticky header */}
          <div className="lg:sticky lg:top-24">
            <SectionLabel>FAQ</SectionLabel>
            <TextReveal
              text="Every question you'd want answered."
              className="display-md text-white/90 mb-5"
            />
            <motion.p
              className="body-base text-white/38 mb-8"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Still have questions? We&apos;re real humans who love to talk craft.
            </motion.p>

            <motion.a
              href="#cta"
              className="inline-flex items-center gap-3 btn btn-ghost cursor-none"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Book a call
              <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>→</motion.span>
            </motion.a>
          </div>

          {/* Right: FAQ list */}
          <div>
            {FAQS.map((item, i) => (
              <FAQItem key={item.q} item={item} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
