"use client";

import { useRef, Suspense, useMemo, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Canvas, useFrame, useThree, extend } from "@react-three/fiber";
import { Float, Stars, MeshDistortMaterial, Sphere, Ring, shaderMaterial } from "@react-three/drei";
import { EffectComposer, Bloom, ChromaticAberration } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import TextReveal from "../ui/TextReveal";
import { GLSL_NOISE } from "@/lib/shaders/noise";

// ─── Custom shader for the outer shell ───────────────────────────────────
const ShellMaterial = shaderMaterial(
  { uTime: 0, uMouse: new THREE.Vector2(0, 0) },
  /* vert */ `
    ${GLSL_NOISE}
    uniform float uTime;
    uniform vec2  uMouse;
    varying vec3  vNormal;
    varying vec2  vUv;

    void main(){
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vec3 pos = position;
      float n = snoise(pos * 1.5 + vec3(uTime * 0.3));
      pos += normal * n * 0.08;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  /* frag */ `
    ${GLSL_NOISE}
    uniform float uTime;
    uniform vec2  uMouse;
    varying vec3  vNormal;
    varying vec2  vUv;

    void main(){
      // Fresnel
      vec3 viewDir = normalize(cameraPosition - vNormal);
      float fresnel = pow(1.0 - abs(dot(vNormal, viewDir)), 2.5);

      // Iridescent gradient
      float t = vUv.x + vUv.y + uTime * 0.08;
      vec3 col1 = vec3(0.24, 0.18, 0.85);
      vec3 col2 = vec3(0.02, 0.55, 0.80);
      vec3 col3 = vec3(0.85, 0.10, 0.55);
      float n = snoise(vec3(vUv * 3.0, uTime * 0.2)) * 0.5 + 0.5;
      vec3 col = mix(col1, mix(col2, col3, sin(t * 2.0 + n) * 0.5 + 0.5), cos(t * 1.4) * 0.5 + 0.5);

      col *= fresnel * 1.8 + 0.1;
      gl_FragColor = vec4(col, fresnel * 0.7 + 0.1);
    }
  `
);
extend({ ShellMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    shellMaterial: {
      uTime?: number;
      uMouse?: THREE.Vector2;
      transparent?: boolean;
      side?: THREE.Side;
      depthWrite?: boolean;
      blending?: THREE.Blending;
      ref?: React.Ref<THREE.ShaderMaterial & { uTime: number; uMouse: THREE.Vector2 }>;
    };
  }
}

// ─── Core orb ─────────────────────────────────────────────────────────────
function CoreOrb({ mouseRef }: { mouseRef: React.MutableRefObject<THREE.Vector2> }) {
  const shellRef = useRef<THREE.ShaderMaterial & { uTime: number; uMouse: THREE.Vector2 }>(null);
  const groupRef = useRef<THREE.Group>(null);
  const { mouse } = useThree();

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (shellRef.current) {
      shellRef.current.uTime = t;
      shellRef.current.uMouse.lerp(mouse, 0.05);
    }
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.004;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, mouse.y * 0.3, 0.03);
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, mouse.x * 0.4, 0.04);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, mouse.y * 0.25, 0.04);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Inner core */}
      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
        <Sphere args={[1.0, 128, 128]}>
          <MeshDistortMaterial
            color="#6366f1"
            emissive="#4f46e5"
            emissiveIntensity={1.2}
            distort={0.45}
            speed={2}
            roughness={0}
            metalness={0.8}
          />
        </Sphere>
      </Float>

      {/* Outer iridescent shell */}
      <Sphere args={[1.5, 64, 64]}>
        <shellMaterial
          ref={shellRef}
          transparent
          side={THREE.BackSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Sphere>

      {/* Ring system */}
      {[2.2, 2.8, 3.5].map((r, i) => (
        <Ring
          key={r}
          args={[r, r + 0.03, 128]}
          rotation={[
            Math.PI / 2 + i * 0.3,
            i * 0.4,
            0,
          ]}
        >
          <meshBasicMaterial
            color={["#6366f1", "#8b5cf6", "#06b6d4"][i]}
            transparent
            opacity={0.25 - i * 0.05}
            side={THREE.DoubleSide}
          />
        </Ring>
      ))}
    </group>
  );
}

// ─── Deterministic particle field ─────────────────────────────────────────
const PARTICLE_COUNT = 2500;
const PARTICLE_POSITIONS = (() => {
  const pos = new Float32Array(PARTICLE_COUNT * 3);
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const phi   = Math.acos(1 - (2 * (i + 0.5)) / PARTICLE_COUNT);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    const r = 4.5 + (i % 7) * 0.5;
    pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
    pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    pos[i * 3 + 2] = r * Math.cos(phi);
  }
  return pos;
})();

function ParticleCloud() {
  const pointsRef = useRef<THREE.Points>(null);
  const positions = useMemo(() => PARTICLE_POSITIONS, []);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = clock.elapsedTime * 0.03;
    pointsRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.02) * 0.1;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.018}
        color="#6366f1"
        transparent
        opacity={0.5}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// ─── Light probes that follow mouse ───────────────────────────────────────
function DynamicLights({ mouseRef }: { mouseRef: React.MutableRefObject<THREE.Vector2> }) {
  const light1Ref = useRef<THREE.PointLight>(null);
  const light2Ref = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (light1Ref.current) {
      light1Ref.current.position.x = THREE.MathUtils.lerp(light1Ref.current.position.x, mouseRef.current.x * 4, 0.05);
      light1Ref.current.position.y = THREE.MathUtils.lerp(light1Ref.current.position.y, mouseRef.current.y * 4, 0.05);
      light1Ref.current.intensity = 3 + Math.sin(t * 1.5) * 0.5;
    }
    if (light2Ref.current) {
      light2Ref.current.position.x = Math.sin(t * 0.3) * 5;
      light2Ref.current.position.y = Math.cos(t * 0.4) * 4;
    }
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight ref={light1Ref} position={[3, 3, 3]} intensity={3} color="#6366f1" distance={15} />
      <pointLight ref={light2Ref} position={[0, 0, 5]} intensity={1.5} color="#06b6d4" distance={12} />
      <pointLight position={[0, -5, 0]} intensity={1} color="#8b5cf6" distance={10} />
    </>
  );
}

// ─── Full 3D scene ────────────────────────────────────────────────────────
function Scene({ mouseRef }: { mouseRef: React.MutableRefObject<THREE.Vector2> }) {
  return (
    <>
      <DynamicLights mouseRef={mouseRef} />
      <CoreOrb mouseRef={mouseRef} />
      <ParticleCloud />
      <Stars radius={80} depth={40} count={2000} factor={3} saturation={0.6} fade speed={0.5} />
      <EffectComposer>
        <Bloom
          intensity={1.8}
          luminanceThreshold={0.3}
          luminanceSmoothing={0.4}
          blendFunction={BlendFunction.ADD}
        />
        <ChromaticAberration
          offset={new THREE.Vector2(0.0008, 0.0008) as unknown as [number, number]}
          blendFunction={BlendFunction.NORMAL}
          radialModulation={true}
          modulationOffset={0.2}
        />
      </EffectComposer>
    </>
  );
}

// ─── Public component ─────────────────────────────────────────────────────
export default function Interactive3D() {
  const ref = useRef<HTMLElement>(null);
  const mouseRef = useRef(new THREE.Vector2(0, 0));

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const canvasOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const canvasScale   = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.85, 1, 1, 0.85]);
  const textY         = useTransform(scrollYProgress, [0, 0.5], [60, 0]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
      );
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section ref={ref} className="relative py-32 md:py-48 overflow-hidden" style={{ background: "#020206" }}>
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* 3D canvas */}
          <motion.div
            className="relative h-[420px] md:h-[620px] order-2 lg:order-1 rounded-3xl overflow-hidden"
            style={{ opacity: canvasOpacity, scale: canvasScale }}
          >
            <Canvas
              camera={{ position: [0, 0, 8], fov: 50 }}
              gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
              dpr={[1, 1.5]}
              style={{ background: "transparent" }}
            >
              <Suspense fallback={null}>
                <Scene mouseRef={mouseRef} />
              </Suspense>
            </Canvas>

            {/* Vignette */}
            <div
              className="absolute inset-0 pointer-events-none rounded-3xl"
              style={{ background: "radial-gradient(circle at 50% 50%, transparent 35%, rgba(2,2,6,0.85) 100%)" }}
            />
            {/* Glass border */}
            <div className="absolute inset-0 rounded-3xl border border-white/[0.05] pointer-events-none" />
          </motion.div>

          {/* Text */}
          <motion.div className="order-1 lg:order-2" style={{ y: textY }}>
            <motion.div
              className="flex items-center gap-3 mb-6"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="w-8 h-px bg-indigo-500" />
              <span className="text-xs text-indigo-400/80 tracking-[0.4em] uppercase font-light">Interactive 3D</span>
            </motion.div>

            <div className="mb-8">
              <TextReveal text="Immersive 3D" className="text-5xl md:text-6xl font-thin text-white/90 leading-tight" delay={0.1} />
              <TextReveal text="experiences that" className="text-5xl md:text-6xl font-thin text-white/90 leading-tight" delay={0.2} />
              <TextReveal text="transcend screens." className="text-5xl md:text-6xl font-thin gradient-text leading-tight" delay={0.3} />
            </div>

            <motion.p
              className="text-white/35 font-light leading-relaxed text-base mb-10 max-w-md"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              Real-time WebGL with custom GLSL shaders, post-processing pipeline (Bloom + Chromatic Aberration),
              and physics-based mouse interaction — all running at 60fps on the GPU.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              {["Three.js", "React Three Fiber", "GLSL Shaders", "Bloom", "Chromatic Aberration", "Drei"].map((tech) => (
                <span
                  key={tech}
                  className="text-xs px-3.5 py-1.5 rounded-full glass border border-white/[0.06] text-white/35 hover:text-white/70 hover:border-indigo-500/40 transition-all duration-300 cursor-none"
                >
                  {tech}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
