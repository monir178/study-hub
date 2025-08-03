"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function StudyTimeChartSkeleton() {
  const t = useTranslations("dashboard.charts");

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>
          {t("studyTime")} ({t("last7Days")})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Chart Area Skeleton */}
          <div className="relative h-[400px] w-full">
            {/* Grid Lines */}
            <div className="absolute inset-0">
              {/* Horizontal grid lines */}
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="absolute w-full border-b border-dashed border-gray-200"
                  style={{ top: `${i * 25}%` }}
                />
              ))}
              {/* Vertical grid lines */}
              {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="absolute h-full border-r border-dashed border-gray-200"
                  style={{ left: `${i * 16.66}%` }}
                />
              ))}
            </div>

            {/* Area Chart Skeleton */}
            <div className="absolute inset-0 flex items-end">
              {/* Base line */}
              <div className="w-full h-0.5 bg-gray-300" />

              {/* Area fill skeleton - simulating the chart area */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-purple-100 to-transparent opacity-30">
                <div
                  className="h-full w-full"
                  style={{
                    clipPath:
                      "polygon(0% 100%, 14.28% 100%, 28.57% 100%, 42.85% 100%, 57.14% 100%, 71.42% 100%, 85.71% 100%, 100% 10%, 100% 100%)",
                  }}
                />
              </div>
            </div>

            {/* Y-axis labels skeleton */}
            <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-400">
              <Skeleton className="h-3 w-8" />
              <Skeleton className="h-3 w-8" />
              <Skeleton className="h-3 w-8" />
              <Skeleton className="h-3 w-8" />
              <Skeleton className="h-3 w-8" />
            </div>

            {/* X-axis labels skeleton */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-400 px-2">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-3 w-12" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
