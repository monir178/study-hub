"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Timer, BookOpen, Users, TrendingUp } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts";
import {
  UserDashboardStats as UserStats,
  DashboardTrends,
  StudyTimeByDay,
  SessionTypeDistribution,
  RoomActivity,
  ChartData,
} from "../types";
import { UserDashboardStatsSkeleton } from "../dashboard/components/skeletons";

interface UserDashboardStatsProps {
  stats: UserStats;
  trends: DashboardTrends;
  studyTimeByDay?: StudyTimeByDay[];
  sessionTypes?: SessionTypeDistribution[];
  roomActivity?: RoomActivity[];
  chartData?: ChartData;
  loading?: boolean;
}

export function UserDashboardStats({
  stats,
  trends,
  studyTimeByDay = [],
  sessionTypes = [],
  roomActivity = [],
  chartData,
  loading,
}: UserDashboardStatsProps) {
  const t = useTranslations("dashboard.stats");

  // Utility function to format date for tooltips
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      // Format as "Today", "Yesterday", or "Aug 19"
      if (date.toDateString() === today.toDateString()) {
        return "Today";
      } else if (date.toDateString() === yesterday.toDateString()) {
        return "Yesterday";
      } else {
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      }
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div data-testid="user-stats-loading">
        <UserDashboardStatsSkeleton />
      </div>
    );
  }

  // Generate chart data for each stat
  const generateChartData = (type: string, currentValue: number) => {
    // Use enhanced chart data if available
    if (chartData) {
      switch (type) {
        case "sessions":
          return chartData.sessions.slice(-7).map((item) => ({
            value: item.value,
            date: item.date,
            label: `${item.value} sessions`,
          }));
        case "joinedRooms":
          return chartData.joinedRooms.slice(-7).map((item) => ({
            value: item.value,
            date: item.date,
            label: `${item.value} rooms joined`,
          }));
        case "createdRooms":
          return chartData.createdRooms.slice(-7).map((item) => ({
            value: item.value,
            date: item.date,
            label: `${item.value} rooms created`,
          }));
        case "privateRooms":
          return chartData.privateRooms.slice(-7).map((item) => ({
            value: item.value,
            date: item.date,
            label: `${item.value} private rooms`,
          }));
        case "studyTime":
          return chartData.studyTime.slice(-7).map((item) => ({
            value: item.value,
            date: item.date,
            label: `${item.value} minutes studied`,
          }));
        default:
          return chartData.sessions.slice(-7).map((item) => ({
            value: item.value,
            date: item.date,
            label: `${item.value} sessions`,
          }));
      }
    }

    // Fallback to legacy data structure with generated dates
    const generateDateRange = (days: number) => {
      const dates = [];
      const now = new Date();
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        dates.push(date.toISOString().split("T")[0]);
      }
      return dates;
    };

    switch (type) {
      case "sessions":
        // Use study time by day data for sessions chart
        if (studyTimeByDay.length > 0) {
          return studyTimeByDay.slice(-7).map((item) => {
            const value = Math.round((item._sum.duration || 0) / 60);
            return {
              value,
              date: item.startedAt,
              label: `${value} minutes studied`,
            };
          });
        }
        break;
      case "rooms":
        // Use room activity data
        if (roomActivity.length > 0) {
          const dates = generateDateRange(7);
          return roomActivity.slice(-7).map((item, index) => {
            const value = item._count?.roomId || 0;
            return {
              value,
              date: dates[index] || new Date().toISOString().split("T")[0],
              label: `${value} rooms`,
            };
          });
        }
        break;
      case "sessionTypes":
        // Use session types for variety
        if (sessionTypes.length > 0) {
          const dates = generateDateRange(7);
          return sessionTypes.slice(-7).map((item, index) => {
            const value = item._count?.type || 0;
            return {
              value,
              date: dates[index] || new Date().toISOString().split("T")[0],
              label: `${value} ${item.type.toLowerCase()} sessions`,
            };
          });
        }
        break;
    }

    // Generate realistic trend data with dates (only as last resort)
    const baseValue = Math.max(currentValue * 0.7, 1);
    const variation = currentValue * 0.3;
    const dates = generateDateRange(7);
    return Array.from({ length: 7 }, (_, i) => {
      const value = Math.round(
        baseValue + Math.random() * variation + (i * variation) / 20,
      );
      return {
        value,
        date: dates[i],
        label: `${value} items`,
      };
    });
  };

  const statsCards = [
    {
      title: t("totalSessions"),
      value: stats.totalSessions.toString(),
      period: "This week",
      data: generateChartData("sessions", stats.totalSessions),
      color: "#3b82f6", // blue-500
      icon: Timer,
      gradientId: "sessionsGradient",
      trend: trends.sessions.trend,
      change: trends.sessions.change,
      unit: "sessions",
    },
    {
      title: t("joinedRooms"),
      value: stats.joinedRoomsCount.toString(),
      period: "This week",
      data: generateChartData("joinedRooms", stats.joinedRoomsCount),
      color: "#10b981", // emerald-500
      icon: Users,
      gradientId: "roomsGradient",
      trend: trends.rooms.trend,
      change: trends.rooms.change,
      unit: "rooms",
    },
    {
      title: t("createdRooms"),
      value: stats.createdRooms.toString(),
      period: "This week",
      data: generateChartData("createdRooms", stats.createdRooms),
      color: "#8b5cf6", // violet-500
      icon: BookOpen,
      gradientId: "createdGradient",
      trend: trends.createdRooms.trend,
      change: trends.createdRooms.change,
      unit: "rooms created",
    },
    {
      title: t("privateRooms"),
      value: stats.privateRooms.toString(),
      period: "This week",
      data: generateChartData("privateRooms", stats.privateRooms),
      color: "#f97316", // orange-500
      icon: TrendingUp,
      gradientId: "privateGradient",
      trend: trends.privateRooms.trend,
      change: trends.privateRooms.change,
      unit: "private rooms",
    },
  ];

  const getTrendColor = (trend?: "up" | "down" | "neutral") => {
    switch (trend) {
      case "up":
        return "#10b981"; // emerald-500
      case "down":
        return "#ef4444"; // red-500
      default:
        return "#6b7280"; // gray-500
    }
  };

  return (
    <div className="@container w-full" data-testid="user-stats">
      {/* Grid of 4 cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <Card
              key={i}
              data-testid="user-stats-card"
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="space-y-3 pt-4">
                {/* Header with icon and title */}
                <div className="flex items-center gap-2 pt-2">
                  <Icon className="size-5" style={{ color: card.color }} />
                  <span className="text-base font-semibold">{card.title}</span>
                </div>

                <div className="flex items-end gap-4 justify-between">
                  {/* Details */}
                  <div className="flex flex-col gap-2">
                    {/* Main Value - Top */}
                    <div className="text-3xl font-bold text-foreground tracking-tight">
                      {card.value}
                    </div>

                    {/* Bottom row: Period and Trend */}
                    <div className="flex items-center justify-between gap-2">
                      {/* Period text on the left */}
                      {card.period && (
                        <div className="text-sm text-muted-foreground whitespace-nowrap">
                          {card.period}
                        </div>
                      )}

                      {/* Trend indicator on the right */}
                      {card.change && (
                        <span
                          className="text-xs font-medium px-1.5 py-0.5 rounded"
                          style={{ color: getTrendColor(card.trend) }}
                          data-testid="user-stats-change"
                        >
                          {card.change}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Chart - increased size */}
                  <div className="max-w-48 h-20 w-full relative flex-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={card.data}
                        margin={{
                          top: 2,
                          right: 2,
                          left: 2,
                          bottom: 2,
                        }}
                      >
                        <defs>
                          <linearGradient
                            id={card.gradientId}
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor={card.color}
                              stopOpacity={0.4}
                            />
                            <stop
                              offset="50%"
                              stopColor={card.color}
                              stopOpacity={0.1}
                            />
                            <stop
                              offset="100%"
                              stopColor={card.color}
                              stopOpacity={0.05}
                            />
                          </linearGradient>
                          <filter
                            id={`dotShadow${i}`}
                            x="-50%"
                            y="-50%"
                            width="200%"
                            height="200%"
                          >
                            <feDropShadow
                              dx="1"
                              dy="1"
                              stdDeviation="2"
                              floodColor="rgba(0,0,0,0.3)"
                            />
                          </filter>
                        </defs>

                        <Tooltip
                          cursor={{
                            stroke: card.color,
                            strokeWidth: 1,
                            strokeDasharray: "2 2",
                            strokeOpacity: 0.5,
                          }}
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              const value = payload[0].value as number;
                              const date = data?.date;
                              const itemLabel =
                                data?.label || `${value} ${card.unit}`;

                              return (
                                <div className="bg-background/95 backdrop-blur-sm border border-border shadow-lg rounded-lg p-3 pointer-events-none min-w-[120px]">
                                  <div className="space-y-1">
                                    {date && (
                                      <p className="text-xs text-muted-foreground font-medium">
                                        {formatDate(date)}
                                      </p>
                                    )}
                                    <p className="text-sm font-semibold text-foreground">
                                      {itemLabel}
                                    </p>
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />

                        {/* Area with enhanced gradient and smoothed curves */}
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke={card.color}
                          fill={`url(#${card.gradientId})`}
                          strokeWidth={2.5}
                          dot={false}
                          activeDot={{
                            r: 5,
                            fill: "white",
                            stroke: card.color,
                            strokeWidth: 3,
                            filter: `url(#dotShadow${i})`,
                          }}
                          connectNulls={true}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
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
