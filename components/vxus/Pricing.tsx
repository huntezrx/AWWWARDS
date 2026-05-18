"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PLANS = [
  {
    name: "Starter",
    monthlyPrice: 0,
    annualPrice: 0,
    description: "For teams exploring AI capabilities",
    accent: "rgba(237,233,255,0.6)",
    featured: false,
    cta: "Start free",
    features: [
      "1M tokens / month",
      "GPT-4o access",
      "REST API",
      "Community support",
      "5 team seats",
    ],
  },
  {
    name: "Pro",
    monthlyPrice: 49,
    annualPrice: 39,
    description: "For teams ready to scale AI across the organization",
    accent: "#A68FFF",
    featured: true,
    cta: "Start 14-day trial",
    features: [
      "50M tokens / month",
      "GPT-5 access",
      "Fine-tuning support",
      "Priority support",
      "Unlimited seats",
      "Advanced analytics",
      "Custom system prompts",
    ],
  },
  {
    name: "Enterprise",
    monthlyPrice: null,
    annualPrice: null,
    description: "For organizations demanding peak performance and compliance",
    accent: "#00CFFF",
    featured: false,
    cta: "Contact sales",
    features: [
      "Unlimited tokens",
      "Dedicated infrastructure",
      "Custom model fine-tuning",
      "SLA guarantees",
      "24/7 dedicated support",
      "On-prem deployment",
      "HIPAA / FedRAMP",
    ],
  },
];

export default function Pricing() {
  const [annual, setAnnual] = useState(true);

  return (
    <section id="pricing" className="section">
      <div className="container">
        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        >
          <div className="pill pill-violet mb-5 inline-flex">Simple pricing</div>
          <h2 className="display-2 mb-5">
            <span style={{ color: "#EDE9FF" }}>Start free,</span>{" "}
            <span className="gradient-text">scale infinitely.</span>
          </h2>

          {/* Toggle */}
          <div className="inline-flex items-center gap-4 mt-6">
            <span className="label" style={{ color: annual ? "rgba(237,233,255,0.35)" : "#EDE9FF" }}>Monthly</span>
            <button
              onClick={() => setAnnual(!annual)}
              className="relative w-12 h-6 rounded-full transition-colors duration-300"
              style={{ background: annual ? "#7C5AF3" : "rgba(255,255,255,0.1)" }}
            >
              <motion.div
                className="absolute top-1 w-4 h-4 rounded-full bg-white"
                animate={{ left: annual ? 26 : 4 }}
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            </button>
            <div className="flex items-center gap-2">
              <span className="label" style={{ color: annual ? "#EDE9FF" : "rgba(237,233,255,0.35)" }}>Annual</span>
              <span className="pill pill-cyan" style={{ fontSize: "0.6rem", padding: "0.2rem 0.6rem" }}>-20%</span>
            </div>
          </div>
        </motion.div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              className={`relative rounded-2xl ${plan.featured ? "" : "glass-card trim-top"}`}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-5%" }}
              transition={{ duration: 0.7, delay: i * 0.12, ease: [0.23, 1, 0.32, 1] }}
            >
              {/* Featured: gradient border via padding trick */}
              {plan.featured && (
                <div
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    background: "linear-gradient(135deg, rgba(124,90,243,0.7), rgba(0,207,255,0.5))",
                    padding: "1px",
                  }}
                >
                  <div
                    className="w-full h-full rounded-2xl"
                    style={{ background: "#0C0B28" }}
                  />
                </div>
              )}

              <div className={`relative z-10 p-8 ${plan.featured ? "" : ""}`}>
                {/* Badge */}
                {plan.featured && (
                  <div className="pill pill-violet mb-5 inline-flex">Most popular</div>
                )}

                {/* Name */}
                <h3
                  className="text-xl font-semibold mb-1.5"
                  style={{ fontFamily: "var(--font-syne)", color: plan.accent }}
                >
                  {plan.name}
                </h3>
                <p className="text-sm mb-6" style={{ color: "rgba(237,233,255,0.42)" }}>
                  {plan.description}
                </p>

                {/* Price */}
                <div className="mb-8">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={annual ? "annual" : "monthly"}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                    >
                      {plan.monthlyPrice !== null ? (
                        <div className="flex items-end gap-1.5">
                          <span
                            className="text-5xl font-bold"
                            style={{ fontFamily: "var(--font-syne)", color: "#EDE9FF" }}
                          >
                            ${annual ? plan.annualPrice : plan.monthlyPrice}
                          </span>
                          <span className="label mb-2.5" style={{ color: "rgba(237,233,255,0.38)" }}>/ mo</span>
                        </div>
                      ) : (
                        <div className="text-3xl font-bold" style={{ fontFamily: "var(--font-syne)", color: "#EDE9FF" }}>
                          Custom
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                  {annual && plan.monthlyPrice !== null && plan.annualPrice !== null && plan.annualPrice < plan.monthlyPrice && (
                    <p className="text-xs mt-1" style={{ color: "rgba(0,229,160,0.7)" }}>
                      Save ${(plan.monthlyPrice - plan.annualPrice) * 12}/year
                    </p>
                  )}
                </div>

                {/* CTA */}
                <button
                  className={`w-full ${plan.featured ? "btn-primary justify-center" : "btn-ghost justify-center"} mb-8`}
                >
                  {plan.cta}
                </button>

                {/* Features */}
                <ul className="flex flex-col gap-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm" style={{ color: "rgba(237,233,255,0.6)" }}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="flex-shrink-0">
                        <path d="M2 7l4 4 6-7" stroke={plan.accent} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Enterprise note */}
        <motion.p
          className="text-center text-sm mt-10"
          style={{ color: "rgba(237,233,255,0.3)" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          All plans include a 99.99% uptime SLA, end-to-end encryption, and dedicated onboarding support.
        </motion.p>
      </div>
    </section>
  );
}
