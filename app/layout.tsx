import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Provably Fair Plinko Lab",
  description:
    "Deterministic, verifiable, fair Plinko gameplay with cryptographic fairness verification.",
  keywords: ["plinko", "provably fair", "game", "casino", "crypto"],
  authors: [{ name: "Plinko Lab" }],
  openGraph: {
    title: "Provably Fair Plinko Lab",
    description: "Experience the future of fair gaming",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col overflow-x-hidden bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.16),_transparent_28%),radial-gradient(circle_at_20%_20%,_rgba(168,85,247,0.14),_transparent_24%),linear-gradient(135deg,_#020617_0%,_#050816_45%,_#020202_100%)]">
        {children}
      </body>
    </html>
  );
}
