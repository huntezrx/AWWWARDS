"use client";

import { useRef, Suspense, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial, Float, Stars, Ring } from "@react-three/drei";
import * as THREE from "three";
import TextReveal from "../ui/TextReveal";

function AnimatedOrb() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { mouse } = useThree();

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.1;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    meshRef.current.position.x = THREE.MathUtils.lerp(
      meshRef.current.position.x,
      mouse.x * 0.5,
      0.02
    );
    meshRef.current.position.y = THREE.MathUtils.lerp(
      meshRef.current.position.y,
      mouse.y * 0.3,
      0.02
    );
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
      <Sphere ref={meshRef} args={[1.5, 128, 128]}>
        <MeshDistortMaterial
          color="#6366f1"
          emissive="#4338ca"
          emissiveIntensity={0.4}
          distort={0.4}
          speed={2}
          roughness={0}
          metalness={0.8}
          transparent
          opacity={0.85}
        />
      </Sphere>
    </Float>
  );
}

function RingSystem() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.x = state.clock.elapsedTime * 0.05;
    groupRef.current.rotation.z = state.clock.elapsedTime * 0.08;
  });

  return (
    <group ref={groupRef}>
      <Ring args={[2.2, 2.4, 64]} rotation={[Math.PI / 2, 0, 0]}>
        <meshBasicMaterial color="#6366f1" transparent opacity={0.15} side={THREE.DoubleSide} />
      </Ring>
      <Ring args={[3.0, 3.1, 64]} rotation={[Math.PI / 3, 0.2, 0]}>
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0.1} side={THREE.DoubleSide} />
      </Ring>
      <Ring args={[3.8, 3.85, 64]} rotation={[Math.PI / 4, -0.3, 0]}>
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.08} side={THREE.DoubleSide} />
      </Ring>
    </group>
  );
}

const PARTICLE_COUNT = 2000;
const PARTICLE_POSITIONS = (() => {
  const pos = new Float32Array(PARTICLE_COUNT * 3);
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const theta = ((i * 2.39996) % (Math.PI * 2));
    const phi = Math.acos(1 - (2 * i) / PARTICLE_COUNT);
    const radius = 4 + (i % 7) * (6 / 7);
    pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    pos[i * 3 + 2] = radius * Math.cos(phi);
  }
  return pos;
})();

function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => PARTICLE_POSITIONS, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.03;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.015}
        color="#6366f1"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} color="#6366f1" />
      <directionalLight position={[-5, -5, -5]} intensity={0.5} color="#06b6d4" />
      <pointLight position={[0, 0, 0]} intensity={2} color="#8b5cf6" distance={10} />

      <AnimatedOrb />
      <RingSystem />
      <ParticleField />
      <Stars radius={100} depth={50} count={3000} factor={3} saturation={0.5} fade speed={1} />
    </>
  );
}

export default function Interactive3D() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const canvasOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const canvasScale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.8, 1, 1, 0.8]);
  const textY = useTransform(scrollYProgress, [0, 0.5], [60, 0]);

  return (
    <section
      ref={ref}
      className="relative py-32 md:py-48 overflow-hidden"
      style={{ background: "#020206" }}
    >
      {/* Background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute left-1/2 top-1/2 w-[600px] h-[600px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)",
            filter: "blur(100px)",
            translateX: "-50%",
            translateY: "-50%",
            opacity: canvasOpacity,
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: 3D Canvas */}
          <motion.div
            className="relative h-[400px] md:h-[600px] order-2 lg:order-1"
            style={{ opacity: canvasOpacity, scale: canvasScale }}
          >
            <Canvas
              camera={{ position: [0, 0, 8], fov: 50 }}
              gl={{ antialias: true, alpha: true }}
              style={{ background: "transparent" }}
            >
              <Suspense fallback={null}>
                <Scene />
              </Suspense>
            </Canvas>

            {/* Overlay vignette */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "radial-gradient(circle at 50% 50%, transparent 40%, rgba(2,2,6,0.8) 100%)",
              }}
            />
          </motion.div>

          {/* Right: Content */}
          <motion.div className="order-1 lg:order-2" style={{ y: textY }}>
            <motion.div
              className="flex items-center gap-3 mb-6"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-10%" }}
            >
              <div className="w-8 h-px bg-indigo-500" />
              <span className="text-xs text-indigo-400/80 tracking-[0.4em] uppercase font-light">
                Interactive 3D
              </span>
            </motion.div>

            <div className="mb-8">
              <TextReveal
                text="Immersive 3D"
                className="text-4xl md:text-5xl lg:text-6xl font-thin text-white/90 leading-tight"
                delay={0.1}
              />
              <TextReveal
                text="experiences that"
                className="text-4xl md:text-5xl lg:text-6xl font-thin text-white/90 leading-tight"
                delay={0.2}
              />
              <TextReveal
                text="transcend screens."
                className="text-4xl md:text-5xl lg:text-6xl font-thin gradient-text leading-tight"
                delay={0.3}
              />
            </div>

            <motion.p
              className="text-white/40 font-light leading-relaxed text-base mb-10 max-w-md"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              We harness the power of WebGL, GLSL shaders, and real-time rendering
              to create digital environments that feel physically present and
              emotionally resonant.
            </motion.p>

            {/* Tech pills */}
            <motion.div
              className="flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              {["Three.js", "React Three Fiber", "GLSL Shaders", "WebGL 2.0", "Drei"].map((tech) => (
                <span
                  key={tech}
                  className="text-xs px-4 py-2 rounded-full glass border border-white/5 text-white/40 hover:text-white/70 hover:border-indigo-500/30 transition-all duration-300 cursor-none"
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
