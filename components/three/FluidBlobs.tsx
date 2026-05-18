"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, extend } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";
import { gooeyFragment, liquidVertex } from "@/lib/shaders/liquid";

const BlobMaterial = shaderMaterial(
  {
    uTime: 0,
    uMouse: new THREE.Vector2(0, 0),
    uResolution: new THREE.Vector2(1, 1),
  },
  liquidVertex,
  gooeyFragment
);
extend({ BlobMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    blobMaterial: {
      uTime?: number;
      uMouse?: THREE.Vector2;
      uResolution?: THREE.Vector2;
      transparent?: boolean;
      depthWrite?: boolean;
      blending?: THREE.Blending;
      ref?: React.Ref<THREE.ShaderMaterial & {
        uTime: number;
        uMouse: THREE.Vector2;
        uResolution: THREE.Vector2;
      }>;
    };
  }
}

function BlobPlane({
  mouseRef,
  resolution,
}: {
  mouseRef: React.MutableRefObject<THREE.Vector2>;
  resolution: [number, number];
}) {
  const matRef = useRef<THREE.ShaderMaterial & {
    uTime: number;
    uMouse: THREE.Vector2;
    uResolution: THREE.Vector2;
  }>(null);

  useFrame(({ clock }) => {
    if (!matRef.current) return;
    matRef.current.uTime = clock.elapsedTime;
    matRef.current.uMouse.lerp(mouseRef.current, 0.05);
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <blobMaterial
        ref={matRef}
        uResolution={new THREE.Vector2(...resolution)}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

interface FluidBlobsProps {
  className?: string;
  mouseRef: React.MutableRefObject<THREE.Vector2>;
}

export default function FluidBlobs({ className = "", mouseRef }: FluidBlobsProps) {
  const resolution = useMemo<[number, number]>(() => {
    if (typeof window === "undefined") return [1, 1];
    return [window.innerWidth, window.innerHeight];
  }, []);

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 1], fov: 90 }}
        gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
        dpr={[1, 1.5]}
        style={{ background: "transparent" }}
      >
        <BlobPlane mouseRef={mouseRef} resolution={resolution} />
      </Canvas>
    </div>
  );
}
