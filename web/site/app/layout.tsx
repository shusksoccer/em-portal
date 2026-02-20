import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
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
  title: "Material Note",
  description: "整理された教材とノートのポータルサイト",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="border-b border-zinc-200 dark:border-zinc-800">
          <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="font-bold text-xl">
              Material Note
            </Link>
            <nav>
              <Link href="/materials" className="text-zinc-600 hover:text-blue-600 transition-colors">
                教材一覧
              </Link>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
