"use client";

import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  Play,
  Pause,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { RecentSession } from "../types";
import { formatDistanceToNow } from "date-fns";

interface RecentSessionsProps {
  sessions: RecentSession[];
  loading?: boolean;
}

export function RecentSessions({ sessions, loading }: RecentSessionsProps) {
  const t = useTranslations("moderator.dashboard.recentSessions");

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            {t("title")}
          </CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-3 rounded-lg border">
                <div className="h-4 w-3/4 bg-muted animate-pulse rounded mb-2" />
                <div className="h-3 w-1/2 bg-muted animate-pulse rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusIcon = (status: RecentSession["status"]) => {
    switch (status) {
      case "ACTIVE":
        return <Play className="w-3 h-3 text-green-600" />;
      case "PAUSED":
        return <Pause className="w-3 h-3 text-yellow-600" />;
      case "COMPLETED":
        return <CheckCircle className="w-3 h-3 text-blue-600" />;
      case "CANCELLED":
        return <XCircle className="w-3 h-3 text-red-600" />;
      default:
        return <Clock className="w-3 h-3 text-gray-600" />;
    }
  };

  const getStatusColor = (status: RecentSession["status"]) => {
    switch (status) {
      case "ACTIVE":
        return "default";
      case "PAUSED":
        return "outline";
      case "COMPLETED":
        return "secondary";
      case "CANCELLED":
        return "destructive";
      default:
        return "outline";
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          {t("title")}
        </CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sessions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">{t("noSessions")}</p>
            </div>
          ) : (
            sessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-3 rounded-lg border"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium">
                      {session.type} {t("session")}
                    </p>
                    {getStatusIcon(session.status)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {session.user.name || session.user.email} {t("in")}{" "}
                    {session.room.name} •{" "}
                    {formatDistanceToNow(new Date(session.startedAt))}{" "}
                    {t("ago")}
                  </p>
                </div>
                <div className="text-right space-y-1">
                  <Badge variant={getStatusColor(session.status)}>
                    {session.status}
                  </Badge>
                  <p className="text-xs text-muted-foreground">
                    {formatDuration(session.duration)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
        {/* {sessions.length > 0 && (
          <div className="mt-4">
            <button className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors">
              {t("viewAll")}
            </button>
          </div>
        )} */}
      </CardContent>
    </Card>
  );
}
