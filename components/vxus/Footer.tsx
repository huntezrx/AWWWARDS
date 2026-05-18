"use client";

import VXUSLogo from "./VXUSLogo";

const LINKS = {
  Product: ["Features", "Pricing", "Changelog", "Roadmap", "Security"],
  Developers: ["Documentation", "API Reference", "SDKs", "Open Source", "Status"],
  Company: ["About", "Blog", "Careers", "Press", "Contact"],
  Legal: ["Privacy", "Terms", "Cookies", "DPA", "Security Policy"],
};

export default function Footer() {
  return (
    <footer
      className="relative border-t"
      style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(7,6,26,0.5)" }}
    >
      <div className="container section" style={{ paddingTop: "5rem", paddingBottom: "3rem" }}>
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-10 mb-16">
          {/* Brand column */}
          <div className="col-span-2">
            <VXUSLogo size={28} className="mb-5" />
            <p className="text-sm leading-relaxed max-w-xs mb-6" style={{ color: "rgba(237,233,255,0.38)" }}>
              The AI platform engineered for enterprises that demand precision,
              performance, and absolute reliability.
            </p>
            {/* Social links */}
            <div className="flex gap-3">
              {[
                { label: "X", path: "M18 4l-8 8m0 0L4 4m6 8l-6 8m6-8l8 8" },
                { label: "GH", path: "M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" },
                { label: "LI", path: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" },
              ].map(({ label, path }) => (
                <a
                  key={label}
                  href="#"
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-200"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    color: "rgba(237,233,255,0.35)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(124,90,243,0.12)";
                    (e.currentTarget as HTMLElement).style.color = "#A68FFF";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(124,90,243,0.3)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
                    (e.currentTarget as HTMLElement).style.color = "rgba(237,233,255,0.35)";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)";
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d={path}/>
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([category, links]) => (
            <div key={category}>
              <h4 className="label mb-5" style={{ color: "rgba(237,233,255,0.5)" }}>{category}</h4>
              <ul className="flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm transition-colors duration-200"
                      style={{ color: "rgba(237,233,255,0.32)" }}
                      onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#EDE9FF")}
                      onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "rgba(237,233,255,0.32)")}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          <p className="text-xs" style={{ color: "rgba(237,233,255,0.22)" }}>
            © 2025 VXUS AI, Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#00E5A0" }} />
            <span className="text-xs" style={{ color: "rgba(237,233,255,0.28)" }}>
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
