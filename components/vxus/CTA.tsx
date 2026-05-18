"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import VXUSLogo from "./VXUSLogo";

export default function CTA() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <section id="cta" className="section relative overflow-hidden">
      {/* Ambient glow background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: 800, height: 500,
            background: "radial-gradient(ellipse, rgba(124,90,243,0.14) 0%, rgba(0,207,255,0.05) 50%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
      </div>

      <div className="container relative">
        <div
          className="glass-card trim-top rounded-3xl p-12 lg:p-20 text-center relative overflow-hidden"
          style={{
            background: "rgba(12,11,40,0.8)",
            borderColor: "rgba(124,90,243,0.2)",
          }}
        >
          {/* Decorative top line */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(124,90,243,0.8), rgba(0,207,255,0.6), transparent)" }}
          />

          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          {/* Content */}
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            >
              <div className="flex justify-center mb-6">
                <VXUSLogo size={42} showWordmark={false} />
              </div>

              <h2 className="display-2 mb-5">
                <span style={{ color: "#EDE9FF" }}>Start building</span>
                <br />
                <span className="gradient-text">today, for free.</span>
              </h2>

              <p className="text-base max-w-md mx-auto mb-10" style={{ color: "rgba(237,233,255,0.45)" }}>
                Join 10,000+ teams using VXUS AI to build the
                next generation of intelligent applications.
              </p>
            </motion.div>

            {/* Email form */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
            >
              {!submitted ? (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Work email address"
                    required
                    className="flex-1 px-5 py-3.5 rounded-full text-sm outline-none"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "#EDE9FF",
                      cursor: "text",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "rgba(124,90,243,0.5)")}
                    onBlur={(e)  => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
                  />
                  <button type="submit" className="btn-primary whitespace-nowrap">
                    Get access →
                  </button>
                </form>
              ) : (
                <motion.div
                  className="flex flex-col items-center gap-3"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(0,229,160,0.12)", border: "1px solid rgba(0,229,160,0.3)" }}
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M4 10l5 5 7-8" stroke="#00E5A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <p style={{ color: "#00E5A0", fontSize: "0.9rem" }}>You're on the list! We'll be in touch.</p>
                </motion.div>
              )}

              {/* Trust signals */}
              <div className="flex items-center justify-center gap-6 mt-8 flex-wrap">
                {["No credit card", "SOC 2 certified", "Cancel anytime"].map((t) => (
                  <div key={t} className="flex items-center gap-1.5 text-xs" style={{ color: "rgba(237,233,255,0.28)" }}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2.5 2.5 3.5-4" stroke="rgba(0,229,160,0.6)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {t}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
