import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Header } from "@/components/header";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://korih.dev";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Kori H — Software Developer in Vancouver",
    template: "%s | Kori H",
  },
  description:
    "Kori H is a software developer based in Vancouver, BC. Writing about code, light novels, and films worth watching.",
  icons: {
    icon: [
      { url: "/favicon_io/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon_io/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/favicon_io/apple-touch-icon.png",
    shortcut: "/favicon_io/favicon.ico",
  },
  manifest: "/favicon_io/site.webmanifest",
  openGraph: {
    siteName: "Kori H",
    locale: "en_CA",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-bg text-fg font-sans">
        <Providers>
          <Header />
          <main className="mx-auto max-w-5xl px-4 sm:px-6 py-8">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
