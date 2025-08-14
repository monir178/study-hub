"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { Link } from "@/i18n/navigation";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export function ErrorPage({ error, reset }: ErrorPageProps) {
  const t = useTranslations();

  useEffect(() => {
    // Log error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-red-950/20 dark:via-orange-950/20 dark:to-yellow-950/20">
      <Card className="w-full max-w-md shadow-lg border-destructive/20">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl font-bold text-destructive">
            {t("common.error")}
          </CardTitle>
          <CardDescription className="text-base">
            {t("auth.errorOccurred")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
            <p className="font-medium mb-1">{t("common.errorDetails")}:</p>
            <p className="text-xs font-mono break-words">
              {error.message || "An unexpected error occurred"}
            </p>
            {error.digest && (
              <p className="text-xs font-mono mt-1 opacity-70">
                ID: {error.digest}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <Button
              onClick={reset}
              variant="default"
              className="w-full"
              size="lg"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              {t("common.refresh")}
            </Button>

            <Button asChild variant="outline" className="w-full" size="lg">
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                {t("common.goToHomepage")}
              </Link>
            </Button>
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              {t("common.contactSupport")}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
