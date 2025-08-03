"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function RecentRoomsSkeleton() {
  const t = useTranslations("dashboard.charts");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("recentRooms")}</CardTitle>
        <Skeleton className="h-4 w-48" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="space-y-1">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-8 w-16" />
            </div>
          ))}
          <div className="text-center py-4">
            <Skeleton className="h-9 w-32 mx-auto" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
