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
  title: "Streaming Landscape Explorer",
  description: "Explore how movies and shows vary by genre, country, language, and more. An interactive data visualization experience.",
  keywords: ["Netflix", "streaming", "movies", "TV shows", "data visualization", "analytics"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#09090b] text-[#fafafa] min-h-screen`}
      >
        {/* Animated gradient background */}
        <div className="gradient-bg" aria-hidden="true" />
        <div className="grid-pattern" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
