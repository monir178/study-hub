"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { RoomMember } from "../types";
import { RecentRoomsSkeleton } from "../dashboard/components/skeletons";

interface RecentRoomsProps {
  recentRooms: RoomMember[];
  loading?: boolean;
}

export function RecentRooms({ recentRooms, loading }: RecentRoomsProps) {
  const t = useTranslations("dashboard.charts");

  if (loading) {
    return <RecentRoomsSkeleton />;
  }

  return (
    <Card className="min-h-[200px]">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{t("recentRooms")}</CardTitle>
          <Users className="w-5 h-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentRooms.slice(0, 3).map((room) => (
            <div
              key={room.id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage
                    src={room.room.members[0]?.user.image || undefined}
                  />
                  <AvatarFallback>
                    {room.room.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{room.room.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {room.room.members.length} {t("members")}
                  </p>
                </div>
              </div>
              <Button size="sm" variant="outline" asChild>
                <Link href={`/dashboard/rooms/${room.roomId}`}>
                  {t("join")}
                </Link>
              </Button>
            </div>
          ))}
          {recentRooms.length === 0 && (
            <div className="text-center py-8">
              <Users className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                {t("noRecentRooms")}
              </p>
              <Button variant="outline" size="sm" className="mt-2" asChild>
                <Link href="/dashboard/rooms">{t("browseRooms")}</Link>
              </Button>
            </div>
          )}
          {recentRooms.length > 0 && (
            <Button variant="ghost" size="sm" className="w-full" asChild>
              <Link href="/dashboard/rooms">
                {t("viewAllRooms")}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
