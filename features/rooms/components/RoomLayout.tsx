/* eslint-disable */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  Users,
  MessageSquare,
  FileText,
  Globe,
  Lock,
  Crown,
  Shield,
  User as UserIcon,
  Clock,
  Calendar,
  MoreVertical,
  Timer,
  Coffee,
  Play,
  Pause,
  RotateCcw,
} from "lucide-react";
import { useRoom } from "../hooks/useRooms";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/lib/hooks/useAuth";
import { RoomHeader } from "./RoomHeader";
import { RoomSidebar } from "./RoomSidebar";
import { PomodoroTimer } from "@/features/timer/components/PomodoroTimer";
// import { CollaborativeNotes } from "./CollaborativeNotes";
import { GroupChat } from "./GroupChat";
import { ChatPanel } from "@/features/chat/components/ChatPanel";
import { useRoomMembers } from "../hooks/useRoomMembers";

interface RoomLayoutProps {
  roomId: string;
}

export function RoomLayout({ roomId }: RoomLayoutProps) {
  const router = useRouter();
  const { user: currentUser } = useAuth();

  const { data: room, isLoading, error } = useRoom(roomId);

  // Auto-join room when component mounts
  const { actions: memberActions } = useRoomMembers({
    roomId,
    initialRoom: room || {
      id: roomId,
      name: "",
      description: "",
      isPublic: true,
      maxMembers: 10,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      creator: { id: "", name: "", role: "USER" },
      members: [],
      memberCount: 0,
      messageCount: 0,
      noteCount: 0,
      isJoined: false,
      onlineMembers: 0,
    },
  });

  // Auto-join room when user enters
  useEffect(() => {
    if (room && currentUser?.id) {
      // Check if user is already a member
      const isMember = room.members.some(
        (member) => member.user.id === currentUser.id,
      );

      if (!isMember) {
        // Auto-join the room
        memberActions.joinRoom();
      }
    }
  }, [room, currentUser?.id, memberActions]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-6">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>

          <div className="grid gap-6 lg:grid-cols-4">
            {/* Main Content Skeleton */}
            <div className="lg:col-span-3 space-y-6">
              <Card>
                <CardHeader>
                  <div className="space-y-2">
                    <div className="h-8 bg-muted animate-pulse rounded w-3/4"></div>
                    <div className="h-4 bg-muted animate-pulse rounded w-full"></div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-96 bg-muted animate-pulse rounded"></div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Skeleton */}
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
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-6">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>

          <Alert variant="destructive">
            <AlertDescription>
              {error?.message || "Failed to load room"}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6">
        {/* Room Header */}
        <RoomHeader room={room} />

        {/* Main Layout */}
        <div className="grid gap-6 lg:grid-cols-4 mt-6">
          {/* Main Content Panel */}
          <div className="lg:col-span-3 space-y-6">
            {/* Pomodoro Timer - Minimalistic Top Bar */}
            <Card className="border-0 shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Timer className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-sm">Study Timer</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {room.onlineMembers} online
                    </Badge>
                  </div>

                  {/* Minimal Timer Display */}
                  <PomodoroTimer
                    roomId={roomId}
                    roomCreatorId={room.creator.id}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Chat Panel - Main Content */}
            <Card className="max-h-[calc(100vh-200px)] flex flex-col">
              <CardHeader className="pb-4 border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Chat
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      <Users className="w-3 h-3 mr-1" />
                      {room.onlineMembers} online
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex-1 p-0">
                <GroupChat roomId={roomId} />
              </CardContent>
            </Card>

            {/* Notes Panel - Commented out for now */}
            {/* 
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Collaborative Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CollaborativeNotes roomId={roomId} />
              </CardContent>
            </Card>
            */}
          </div>

          {/* Sidebar Panel */}
          <div className="lg:col-span-1">
            <RoomSidebar room={room} />
          </div>
        </div>
      </div>
    </div>
  );
}
