import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://clipcraftapp.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ClipCraft — Convert, compress and GIF-ify videos in your browser",
    template: "%s · ClipCraft",
  },
  description:
    "Drag any video. Get a viral-ready GIF in seconds. 100% in your browser. Zero upload. Forever free. No watermark, no signup.",
  applicationName: "ClipCraft",
  keywords: [
    "video to gif",
    "mp4 to gif",
    "compress video online",
    "convert video browser",
    "ffmpeg wasm",
    "private video converter",
    "no upload video converter",
    "free gif maker",
  ],
  authors: [{ name: "ClipCraft" }],
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "ClipCraft — Convert videos in your browser. Zero upload.",
    description:
      "Drag any video. Get a viral-ready GIF in seconds. 100% in your browser. Forever free.",
    siteName: "ClipCraft",
  },
  twitter: {
    card: "summary_large_image",
    title: "ClipCraft — Convert videos in your browser. Zero upload.",
    description:
      "Drag any video. Get a viral-ready GIF in seconds. 100% in your browser. Forever free.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
        {children}
        <ServiceWorkerRegister />
        <Analytics />
      </body>
    </html>
  );
}
