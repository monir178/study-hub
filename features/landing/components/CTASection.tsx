import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

interface CTASectionProps {
  locale?: string;
}

export default function CTASection({
  locale: _locale = "en",
}: CTASectionProps) {
  const t = useTranslations("landing.cta");

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl lg:text-4xl font-bold mb-6">{t("title")}</h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          {t("subtitle")}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="px-8 py-6 text-lg" asChild>
            <Link href="/auth/signup">{t("startLearning")}</Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="px-8 py-6 text-lg"
            asChild
          >
            <Link href="/dashboard/rooms">{t("exploreRooms")}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
