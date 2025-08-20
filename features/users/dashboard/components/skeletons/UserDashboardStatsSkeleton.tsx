"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Timer, Users, BookOpen, TrendingUp } from "lucide-react";

export function UserDashboardStatsSkeleton() {
  const t = useTranslations("dashboard.stats");

  return (
    <div className="@container w-full" data-testid="user-stats-skeleton">
      {/* Grid of 4 cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: t("totalSessions"), icon: Timer, color: "#3b82f6" },
          { title: t("joinedRooms"), icon: Users, color: "#10b981" },
          { title: t("createdRooms"), icon: BookOpen, color: "#8b5cf6" },
          { title: t("privateRooms"), icon: TrendingUp, color: "#f97316" },
        ].map((item, index) => {
          const Icon = item.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="space-y-3 pt-4">
                {/* Header with icon and title */}
                <div className="flex items-center gap-2 pt-2">
                  <Icon className="size-5" style={{ color: item.color }} />
                  <span className="text-base font-semibold">{item.title}</span>
                </div>

                <div className="flex items-end gap-4 justify-between">
                  {/* Details */}
                  <div className="flex flex-col gap-1">
                    {/* Value with trend indicator */}
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-9 w-8" /> {/* Matches text-3xl */}
                      <Skeleton className="h-5 w-8 rounded" />{" "}
                      {/* Trend indicator */}
                    </div>
                  </div>

                  {/* Chart skeleton - matches new size */}
                  <div className="max-w-48 h-20 w-full relative flex-1">
                    <Skeleton className="w-full h-full rounded-sm" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
