"use client";

import { motion, type Variants } from "framer-motion";

const FEATURES = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M11 2C6.03 2 2 6.03 2 11s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9z" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M11 7v4l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        <circle cx="11" cy="11" r="1.5" fill="currentColor"/>
      </svg>
    ),
    label: "Neural Engine",
    title: "Process at the speed of thought",
    description: "Our proprietary neural architecture processes complex queries in under 50ms. Built on next-generation transformer models with 1T+ parameters.",
    accent: "#7C5AF3",
    large: true,
    extra: (
      <div className="mt-6 relative h-16 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bottom-0 w-1.5 rounded-t-full"
            style={{
              left: `${i * 14}%`,
              background: "linear-gradient(to top, #7C5AF3, #00CFFF)",
              opacity: 0.6 + (i % 3) * 0.13,
            }}
            animate={{ height: [`${20 + (i % 4) * 15}%`, `${60 + (i % 3) * 20}%`, `${20 + (i % 4) * 15}%`] }}
            transition={{ duration: 1.2 + i * 0.15, repeat: Infinity, ease: "easeInOut", delay: i * 0.1 }}
          />
        ))}
      </div>
    ),
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M3 11h16M3 6h16M3 16h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
    label: "Multimodal",
    title: "Text, image, code, audio",
    description: "Understands and generates across all modalities. One API, infinite possibilities.",
    accent: "#00CFFF",
    large: false,
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
        <rect x="12" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
        <rect x="3" y="12" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
        <rect x="12" y="12" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
      </svg>
    ),
    label: "Context Window",
    title: "1M token context",
    description: "Entire codebases, legal documents, financial records — analyzed in one shot.",
    accent: "#A68FFF",
    large: false,
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M11 3l2 5h5l-4 3 1.5 5L11 13l-4.5 3L8 11 4 8h5L11 3z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
      </svg>
    ),
    label: "Enterprise Security",
    title: "Zero-trust, SOC 2 Type II",
    description: "Your data never trains our models. End-to-end encryption, VPC isolation, and full audit logs. GDPR, HIPAA, and CCPA compliant out of the box.",
    accent: "#00E5A0",
    large: true,
    extra: (
      <div className="mt-5 flex items-center gap-2.5 flex-wrap">
        {["SOC 2", "GDPR", "HIPAA", "ISO 27001"].map((badge) => (
          <div
            key={badge}
            className="px-3 py-1.5 rounded-full text-xs font-medium"
            style={{
              background: "rgba(0,229,160,0.08)",
              border: "1px solid rgba(0,229,160,0.22)",
              color: "#00E5A0",
              letterSpacing: "0.05em",
            }}
          >
            {badge}
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M4 6l7 5 7-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        <rect x="3" y="5" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.4"/>
      </svg>
    ),
    label: "Workflow Automation",
    title: "Automate entire workflows",
    description: "Chain AI agents to execute multi-step processes — from data ingestion to final report delivery.",
    accent: "#7C5AF3",
    large: false,
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M5 16l4-4 3 3 5-7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="2" y="2" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.4"/>
      </svg>
    ),
    label: "Analytics",
    title: "Real-time intelligence",
    description: "Live dashboards powered by AI. Anomaly detection, trend forecasting, and executive narratives generated automatically.",
    accent: "#00CFFF",
    large: false,
  },
];

const card: Variants = {
  hidden: { opacity: 0, y: 32 },
  show:   { opacity: 1, y: 0 },
};

export default function Features() {
  return (
    <section id="features" className="section">
      <div className="container">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        >
          <div className="pill pill-violet mb-5 inline-flex">Platform capabilities</div>
          <h2 className="display-2 mb-5">
            <span style={{ color: "#EDE9FF" }}>Built different,</span>{" "}
            <span className="gradient-text">by design.</span>
          </h2>
          <p className="text-base max-w-lg mx-auto" style={{ color: "rgba(237,233,255,0.45)" }}>
            Every feature is engineered for enterprises that demand precision,
            speed, and absolute reliability.
          </p>
        </motion.div>

        {/* Bento grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={{ show: { transition: { staggerChildren: 0.1 } } }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-5%" }}
        >
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.label}
              variants={card}
              className={`glass-card trim-top rounded-2xl p-7 flex flex-col ${
                f.large ? "md:col-span-1 lg:col-span-1" : ""
              }`}
            >
              {/* Icon */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-5 flex-shrink-0"
                style={{
                  background: `${f.accent}14`,
                  border: `1px solid ${f.accent}30`,
                  color: f.accent,
                }}
              >
                {f.icon}
              </div>

              {/* Label */}
              <div className="label mb-2.5" style={{ color: `${f.accent}` }}>{f.label}</div>

              {/* Title */}
              <h3
                className="text-lg font-semibold mb-2.5 leading-snug"
                style={{ fontFamily: "var(--font-syne)", color: "#EDE9FF" }}
              >
                {f.title}
              </h3>

              {/* Description */}
              <p className="text-sm leading-relaxed" style={{ color: "rgba(237,233,255,0.45)" }}>
                {f.description}
              </p>

              {/* Extra content */}
              {f.extra}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
