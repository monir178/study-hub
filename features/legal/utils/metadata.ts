import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal" });

  return {
    title: t("metadata.title"),
    description: t("metadata.description"),
    keywords: [
      "privacy policy",
      "terms of service",
      "security",
      "contact",
      "legal",
      "studyhub",
      "collaborative learning",
    ],
    openGraph: {
      title: t("metadata.title"),
      description: t("metadata.description"),
      type: "website",
    },
    twitter: {
      card: "summary",
      title: t("metadata.title"),
      description: t("metadata.description"),
    },
  };
}
