import { Metadata } from "next";

export const landingPageMetadata: Metadata = {
  title:
    "StudyHub - Collaborative Learning Platform | Sync Timers, Notes & Chat",
  description:
    "Join synchronized study rooms with real-time Pomodoro timers, collaborative markdown notes, and instant group chat. The ultimate platform for focused, productive learning sessions.",
  keywords: [
    "study groups",
    "collaborative learning",
    "pomodoro timer",
    "study rooms",
    "real-time notes",
    "group chat",
    "online education",
    "student collaboration",
    "productivity",
    "learning platform",
  ],
  authors: [{ name: "StudyHub Team" }],
  creator: "StudyHub",
  publisher: "StudyHub",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en",
      "es-ES": "/es",
    },
  },
  openGraph: {
    title: "StudyHub - Collaborative Learning Platform",
    description:
      "Join synchronized study rooms with real-time Pomodoro timers, collaborative markdown notes, and instant group chat.",
    url: "/",
    siteName: "StudyHub",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "StudyHub - Collaborative Learning Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "StudyHub - Collaborative Learning Platform",
    description:
      "Join synchronized study rooms with real-time Pomodoro timers, collaborative markdown notes, and instant group chat.",
    images: ["/og-image.jpg"],
    creator: "@studyhub",
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
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
};

export const generateLandingPageMetadata = (
  locale: string = "en",
): Metadata => {
  const baseMetadata = { ...landingPageMetadata };

  if (locale === "es") {
    baseMetadata.title =
      "StudyHub - Plataforma de Aprendizaje Colaborativo | Sincroniza Timers, Notas y Chat";
    baseMetadata.description =
      "Únete a salas de estudio sincronizadas con temporizadores Pomodoro en tiempo real, notas markdown colaborativas y chat grupal instantáneo.";

    if (baseMetadata.openGraph) {
      baseMetadata.openGraph.title =
        "StudyHub - Plataforma de Aprendizaje Colaborativo";
      baseMetadata.openGraph.description =
        "Únete a salas de estudio sincronizadas con temporizadores Pomodoro en tiempo real, notas markdown colaborativas y chat grupal instantáneo.";
      baseMetadata.openGraph.locale = "es_ES";
    }

    if (baseMetadata.twitter) {
      baseMetadata.twitter.title =
        "StudyHub - Plataforma de Aprendizaje Colaborativo";
      baseMetadata.twitter.description =
        "Únete a salas de estudio sincronizadas con temporizadores Pomodoro en tiempo real, notas markdown colaborativas y chat grupal instantáneo.";
    }
  }

  return baseMetadata;
};
