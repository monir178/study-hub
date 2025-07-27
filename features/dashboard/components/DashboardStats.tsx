"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  BookOpen,
  Clock,
  MessageSquare,
  Shield,
  AlertTriangle,
  TrendingUp,
  Calendar,
} from "lucide-react";

interface StatCard {
  title: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon: React.ReactNode;
  description?: string;
}

interface DashboardStatsProps {
  role: "USER" | "MODERATOR" | "ADMIN";
  stats?: {
    totalUsers?: number;
    activeStudyRooms?: number;
    totalStudyTime?: number;
    messagesCount?: number;
    reportsCount?: number;
    moderationActions?: number;
  };
  loading?: boolean;
}

export function DashboardStats({ role, stats, loading }: DashboardStatsProps) {
  const getStatsForRole = (): StatCard[] => {
    switch (role) {
      case "ADMIN":
        return [
          {
            title: "Total Users",
            value: stats?.totalUsers || 0,
            change: "+12%",
            trend: "up",
            icon: <Users className="w-4 h-4" />,
            description: "Registered users",
          },
          {
            title: "Active Study Rooms",
            value: stats?.activeStudyRooms || 0,
            change: "+8%",
            trend: "up",
            icon: <BookOpen className="w-4 h-4" />,
            description: "Currently active",
          },
          {
            title: "Total Study Time",
            value: `${Math.floor((stats?.totalStudyTime || 0) / 60)}h`,
            change: "+15%",
            trend: "up",
            icon: <Clock className="w-4 h-4" />,
            description: "This month",
          },
          {
            title: "Platform Messages",
            value: stats?.messagesCount || 0,
            change: "+5%",
            trend: "up",
            icon: <MessageSquare className="w-4 h-4" />,
            description: "Total messages sent",
          },
        ];

      case "MODERATOR":
        return [
          {
            title: "Pending Reports",
            value: stats?.reportsCount || 0,
            change: "-3%",
            trend: "down",
            icon: <AlertTriangle className="w-4 h-4" />,
            description: "Require attention",
          },
          {
            title: "Moderation Actions",
            value: stats?.moderationActions || 0,
            change: "+2%",
            trend: "up",
            icon: <Shield className="w-4 h-4" />,
            description: "This week",
          },
          {
            title: "Active Study Rooms",
            value: stats?.activeStudyRooms || 0,
            change: "+8%",
            trend: "up",
            icon: <BookOpen className="w-4 h-4" />,
            description: "Being monitored",
          },
          {
            title: "User Messages",
            value: stats?.messagesCount || 0,
            change: "+5%",
            trend: "up",
            icon: <MessageSquare className="w-4 h-4" />,
            description: "Recent activity",
          },
        ];

      case "USER":
      default:
        return [
          {
            title: "Study Sessions",
            value: 12,
            change: "+3",
            trend: "up",
            icon: <Clock className="w-4 h-4" />,
            description: "This week",
          },
          {
            title: "Study Time",
            value: "24h",
            change: "+2h",
            trend: "up",
            icon: <TrendingUp className="w-4 h-4" />,
            description: "This week",
          },
          {
            title: "Study Rooms",
            value: 3,
            change: "+1",
            trend: "up",
            icon: <BookOpen className="w-4 h-4" />,
            description: "Joined rooms",
          },
          {
            title: "Streak",
            value: "7 days",
            change: "Active",
            trend: "up",
            icon: <Calendar className="w-4 h-4" />,
            description: "Current streak",
          },
        ];
    }
  };

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

  const statsCards = getStatsForRole();

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-muted animate-pulse rounded w-20"></div>
              <div className="h-4 w-4 bg-muted animate-pulse rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted animate-pulse rounded w-16 mb-2"></div>
              <div className="h-3 bg-muted animate-pulse rounded w-24"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsCards.map((stat, index) => (
        <Card key={index}>
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
