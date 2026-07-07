import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { isAdminSession } from "@/lib/auth";
import Header from "@/components/Header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fantacalcio 2026-2027",
  description:
    "Squadre iscritte ai gironi del Fantacalcio 2026-2027: gironi A, B, C e D con date delle aste.",
};

export const viewport: Viewport = {
  themeColor: "#0d0d0d",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isAdmin = await isAdminSession();

  return (
    <html lang="it" className={`${geistSans.variable} antialiased`}>
      <body className="min-h-screen font-sans">
        <Header isAdmin={isAdmin} />
        <main className="mx-auto w-full max-w-3xl px-4 pb-12 pt-6">
          {children}
        </main>
      </body>
    </html>
  );
}
