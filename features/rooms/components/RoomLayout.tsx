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

import { GroupChat } from "./GroupChat";
import { NotesContainer } from "@/features/notes/components/NotesContainer";
import { RoomOverview } from "./RoomOverview";
import { useRoomMembers } from "../hooks/useRoomMembers";
import { Loading } from "@/components/ui/loading";

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
    return <Loading />;
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
    <div className="min-h-screen ">
      {/* Fixed Pomodoro Timer - Desktop Only */}
      <div className="hidden lg:block">
        <PomodoroTimer roomId={roomId} roomCreatorId={room.creator.id} />
      </div>

      <div className="w-full max-w-[1920px] mx-auto ">
        {/* Room Header */}
        <RoomHeader room={room} />

        {/* Main Layout */}
        <div className="grid gap-4 lg:grid-cols-8 mt-4">
          {/* Chat Panel - Left Side */}
          <div className="lg:col-span-5 space-y-6">
            {/* Mobile Timer - Above Chat */}
            <div className="block lg:hidden">
              <PomodoroTimer roomId={roomId} roomCreatorId={room.creator.id} />
            </div>

            {/* Chat Panel - Main Content */}
            <Card className="h-[calc(100vh-280px)] lg:h-[calc(100vh-200px)] flex flex-col">
              <CardHeader className="pb-4 border-b flex-shrink-0">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    {room.name}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge className="text-xs font-semibold bg-primary/10 text-black dark:text-white">
                      <Users className="w-3 h-3 mr-1" />
                      {room.onlineMembers > 1
                        ? `${room.onlineMembers} members`
                        : `${room.onlineMembers} member`}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex-1 p-0 min-h-0">
                <GroupChat roomId={roomId} />
              </CardContent>
            </Card>
          </div>

          {/* Notes Panel - Right Side */}
          <div className="lg:col-span-3">
            <Card className="h-[calc(100vh-280px)] lg:h-[calc(100vh-200px)] flex flex-col">
              <CardContent className="flex-1 flex flex-col min-h-0 p-0">
                <NotesContainer
                  roomId={roomId}
                  room={{
                    id: room.id,
                    name: room.name,
                    isPublic: room.isPublic,
                    creatorId: room.creator.id,
                    members: room.members.map((member) => ({
                      userId: member.user.id,
                      user: {
                        id: member.user.id,
                        name: member.user.name || "Unknown User",
                        email: "",
                      },
                    })),
                  }}
                />
              </CardContent>
            </Card>
          </div>

          {/* Room Overview - Far Right */}
          {/* <div className="lg:col-span-1">
            <RoomOverview room={room} />
          </div> */}
        </div>
      </div>
    </div>
  );
}
