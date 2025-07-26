import { Button } from "@/components/ui/button";
import Link from "next/link";

interface CTASectionProps {
  locale?: string;
}

export default function CTASection({ locale = "en" }: CTASectionProps) {
  return (
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
            <Link href={`/${locale}/auth/signup`}>Start Learning Together</Link>
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
  );
}
