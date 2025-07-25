export const landingPageStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "StudyHub",
  description:
    "Collaborative learning platform with synchronized study rooms, real-time Pomodoro timers, collaborative notes, and group chat.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  applicationCategory: "EducationalApplication",
  operatingSystem: "Web Browser",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
  },
  featureList: [
    "Synchronized Pomodoro Timers",
    "Real-time Collaborative Notes",
    "Group Chat",
    "Study Rooms",
    "Multi-language Support",
    "Cross-platform Compatibility",
  ],
  provider: {
    "@type": "Organization",
    name: "StudyHub",
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    ratingCount: "1250",
    bestRating: "5",
    worstRating: "1",
  },
  author: {
    "@type": "Organization",
    name: "StudyHub Team",
  },
};

export const organizationStructuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "StudyHub",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  logo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/logo.png`,
  description:
    "StudyHub is a collaborative learning platform that helps students study together with synchronized timers, real-time notes, and group chat.",
  foundingDate: "2024",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    email: "support@studyhub.com",
  },
  sameAs: [
    "https://twitter.com/studyhub",
    "https://github.com/studyhub",
    "https://linkedin.com/company/studyhub",
  ],
};

export const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is StudyHub?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "StudyHub is a collaborative learning platform that allows students to join synchronized study rooms with real-time Pomodoro timers, collaborative markdown notes, and instant group chat.",
      },
    },
    {
      "@type": "Question",
      name: "Is StudyHub free to use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, StudyHub offers a free tier that includes access to basic features like study rooms, timers, and chat. Premium features are available with paid plans.",
      },
    },
    {
      "@type": "Question",
      name: "How do synchronized timers work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Synchronized timers ensure all members in a study room have the same Pomodoro timer running, helping maintain focus and coordinated study sessions.",
      },
    },
    {
      "@type": "Question",
      name: "Can I collaborate on notes in real-time?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, StudyHub features a real-time collaborative markdown editor that allows multiple users to edit notes simultaneously with live updates.",
      },
    },
  ],
};
