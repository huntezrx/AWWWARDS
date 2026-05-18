"use client";

import { useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame, extend, useThree } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";
import { trailVertex, trailFragment } from "@/lib/shaders/particles";

const TrailMaterial = shaderMaterial(
  { uTime: 0 },
  trailVertex,
  trailFragment
);
extend({ TrailMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    trailMaterial: {
      uTime?: number;
      transparent?: boolean;
      depthWrite?: boolean;
      blending?: THREE.Blending;
      ref?: React.Ref<THREE.ShaderMaterial & { uTime: number }>;
    };
  }
}

const TRAIL_LENGTH = 80;

function Trail({ mouseRef }: { mouseRef: React.MutableRefObject<THREE.Vector2> }) {
  const { camera, size } = useThree();
  const pointsRef = useRef<THREE.Points>(null);
  const matRef    = useRef<THREE.ShaderMaterial & { uTime: number }>(null);

  // Circular ring buffer for trail positions
  const trailData = useRef({
    positions: new Float32Array(TRAIL_LENGTH * 3).fill(0),
    ages:      new Float32Array(TRAIL_LENGTH).fill(1),
    head:      0,
  });

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(TRAIL_LENGTH * 3), 3));
    g.setAttribute("aT",       new THREE.BufferAttribute(new Float32Array(TRAIL_LENGTH), 1));
    return g;
  }, []);

  useFrame(({ clock }) => {
    if (!pointsRef.current || !matRef.current) return;
    matRef.current.uTime = clock.elapsedTime;

    const td = trailData.current;
    // Unproject mouse to world at z=0
    const ndc = new THREE.Vector3(mouseRef.current.x, mouseRef.current.y, 0.5);
    ndc.unproject(camera);
    const dir = ndc.sub(camera.position).normalize();
    const dist = -camera.position.z / dir.z;
    const worldPos = camera.position.clone().add(dir.multiplyScalar(dist));

    const h = td.head;
    td.positions[h * 3]     = worldPos.x;
    td.positions[h * 3 + 1] = worldPos.y;
    td.positions[h * 3 + 2] = worldPos.z;
    td.head = (h + 1) % TRAIL_LENGTH;

    const posAttr = geo.attributes.position as THREE.BufferAttribute;
    const ageAttr = geo.attributes.aT       as THREE.BufferAttribute;
    for (let i = 0; i < TRAIL_LENGTH; i++) {
      const idx = (td.head - 1 - i + TRAIL_LENGTH) % TRAIL_LENGTH;
      posAttr.setXYZ(i, td.positions[idx * 3], td.positions[idx * 3 + 1], td.positions[idx * 3 + 2]);
      ageAttr.setX(i, i / TRAIL_LENGTH);
    }
    posAttr.needsUpdate = true;
    ageAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} geometry={geo}>
      <trailMaterial
        ref={matRef}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function MouseTrail({ mouseRef }: { mouseRef: React.MutableRefObject<THREE.Vector2> }) {
  return (
    <div className="fixed inset-0 z-[1] pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
        dpr={[1, 1.5]}
        style={{ background: "transparent" }}
      >
        <Trail mouseRef={mouseRef} />
      </Canvas>
    </div>
  );
}
