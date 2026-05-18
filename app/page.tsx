"use client";

import { useLenis } from "@/hooks/useLenis";
import CustomCursor from "@/components/ui/CustomCursor";
import LoadingScreen from "@/components/ui/LoadingScreen";
import Navigation from "@/components/Navigation";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Interactive3D from "@/components/sections/Interactive3D";
import Services from "@/components/sections/Services";
import BentoGrid from "@/components/sections/BentoGrid";
import MarqueeSection from "@/components/sections/MarqueeSection";
import Showcase from "@/components/sections/Showcase";
import Testimonials from "@/components/sections/Testimonials";
import CTA from "@/components/sections/CTA";
import Footer from "@/components/sections/Footer";

export default function Home() {
  useLenis();

  return (
    <>
      <LoadingScreen />
      <CustomCursor />
      <Navigation />

      <main className="relative overflow-hidden" style={{ background: "#020206" }}>
        <Hero />
        <MarqueeSection />
        <About />
        <Services />
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
