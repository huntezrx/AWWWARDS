"use client";

import { useRef, Suspense, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere, Box, Torus } from "@react-three/drei";
import * as THREE from "three";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import TextReveal from "../ui/TextReveal";

// ─── Keyframed camera path ─────────────────────────────────────────────────
const CAMERA_PATH = [
  { position: new THREE.Vector3(0, 0, 8),   lookAt: new THREE.Vector3(0, 0, 0) },
  { position: new THREE.Vector3(3, 1, 5),   lookAt: new THREE.Vector3(0, 0, 0) },
  { position: new THREE.Vector3(-2, -1, 4), lookAt: new THREE.Vector3(0, 0, 0) },
  { position: new THREE.Vector3(0, 2, 6),   lookAt: new THREE.Vector3(0, 0, 0) },
];

function SceneCamera({ progress }: { progress: React.MutableRefObject<number> }) {
  const { camera } = useThree();
  const currentPos  = useRef(new THREE.Vector3());
  const currentLook = useRef(new THREE.Vector3());

  useFrame(() => {
    const t    = progress.current * (CAMERA_PATH.length - 1);
    const i    = Math.floor(t);
    const frac = t - i;
    const from = CAMERA_PATH[Math.min(i, CAMERA_PATH.length - 1)];
    const to   = CAMERA_PATH[Math.min(i + 1, CAMERA_PATH.length - 1)];

    currentPos.current.lerpVectors(from.position, to.position, frac);
    currentLook.current.lerpVectors(from.lookAt, to.lookAt, frac);
    camera.position.lerp(currentPos.current, 0.05);
    camera.lookAt(currentLook.current);
  });

  return null;
}

// ─── 3D objects ────────────────────────────────────────────────────────────
function SceneObjects() {
  const torusRef  = useRef<THREE.Mesh>(null);
  const sphereRef = useRef<THREE.Mesh>(null);
  const boxRef    = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (torusRef.current)  { torusRef.current.rotation.x = t * 0.3; torusRef.current.rotation.z = t * 0.2; }
    if (sphereRef.current) { sphereRef.current.rotation.y = t * 0.4; }
    if (boxRef.current)    { boxRef.current.rotation.x = t * 0.2; boxRef.current.rotation.y = t * 0.3; }
  });

  return (
    <>
      <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.6}>
        <Sphere ref={sphereRef} args={[1, 64, 64]} position={[0, 0, 0]}>
          <MeshDistortMaterial
            color="#6366f1" emissive="#4338ca" emissiveIntensity={0.5}
            distort={0.35} speed={1.5} roughness={0} metalness={0.9}
            transparent opacity={0.85}
          />
        </Sphere>
      </Float>

      <Float speed={2} rotationIntensity={0.3}>
        <Torus ref={torusRef} args={[2.2, 0.04, 16, 100]}>
          <meshBasicMaterial color="#8b5cf6" transparent opacity={0.4} />
        </Torus>
      </Float>

      <Float speed={1} rotationIntensity={0.6} floatIntensity={0.3}>
        <Box ref={boxRef} args={[1.2, 1.2, 1.2]} position={[2.5, 0.5, -1]}>
          <meshBasicMaterial color="#06b6d4" wireframe transparent opacity={0.3} />
        </Box>
      </Float>

      <InstancedParticles />

      <ambientLight intensity={0.3} />
      <pointLight position={[3, 3, 3]}    intensity={2.5} color="#6366f1" />
      <pointLight position={[-3, -3, 3]}  intensity={1.5} color="#06b6d4" />
      <pointLight position={[0, 5, -2]}   intensity={1.0} color="#8b5cf6" />
    </>
  );
}

function InstancedParticles() {
  const count   = 200;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy   = new THREE.Object3D();

  const positions = Array.from({ length: count }, (_, i) => {
    const phi   = Math.acos(1 - (2 * (i + 0.5)) / count);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    const r = 3.5 + (i % 5) * 0.3;
    return new THREE.Vector3(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.sin(phi) * Math.sin(theta),
      r * Math.cos(phi)
    );
  });

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.elapsedTime;
    positions.forEach((pos, i) => {
      const offset = Math.sin(t * 0.4 + i * 0.31) * 0.2;
      dummy.position.set(pos.x + offset, pos.y + offset * 0.5, pos.z);
      dummy.scale.setScalar(0.02 + (i % 4) * 0.008);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color="#6366f1" transparent opacity={0.5} />
    </instancedMesh>
  );
}

// ─── Story chapters ────────────────────────────────────────────────────────
const CHAPTERS = [
  { title: "Conception", body: "Every masterpiece begins with a single thought. We explore the space between imagination and reality.", tag: "01 — IDEATE" },
  { title: "Craft",      body: "Pixel by pixel, shader by shader, we forge digital experiences that defy expectation.",               tag: "02 — BUILD" },
  { title: "Emergence",  body: "The moment a product transcends function and becomes art. This is what we live for.",                 tag: "03 — LAUNCH" },
];

function StoryChapter({
  chapter, index, scrollProgress,
}: {
  chapter: (typeof CHAPTERS)[0];
  index: number;
  scrollProgress: MotionValue<number>;
}) {
  const start   = index / CHAPTERS.length;
  const end     = (index + 1) / CHAPTERS.length;
  const opacity = useTransform(scrollProgress, [start, start + 0.15, end - 0.15, end], [0, 1, 1, 0]);
  const y       = useTransform(scrollProgress, [start, start + 0.15, end - 0.15, end], [40, 0, 0, -40]);

  return (
    <motion.div style={{ opacity, y }} className="absolute inset-0 flex flex-col justify-center px-6 md:px-16 max-w-xl">
      <span className="text-[10px] text-indigo-400/60 tracking-[0.5em] uppercase mb-6 font-light">{chapter.tag}</span>
      <h3 className="text-5xl md:text-7xl font-thin text-white/90 mb-6 leading-tight">{chapter.title}</h3>
      <p className="text-white/40 font-light leading-relaxed text-base md:text-lg">{chapter.body}</p>
    </motion.div>
  );
}

// Progress dot — own component so hooks are at top level
function ProgressDot({ index, scrollProgress }: { index: number; scrollProgress: MotionValue<number> }) {
  const start  = index / CHAPTERS.length;
  const end    = (index + 1) / CHAPTERS.length;
  const active = useTransform(scrollProgress, [start, end], [0, 1]);
  const width  = useTransform(active, [0, 1], [8, 24]);

  return (
    <div className="flex items-center gap-2">
      <motion.div className="h-px bg-indigo-500" style={{ width }} />
      <motion.span className="text-[9px] text-white/30 tracking-widest uppercase" style={{ opacity: active }}>
        {String(index + 1).padStart(2, "0")}
      </motion.span>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────
export default function ScrollStory() {
  const stickyRef   = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);

  const { scrollYProgress } = useScroll({
    target: stickyRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    return scrollYProgress.on("change", (v) => { progressRef.current = v; });
  }, [scrollYProgress]);

  return (
    <section ref={stickyRef} className="relative" style={{ height: "350vh", background: "#020206" }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* 3D canvas */}
        <div className="absolute inset-0">
          <Canvas
            camera={{ position: [0, 0, 8], fov: 50 }}
            gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
            dpr={[1, 1.5]}
            style={{ background: "transparent" }}
          >
            <Suspense fallback={null}>
              <SceneObjects />
              <SceneCamera progress={progressRef} />
            </Suspense>
          </Canvas>
          <div className="absolute inset-0 bg-gradient-to-r from-[#020206] via-[#020206]/60 to-transparent" />
        </div>

        {/* Chapters */}
        <div className="absolute inset-0 pointer-events-none">
          {CHAPTERS.map((ch, i) => (
            <StoryChapter key={ch.title} chapter={ch} index={i} scrollProgress={scrollYProgress} />
          ))}
        </div>

        {/* Progress dots */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3 pointer-events-none">
          {CHAPTERS.map((ch, i) => (
            <ProgressDot key={ch.title} index={i} scrollProgress={scrollYProgress} />
          ))}
        </div>
      </div>
    </section>
  );
}
