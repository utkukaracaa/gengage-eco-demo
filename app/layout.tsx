import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gengage Eco Filter Demo — Vivense Pilot",
  description: "AI-powered eco-friendly product detection: keyword scoring + LLM intent extraction",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className="antialiased">{children}</body>
    </html>
  );
}
