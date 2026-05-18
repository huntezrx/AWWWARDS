"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import * as THREE from "three";
import { useLenis } from "@/hooks/useLenis";

// ── Static imports (no WebGL) ─────────────────────────────────────────────
import CustomCursor    from "@/components/ui/CustomCursor";
import LoadingScreen   from "@/components/ui/LoadingScreen";
import Navigation      from "@/components/Navigation";
import Hero            from "@/components/sections/Hero";
import About           from "@/components/sections/About";
import Services        from "@/components/sections/Services";
import BentoGrid       from "@/components/sections/BentoGrid";
import MarqueeSection  from "@/components/sections/MarqueeSection";
import Showcase        from "@/components/sections/Showcase";
import Testimonials    from "@/components/sections/Testimonials";
import CTA             from "@/components/sections/CTA";
import Footer          from "@/components/sections/Footer";

// ── Dynamic WebGL imports — loaded only client-side ───────────────────────
const WebGLBackground = dynamic(
  () => import("@/components/three/WebGLBackground"),
  { ssr: false }
);
const MouseTrail = dynamic(
  () => import("@/components/three/MouseTrail"),
  { ssr: false }
);
const Interactive3D = dynamic(
  () => import("@/components/sections/Interactive3D"),
  { ssr: false }
);
const ScrollStory = dynamic(
  () => import("@/components/sections/ScrollStory"),
  { ssr: false }
);

export default function Home() {
  useLenis();
  // Shared mouse ref for components that need raw NDC coords
  const mouseRef = useRef(new THREE.Vector2(0, 0));

  return (
    <>
      {/* Cinematic loading */}
      <LoadingScreen />

      {/* Premium cursor */}
      <CustomCursor />

      {/* Persistent full-screen WebGL aurora */}
      <WebGLBackground />

      {/* Mouse trail canvas */}
      <MouseTrail mouseRef={mouseRef} />

      {/* Nav */}
      <Navigation />

      {/* ── Sections ── */}
      <main className="relative" style={{ background: "transparent" }}>
        <Hero />
        <MarqueeSection />
        <About />
        <Services />
        <ScrollStory />
        <Interactive3D />
        <BentoGrid />
        <Showcase />
        <Testimonials />
        <CTA />
        <Footer />
      </main>
    </>
  );
}
