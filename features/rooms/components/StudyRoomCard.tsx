"use client";

import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Users,
  MessageSquare,
  Lock,
  Globe,
  Calendar,
  Crown,
  Shield,
  User as UserIcon,
} from "lucide-react";
import { StudyRoom } from "../hooks/useRooms";
import { formatDistanceToNow } from "date-fns";

interface StudyRoomCardProps {
  room: StudyRoom;
  onJoin?: (roomId: string) => void;
  onLeave?: (roomId: string) => void;
  onView?: (roomId: string) => void;
  loading?: boolean;
}

export function StudyRoomCard({
  room,
  onJoin,
  onLeave,
  onView: _onView,
  loading = false,
}: StudyRoomCardProps) {
  const router = useRouter();
  const getRoleIcon = (role: string) => {
    switch (role) {
      case "ADMIN":
        return <Crown className="w-3 h-3" />;
      case "MODERATOR":
        return <Shield className="w-3 h-3" />;
      default:
        return <UserIcon className="w-3 h-3" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "MODERATOR":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      default:
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    }
  };

  const handleAction = () => {
    if (room.isJoined) {
      // Navigate to room detail page using Next.js router
      router.push(`/rooms/${room.id}`);
    } else {
      if (onJoin) onJoin(room.id);
    }
  };

  const handleLeave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onLeave) onLeave(room.id);
  };

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <CardTitle className="text-lg group-hover:text-primary transition-colors">
                {room.name}
              </CardTitle>
              {room.isPublic ? (
                <Globe className="w-4 h-4 text-green-600" />
              ) : (
                <Lock className="w-4 h-4 text-orange-600" />
              )}
            </div>
            <CardDescription className="line-clamp-2">
              {room.description || "No description provided"}
            </CardDescription>
          </div>
          {room.userRole && (
            <Badge
              className={`${getRoleBadgeColor(room.userRole)} flex items-center gap-1`}
            >
              {getRoleIcon(room.userRole)}
              {room.userRole}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Creator Info */}
        <div className="flex items-center gap-2">
          <Avatar className="w-6 h-6">
            <AvatarImage
              src={room.creator.image || ""}
              alt={room.creator.name || ""}
            />
            <AvatarFallback className="text-xs">
              {room.creator.name?.charAt(0) || "?"}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">
            Created by {room.creator.name || "Unknown"}
          </span>
        </div>

        {/* Room Stats */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>
                {room.onlineMembers}/{room.memberCount}
              </span>
              <span className="text-xs">online</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="w-4 h-4" />
              <span>{room.messageCount}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>
              {formatDistanceToNow(new Date(room.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>
        </div>

        {/* Member Avatars */}
        {room.members.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Members:</span>
            <div className="flex -space-x-2">
              {room.members.slice(0, 5).map((member) => (
                <Avatar
                  key={member.id}
                  className="w-6 h-6 border-2 border-background"
                >
                  <AvatarImage
                    src={member.user.image || ""}
                    alt={member.user.name || ""}
                  />
                  <AvatarFallback className="text-xs">
                    {member.user.name?.charAt(0) || "?"}
                  </AvatarFallback>
                </Avatar>
              ))}
              {room.members.length > 5 && (
                <div className="w-6 h-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">
                    +{room.members.length - 5}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            onClick={handleAction}
            disabled={loading}
            className="flex-1"
            variant={room.isJoined ? "outline" : "default"}
          >
            {loading
              ? "Loading..."
              : room.isJoined
                ? "Enter Room"
                : "Join Room"}
          </Button>

          {room.isJoined && room.userRole !== "ADMIN" && (
            <Button
              onClick={handleLeave}
              disabled={loading}
              variant="outline"
              size="sm"
            >
              Leave
            </Button>
          )}
        </div>

        {/* Room Full Warning */}
        {!room.isJoined && room.memberCount >= room.maxMembers && (
          <div className="text-center">
            <Badge variant="destructive" className="text-xs">
              Room Full ({room.memberCount}/{room.maxMembers})
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
