import {
  HeroSection,
  FeaturesSection,
  CTASection,
} from "@/features/landing/components";
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

      {/* Hero Section - Full width, no container */}
      <HeroSection key={`hero-${locale}`} />

      {/* Main Content */}

      {/* Features Section */}
      <FeaturesSection key={`features-${locale}`} />

      {/* CTA Section */}
      <CTASection key={`cta-${locale}`} locale={locale} />
    </div>
  );
}
