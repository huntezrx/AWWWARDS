"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import * as THREE from "three";
import { useLenis } from "@/hooks/useLenis";
import { useScrollVelocity } from "@/hooks/useScrollVelocity";

// ── Static sections ──────────────────────────────────────────────────────
import CustomCursor     from "@/components/ui/CustomCursor";
import LoadingScreen    from "@/components/ui/LoadingScreen";
import CinematicOverlay from "@/components/ui/CinematicOverlay";
import AmbientSound     from "@/components/ui/AmbientSound";
import EasterEggs       from "@/components/ui/EasterEggs";
import PageProgress     from "@/components/ui/PageProgress";
import Navigation       from "@/components/Navigation";
import Hero             from "@/components/sections/Hero";
import Stats          from "@/components/sections/Stats";
import MarqueeSection from "@/components/sections/MarqueeSection";
import About          from "@/components/sections/About";
import Features       from "@/components/sections/Features";
import Services       from "@/components/sections/Services";
import BentoGrid      from "@/components/sections/BentoGrid";
import Pricing        from "@/components/sections/Pricing";
import Showcase       from "@/components/sections/Showcase";
import Testimonials   from "@/components/sections/Testimonials";
import Timeline       from "@/components/sections/Timeline";
import FAQ            from "@/components/sections/FAQ";
import CTA            from "@/components/sections/CTA";
import Footer         from "@/components/sections/Footer";

// ── WebGL — client-only ──────────────────────────────────────────────────
const WebGLBackground = dynamic(() => import("@/components/three/WebGLBackground"), { ssr: false });
const MouseTrail      = dynamic(() => import("@/components/three/MouseTrail"),      { ssr: false });
const Interactive3D   = dynamic(() => import("@/components/sections/Interactive3D"), { ssr: false });
const ScrollStory     = dynamic(() => import("@/components/sections/ScrollStory"),  { ssr: false });

export default function Home() {
  useLenis();
  const mouseRef = useRef(new THREE.Vector2(0, 0));
  useScrollVelocity();

  return (
    <>
      <LoadingScreen />
      <CustomCursor />
      <CinematicOverlay />
      <AmbientSound />
      <EasterEggs />
      <PageProgress />

      {/* Persistent WebGL aurora backdrop */}
      <WebGLBackground />
      <MouseTrail mouseRef={mouseRef} />

      <Navigation />

      <main className="relative">
        {/* 1. Hook — cinematic hero */}
        <Hero />

        {/* 2. Social proof — immediate trust */}
        <Stats />
        <MarqueeSection />

        {/* 3. Story — who we are */}
        <About />

        {/* 4. Value — what we do */}
        <Features />
        <Services />

        {/* 5. Experience — 3D immersive */}
        <ScrollStory />
        <Interactive3D />

        {/* 6. Proof — portfolio grid */}
        <BentoGrid />
        <Showcase />

        {/* 7. Decision support */}
        <Testimonials />
        <Pricing />

        {/* 8. Process & objections */}
        <Timeline />
        <FAQ />

        {/* 9. Conversion */}
        <CTA />

        <Footer />
      </main>
    </>
  );
}
