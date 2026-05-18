"use client";

import { useRef, useState, ReactNode } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";

interface LiquidCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
}

export default function LiquidCard({
  children,
  className = "",
  glowColor = "rgba(99,102,241,0.4)",
}: LiquidCardProps) {
  const cardRef  = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(false);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const mxS    = useSpring(mouseX, { stiffness: 200, damping: 25 });
  const myS    = useSpring(mouseY, { stiffness: 200, damping: 25 });

  // 3D tilt
  const rotX = useTransform(myS, [0, 1], [8, -8]);
  const rotY = useTransform(mxS, [0, 1], [-8, 8]);

  // Specular highlight position
  const hlX = useTransform(mxS, [0, 1], ["10%", "90%"]);
  const hlY = useTransform(myS, [0, 1], ["10%", "90%"]);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top)  / rect.height);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMove}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); mouseX.set(0.5); mouseY.set(0.5); }}
      style={{
        rotateX: hover ? rotX : 0,
        rotateY: hover ? rotY : 0,
        transformStyle: "preserve-3d",
        perspective: 800,
      }}
      className={`relative cursor-none ${className}`}
      animate={{ scale: hover ? 1.02 : 1 }}
      transition={{ type: "spring", stiffness: 350, damping: 28 }}
    >
      {/* Main glass surface */}
      <div className="relative w-full h-full rounded-3xl overflow-hidden glass border border-white/[0.07]">
        {/* Animated shimmer gradient */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${hlX} ${hlY}, rgba(255,255,255,0.08) 0%, transparent 60%)`,
          }}
          animate={{ opacity: hover ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Edge glow on hover */}
        <motion.div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          animate={{
            boxShadow: hover
              ? `inset 0 0 30px ${glowColor}, 0 0 40px ${glowColor}`
              : "inset 0 0 0px transparent",
          }}
          transition={{ duration: 0.5 }}
        />

        {/* Liquid distortion top-edge */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-[1px] pointer-events-none"
          style={{
            background: `linear-gradient(90deg, transparent, ${glowColor}, transparent)`,
            opacity: hover ? 1 : 0.3,
            transition: "opacity 0.4s",
          }}
        />

        <div className="relative z-10">{children}</div>
      </div>

      {/* Drop shadow glow */}
      <motion.div
        className="absolute inset-0 -z-10 rounded-3xl blur-2xl"
        style={{ background: glowColor }}
        animate={{ opacity: hover ? 0.25 : 0, scale: 1.05 }}
        transition={{ duration: 0.5 }}
      />
    </motion.div>
  );
}
