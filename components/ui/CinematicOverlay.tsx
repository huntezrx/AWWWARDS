"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";

/* ───────────────────────────────────────────────────────────────
   Film grain via offscreen canvas rendered each frame.
   Runs entirely on the GPU-composited layer.
─────────────────────────────────────────────────────────────── */
function FilmGrain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef(0);

  const render = useCallback(() => {
    const c  = canvasRef.current;
    if (!c)  return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    const w = c.width, h = c.height;
    // Use typed array for performance
    const img  = ctx.createImageData(w, h);
    const data = img.data;
    const len  = data.length;

    // XOR-shift PRNG — much faster than Math.random() in a loop
    let seed = (Date.now() & 0xffffffff) >>> 0;
    for (let i = 0; i < len; i += 4) {
      seed ^= seed << 13; seed ^= seed >> 17; seed ^= seed << 5;
      const v = (seed & 0xff) > 200 ? ((seed >> 8) & 0x1f) : 0;
      data[i] = data[i+1] = data[i+2] = v;
      data[i+3] = v > 0 ? 38 : 0;          // sparse, translucent
    }
    ctx.putImageData(img, 0, 0);
    rafRef.current = requestAnimationFrame(render);
  }, []);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;

    const resize = () => {
      // Half-res for perf — CSS scale fills the rest
      c.width  = Math.ceil(window.innerWidth  / 2);
      c.height = Math.ceil(window.innerHeight / 2);
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    render();
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, [render]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[99990]"
      style={{
        width: "100%",
        height: "100%",
        mixBlendMode: "soft-light",
        opacity: 0.28,
        imageRendering: "pixelated",
        willChange: "contents",
      }}
    />
  );
}

/* ───────────────────────────────────────────────────────────────
   Vignette — pure CSS radial gradient
─────────────────────────────────────────────────────────────── */
function Vignette() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[99988]"
      style={{
        background:
          "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(2,2,6,0.65) 100%)",
        mixBlendMode: "multiply",
      }}
    />
  );
}

/* ───────────────────────────────────────────────────────────────
   Scan lines — CSS repeating-linear-gradient
─────────────────────────────────────────────────────────────── */
function ScanLines() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[99989]"
      style={{
        backgroundImage:
          "repeating-linear-gradient(0deg, rgba(0,0,0,0.025) 0px, rgba(0,0,0,0.025) 1px, transparent 1px, transparent 3px)",
        mixBlendMode: "overlay",
      }}
    />
  );
}

/* ───────────────────────────────────────────────────────────────
   Chromatic aberration edge fringe — subtle CSS
─────────────────────────────────────────────────────────────── */
function ChromaticEdge() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[99987]"
      style={{
        boxShadow:
          "inset 0 0 120px rgba(99,102,241,0.04), inset 0 0 40px rgba(6,182,212,0.02)",
        borderRadius: 0,
      }}
    />
  );
}

/* ───────────────────────────────────────────────────────────────
   Bloom — soft outer glow driven by interaction
─────────────────────────────────────────────────────────────── */
function BloomLayer() {
  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-[99986]"
      animate={{
        opacity: [0.3, 0.55, 0.3],
      }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      style={{
        background:
          "radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.06) 0%, transparent 60%)",
        mixBlendMode: "screen",
      }}
    />
  );
}

/* ───────────────────────────────────────────────────────────────
   Cinematic letterbox bars — appear on page load, fade out
─────────────────────────────────────────────────────────────── */
function LetterboxBars() {
  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 z-[99985] pointer-events-none origin-top"
        style={{ background: "#000", height: "6vh" }}
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 1.2, delay: 3.2, ease: [0.76, 0, 0.24, 1] }}
      />
      <motion.div
        className="fixed bottom-0 left-0 right-0 z-[99985] pointer-events-none origin-bottom"
        style={{ background: "#000", height: "6vh" }}
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 1.2, delay: 3.2, ease: [0.76, 0, 0.24, 1] }}
      />
    </>
  );
}

/* ───────────────────────────────────────────────────────────────
   Public component — mounts all cinematic layers
─────────────────────────────────────────────────────────────── */
export default function CinematicOverlay() {
  return (
    <>
      <LetterboxBars />
      <BloomLayer />
      <ChromaticEdge />
      <ScanLines />
      <Vignette />
      <FilmGrain />
    </>
  );
}
