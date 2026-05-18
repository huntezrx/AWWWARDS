"use client";

import { useEffect, useRef, useState } from "react";

interface ScrollVelocityState {
  velocity: number;   // px/frame, positive = down
  direction: 1 | -1;
  isScrolling: boolean;
}

/* Tracks scroll velocity and applies motion-blur-like CSS to body */
export function useScrollVelocity() {
  const [state, setState] = useState<ScrollVelocityState>({
    velocity: 0,
    direction: 1,
    isScrolling: false,
  });

  const prevY      = useRef(0);
  const velocity   = useRef(0);
  const rafRef     = useRef(0);
  const idleTimer  = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      const delta    = currentY - prevY.current;
      prevY.current  = currentY;

      velocity.current = velocity.current * 0.6 + delta * 0.4; // exponential smooth

      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => {
        velocity.current = 0;
        setState((s) => ({ ...s, velocity: 0, isScrolling: false }));
      }, 120);

      setState({
        velocity: velocity.current,
        direction: delta >= 0 ? 1 : -1,
        isScrolling: true,
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, []);

  // Apply subtle skewY + blur to main content based on velocity
  useEffect(() => {
    const main = document.querySelector("main") as HTMLElement | null;
    if (!main) return;

    const abs   = Math.abs(state.velocity);
    const skew  = Math.min(abs * 0.025, 0.8);   // max 0.8deg
    const blur  = Math.min(abs * 0.08,  2.5);    // max 2.5px

    if (abs > 1.5) {
      main.style.transition = "none";
      main.style.transform  = `skewY(${-skew * state.direction}deg)`;
      main.style.filter     = `blur(${blur}px)`;
    } else {
      main.style.transition = "transform 0.5s cubic-bezier(0.23,1,0.32,1), filter 0.4s ease";
      main.style.transform  = "skewY(0deg)";
      main.style.filter     = "blur(0px)";
    }
  }, [state]);

  return state;
}
