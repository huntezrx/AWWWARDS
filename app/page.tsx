"use client";

import { useLenis } from "@/hooks/useLenis";
import { useScrollVelocity } from "@/hooks/useScrollVelocity";

import VXUSCursor  from "@/components/vxus/VXUSCursor";
import Nav         from "@/components/vxus/Nav";
import Hero        from "@/components/vxus/Hero";
import TrustedBy   from "@/components/vxus/TrustedBy";
import Features    from "@/components/vxus/Features";
import Stats       from "@/components/vxus/Stats";
import Pricing     from "@/components/vxus/Pricing";
import CTA         from "@/components/vxus/CTA";
import Footer      from "@/components/vxus/Footer";

export default function Home() {
  useLenis();
  useScrollVelocity();

  return (
    <>
      <VXUSCursor />
      <Nav />
      <main>
        <Hero />
        <TrustedBy />
        <Features />
        <Stats />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
