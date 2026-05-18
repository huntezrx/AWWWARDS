"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [label, setLabel] = useState("");

  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const springX = useSpring(cursorX, springConfig);
  const springY = useSpring(cursorY, springConfig);

  const dotSpringConfig = { damping: 50, stiffness: 800, mass: 0.1 };
  const dotX = useSpring(cursorX, dotSpringConfig);
  const dotY = useSpring(cursorY, dotSpringConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleHoverStart = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive =
        target.closest("a") ||
        target.closest("button") ||
        target.closest("[data-cursor='hover']");

      if (isInteractive) {
        setIsHovering(true);
        const dataLabel = target.closest("[data-cursor-label]")?.getAttribute("data-cursor-label");
        if (dataLabel) setLabel(dataLabel);
      } else {
        setIsHovering(false);
        setLabel("");
      }
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mousemove", handleHoverStart);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mousemove", handleHoverStart);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [cursorX, cursorY]);

  return (
    <>
      {/* Outer ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[99999] mix-blend-difference"
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          className="rounded-full border border-white/80 flex items-center justify-center"
          animate={{
            width: isHovering ? 60 : isClicking ? 20 : 36,
            height: isHovering ? 60 : isClicking ? 20 : 36,
            opacity: isHovering ? 0.8 : 1,
          }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
        >
          {label && (
            <span className="text-white text-[8px] font-medium uppercase tracking-widest whitespace-nowrap">
              {label}
            </span>
          )}
        </motion.div>
      </motion.div>

      {/* Inner dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[99999]"
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
            width: isHovering ? 6 : isClicking ? 12 : 4,
            height: isHovering ? 6 : isClicking ? 12 : 4,
            opacity: isHovering ? 0.6 : 1,
          }}
          transition={{ type: "spring", damping: 30, stiffness: 600 }}
        />
      </motion.div>
    </>
  );
}
