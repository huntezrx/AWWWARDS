"use client";

import { useRef, useEffect, useState } from "react";

interface PhysicsState {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export function useElasticMouse(stiffness = 0.08, damping = 0.75) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const state = useRef<PhysicsState>({ x: 0, y: 0, vx: 0, vy: 0 });
  const target = useRef({ x: 0, y: 0 });
  const rafRef = useRef(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    const tick = () => {
      const s = state.current;
      const dx = target.current.x - s.x;
      const dy = target.current.y - s.y;
      s.vx = (s.vx + dx * stiffness) * damping;
      s.vy = (s.vy + dy * stiffness) * damping;
      s.x += s.vx;
      s.y += s.vy;
      setPos({ x: s.x, y: s.y });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [stiffness, damping]);

  return pos;
}

// Inertia-based scroll value
export function useScrollInertia(factor = 0.08) {
  const [scrollY, setScrollY] = useState(0);
  const current = useRef(0);
  const target  = useRef(0);
  const rafRef  = useRef(0);

  useEffect(() => {
    const onScroll = () => { target.current = window.scrollY; };
    window.addEventListener("scroll", onScroll, { passive: true });

    const tick = () => {
      current.current += (target.current - current.current) * factor;
      setScrollY(current.current);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [factor]);

  return scrollY;
}
