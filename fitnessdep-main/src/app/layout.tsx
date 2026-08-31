import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AETHER — Futuristic 3D AI Fitness & Nutrition OS",
  description: "An immersive holographic AI Fitness & Calorie operating system with real-time biometric scanning, custom 3D models, and smart workout mechanics.",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className="antialiased text-foreground bg-background min-h-screen relative"
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          {/* Futuristic moving aurora gradients */}
          <div className="absolute -top-[30%] -left-[20%] w-[70vw] h-[70vw] rounded-full bg-neon-purple/8 opacity-25 blur-[120px] animate-pulse" />
          <div className="absolute -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-neon-blue/8 opacity-20 blur-[140px]" />
          <div className="absolute top-[40%] left-[60%] w-[35vw] h-[35vw] rounded-full bg-neon-pink/5 opacity-15 blur-[110px] animate-float" />
        </div>
        <div className="relative z-10 min-h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
