import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Clock,
  Users,
  MessageSquare,
  FileText,
  Zap,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { HeroSection, Header } from "@/features/landing/components";
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

      {/* Header - positioned absolutely over hero */}
      <Header locale={locale} />

      {/* Hero Section - Full width, no container */}
      <HeroSection />

      {/* Main Content */}
      <main className="relative z-10">
        {/* Features Section */}
        <section id="features" className="py-20 px-4 bg-muted/50">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Everything You Need to Study Together
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Powerful features designed to enhance collaborative learning and
                boost productivity
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <Clock className="w-10 h-10 text-primary mb-2" />
                  <CardTitle>Synchronized Timers</CardTitle>
                  <CardDescription>
                    Pomodoro timers that sync across all room members for
                    focused study sessions with breaks in perfect harmony
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <FileText className="w-10 h-10 text-primary mb-2" />
                  <CardTitle>Collaborative Notes</CardTitle>
                  <CardDescription>
                    Real-time markdown editor for shared note-taking with live
                    collaboration and version history
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <MessageSquare className="w-10 h-10 text-primary mb-2" />
                  <CardTitle>Group Chat</CardTitle>
                  <CardDescription>
                    Instant messaging within study rooms to discuss topics,
                    share resources, and stay connected
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <Users className="w-10 h-10 text-primary mb-2" />
                  <CardTitle>Study Rooms</CardTitle>
                  <CardDescription>
                    Create or join public/private rooms with role-based
                    permissions and member management
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <Zap className="w-10 h-10 text-primary mb-2" />
                  <CardTitle>Real-time Sync</CardTitle>
                  <CardDescription>
                    Everything updates instantly across all devices and
                    participants with lightning-fast performance
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <Shield className="w-10 h-10 text-primary mb-2" />
                  <CardTitle>Secure & Private</CardTitle>
                  <CardDescription>
                    Your data is protected with enterprise-grade security,
                    encryption, and privacy controls
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Ready to Transform Your Study Sessions?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of students already using StudyHub to achieve their
              learning goals together. Start your collaborative learning journey
              today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="px-8 py-6 text-lg" asChild>
                <Link href={`/${locale}/auth/signup`}>
                  Start Learning Together
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-6 text-lg"
                asChild
              >
                <Link href={`/${locale}/rooms`}>Explore Rooms</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t py-12 px-4 bg-muted/30">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">S</span>
                  </div>
                  <span className="text-xl font-bold">StudyHub</span>
                </div>
                <p className="text-muted-foreground">
                  The ultimate collaborative learning platform for students
                  worldwide.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Product</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>
                    <Link href="#features" className="hover:text-foreground">
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link href="#pricing" className="hover:text-foreground">
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={`/${locale}/rooms`}
                      className="hover:text-foreground"
                    >
                      Study Rooms
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Company</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>
                    <Link href="#about" className="hover:text-foreground">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link href="#contact" className="hover:text-foreground">
                      Contact
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy" className="hover:text-foreground">
                      Privacy
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Support</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>
                    <Link href="/help" className="hover:text-foreground">
                      Help Center
                    </Link>
                  </li>
                  <li>
                    <Link href="/docs" className="hover:text-foreground">
                      Documentation
                    </Link>
                  </li>
                  <li>
                    <Link href="/community" className="hover:text-foreground">
                      Community
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t pt-8 text-center text-muted-foreground">
              <p>
                &copy; 2024 StudyHub. Built with Next.js, Tailwind CSS, and ❤️.
                All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
