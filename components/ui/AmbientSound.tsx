"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ───────────────────────────────────────────────────────────────
   Generates a lush ambient drone via Web Audio API.
   3 detuned oscillators → gain → reverb-like convolver → master.
─────────────────────────────────────────────────────────────── */
function createAmbientDrone(ctx: AudioContext): () => void {
  const master = ctx.createGain();
  master.gain.setValueAtTime(0, ctx.currentTime);
  master.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 2.5);
  master.connect(ctx.destination);

  // Reverb-like delay (poor-man's convolver)
  const delay  = ctx.createDelay(4);
  const fb     = ctx.createGain();
  delay.delayTime.value = 2.1;
  fb.gain.value         = 0.45;
  delay.connect(fb);
  fb.connect(delay);
  delay.connect(master);

  // Low-pass filter for warmth
  const lp = ctx.createBiquadFilter();
  lp.type            = "lowpass";
  lp.frequency.value = 280;
  lp.Q.value         = 0.4;
  lp.connect(delay);
  lp.connect(master);

  // Three detuned sine oscillators: root, minor-3rd, 5th
  const freqs   = [55, 65.4, 82.4]; // A2, C3, E3
  const osc: OscillatorNode[] = [];
  const gn:  GainNode[]       = [];

  freqs.forEach((f, i) => {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.value  = f;
    o.detune.value     = [-3, 0, 5][i]; // slight detune for beating
    g.gain.value       = [0.5, 0.3, 0.2][i];
    o.connect(g);
    g.connect(lp);
    o.start();
    osc.push(o);
    gn.push(g);
  });

  // Slow LFO on filter cutoff for motion
  const lfo = ctx.createOscillator();
  const lg  = ctx.createGain();
  lfo.type = "sine";
  lfo.frequency.value = 0.07;
  lg.gain.value       = 60;
  lfo.connect(lg);
  lg.connect(lp.frequency);
  lfo.start();

  return () => {
    master.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5);
    setTimeout(() => {
      osc.forEach((o) => { try { o.stop(); } catch (_) {} });
      lfo.stop();
      ctx.close();
    }, 1600);
  };
}

export default function AmbientSound() {
  const [active, setActive]   = useState(false);
  const [visible, setVisible] = useState(false);
  const ctxRef    = useRef<AudioContext | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  // Show button after loading screen
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 3800);
    return () => clearTimeout(t);
  }, []);

  const toggle = useCallback(() => {
    if (!active) {
      const AudioCtx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx     = new AudioCtx();
      ctxRef.current = ctx;
      cleanupRef.current = createAmbientDrone(ctx);
      setActive(true);
    } else {
      cleanupRef.current?.();
      cleanupRef.current = null;
      ctxRef.current    = null;
      setActive(false);
    }
  }, [active]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          onClick={toggle}
          className="fixed bottom-6 right-6 z-[1000] flex items-center gap-2.5 px-4 py-2.5 rounded-full glass cursor-none transition-all duration-500"
          style={{
            border: `1px solid ${active ? "rgba(99,102,241,0.4)" : "rgba(255,255,255,0.07)"}`,
            boxShadow: active ? "0 0 20px rgba(99,102,241,0.2)" : "none",
          }}
          initial={{ opacity: 0, y: 16, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.9 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          aria-label={active ? "Mute ambient sound" : "Play ambient sound"}
        >
          {/* Waveform bars */}
          <div className="flex items-center gap-0.5 h-3">
            {[1, 1.5, 0.7, 1.8, 1].map((h, i) => (
              <motion.span
                key={i}
                className="w-0.5 rounded-full"
                style={{ background: active ? "#818cf8" : "rgba(255,255,255,0.25)" }}
                animate={active
                  ? { scaleY: [1, h, 0.4, h * 0.8, 1], transition: { duration: 0.8 + i * 0.15, repeat: Infinity, ease: "easeInOut" } }
                  : { scaleY: 0.3 }
                }
                initial={{ scaleY: 0.3, height: 12 }}
              />
            ))}
          </div>
          <span
            className="text-[10px] font-light tracking-widest uppercase transition-colors duration-300"
            style={{ color: active ? "rgba(129,140,248,0.9)" : "rgba(255,255,255,0.28)" }}
          >
            {active ? "Ambient" : "Sound"}
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
