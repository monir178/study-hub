"use client";

import { useTranslations } from "next-intl";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
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

const chartConfig = {
  pomodoro: {
    label: "Pomodoro",
    color: "var(--chart-1)",
  },
  custom: {
    label: "Custom",
    color: "var(--chart-2)",
  },
  break: {
    label: "Break",
    color: "var(--chart-3)",
  },
};

// Mock API service for session activity data
const getSessionActivityData = async () => {
  // This would be replaced with actual API call
  const response = await fetch("/api/moderator/dashboard/session-activity");
  if (!response.ok) {
    throw new Error("Failed to fetch session activity data");
  }
  return response.json();
};

export function SessionActivityChart() {
  const t = useTranslations("moderator");
  const { data, isLoading } = useApiQuery({
    queryKey: ["moderator", "session-activity"],
    queryFn: getSessionActivityData,
  });

  if (isLoading || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("sessionActivity")}</CardTitle>
          <CardDescription>{t("last30Days")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] animate-pulse bg-muted rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("sessionActivity")}</CardTitle>
        <CardDescription>{t("sessionTrendsLast30Days")}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickCount={3}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="pomodoro"
              type="natural"
              stroke="var(--color-pomodoro)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="custom"
              type="natural"
              stroke="var(--color-custom)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="break"
              type="natural"
              stroke="var(--color-break)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
