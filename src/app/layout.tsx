import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

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
        className="antialiased noise-overlay"
      >
        <Header />
        <main className="max-w-4xl lg:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-safe">
          {children}
        </main>
      </body>
    </html>
  );
}
