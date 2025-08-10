"use client";

import { useTranslations } from "next-intl";
import { RadialBarChart, RadialBar } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useApiQuery } from "@/lib/api/hooks/use-api-query";
import { queryKeys } from "@/lib/query/keys";
import { ModeratorDashboardService } from "../services/moderator-dashboard.service";
import { TrendingUp } from "lucide-react";

const chartConfig = {
  users: {
    label: "Users",
    color: "var(--chart-1)",
  },
  moderators: {
    label: "Moderators",
    color: "var(--chart-2)",
  },
  admins: {
    label: "Admins",
    color: "var(--chart-3)",
  },
};

export function UserRoleDistributionChart() {
  const t = useTranslations("moderator");
  const { data, isLoading } = useApiQuery({
    queryKey: queryKeys.moderatorDashboard(),
    queryFn: () => ModeratorDashboardService.getDashboardData(),
  });

  if (isLoading || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("userRoleDistribution")}</CardTitle>
          <CardDescription>{t("usersByRole")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] animate-pulse bg-muted rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  // Create gradient colors from darker to lighter using RGB with opacity
  const chartData = [
    {
      role: "users",
      label: "Users",
      count: data.stats.users.byRole.users,
      fill: "rgba(99, 102, 241, 0.6)", // Lightest (innermost)
    },
    {
      role: "moderators",
      label: "Moderators",
      count: data.stats.users.byRole.moderators,
      fill: "rgba(79, 70, 229, 0.8)", // Medium
    },
    {
      role: "admins",
      label: "Admins",
      count: data.stats.users.byRole.admins,
      fill: "rgba(67, 56, 202, 1)", // Darkest (outermost)
    },
  ];

  const totalUsers = data.stats.users.total;
  const newUsersThisWeek = data.stats.users.newThisWeek;
  const growthPercentage =
    totalUsers > 0 ? ((newUsersThisWeek / totalUsers) * 100).toFixed(1) : "0.0";

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{t("userRoleDistribution")}</CardTitle>
            <CardDescription>
              {t("totalUsers")}: {totalUsers.toLocaleString()}
            </CardDescription>
          </div>

          {/* Legend in top-right */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: "rgba(67, 56, 202, 1)" }}
              />
              <span className="text-sm font-medium">{t("roles.admins")}</span>
              <span className="text-sm font-bold text-foreground">
                {data.stats.users.byRole.admins}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: "rgba(79, 70, 229, 0.8)" }}
              />
              <span className="text-sm font-medium">
                {t("roles.moderators")}
              </span>
              <span className="text-sm font-bold text-foreground">
                {data.stats.users.byRole.moderators}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: "rgba(99, 102, 241, 0.6)" }}
              />
              <span className="text-sm font-medium">{t("roles.users")}</span>
              <span className="text-sm font-bold text-foreground">
                {data.stats.users.byRole.users}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={90}
            endAngle={450}
            innerRadius={30}
            outerRadius={110}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel nameKey="role" />}
            />
            <RadialBar dataKey="count" cornerRadius={10} />
          </RadialBarChart>
        </ChartContainer>

        <div className="flex items-center justify-center gap-2 pt-4">
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="h-4 w-4 text-emerald-500" />
            <span className="font-medium">
              {t("trendingUp", { percentage: growthPercentage })}
            </span>
          </div>
        </div>
        <div className="text-center text-xs text-muted-foreground mt-1">
          {t("usersByRole")}
        </div>
      </CardContent>
    </Card>
  );
}
