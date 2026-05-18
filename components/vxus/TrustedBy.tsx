"use client";

import { motion } from "framer-motion";

const LOGOS = [
  "Anthropic", "OpenAI", "Stripe", "Notion", "Linear",
  "Figma", "Vercel", "Supabase", "Railway", "Resend",
  "Anthropic", "OpenAI", "Stripe", "Notion", "Linear",
  "Figma", "Vercel", "Supabase", "Railway", "Resend",
];

function LogoItem({ name }: { name: string }) {
  return (
    <div
      className="flex items-center justify-center px-8 py-3 flex-shrink-0 select-none"
      style={{
        fontFamily: "var(--font-syne)",
        fontSize: "0.85rem",
        fontWeight: 600,
        letterSpacing: "0.06em",
        color: "rgba(237,233,255,0.2)",
      }}
    >
      {name}
    </div>
  );
}

export default function TrustedBy() {
  return (
    <section className="py-16 relative overflow-hidden">
      <div className="container mb-8">
        <motion.p
          className="text-center label"
          style={{ color: "rgba(237,233,255,0.22)" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Trusted by forward-thinking teams
        </motion.p>
      </div>

      {/* Marquee */}
      <div className="relative">
        {/* Edge fades */}
        <div className="absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, var(--vx-black), transparent)" }} />
        <div className="absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, var(--vx-black), transparent)" }} />

        <div className="flex" style={{ width: "max-content" }}>
          <div className="flex animate-marquee" style={{ willChange: "transform" }}>
            {LOGOS.map((l, i) => <LogoItem key={i} name={l} />)}
          </div>
          <div className="flex animate-marquee" style={{ willChange: "transform", animationDelay: "-18s" }}>
            {LOGOS.map((l, i) => <LogoItem key={i} name={l} />)}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="container mt-16">
        <div className="divider" />
      </div>
    </section>
  );
}
