"use client";

import { useRef, useCallback } from "react";

export function useMagneticEffect(strength: number = 0.4) {
  const ref = useRef<HTMLElement>(null);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;

      el.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    },
    [strength]
  );

  const handleMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "translate(0px, 0px)";
    el.style.transition = "transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)";
  }, []);

  const handleMouseEnter = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transition = "transform 0.1s linear";
  }, []);

  return { ref, handleMouseMove, handleMouseLeave, handleMouseEnter };
}
