import type { Metadata } from "next";
import "./globals.css";

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
      <body className="antialiased noise-overlay">
        {children}
      </body>
    </html>
  );
}
