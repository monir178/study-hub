import {
  HeroSection,
  FeaturesSection,
  CTASection,
  Footer,
} from "@/features/landing/components";
import { Navbar } from "@/features/shared";
import { generateLandingPageMetadata } from "@/features/landing/utils/metadata";
import {
  landingPageStructuredData,
  organizationStructuredData,
  faqStructuredData,
} from "@/features/landing/utils/structuredData";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return generateLandingPageMetadata(locale);
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="w-full">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            landingPageStructuredData,
            organizationStructuredData,
            faqStructuredData,
          ]),
        }}
      />

      {/* Navbar - positioned absolutely over hero */}
      <Navbar locale={locale} variant="landing" />

      {/* Hero Section - Full width, no container */}
      <HeroSection />

      {/* Main Content */}
      <main className="relative z-10">
        {/* Features Section */}
        <FeaturesSection />

        {/* CTA Section */}
        <CTASection locale={locale} />

        {/* Footer */}
        <Footer locale={locale} />
      </main>
    </div>
  );
}
