"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function VXUSCursor() {
  const mx = useMotionValue(-100);
  const my = useMotionValue(-100);
  const sx = useSpring(mx, { stiffness: 280, damping: 28, mass: 0.5 });
  const sy = useSpring(my, { stiffness: 280, damping: 28, mass: 0.5 });

  const dotX = useSpring(mx, { stiffness: 600, damping: 32 });
  const dotY = useSpring(my, { stiffness: 600, damping: 32 });

  const hovering = useRef(false);
  const circleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const move = (e: MouseEvent) => { mx.set(e.clientX); my.set(e.clientY); };
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const isHover = !!(t.closest("a, button, [role=button], input, textarea, select"));
      hovering.current = isHover;
      if (circleRef.current) {
        circleRef.current.style.transform = isHover
          ? "translate(-50%,-50%) scale(1.8)"
          : "translate(-50%,-50%) scale(1)";
        circleRef.current.style.borderColor = isHover
          ? "rgba(166,143,255,0.7)"
          : "rgba(124,90,243,0.6)";
        circleRef.current.style.background = isHover ? "rgba(124,90,243,0.08)" : "transparent";
      }
    };
    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseover", over, { passive: true });
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
    };
  }, [mx, my]);

  return (
    <>
      {/* Ring */}
      <motion.div
        ref={circleRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{
          x: sx, y: sy,
          width: 36, height: 36,
          marginLeft: -18, marginTop: -18,
          borderRadius: "50%",
          border: "1px solid rgba(124,90,243,0.6)",
          transition: "transform 0.25s ease, border-color 0.25s, background 0.25s",
        }}
      />
      {/* Dot */}
      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none rounded-full"
        style={{
          x: dotX, y: dotY,
          width: 5, height: 5,
          marginLeft: -2.5, marginTop: -2.5,
          background: "#A68FFF",
          boxShadow: "0 0 8px rgba(166,143,255,0.8)",
        }}
      />
    </>
  );
}
