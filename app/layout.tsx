import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["200", "300", "400", "500", "600"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#020206",
};

export const metadata: Metadata = {
  title: "LUMINA — Digital Luxury Studio",
  description:
    "We engineer premium digital experiences that convert. Specialists in WebGL, motion design, and conversion-optimised UI for the world's most ambitious brands.",
  keywords: ["digital studio", "luxury design", "WebGL", "UI/UX", "motion design", "Next.js"],
  authors: [{ name: "Lumina Studio" }],
  openGraph: {
    title: "LUMINA — Digital Luxury Studio",
    description: "Premium digital experiences that convert.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "LUMINA — Digital Luxury Studio",
    description: "Premium digital experiences that convert.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
