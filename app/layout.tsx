import type { Metadata, Viewport } from "next";
import { Syne, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["300", "400"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#03020E",
};

export const metadata: Metadata = {
  title: "VXUS AI — Intelligence, Redefined",
  description: "Next-generation AI platform delivering enterprise intelligence at the speed of thought.",
  keywords: ["AI platform", "artificial intelligence", "enterprise AI", "machine learning", "VXUS"],
  authors: [{ name: "VXUS AI" }],
  openGraph: {
    title: "VXUS AI — Intelligence, Redefined",
    description: "Next-generation AI platform.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${syne.variable} ${inter.variable} ${jetbrains.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
