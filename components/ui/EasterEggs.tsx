"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Konami code easter egg ─────────────────────────────────────────── */
const KONAMI = [
  "ArrowUp","ArrowUp","ArrowDown","ArrowDown",
  "ArrowLeft","ArrowRight","ArrowLeft","ArrowRight",
  "b","a",
];

function useKonami(onActivate: () => void) {
  const seq = useRef<string[]>([]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      seq.current = [...seq.current, e.key].slice(-KONAMI.length);
      if (seq.current.join(",") === KONAMI.join(",")) {
        seq.current = [];
        onActivate();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onActivate]);
}

/* ─── Konami visual explosion ─────────────────────────────────────────── */
function KonamiExplosion({ onDone }: { onDone: () => void }) {
  const particles = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    angle: (i / 60) * Math.PI * 2,
    dist:  80 + (i % 5) * 60,
    color: ["#6366f1","#8b5cf6","#06b6d4","#ec4899","#fbbf24"][i % 5],
    size:  3 + (i % 4) * 2,
  }));

  return (
    <motion.div
      className="fixed inset-0 z-[99994] pointer-events-none flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onAnimationComplete={() => setTimeout(onDone, 2200)}
    >
      {/* Flash */}
      <motion.div
        className="absolute inset-0"
        style={{ background: "radial-gradient(circle at 50% 50%, rgba(99,102,241,0.4), transparent 60%)" }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: [0, 1, 0], scale: [0.5, 2, 3] }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />

      {/* Particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{ width: p.size, height: p.size, background: p.color }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
          animate={{
            x: Math.cos(p.angle) * p.dist,
            y: Math.sin(p.angle) * p.dist,
            opacity: 0,
            scale: [0, 1.5, 0],
          }}
          transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1], delay: Math.random() * 0.2 }}
        />
      ))}

      {/* Message */}
      <motion.div
        className="relative text-center"
        initial={{ opacity: 0, scale: 0.6, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 1.1 }}
        transition={{ delay: 0.3, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
      >
        <div className="text-6xl mb-4">✦</div>
        <h2 className="text-3xl font-thin text-white/90 tracking-widest mb-2">
          You found it.
        </h2>
        <p className="text-sm text-white/40 tracking-widest">
          The secret of the masters.
        </p>
      </motion.div>
    </motion.div>
  );
}

/* ─── Idle screensaver ────────────────────────────────────────────────── */
function useIdleDetector(onIdle: () => void, onActive: () => void, delay = 25000) {
  useEffect(() => {
    let timer: NodeJS.Timeout;

    const reset = () => {
      clearTimeout(timer);
      onActive();
      timer = setTimeout(onIdle, delay);
    };

    const events = ["mousemove", "keydown", "scroll", "touchstart"];
    events.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    timer = setTimeout(onIdle, delay);

    return () => {
      clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, reset));
    };
  }, [onIdle, onActive, delay]);
}

/* ─── Hidden cursor trail message ────────────────────────────────────── */
const CURSOR_MESSAGES = [
  "Keep exploring ↓",
  "You're doing great",
  "Almost there →",
  "Nice moves.",
];

function useScrollSurprise() {
  const [message, setMessage]   = useState<string | null>(null);
  const [msgPos, setMsgPos]     = useState({ x: 0, y: 0 });
  const shownAt = useRef<Set<number>>(new Set());

  useEffect(() => {
    const thresholds = [0.25, 0.5, 0.75, 0.9];
    let msgIdx = 0;

    const handler = () => {
      const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      thresholds.forEach((t, i) => {
        if (pct > t && !shownAt.current.has(i)) {
          shownAt.current.add(i);
          setMessage(CURSOR_MESSAGES[msgIdx % CURSOR_MESSAGES.length]);
          setMsgPos({
            x: 60 + Math.random() * (window.innerWidth - 200),
            y: 100 + Math.random() * (window.innerHeight - 200),
          });
          msgIdx++;
          setTimeout(() => setMessage(null), 2000);
        }
      });
    };

    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return { message, msgPos };
}

/* ─── Logo click secret ──────────────────────────────────────────────── */
function useLogoSecret() {
  const [revealed, setRevealed] = useState(false);
  const clicks = useRef(0);
  const timer  = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const logo = document.querySelector("nav a:first-child") as HTMLElement | null;
    if (!logo) return;

    const handler = () => {
      clicks.current++;
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => { clicks.current = 0; }, 1200);

      if (clicks.current >= 5) {
        clicks.current = 0;
        setRevealed(true);
        setTimeout(() => setRevealed(false), 3000);
      }
    };

    logo.addEventListener("click", handler);
    return () => logo.removeEventListener("click", handler);
  }, []);

  return revealed;
}

/* ─── Root easter egg component ───────────────────────────────────────── */
export default function EasterEggs() {
  const [konamiActive, setKonamiActive] = useState(false);
  const [isIdle,       setIsIdle]       = useState(false);
  const { message, msgPos }             = useScrollSurprise();
  const logoSecret                      = useLogoSecret();

  const activateKonami = useCallback(() => setKonamiActive(true), []);
  const onIdle   = useCallback(() => setIsIdle(true),  []);
  const onActive = useCallback(() => setIsIdle(false), []);

  useKonami(activateKonami);
  useIdleDetector(onIdle, onActive);

  return (
    <>
      {/* Konami burst */}
      <AnimatePresence>
        {konamiActive && (
          <KonamiExplosion onDone={() => setKonamiActive(false)} />
        )}
      </AnimatePresence>

      {/* Idle screensaver — aurora pulse */}
      <AnimatePresence>
        {isIdle && (
          <motion.div
            className="fixed inset-0 z-[500] pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(99,102,241,0.08) 0%, transparent 60%)",
            }}
          >
            <motion.div
              className="absolute inset-0"
              animate={{ scale: [1, 1.04, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              style={{
                background:
                  "radial-gradient(circle at 50% 50%, rgba(139,92,246,0.06) 0%, transparent 50%)",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll surprise messages */}
      <AnimatePresence>
        {message && (
          <motion.div
            className="fixed z-[800] pointer-events-none"
            style={{ left: msgPos.x, top: msgPos.y }}
            initial={{ opacity: 0, scale: 0.7, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -10 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          >
            <div
              className="px-4 py-2 rounded-full text-xs font-light tracking-widest text-white/50"
              style={{
                background: "rgba(2,2,6,0.8)",
                border: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(20px)",
              }}
            >
              {message}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logo click secret */}
      <AnimatePresence>
        {logoSecret && (
          <motion.div
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[900] pointer-events-none"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          >
            <div
              className="px-6 py-3 rounded-2xl text-sm text-indigo-300/80 font-light tracking-wider"
              style={{
                background: "rgba(99,102,241,0.08)",
                border: "1px solid rgba(99,102,241,0.2)",
                backdropFilter: "blur(24px)",
              }}
            >
              ✦ &nbsp; Made with obsession &nbsp; ✦
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
