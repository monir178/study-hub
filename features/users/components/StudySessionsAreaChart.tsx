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
import { StudySession } from "../types";

interface StudySessionsAreaChartProps {
  data: StudySession[];
  loading?: boolean;
}

export function StudySessionsAreaChart({
  data,
  loading,
}: StudySessionsAreaChartProps) {
  if (loading) {
    return (
      <Card data-testid="sessions-area-loading">
        <CardHeader>
          <CardTitle>Study Sessions Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  // Transform data for chart - show session progression over time
  const chartData = data.slice(0, 10).map((session, index) => ({
    session: `Session ${index + 1}`,
    remaining: Math.round(session.remaining / 60), // Convert to minutes
    duration: Math.round(session.duration / 60), // Convert to minutes
    sessionNumber: session.session,
    totalSessions: session.totalSessions,
    phase: session.phase,
    status: session.status,
  }));

  return (
    <Card data-testid="sessions-area">
      <CardHeader>
        <CardTitle>Study Sessions Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            remaining: {
              label: "Remaining Time",
              color: "var(--chart-2)",
            },
            duration: {
              label: "Duration",
              color: "var(--chart-3)",
            },
          }}
        >
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="session" tickLine={false} axisLine={false} />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}m`}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="rounded-lg border bg-background p-3 shadow-sm">
                        <div className="space-y-2">
                          <div className="font-medium">{label}</div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">
                                Remaining:
                              </span>
                              <span className="font-medium ml-1">
                                {data.remaining}m
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">
                                Duration:
                              </span>
                              <span className="font-medium ml-1">
                                {data.duration}m
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">
                                Phase:
                              </span>
                              <span className="font-medium ml-1 capitalize">
                                {data.phase}
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">
                                Status:
                              </span>
                              <span className="font-medium ml-1 capitalize">
                                {data.status}
                              </span>
                            </div>
                            <div className="col-span-2">
                              <span className="text-muted-foreground">
                                Session:
                              </span>
                              <span className="font-medium ml-1">
                                {data.sessionNumber}/{data.totalSessions}
                              </span>
                            </div>
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
                dataKey="remaining"
                stackId="1"
                stroke="var(--chart-2)"
                fill="var(--chart-2)"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="duration"
                stackId="2"
                stroke="var(--chart-3)"
                fill="var(--chart-3)"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
