"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import TextReveal from "../ui/TextReveal";

const services = [
  {
    number: "01",
    title: "Visual Design",
    description:
      "Pixel-perfect interfaces that communicate brand identity through sophisticated visual hierarchy, motion, and emotion.",
    tags: ["UI/UX", "Brand", "Systems"],
    icon: "◈",
  },
  {
    number: "02",
    title: "Motion & Interaction",
    description:
      "Choreographed animations and micro-interactions that make every touchpoint feel alive and intentional.",
    tags: ["GSAP", "Framer", "WebGL"],
    icon: "◊",
  },
  {
    number: "03",
    title: "3D & Immersive",
    description:
      "Real-time 3D experiences and immersive environments that transport users into entirely new dimensions.",
    tags: ["Three.js", "R3F", "Shaders"],
    icon: "⬡",
  },
  {
    number: "04",
    title: "Development",
    description:
      "Production-grade frontend engineering with obsessive attention to performance, accessibility, and scalability.",
    tags: ["Next.js", "TypeScript", "Edge"],
    icon: "⊕",
  },
];

export default function Services() {
  const ref = useRef<HTMLElement>(null);
  const [activeService, setActiveService] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  return (
    <section
      ref={ref}
      id="services"
      className="relative py-32 md:py-48 overflow-hidden"
      style={{ background: "#020206" }}
    >
      {/* Background */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ y: backgroundY }}
      >
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 80%, rgba(99,102,241,1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(6,182,212,1) 0%, transparent 50%)`,
          }}
        />
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="mb-20">
          <motion.div
            className="flex items-center gap-3 mb-6"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-8 h-px bg-indigo-500" />
            <span className="text-xs text-indigo-400/80 tracking-[0.4em] uppercase font-light">
              What We Do
            </span>
          </motion.div>
          <TextReveal
            text="Services built for exceptional brands."
            className="text-4xl md:text-6xl font-thin text-white/90 max-w-2xl"
            delay={0.1}
          />
        </div>

        {/* Services list */}
        <div className="space-y-0">
          {services.map((service, i) => (
            <motion.div
              key={service.number}
              className="group relative border-t border-white/5 py-8 cursor-none"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-5%" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              onMouseEnter={() => setActiveService(i)}
              onMouseLeave={() => setActiveService(null)}
            >
              {/* Hover background */}
              <motion.div
                className="absolute inset-0 rounded-2xl"
                animate={{
                  opacity: activeService === i ? 1 : 0,
                  background: "linear-gradient(90deg, rgba(99,102,241,0.05) 0%, transparent 100%)",
                }}
                transition={{ duration: 0.3 }}
              />

              <div className="relative flex flex-col md:flex-row md:items-center gap-6 md:gap-10 px-4">
                {/* Number */}
                <div className="flex-shrink-0">
                  <motion.span
                    className="text-sm font-mono text-white/20 group-hover:text-indigo-500/60 transition-colors duration-500"
                    animate={{ x: activeService === i ? 8 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {service.number}
                  </motion.span>
                </div>

                {/* Icon */}
                <div className="flex-shrink-0 w-10 hidden md:block">
                  <motion.span
                    className="text-2xl text-indigo-400/30 group-hover:text-indigo-400/80 transition-colors duration-500"
                    animate={{ scale: activeService === i ? 1.2 : 1, rotate: activeService === i ? 45 : 0 }}
                    transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                  >
                    {service.icon}
                  </motion.span>
                </div>

                {/* Title */}
                <div className="flex-shrink-0 md:w-56">
                  <h3 className="text-xl md:text-2xl font-light text-white/80 group-hover:text-white transition-colors duration-500">
                    {service.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-white/30 font-light leading-relaxed text-sm md:text-base flex-1 group-hover:text-white/50 transition-colors duration-500">
                  {service.description}
                </p>

                {/* Tags */}
                <div className="flex-shrink-0 flex gap-2 flex-wrap md:flex-nowrap">
                  {service.tags.map((tag) => (
                    <motion.span
                      key={tag}
                      className="text-xs px-3 py-1 rounded-full border border-white/5 text-white/30 group-hover:border-indigo-500/30 group-hover:text-indigo-400/60 transition-all duration-500"
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>

                {/* Arrow */}
                <div className="flex-shrink-0 hidden md:block">
                  <motion.div
                    className="text-white/20 group-hover:text-white/60 transition-colors duration-500"
                    animate={{ x: activeService === i ? 4 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    →
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
          <div className="border-t border-white/5" />
        </div>
      </div>
    </section>
  );
}
