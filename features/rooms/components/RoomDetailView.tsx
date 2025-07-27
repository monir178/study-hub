"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  Users,
  MessageSquare,
  FileText,
  Settings,
  Globe,
  Lock,
  Crown,
  Shield,
  User as UserIcon,
  Clock,
  Calendar,
} from "lucide-react";
import { useRoom, useJoinRoom, useLeaveRoom } from "../hooks/useRooms";
import { formatDistanceToNow } from "date-fns";
import { JoinRoomDialog } from "./JoinRoomDialog";

interface RoomDetailViewProps {
  roomId: string;
}

export function RoomDetailView({ roomId }: RoomDetailViewProps) {
  const router = useRouter();
  const [showJoinDialog, setShowJoinDialog] = useState(false);

  const { data: room, isLoading, error } = useRoom(roomId);
  const joinRoom = useJoinRoom();
  const leaveRoom = useLeaveRoom();

  const handleJoinRoom = async (password?: string) => {
    try {
      await joinRoom.mutateAsync({
        roomId,
        data: password ? { password } : {},
      });
      setShowJoinDialog(false);
    } catch {
      // Error handled by mutation hook
    }
  };

  const handleLeaveRoom = async () => {
    try {
      await leaveRoom.mutateAsync(roomId);
    } catch {
      // Error handled by mutation hook
    }
  };

  const handleJoinClick = () => {
    if (room && !room.isPublic) {
      setShowJoinDialog(true);
    } else {
      handleJoinRoom();
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "ADMIN":
        return <Crown className="w-4 h-4" />;
      case "MODERATOR":
        return <Shield className="w-4 h-4" />;
      default:
        return <UserIcon className="w-4 h-4" />;
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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="space-y-2">
                  <div className="h-8 bg-muted animate-pulse rounded w-3/4"></div>
                  <div className="h-4 bg-muted animate-pulse rounded w-full"></div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-4 bg-muted animate-pulse rounded w-1/2"></div>
                  <div className="h-4 bg-muted animate-pulse rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="h-6 bg-muted animate-pulse rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-muted animate-pulse rounded-full"></div>
                      <div className="h-4 bg-muted animate-pulse rounded w-24"></div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
        <Alert variant="destructive">
          <AlertDescription>
            {error?.message ||
              "Room not found or you don't have access to this room."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            {room.isPublic ? (
              <Globe className="w-5 h-5 text-green-600" />
            ) : (
              <Lock className="w-5 h-5 text-orange-600" />
            )}
            <h1 className="text-2xl font-bold">{room.name}</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {room.isJoined ? (
            <>
              {room.userRole !== "ADMIN" && (
                <Button
                  variant="outline"
                  onClick={handleLeaveRoom}
                  disabled={leaveRoom.isPending}
                >
                  {leaveRoom.isPending ? "Leaving..." : "Leave Room"}
                </Button>
              )}
              <Badge className={getRoleBadgeColor(room.userRole || "MEMBER")}>
                {getRoleIcon(room.userRole || "MEMBER")}
                <span className="ml-1">{room.userRole || "MEMBER"}</span>
              </Badge>
            </>
          ) : (
            <Button
              onClick={handleJoinClick}
              disabled={
                joinRoom.isPending || room.memberCount >= room.maxMembers
              }
            >
              {joinRoom.isPending ? "Joining..." : "Join Room"}
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Room Info */}
          <Card>
            <CardHeader>
              <CardTitle>Room Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {room.description && (
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-muted-foreground">{room.description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">
                    {room.onlineMembers}/{room.memberCount} online
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{room.messageCount} messages</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{room.noteCount || 0} notes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">
                    Created{" "}
                    {formatDistanceToNow(new Date(room.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Created by</h4>
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage
                      src={room.creator.image || ""}
                      alt={room.creator.name || ""}
                    />
                    <AvatarFallback>
                      {room.creator.name?.charAt(0) || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">
                    {room.creator.name || "Unknown"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Room Features - Only show if joined */}
          {room.isJoined && (
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-8 h-8 text-primary" />
                    <div>
                      <h3 className="font-medium">Group Chat</h3>
                      <p className="text-sm text-muted-foreground">
                        Real-time messaging with room members
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <Clock className="w-8 h-8 text-primary" />
                    <div>
                      <h3 className="font-medium">Pomodoro Timer</h3>
                      <p className="text-sm text-muted-foreground">
                        Synchronized study sessions
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-primary" />
                    <div>
                      <h3 className="font-medium">Collaborative Notes</h3>
                      <p className="text-sm text-muted-foreground">
                        Shared note-taking and editing
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <Settings className="w-8 h-8 text-primary" />
                    <div>
                      <h3 className="font-medium">Room Settings</h3>
                      <p className="text-sm text-muted-foreground">
                        Manage room preferences
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Members List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Members ({room.memberCount})</span>
                <Badge variant="outline">{room.onlineMembers} online</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {room.members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="w-8 h-8">
                          <AvatarImage
                            src={member.user.image || ""}
                            alt={member.user.name || ""}
                          />
                          <AvatarFallback>
                            {member.user.name?.charAt(0) || "?"}
                          </AvatarFallback>
                        </Avatar>
                        {(member.status === "ONLINE" ||
                          member.status === "STUDYING") && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {member.user.name || "Unknown"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {member.status.toLowerCase()}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={`${getRoleBadgeColor(member.role)} text-xs`}
                    >
                      {getRoleIcon(member.role)}
                      <span className="ml-1">{member.role}</span>
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Room Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Room Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Capacity</span>
                <span className="text-sm font-medium">
                  {room.memberCount}/{room.maxMembers}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Messages</span>
                <span className="text-sm font-medium">{room.messageCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Notes</span>
                <span className="text-sm font-medium">
                  {room.noteCount || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Visibility
                </span>
                <span className="text-sm font-medium">
                  {room.isPublic ? "Public" : "Private"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Join Room Dialog for Private Rooms */}
      <JoinRoomDialog
        open={showJoinDialog}
        onOpenChange={setShowJoinDialog}
        onJoin={handleJoinRoom}
        roomName={room.name}
        isLoading={joinRoom.isPending}
      />
    </div>
  );
}
