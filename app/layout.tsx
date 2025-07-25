import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "StudyHub - Collaborative Learning Platform",
  description:
    "A modern collaborative learning platform with real-time features for study groups",
  keywords: ["study", "collaboration", "pomodoro", "notes", "chat", "learning"],
  authors: [{ name: "StudyHub Team" }],
  openGraph: {
    title: "StudyHub - Collaborative Learning Platform",
    description:
      "A modern collaborative learning platform with real-time features for study groups",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
