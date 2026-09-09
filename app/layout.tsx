import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { Navbar } from "@/components/Navbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#09090b",
};

export const metadata: Metadata = {
  title: "PRD Craft - AI PRD & Architecture Generator",
  description:
    "Generate production-grade Product Requirements Documents, SQL schemas, API contracts, and Cursor AI rules in seconds with Google Gemini.",
  keywords: [
    "PRD Generator",
    "AI Product Manager",
    "System Architecture",
    "Next.js 15",
    "Supabase",
    "Cursor Rules",
  ],
  authors: [{ name: "PRD Craft Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} min-h-screen bg-zinc-950 font-sans text-zinc-100 antialiased selection:bg-brand-500/30 selection:text-brand-200`}
      >
        <AuthProvider>
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <footer className="no-print border-t border-zinc-800/60 bg-zinc-950/80 py-8 text-center text-xs text-zinc-500">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>PRD Craft • High-Assurance AI Architecture Engine</span>
                </div>
                <div className="flex items-center gap-4 text-zinc-400">
                  <span>Powered by Gemini 1.5 & Supabase SSR</span>
                </div>
              </div>
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
