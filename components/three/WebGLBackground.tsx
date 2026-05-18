"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree, extend } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";
import { auroraVertex, auroraFragment } from "@/lib/shaders/aurora";
import { particleVertex, particleFragment } from "@/lib/shaders/particles";

// ─── Aurora shader material ────────────────────────────────────────────────
const AuroraMaterial = shaderMaterial(
  {
    uTime: 0,
    uMouse: new THREE.Vector2(0, 0),
    uResolution: new THREE.Vector2(1, 1),
    uScroll: 0,
  },
  auroraVertex,
  auroraFragment
);
extend({ AuroraMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    auroraMaterial: {
      uTime?: number;
      uMouse?: THREE.Vector2;
      uResolution?: THREE.Vector2;
      uScroll?: number;
      ref?: React.Ref<THREE.ShaderMaterial & {
        uTime: number;
        uMouse: THREE.Vector2;
        uResolution: THREE.Vector2;
        uScroll: number;
      }>;
    };
  }
}

// ─── Full-screen aurora plane ──────────────────────────────────────────────
function AuroraPlane({
  mouseRef,
  scrollRef,
}: {
  mouseRef: React.MutableRefObject<THREE.Vector2>;
  scrollRef: React.MutableRefObject<number>;
}) {
  const matRef = useRef<THREE.ShaderMaterial & {
    uTime: number;
    uMouse: THREE.Vector2;
    uResolution: THREE.Vector2;
    uScroll: number;
  }>(null);
  const { size } = useThree();

  useFrame(({ clock }) => {
    if (!matRef.current) return;
    matRef.current.uTime = clock.elapsedTime;
    matRef.current.uMouse.lerp(mouseRef.current, 0.04);
    matRef.current.uScroll += (scrollRef.current - matRef.current.uScroll) * 0.05;
  });

  return (
    <mesh position={[0, 0, -1]}>
      <planeGeometry args={[2, 2]} />
      <auroraMaterial
        ref={matRef}
        uResolution={new THREE.Vector2(size.width, size.height)}
      />
    </mesh>
  );
}

// ─── GPU Particle system ──────────────────────────────────────────────────
const PARTICLE_COUNT = 3000;

const ParticleMaterial = shaderMaterial(
  { uTime: 0, uMouse: new THREE.Vector2(0, 0), uScroll: 0 },
  particleVertex,
  particleFragment
);
extend({ ParticleMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    particleMaterial: {
      uTime?: number;
      uMouse?: THREE.Vector2;
      uScroll?: number;
      transparent?: boolean;
      depthWrite?: boolean;
      blending?: THREE.Blending;
      ref?: React.Ref<THREE.ShaderMaterial & {
        uTime: number;
        uMouse: THREE.Vector2;
        uScroll: number;
      }>;
    };
  }
}

function GPUParticles({
  mouseRef,
  scrollRef,
}: {
  mouseRef: React.MutableRefObject<THREE.Vector2>;
  scrollRef: React.MutableRefObject<number>;
}) {
  const matRef = useRef<THREE.ShaderMaterial & {
    uTime: number;
    uMouse: THREE.Vector2;
    uScroll: number;
  }>(null);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const indices = new Float32Array(PARTICLE_COUNT);
    const basePositions = new Float32Array(PARTICLE_COUNT * 3);
    const sizes = new Float32Array(PARTICLE_COUNT);
    const colors = new Float32Array(PARTICLE_COUNT * 3);

    const palette = [
      [0.38, 0.22, 0.85],  // indigo
      [0.05, 0.55, 0.80],  // cyan
      [0.55, 0.10, 0.75],  // violet
      [0.92, 0.28, 0.60],  // pink
      [0.80, 0.80, 0.95],  // white-blue
    ];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      indices[i] = i;
      // Distribute in a sphere shell
      const phi   = Math.acos(1 - (2 * (i + 0.5)) / PARTICLE_COUNT);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i; // golden angle
      const r = 3 + (i % 7) * 0.8;
      basePositions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      basePositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      basePositions[i * 3 + 2] = r * Math.cos(phi);

      sizes[i] = 1.5 + (i % 5) * 0.6;
      const c = palette[i % palette.length];
      colors[i * 3]     = c[0];
      colors[i * 3 + 1] = c[1];
      colors[i * 3 + 2] = c[2];
    }

    g.setAttribute("aIndex",        new THREE.BufferAttribute(indices, 1));
    g.setAttribute("aBasePosition", new THREE.BufferAttribute(basePositions, 3));
    g.setAttribute("aSize",         new THREE.BufferAttribute(sizes, 1));
    g.setAttribute("aColor",        new THREE.BufferAttribute(colors, 3));
    return g;
  }, []);

  useFrame(({ clock }) => {
    if (!matRef.current) return;
    matRef.current.uTime = clock.elapsedTime;
    matRef.current.uMouse.lerp(mouseRef.current, 0.06);
    matRef.current.uScroll += (scrollRef.current - matRef.current.uScroll) * 0.05;
  });

  return (
    <points geometry={geo}>
      <particleMaterial
        ref={matRef}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ─── Floating geometric meshes ────────────────────────────────────────────
function FloatingGeometry({
  mouseRef,
}: {
  mouseRef: React.MutableRefObject<THREE.Vector2>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const targetRot = useRef({ x: 0, y: 0 });
  const currentRot = useRef({ x: 0, y: 0 });

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.elapsedTime;

    targetRot.current.x = mouseRef.current.y * 0.3;
    targetRot.current.y = mouseRef.current.x * 0.4;
    currentRot.current.x += (targetRot.current.x - currentRot.current.x) * 0.02;
    currentRot.current.y += (targetRot.current.y - currentRot.current.y) * 0.02;

    groupRef.current.rotation.x = currentRot.current.x + Math.sin(t * 0.15) * 0.1;
    groupRef.current.rotation.y = currentRot.current.y + t * 0.05;
  });

  const wireMat = new THREE.MeshBasicMaterial({
    color: 0x6366f1,
    wireframe: true,
    transparent: true,
    opacity: 0.06,
  });

  return (
    <group ref={groupRef}>
      {/* Outer icosahedron */}
      <mesh material={wireMat}>
        <icosahedronGeometry args={[3.5, 1]} />
      </mesh>
      {/* Inner octahedron */}
      <mesh material={new THREE.MeshBasicMaterial({ color: 0x8b5cf6, wireframe: true, transparent: true, opacity: 0.04 })}>
        <octahedronGeometry args={[2.0, 0]} />
      </mesh>
    </group>
  );
}

// ─── Camera dolly ─────────────────────────────────────────────────────────
function CameraDolly({ scrollRef }: { scrollRef: React.MutableRefObject<number> }) {
  const { camera } = useThree();
  const targetZ = useRef(6);

  useFrame(() => {
    targetZ.current = 6 - scrollRef.current * 1.5;
    camera.position.z += (targetZ.current - camera.position.z) * 0.04;
  });

  return null;
}

// ─── Root scene ───────────────────────────────────────────────────────────
function Scene({
  mouseRef,
  scrollRef,
}: {
  mouseRef: React.MutableRefObject<THREE.Vector2>;
  scrollRef: React.MutableRefObject<number>;
}) {
  return (
    <>
      {/* Orthographic plane for the aurora shader — fills clip space */}
      <AuroraPlane mouseRef={mouseRef} scrollRef={scrollRef} />
      <GPUParticles mouseRef={mouseRef} scrollRef={scrollRef} />
      <FloatingGeometry mouseRef={mouseRef} />
      <CameraDolly scrollRef={scrollRef} />
    </>
  );
}

// ─── Public component ─────────────────────────────────────────────────────
export default function WebGLBackground() {
  const mouseRef  = useRef(new THREE.Vector2(0, 0));
  const scrollRef = useRef(0);

  useEffect(() => {
    const onMouse = (e: MouseEvent) => {
      mouseRef.current.set(
        (e.clientX / window.innerWidth)  * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
      );
    };
    const onScroll = () => {
      scrollRef.current = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    };
    window.addEventListener("mousemove", onMouse, { passive: true });
    window.addEventListener("scroll",    onScroll, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("scroll",    onScroll);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45, near: 0.1, far: 100 }}
        gl={{
          antialias: false, // off for perf — aurora covers background
          alpha: false,
          powerPreference: "high-performance",
          stencil: false,
          depth: false,
        }}
        dpr={[1, 1.5]}
        style={{ background: "#020206" }}
      >
        <Scene mouseRef={mouseRef} scrollRef={scrollRef} />
      </Canvas>
    </div>
  );
}
