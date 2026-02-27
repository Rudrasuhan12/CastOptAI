import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CastOpt AI — Intelligent Precast Cycle Optimization",
  description:
    "AI-powered precast concrete cycle optimization engine. Reduce costs, carbon emissions, and cycle times with intelligent mix design recommendations.",
  keywords: ["precast", "concrete", "AI", "optimization", "construction", "L&T", "sustainability"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}>
        <div className="dot-grid" />
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
