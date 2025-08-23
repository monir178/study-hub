"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { StudyTimeByDay } from "../types";
import {
  format,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import { StudyTimeChartSkeleton } from "../dashboard/components/skeletons";

interface StudyTimeChartProps {
  data: StudyTimeByDay[];
  loading?: boolean;
}

export function StudyTimeChart({ data, loading }: StudyTimeChartProps) {
  const t = useTranslations("dashboard.charts");
  const [period, setPeriod] = useState<"today" | "weekly" | "monthly">(
    "weekly",
  );

  if (loading) {
    return (
      <div data-testid="study-time-loading">
        <StudyTimeChartSkeleton />
      </div>
    );
  }

  // Filter data based on selected period
  const getFilteredData = () => {
    const now = new Date();
    let filteredData = data;

    switch (period) {
      case "today":
        const todayStart = startOfDay(now);
        const todayEnd = endOfDay(now);
        filteredData = data.filter((item) => {
          const itemDate = new Date(item.startedAt);
          return itemDate >= todayStart && itemDate <= todayEnd;
        });
        break;
      case "weekly":
        const weekStart = startOfWeek(now);
        const weekEnd = endOfWeek(now);
        filteredData = data.filter((item) => {
          const itemDate = new Date(item.startedAt);
          return itemDate >= weekStart && itemDate <= weekEnd;
        });
        break;
      case "monthly":
        const monthStart = startOfMonth(now);
        const monthEnd = endOfMonth(now);
        filteredData = data.filter((item) => {
          const itemDate = new Date(item.startedAt);
          return itemDate >= monthStart && itemDate <= monthEnd;
        });
        break;
    }

    return filteredData;
  };

  // Transform data for chart
  const filteredData = getFilteredData();
  const chartData = filteredData.map((item) => ({
    date: format(
      new Date(item.startedAt),
      period === "monthly" ? "MMM dd" : "MMM dd",
    ),
    time: Math.max(0, Math.round((item._sum.duration || 0) / 60)), // Ensure positive values and convert to minutes
  }));

  // Fill missing days with 0 based on period
  const getDaysToShow = () => {
    switch (period) {
      case "today":
        return 1;
      case "weekly":
        return 7;
      case "monthly":
        return 30;
      default:
        return 7;
    }
  };

  const daysToShow = getDaysToShow();
  const filledData = Array.from({ length: daysToShow }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (daysToShow - 1 - i));
    const formattedDate = format(
      date,
      period === "monthly" ? "MMM dd" : "MMM dd",
    );
    const existing = chartData.find((item) => item.date === formattedDate);
    return existing || { date: formattedDate, time: 0 };
  });

  const chartColor = "#3b82f6"; // blue-500

  return (
    <Card className="h-full" data-testid="study-time">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm md:text-lg">{t("studyTime")}</CardTitle>
          <Select
            value={period}
            onValueChange={(value: "today" | "weekly" | "monthly") =>
              setPeriod(value)
            }
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            time: {
              label: t("studyTime"),
              color: chartColor,
            },
          }}
        >
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={filledData}>
              <defs>
                <linearGradient
                  id="studyTimeGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor={chartColor} stopOpacity={0.4} />
                  <stop offset="50%" stopColor={chartColor} stopOpacity={0.1} />
                  <stop
                    offset="100%"
                    stopColor={chartColor}
                    stopOpacity={0.05}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                domain={[0, "dataMax"]}
                tickFormatter={(value) => `${value}m`}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                cursor={{
                  stroke: chartColor,
                  strokeWidth: 1,
                  strokeDasharray: "2 2",
                  strokeOpacity: 0.5,
                }}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const value = payload[0].value as number;
                    return (
                      <div className="bg-background/95 backdrop-blur-sm border border-border shadow-lg rounded-lg p-3 pointer-events-none min-w-[120px]">
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground font-medium">
                            {label}
                          </p>
                          <p className="text-sm font-semibold text-foreground">
                            {value} minutes studied
                          </p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="time"
                stroke={chartColor}
                fill="url(#studyTimeGradient)"
                strokeWidth={2.5}
                dot={false}
                activeDot={{
                  r: 5,
                  fill: "white",
                  stroke: chartColor,
                  strokeWidth: 3,
                }}
                connectNulls={true}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
