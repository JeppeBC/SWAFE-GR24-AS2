import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import '@/app/ui/global.css';
import '@/app/globals.css';
import NavBar from '@/app/components/NavBar';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Group 24 - Fitness",
  description: "Personal trainer and client workout programs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="app-root">
          <NavBar />
          <main className="main-content">{children}</main>
        </div>
      </body>
    </html>
  );
}
