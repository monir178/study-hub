"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, MessageSquare, FileText, Globe, Lock } from "lucide-react";
import { StudyRoom } from "../hooks/useRooms";
import { formatDistanceToNow } from "date-fns";

interface RoomOverviewProps {
  room: StudyRoom;
}

export function RoomOverview({ room }: RoomOverviewProps) {
  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-4 space-y-3">
        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center py-2">
            <div className="text-xl font-semibold">{room.memberCount}</div>
            <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <Users className="w-3 h-3" />
              Members
            </div>
          </div>
          <div className="text-center py-2">
            <div className="text-xl font-semibold">{room.messageCount}</div>
            <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <MessageSquare className="w-3 h-3" />
              Messages
            </div>
          </div>
          <div className="text-center py-2">
            <div className="text-xl font-semibold">{room.noteCount || 0}</div>
            <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <FileText className="w-3 h-3" />
              Notes
            </div>
          </div>
        </div>

        {/* Room Type */}
        <div className="flex items-center justify-center">
          <Badge variant="outline" className="text-xs">
            {room.isPublic ? (
              <>
                <Globe className="w-3 h-3 mr-1" />
                Public
              </>
            ) : (
              <>
                <Lock className="w-3 h-3 mr-1" />
                Private
              </>
            )}
          </Badge>
        </div>

        {/* Created Info */}
        <div className="text-center text-xs text-muted-foreground">
          Created{" "}
          {formatDistanceToNow(new Date(room.createdAt), { addSuffix: true })}
        </div>
      </CardContent>
    </Card>
  );
}
