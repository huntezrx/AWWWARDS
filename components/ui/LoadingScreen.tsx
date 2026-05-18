"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GLSL_NOISE } from "@/lib/shaders/noise";

// ─── Inline canvas shader for the loading reveal ──────────────────────────
function ShaderCanvas({ progress }: { progress: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef     = useRef<WebGLRenderingContext | null>(null);
  const progRef   = useRef<WebGLProgram | null>(null);
  const uTimeRef  = useRef<WebGLUniformLocation | null>(null);
  const uProgRef  = useRef<WebGLUniformLocation | null>(null);
  const rafRef    = useRef(0);
  const startTime = useRef(0);

  useEffect(() => {
    startTime.current = Date.now();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { alpha: true });
    if (!gl) return;
    glRef.current = gl;

    const vert = `
      attribute vec2 aPos;
      varying vec2 vUv;
      void main(){ vUv = aPos * 0.5 + 0.5; gl_Position = vec4(aPos, 0.0, 1.0); }
    `;
    const frag = `
      precision mediump float;
      ${GLSL_NOISE}
      uniform float uTime;
      uniform float uProgress;
      varying vec2 vUv;

      void main(){
        float n = fbm(vec3(vUv * 4.0, uTime * 0.5), 4);
        float wave = vUv.x + n * 0.25;
        float reveal = smoothstep(uProgress - 0.08, uProgress + 0.08, wave);

        // Behind the wave: aurora colours
        vec3 col1 = vec3(0.24, 0.18, 0.65);
        vec3 col2 = vec3(0.02, 0.42, 0.70);
        float t = vUv.x + vUv.y + uTime * 0.1 + n * 0.3;
        vec3 auroraCol = mix(col1, col2, sin(t * 3.0) * 0.5 + 0.5);

        // Edge glow
        float edge = exp(-abs(wave - uProgress) * 20.0);
        auroraCol += vec3(0.3, 0.2, 0.6) * edge;

        vec3 bg = vec3(0.008, 0.008, 0.022);
        vec3 col = mix(auroraCol, bg, reveal);
        gl_FragColor = vec4(col, 1.0);
      }
    `;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const program = gl.createProgram()!;
    gl.attachShader(program, compile(gl.VERTEX_SHADER, vert));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, frag));
    gl.linkProgram(program);
    gl.useProgram(program);
    progRef.current = program;

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    uTimeRef.current = gl.getUniformLocation(program, "uTime");
    uProgRef.current = gl.getUniformLocation(program, "uProgress");

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const render = () => {
      const t = (Date.now() - startTime.current) / 1000;
      gl.uniform1f(uTimeRef.current!, t);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      rafRef.current = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    const gl = glRef.current;
    if (!gl || !uProgRef.current) return;
    gl.useProgram(progRef.current);
    gl.uniform1f(uProgRef.current, progress / 100);
  }, [progress]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
    />
  );
}

// ─── Loading screen ───────────────────────────────────────────────────────
export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase]       = useState<"loading" | "reveal" | "done">("loading");

  useEffect(() => {
    let p = 0;
    const interval = setInterval(() => {
      p += 1.2 + Math.sin(p * 0.06) * 0.8;
      p = Math.min(p, 100);
      setProgress(Math.floor(p));
      if (p >= 100) {
        clearInterval(interval);
        setTimeout(() => setPhase("reveal"), 200);
        setTimeout(() => setPhase("done"),   1400);
      }
    }, 28);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          className="fixed inset-0 z-[99998] overflow-hidden"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {/* Shader canvas */}
          <ShaderCanvas progress={phase === "reveal" ? 110 : progress} />

          {/* Logo */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            >
              {/* Logo mark */}
              <div className="relative flex items-center justify-center mb-6">
                <motion.div
                  className="w-16 h-16 rounded-full border border-white/20"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                  className="absolute w-10 h-10 rounded-full border border-indigo-500/50"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                />
                <span className="absolute text-white/80 text-xs tracking-widest">✦</span>
              </div>

              <motion.h1
                className="text-5xl md:text-7xl font-thin tracking-[0.4em] text-white/90"
                animate={{ letterSpacing: phase === "reveal" ? "0.6em" : "0.4em" }}
                transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
              >
                LUMINA
              </motion.h1>

              <motion.div
                className="mt-3 h-px bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.4, duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
              />

              <motion.p
                className="mt-4 text-xs text-white/30 tracking-[0.4em] uppercase font-light"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                Digital Luxury Experience
              </motion.p>
            </motion.div>

            {/* Progress */}
            {phase === "loading" && (
              <motion.div
                className="absolute bottom-12 flex flex-col items-center gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="relative w-48 h-px bg-white/10 overflow-hidden">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400"
                    style={{ width: `${progress}%` }}
                    transition={{ duration: 0.1 }}
                  />
                  {/* Glow head */}
                  <motion.div
                    className="absolute top-1/2 -translate-y-1/2 w-1 h-3 rounded-full bg-white/80 blur-[1px]"
                    style={{ left: `${progress}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
                <div className="flex items-center gap-6 text-[10px] font-mono text-white/20 tracking-widest">
                  <span>INITIALISING</span>
                  <span
                    className="tabular-nums"
                    style={{ color: "rgba(255,255,255,0.4)" }}
                  >
                    {String(progress).padStart(3, "0")}%
                  </span>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
