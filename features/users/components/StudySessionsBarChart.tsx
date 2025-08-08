"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { StudySession } from "../types";

interface StudySessionsBarChartProps {
  data: StudySession[];
  loading?: boolean;
}

export function StudySessionsBarChart({
  data,
  loading,
}: StudySessionsBarChartProps) {
  if (loading) {
    return (
      <Card data-testid="sessions-bar-loading">
        <CardHeader>
          <CardTitle>Study Sessions Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  // Transform data for chart - show only duration for cleaner look
  const chartData = data.slice(0, 8).map((session, index) => ({
    session: `S${index + 1}`,
    duration: Math.round(session.duration / 60), // Convert to minutes
    sessionNumber: session.session,
    totalSessions: session.totalSessions,
    phase: session.phase,
    status: session.status,
    type: session.type,
  }));

  return (
    <Card data-testid="sessions-bar">
      <CardHeader>
        <CardTitle className="text-lg">Study Sessions Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            duration: {
              label: "Duration",
              color: "var(--chart-1)",
            },
          }}
        >
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--muted))"
                opacity={0.3}
              />
              <XAxis
                dataKey="session"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                tickMargin={8}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}m`}
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                tickMargin={8}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="rounded-lg border bg-background p-3 shadow-lg">
                        <div className="space-y-2">
                          <div className="font-medium text-sm">{label}</div>
                          <div className="space-y-2 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">
                                Duration:
                              </span>
                              <span className="font-medium">
                                {data.duration}m
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">
                                Type:
                              </span>
                              <span className="font-medium capitalize">
                                {data.type}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">
                                Status:
                              </span>
                              <span className="font-medium capitalize">
                                {data.status}
                              </span>
                            </div>
                            <div className="pt-2 border-t">
                              <div className="text-xs text-muted-foreground">
                                Session {data.sessionNumber}/
                                {data.totalSessions} • {data.phase}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="duration"
                fill="var(--chart-1)"
                radius={[4, 4, 0, 0]}
                name="Duration"
                maxBarSize={50}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
