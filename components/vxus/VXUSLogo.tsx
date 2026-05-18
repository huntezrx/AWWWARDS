"use client";

/* VXUS AI Logo
   Symbol: Three vectors converging on a central hexagonal nexus node
   — represents AI neural pathway convergence.
   Gradient: violet #7C5AF3 → cyan #00CFFF
   Wordmark: VXUS in Syne, "AI" with gradient */

export default function VXUSLogo({
  size = 32,
  showWordmark = true,
  className = "",
}: {
  size?: number;
  showWordmark?: boolean;
  className?: string;
}) {
  const id = `vxus-grad-${size}`;
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Symbol */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#7C5AF3" />
            <stop offset="100%" stopColor="#00CFFF" />
          </linearGradient>
        </defs>

        {/* Outer hexagon outline */}
        <polygon
          points="20,2 35,11 35,29 20,38 5,29 5,11"
          stroke={`url(#${id})`}
          strokeWidth="1.2"
          fill="none"
          opacity="0.35"
        />

        {/* Three vectors converging to center nexus */}
        {/* Top vector */}
        <line x1="20" y1="6"  x2="20" y2="18" stroke={`url(#${id})`} strokeWidth="1.8" strokeLinecap="round" />
        {/* Bottom-left vector */}
        <line x1="8.5" y1="27" x2="17.5" y2="21" stroke={`url(#${id})`} strokeWidth="1.8" strokeLinecap="round" />
        {/* Bottom-right vector */}
        <line x1="31.5" y1="27" x2="22.5" y2="21" stroke={`url(#${id})`} strokeWidth="1.8" strokeLinecap="round" />

        {/* Central nexus node */}
        <circle cx="20" cy="20" r="3.5" fill={`url(#${id})`} opacity="0.95" />
        <circle cx="20" cy="20" r="5.5" stroke={`url(#${id})`} strokeWidth="0.8" fill="none" opacity="0.4" />

        {/* Terminal nodes */}
        <circle cx="20"  cy="5.5" r="2"   fill={`url(#${id})`} opacity="0.7" />
        <circle cx="7.5" cy="28"  r="2"   fill={`url(#${id})`} opacity="0.7" />
        <circle cx="32.5" cy="28" r="2"   fill={`url(#${id})`} opacity="0.7" />
      </svg>

      {/* Wordmark */}
      {showWordmark && (
        <div className="flex items-baseline gap-1" style={{ fontFamily: "var(--font-syne, sans-serif)" }}>
          <span
            style={{
              fontSize: size * 0.5,
              fontWeight: 700,
              letterSpacing: "0.06em",
              color: "#EDE9FF",
              lineHeight: 1,
            }}
          >
            VXUS
          </span>
          <span
            style={{
              fontSize: size * 0.32,
              fontWeight: 600,
              letterSpacing: "0.12em",
              background: "linear-gradient(120deg, #A68FFF, #00CFFF)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              lineHeight: 1,
            }}
          >
            AI
          </span>
        </div>
      )}
    </div>
  );
}
