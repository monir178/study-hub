"use client";

import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Home, Lock, Globe } from "lucide-react";
import { RecentRoom } from "../types";
import { formatDistanceToNow } from "date-fns";
import { Link } from "@/i18n/navigation";

interface RecentRoomsProps {
  rooms: RecentRoom[];
  loading?: boolean;
}

export function RecentRooms({ rooms, loading }: RecentRoomsProps) {
  const t = useTranslations("moderator.dashboard.recentRooms");

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="w-5 h-5" />
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="w-5 h-5" />
          {t("title")}
        </CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {rooms.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Home className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">{t("noRooms")}</p>
            </div>
          ) : (
            rooms.map((room) => (
              <div
                key={room.id}
                className="flex items-center justify-between p-3 rounded-lg border"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium">{room.name}</p>
                    {room.isPublic ? (
                      <Globe className="w-3 h-3 text-green-600" />
                    ) : (
                      <Lock className="w-3 h-3 text-orange-600" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t("by")} {room.creator.name || room.creator.email} •{" "}
                    {formatDistanceToNow(new Date(room.createdAt))} {t("ago")}
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant="outline">
                    {room._count.members} {t("members")}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
        {rooms.length > 0 && (
          <Link href="/dashboard/rooms">
            <Button variant="outline" className="w-full mt-4" size="sm">
              {t("viewAll")}
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
