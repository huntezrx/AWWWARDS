"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import SectionLabel from "../ui/SectionLabel";
import TextReveal from "../ui/TextReveal";
import MagneticButton from "../ui/MagneticButton";

const PLANS = [
  {
    id: "studio",
    name: "Studio",
    monthly: 4800,
    annual: 3840,
    desc: "For teams shipping their first premium product.",
    badge: null,
    accent: "rgba(255,255,255,0.08)",
    accentBright: "rgba(255,255,255,0.14)",
    textAccent: "rgba(255,255,255,0.7)",
    features: [
      "1 web product / quarter",
      "Custom UI design system",
      "Framer Motion animations",
      "Lighthouse 95+ guaranteed",
      "2 revision rounds",
      "14-day turnaround",
      "Figma source files",
    ],
    cta: "Start Studio",
    ctaStyle: "ghost" as const,
  },
  {
    id: "pro",
    name: "Pro",
    monthly: 9600,
    annual: 7680,
    desc: "For companies that demand the extraordinary.",
    badge: "Most Popular",
    accent: "rgba(99,102,241,0.12)",
    accentBright: "rgba(99,102,241,0.3)",
    textAccent: "#818cf8",
    features: [
      "3 web products / quarter",
      "WebGL + Three.js environments",
      "Custom GSAP + Framer timelines",
      "Post-processing pipeline",
      "Lighthouse 99 guaranteed",
      "Unlimited revisions",
      "5-day turnaround",
      "Full source + CMS",
      "3-month support",
    ],
    cta: "Start Pro",
    ctaStyle: "primary" as const,
  },
  {
    id: "elite",
    name: "Elite",
    monthly: null,
    annual: null,
    desc: "Dedicated studio partnership for iconic brands.",
    badge: "Invitation Only",
    accent: "rgba(251,191,36,0.06)",
    accentBright: "rgba(251,191,36,0.2)",
    textAccent: "#fbbf24",
    features: [
      "Unlimited projects",
      "Dedicated 3-person team",
      "Real-time collaboration",
      "Custom shader development",
      "AI-powered interactions",
      "Weekly strategy sessions",
      "On-site workshops",
      "Priority 24/7 support",
    ],
    cta: "Request Access",
    ctaStyle: "ghost" as const,
  },
];

function PlanCard({ plan, annual, index }: { plan: typeof PLANS[0]; annual: boolean; index: number }) {
  const [hovered, setHovered] = useState(false);
  const isPro = plan.id === "pro";

  const price = annual ? plan.annual : plan.monthly;

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-5%" }}
      transition={{ duration: 0.9, delay: index * 0.12, ease: [0.23, 1, 0.32, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Outer glow for Pro */}
      {isPro && (
        <motion.div
          className="absolute -inset-px rounded-[32px] pointer-events-none"
          animate={{ opacity: hovered ? 1 : 0.7 }}
          style={{
            background: "linear-gradient(135deg, rgba(99,102,241,0.6), rgba(139,92,246,0.4), rgba(6,182,212,0.6))",
            padding: "1px",
            borderRadius: "32px",
          }}
        />
      )}

      <motion.div
        className="relative h-full rounded-[30px] overflow-hidden p-7 md:p-8 flex flex-col"
        style={{
          background: isPro
            ? "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(2,2,6,0.9))"
            : "var(--surface)",
          border: `1px solid ${hovered ? plan.accentBright : plan.accent}`,
          boxShadow: hovered && isPro ? "0 30px 80px rgba(99,102,241,0.25)" : "none",
          minHeight: "540px",
        }}
        animate={{ scale: isPro ? (hovered ? 1.01 : 1) : (hovered ? 1.01 : 1) }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      >
        {/* Badge */}
        {plan.badge && (
          <div className="mb-5">
            <span
              className="label text-[9px] px-3 py-1.5 rounded-full"
              style={{
                background: `${plan.accentBright}`,
                color: plan.textAccent,
                border: `1px solid ${plan.accentBright}`,
              }}
            >
              {plan.badge}
            </span>
          </div>
        )}

        {/* Name + desc */}
        <div className="mb-6">
          <h3 className="heading-xl mb-2" style={{ color: plan.textAccent }}>{plan.name}</h3>
          <p className="body-sm text-white/38">{plan.desc}</p>
        </div>

        {/* Price */}
        <div className="mb-7">
          <AnimatePresence mode="wait">
            {price ? (
              <motion.div
                key={`${plan.id}-${annual}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="flex items-end gap-2"
              >
                <span className="text-[0.875rem] text-white/30 self-start mt-3">$</span>
                <span className="display-lg text-white/90 leading-none tabular-nums">
                  {price.toLocaleString()}
                </span>
                <span className="body-sm text-white/30 mb-1.5">/mo</span>
              </motion.div>
            ) : (
              <motion.div
                key="custom"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex items-end"
              >
                <span className="display-lg" style={{ color: plan.textAccent }}>Custom</span>
              </motion.div>
            )}
          </AnimatePresence>
          {annual && price && (
            <p className="body-sm text-white/28 mt-1">
              Billed annually · saves ${((plan.monthly! - price) * 12).toLocaleString()}/yr
            </p>
          )}
        </div>

        {/* Features */}
        <ul className="space-y-3 flex-1 mb-8">
          {plan.features.map((feat, fi) => (
            <motion.li
              key={feat}
              className="flex items-start gap-3 body-sm"
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + fi * 0.05, duration: 0.5 }}
            >
              <span className="mt-0.5 text-[11px] shrink-0" style={{ color: plan.textAccent }}>✓</span>
              <span className="text-white/55">{feat}</span>
            </motion.li>
          ))}
        </ul>

        {/* CTA */}
        <MagneticButton className="w-full">
          <motion.button
            className="w-full btn"
            style={
              plan.ctaStyle === "primary"
                ? {
                    background: "linear-gradient(135deg, #6366f1, #7c3aed)",
                    color: "#fff",
                    boxShadow: "0 0 0 1px rgba(99,102,241,0.4), 0 8px 32px rgba(99,102,241,0.3)",
                  }
                : {
                    background: "transparent",
                    color: plan.textAccent,
                    border: `1px solid ${plan.accentBright}`,
                  }
            }
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {plan.cta}
            <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
              →
            </motion.span>
          </motion.button>
        </MagneticButton>
      </motion.div>
    </motion.div>
  );
}

export default function Pricing() {
  const [annual, setAnnual] = useState(true);
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  return (
    <section ref={ref} id="pricing" className="section relative overflow-hidden" style={{ background: "var(--bg)" }}>
      {/* Background */}
      <motion.div className="absolute inset-0 pointer-events-none" style={{ y: bgY }}>
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] opacity-[0.08]"
          style={{ background: "radial-gradient(ellipse, #6366f1, transparent 70%)", filter: "blur(80px)" }}
        />
      </motion.div>

      <div className="container relative">
        {/* Header */}
        <div className="text-center mb-12 md:mb-14">
          <SectionLabel align="center">Pricing</SectionLabel>
          <TextReveal
            text="Transparent pricing. Extraordinary results."
            className="display-md text-white/90 justify-center mb-4"
          />
          <motion.p
            className="body-lg text-white/38 max-w-md mx-auto"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            No retainers. No surprises. Cancel anytime.
          </motion.p>

          {/* Toggle */}
          <motion.div
            className="flex items-center justify-center gap-4 mt-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <span className={`body-sm transition-colors ${!annual ? "text-white/80" : "text-white/28"}`}>Monthly</span>
            <button
              onClick={() => setAnnual((a) => !a)}
              className="relative w-12 h-6 rounded-full cursor-none transition-colors duration-300"
              style={{ background: annual ? "#6366f1" : "rgba(255,255,255,0.12)" }}
              aria-label="Toggle annual billing"
            >
              <motion.div
                className="absolute top-1 w-4 h-4 rounded-full bg-white shadow"
                animate={{ left: annual ? "calc(100% - 20px)" : "4px" }}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
              />
            </button>
            <span className={`body-sm transition-colors ${annual ? "text-white/80" : "text-white/28"}`}>
              Annual
              <span className="ml-2 label text-[9px] text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-full">
                Save 20%
              </span>
            </span>
          </motion.div>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 items-start">
          {PLANS.map((p, i) => <PlanCard key={p.id} plan={p} annual={annual} index={i} />)}
        </div>

        {/* Footer note */}
        <motion.p
          className="text-center body-sm text-white/22 mt-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          All plans include NDA, IP transfer, and source code. Questions?{" "}
          <a href="#faq" className="text-indigo-400/70 hover:text-indigo-400 transition-colors cursor-none">See FAQ</a>
          {" "}or{" "}
          <a href="#cta" className="text-indigo-400/70 hover:text-indigo-400 transition-colors cursor-none">book a call</a>.
        </motion.p>
      </div>
    </section>
  );
}
