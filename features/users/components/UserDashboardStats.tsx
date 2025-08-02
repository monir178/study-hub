"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Timer, BookOpen, Users } from "lucide-react";
import { UserDashboardStats as UserStats, DashboardTrends } from "../types";
import { UserDashboardStatsSkeleton } from "../dashboard/components/skeletons";

interface UserDashboardStatsProps {
  stats: UserStats;
  trends: DashboardTrends;
  loading?: boolean;
}

export function UserDashboardStats({
  stats,
  trends,
  loading,
}: UserDashboardStatsProps) {
  if (loading) {
    return <UserDashboardStatsSkeleton />;
  }

  //   const formatTime = (seconds: number) => {
  //     const hours = Math.floor(seconds / 3600);
  //     const minutes = Math.floor((seconds % 3600) / 60);

  //     if (hours > 0) {
  //       return `${hours}h ${minutes}m`;
  //     }
  //     return `${minutes}m`;
  //   };

  const statsCards = [
    {
      title: "Study Sessions",
      value: stats.totalSessions,
      change: trends.sessions.change,
      trend: trends.sessions.trend,
      icon: <Timer className="w-4 h-4" />,
      description: "This week",
    },
    {
      title: "Joined Rooms",
      value: stats.joinedRoomsCount,
      change: trends.rooms.change,
      trend: trends.rooms.trend,
      icon: <Users className="w-4 h-4" />,
      description: "Active rooms",
    },
    {
      title: "Created Rooms",
      value: stats.createdRooms,
      change: trends.createdRooms.change,
      trend: trends.createdRooms.trend,
      icon: <BookOpen className="w-4 h-4" />,
      description: "Total created",
    },
    {
      title: "Private Rooms",
      value: stats.privateRooms,
      change: trends.privateRooms.change,
      trend: trends.privateRooms.trend,
      icon: <BookOpen className="w-4 h-4" />,
      description: "Your private rooms",
    },
  ];

  const getTrendColor = (trend?: "up" | "down" | "neutral") => {
    switch (trend) {
      case "up":
        return "text-green-600";
      case "down":
        return "text-red-600";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsCards.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            {stat.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center space-x-2 text-xs">
              {stat.change && (
                <Badge
                  variant="secondary"
                  className={`${getTrendColor(stat.trend)} bg-transparent border-0 px-0`}
                >
                  {stat.change}
                </Badge>
              )}
              <span className="text-muted-foreground">{stat.description}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
