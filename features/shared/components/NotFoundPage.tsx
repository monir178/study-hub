"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Search, Home, ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useRouter } from "@/i18n/navigation";

export function NotFoundPage() {
  const t = useTranslations();
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white">
      <Card className="w-full max-w-md shadow-lg border-primary/20">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-primary">
            404 - {t("common.pageNotFound")}
          </CardTitle>
          <CardDescription className="text-base">
            The page you're looking for doesn't exist
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
            <p className="text-center">{t("common.pageNotFoundMessage")}</p>
          </div>

          <div className="flex flex-col gap-3">
            <Button asChild variant="default" className="w-full" size="lg">
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                {t("common.goToHomepage")}
              </Link>
            </Button>

            <Button
              onClick={handleGoBack}
              variant="outline"
              className="w-full"
              size="lg"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("common.back")}
            </Button>
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              {t("common.needHelp")}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
