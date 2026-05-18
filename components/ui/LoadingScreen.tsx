"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const duration = 2200;
    const interval = 30;
    const increment = (100 / duration) * interval;
    let current = 0;

    const timer = setInterval(() => {
      current = Math.min(100, current + increment + Math.random() * 2);
      setProgress(Math.floor(current));

      if (current >= 100) {
        clearInterval(timer);
        setTimeout(() => {
          setIsComplete(true);
          setTimeout(() => setIsVisible(false), 800);
        }, 300);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[99998] flex flex-col items-center justify-center bg-[#020206]"
          exit={{
            clipPath: "inset(0 0 100% 0)",
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
          }}
        >
          {/* Background mesh */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 50%, rgba(99,102,241,0.15) 0%, transparent 70%)",
              }}
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          {/* Logo */}
          <motion.div
            className="relative z-10 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          >
            <motion.h1
              className="text-6xl md:text-8xl font-thin tracking-[0.3em] text-white/90 mb-2"
              style={{ letterSpacing: "0.3em" }}
            >
              LUMINA
            </motion.h1>
            <motion.div
              className="h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent mb-8"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            />
          </motion.div>

          {/* Progress */}
          <motion.div
            className="relative z-10 w-64 md:w-80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="flex justify-between text-xs text-white/30 mb-3 font-mono tracking-widest">
              <span>LOADING</span>
              <motion.span
                animate={{ opacity: isComplete ? 0 : 1 }}
              >
                {progress}%
              </motion.span>
            </div>
            <div className="h-px bg-white/10 relative overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
              <motion.div
                className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-transparent to-white/40"
                animate={{ x: [`${progress - 20}%`, `${progress}%`] }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </motion.div>

          {/* Exit reveal lines */}
          {isComplete && (
            <>
              <motion.div
                className="absolute top-0 left-0 w-full h-0.5 bg-indigo-500"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              />
              <motion.div
                className="absolute bottom-0 left-0 w-full h-0.5 bg-violet-500"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              />
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
