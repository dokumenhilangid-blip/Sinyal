import type { Metadata } from "next";
import { Fraunces, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "block",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SINYAL",
  description: "A cinematic behavioral mirror.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${jetbrainsMono.variable}`}>
      <body
        className="bg-[var(--color-canvas)] text-[var(--color-ink)] font-serif selection:bg-white/20"
        suppressHydrationWarning
      >
        <div
          className="fixed inset-0 pointer-events-none opacity-[0.03] z-50 mix-blend-overlay"
          style={{ backgroundImage: "url('/noise.svg')" }}
        />
        {children}
      </body>
    </html>
  );
}
