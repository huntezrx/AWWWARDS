"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

// Tracks mouse state shared across the cursor sub-components
function useCursorState() {
  const rawX     = useMotionValue(-200);
  const rawY     = useMotionValue(-200);
  const [state, setState] = useState<"default" | "hover" | "click" | "drag">("default");
  const [label, setLabel] = useState("");

  useEffect(() => {
    const move = (e: MouseEvent) => { rawX.set(e.clientX); rawY.set(e.clientY); };
    const down = () => setState("click");
    const up   = () => setState((s) => (s === "click" ? "default" : s));

    const over = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      const interactive = el.closest("a,button,[data-cursor]");
      if (interactive) {
        setState("hover");
        const lbl = interactive.getAttribute("data-cursor-label") ?? "";
        setLabel(lbl);
      } else {
        setState((s) => (s === "click" ? "click" : "default"));
        setLabel("");
      }
    };

    window.addEventListener("mousemove",  move,  { passive: true });
    window.addEventListener("mouseover",  over,  { passive: true });
    window.addEventListener("mousedown",  down);
    window.addEventListener("mouseup",    up);
    return () => {
      window.removeEventListener("mousemove",  move);
      window.removeEventListener("mouseover",  over);
      window.removeEventListener("mousedown",  down);
      window.removeEventListener("mouseup",    up);
    };
  }, [rawX, rawY]);

  return { rawX, rawY, state, label };
}

// Ambient light that follows cursor — sits on the page as DOM glow
function CursorLight({ x, y }: { x: number; y: number }) {
  return (
    <div
      className="fixed pointer-events-none z-[99990] rounded-full"
      style={{
        width: 600,
        height: 600,
        left: x - 300,
        top: y - 300,
        background: "radial-gradient(circle, rgba(99,102,241,0.07) 0%, rgba(139,92,246,0.03) 40%, transparent 70%)",
        transform: "translate3d(0,0,0)",
        transition: "left 0.12s linear, top 0.12s linear",
      }}
    />
  );
}

export default function CustomCursor() {
  const { rawX, rawY, state, label } = useCursorState();

  // Outer ring — slow spring
  const ringCfg = { stiffness: 220, damping: 26, mass: 0.6 };
  const ringX = useSpring(rawX, ringCfg);
  const ringY = useSpring(rawY, ringCfg);

  // Inner dot — snappy
  const dotCfg = { stiffness: 700, damping: 40, mass: 0.2 };
  const dotX = useSpring(rawX, dotCfg);
  const dotY = useSpring(rawY, dotCfg);

  // Light position — very slow lerp via spring
  const lightX = useSpring(rawX, { stiffness: 60, damping: 20 });
  const lightY = useSpring(rawY, { stiffness: 60, damping: 20 });

  const [lightPos, setLightPos] = useState({ x: -300, y: -300 });
  useEffect(() => {
    const unsub = lightX.on("change", (v) => setLightPos((p) => ({ ...p, x: v })));
    return unsub;
  }, [lightX]);
  useEffect(() => {
    const unsub = lightY.on("change", (v) => setLightPos((p) => ({ ...p, y: v })));
    return unsub;
  }, [lightY]);

  const isHover = state === "hover";
  const isClick = state === "click";

  return (
    <>
      <CursorLight x={lightPos.x} y={lightPos.y} />

      {/* Outer ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[99997] mix-blend-difference"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          className="rounded-full border border-white flex items-center justify-center overflow-hidden"
          animate={{
            width:  isHover ? 56 : isClick ? 18 : 32,
            height: isHover ? 56 : isClick ? 18 : 32,
            opacity: isHover ? 0.7 : 1,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
        >
          <motion.span
            className="text-white text-[7px] font-medium uppercase tracking-widest whitespace-nowrap"
            animate={{ opacity: label ? 1 : 0, scale: label ? 1 : 0.5 }}
            transition={{ duration: 0.2 }}
          >
            {label}
          </motion.span>
        </motion.div>
      </motion.div>

      {/* Inner dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[99998]"
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          className="rounded-full bg-white"
          animate={{
            width:  isHover ? 5 : isClick ? 14 : 4,
            height: isHover ? 5 : isClick ? 14 : 4,
            opacity: isHover ? 0.5 : 1,
          }}
          transition={{ type: "spring", stiffness: 600, damping: 35 }}
        />
      </motion.div>

      {/* Click ripple */}
      {isClick && (
        <motion.div
          className="fixed top-0 left-0 pointer-events-none z-[99996] rounded-full border border-indigo-400/40"
          style={{ x: dotX, y: dotY, translateX: "-50%", translateY: "-50%" }}
          initial={{ width: 0, height: 0, opacity: 0.8 }}
          animate={{ width: 80, height: 80, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      )}
    </>
  );
}
