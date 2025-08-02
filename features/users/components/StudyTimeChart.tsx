"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
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
import { format } from "date-fns";
import { StudyTimeChartSkeleton } from "../dashboard/components/skeletons";

interface StudyTimeChartProps {
  data: StudyTimeByDay[];
  loading?: boolean;
}

export function StudyTimeChart({ data, loading }: StudyTimeChartProps) {
  if (loading) {
    return <StudyTimeChartSkeleton />;
  }

  // Transform data for chart
  const chartData = data.map((item) => ({
    date: format(new Date(item.startedAt), "MMM dd"),
    time: Math.round((item._sum.duration || 0) / 60), // Convert to minutes
  }));

  // Fill missing days with 0
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return {
      date: format(date, "MMM dd"),
      time: 0,
    };
  });

  const filledData = last7Days.map((day) => {
    const existing = chartData.find((item) => item.date === day.date);
    return existing || day;
  });

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Study Time (Last 7 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            time: {
              label: "Study Time",
              color: "var(--chart-1)",
            },
          }}
        >
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={filledData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickLine={false} axisLine={false} />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}m`}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              {label}
                            </span>
                            <span className="font-bold text-muted-foreground">
                              {payload[0].value}m
                            </span>
                          </div>
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
                stroke="var(--chart-1)"
                fill="var(--chart-1)"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
