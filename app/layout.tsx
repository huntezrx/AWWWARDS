import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LUMINA — Digital Luxury Experience",
  description: "A surrealist, cinematic digital experience. Premium UI design at the intersection of art and technology.",
  keywords: ["luxury", "digital", "design", "experience", "premium", "UI", "UX"],
  openGraph: {
    title: "LUMINA — Digital Luxury Experience",
    description: "A surrealist, cinematic digital experience.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="antialiased min-h-full">{children}</body>
    </html>
  );
}
