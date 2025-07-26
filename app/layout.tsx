import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Providers } from "@/lib/providers/providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "StudyHub - Collaborative Learning Platform",
    template: "%s | StudyHub",
  },
  description:
    "A modern collaborative learning platform with real-time features for study groups, Pomodoro timers, collaborative notes, and mentor-student interactions.",
  keywords: [
    "study",
    "collaboration",
    "pomodoro",
    "notes",
    "chat",
    "learning",
    "education",
    "mentor",
    "student",
    "real-time",
  ],
  authors: [{ name: "StudyHub Team" }],
  creator: "StudyHub Team",
  metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "StudyHub - Collaborative Learning Platform",
    description:
      "A modern collaborative learning platform with real-time features for study groups",
    siteName: "StudyHub",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "StudyHub - Collaborative Learning Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "StudyHub - Collaborative Learning Platform",
    description:
      "A modern collaborative learning platform with real-time features for study groups",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#6366f1" },
    { media: "(prefers-color-scheme: dark)", color: "#818cf8" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning className="h-full">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased h-full m-0 p-0 w-full overflow-x-hidden bg-background text-foreground`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
