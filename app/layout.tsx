import type { Metadata } from "next";
import { Inter } from "next/font/google";
// @ts-expect-error: allow side-effect CSS import in TS
import "./globals.css";
import Providers from "./providers";
import Navbar from "@/components/Navbar";
import Footer from "../components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Community Based Information System",
  description: "Information system for communities",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased bg-(--cc-bg) text-(--cc-text)`}
      >
        <Providers>
          <Navbar />
          <main className="min-h-[70vh] animate-fade-in">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
