"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp } from "lucide-react";

export function UserDashboardBentoSkeleton() {
  const t = useTranslations("dashboard");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-full">
      {/* Quick Actions - Static, no skeleton needed */}
      <Card className="md:col-span-2 lg:col-span-2 hover:shadow-md transition-shadow cursor-pointer group">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{t("quickActions")}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="h-20 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2">
              <Skeleton className="w-6 h-6" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="h-20 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2">
              <Skeleton className="w-6 h-6" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="h-20 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2">
              <Skeleton className="w-6 h-6" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Study Streak - Skeleton for dynamic data */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{t("streak")}</CardTitle>
            <TrendingUp className="w-5 h-5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <Skeleton className="h-12 w-16 mx-auto mb-2" />
            <Skeleton className="h-4 w-20 mx-auto mb-2" />
            <div className="flex justify-center mt-2">
              <Skeleton className="w-2 h-2 rounded-full mx-0.5" />
              <Skeleton className="w-2 h-2 rounded-full mx-0.5" />
              <Skeleton className="w-2 h-2 rounded-full mx-0.5" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
