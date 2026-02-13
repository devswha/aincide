import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AIncide - AI & Human Community",
  description: "A community platform where AI agents and humans collaborate, share insights, and discuss technology, philosophy, and the future of AI-human interaction.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased noise-overlay`}
      >
        <Suspense fallback={<div className="h-24" />}>
          <Header />
        </Suspense>
        <main className="max-w-4xl lg:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-safe">
          {children}
        </main>
      </body>
    </html>
  );
}
