"use client";

import { motion } from "framer-motion";

/* Volumetric light rays — CSS conic gradient + motion */
export default function LightRays({ className = "" }: { className?: string }) {
  const RAYS = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    angle: (i / 8) * 360,
    width: 1 + (i % 3) * 0.8,
    opacity: 0.03 + (i % 4) * 0.015,
    speed: 12 + i * 3,
    delay: i * 1.2,
  }));

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {RAYS.map((r) => (
        <motion.div
          key={r.id}
          className="absolute"
          style={{
            top: "50%",
            left: "50%",
            width: "200%",
            height: `${r.width}px`,
            transformOrigin: "0 50%",
            background: `linear-gradient(90deg, rgba(99,102,241,${r.opacity * 4}) 0%, rgba(139,92,246,${r.opacity}) 30%, transparent 80%)`,
            rotate: `${r.angle}deg`,
            translateY: "-50%",
          }}
          animate={{
            opacity: [r.opacity * 0.4, r.opacity, r.opacity * 0.4],
            scaleX:  [0.8, 1.05, 0.8],
          }}
          transition={{
            duration: r.speed,
            repeat: Infinity,
            ease: "easeInOut",
            delay: r.delay,
          }}
        />
      ))}

      {/* Central bloom */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: 300,
          height: 300,
          background: "radial-gradient(circle, rgba(99,102,241,0.18) 0%, rgba(139,92,246,0.06) 40%, transparent 70%)",
          filter: "blur(20px)",
        }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
