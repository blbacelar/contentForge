import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";
import { AnimatedLayout } from "@/components/layout/animated-layout";
import { Toaster } from "@/components/ui/sonner"
import { Buffer } from 'buffer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

// Add this early in your app initialization
if (typeof window !== 'undefined') {
  window.Buffer = Buffer;
}

export const metadata: Metadata = {
  title: "AI Video Generator",
  description: "Transform ideas into videos with AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} antialiased bg-zinc-950`}>
        <AnimatedLayout>
          <main className="container mx-auto p-4">
            {children}
          </main>
        </AnimatedLayout>
        <Toaster />
      </body>
    </html>
  );
}
