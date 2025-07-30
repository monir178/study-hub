/* eslint-disable */

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Users,
  MessageSquare,
  // FileText,
  Calendar,
  Crown,
  Shield,
  User as UserIcon,
  // Loader2,
  // Check,
  // UserPlus,
  // UserMinus,
} from "lucide-react";
import { StudyRoom } from "../hooks/useRooms";
import { useRoomMembers } from "../hooks/useRoomMembers";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/lib/hooks/useAuth";
// import { Button } from "@/components/ui/button";

interface RoomSidebarProps {
  room: StudyRoom;
}

export function RoomSidebar({ room }: RoomSidebarProps) {
  const { user } = useAuth();
  // Use real-time member data
  const { members, memberCount, onlineMembers, loading, error, actions } =
    useRoomMembers({
      roomId: room.id,
      initialRoom: room,
    });

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ONLINE":
        return "bg-green-500";
      case "STUDYING":
        return "bg-blue-500";
      case "BREAK":
        return "bg-yellow-500";
      default:
        return "bg-gray-400";
    }
  };

  // Check if current user is a member
  const isCurrentUserMember = members.some((m) => m.userId === user?.id);

  return (
    <div className="space-y-6">
      {/* Room Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Room Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Users className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold">{memberCount}</div>
              <div className="text-xs text-muted-foreground">Members</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-center gap-1 mb-1">
                <MessageSquare className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold">{room.messageCount}</div>
              <div className="text-xs text-muted-foreground">Messages</div>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Online</span>
              <span className="font-medium">{onlineMembers}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Capacity</span>
              <span className="font-medium">
                {memberCount}/{room.maxMembers}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Notes</span>
              <span className="font-medium">{room.noteCount || 0}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Visibility</span>
              <span className="font-medium">
                {room.isPublic ? "Public" : "Private"}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Connection</span>
              <span className="font-medium text-green-600">Connected</span>
            </div>
          </div>

          <Separator />

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Created</span>
            </div>
            <p className="text-sm">
              {formatDistanceToNow(new Date(room.createdAt), {
                addSuffix: true,
              })}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Room Creator */}
      {/* <Card>
        <CardHeader>
          <CardTitle className="text-lg">Room Creator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage
                src={room.creator.image || ""}
                alt={room.creator.name || ""}
              />
              <AvatarFallback>
                {room.creator.name?.charAt(0) || "?"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-medium">{room.creator.name || "Unknown"}</p>
              <Badge
                variant="outline"
                className={`${getRoleBadgeColor(room.creator.role)} text-xs mt-1`}
              >
                {getRoleIcon(room.creator.role)}
                <span className="ml-1">{room.creator.role}</span>
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card> */}

      {/* Join/Leave Room */}
      {/* {user && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Your Status</CardTitle>
          </CardHeader>
          <CardContent>
            {isCurrentUserMember ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-green-600">
                  <Check className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    You're a member of this room
                  </span>
                </div>
                <Button
                  onClick={actions.leaveRoom}
                  disabled={loading.join || loading.leave}
                  variant="outline"
                  size="sm"
                  className="w-full transition-all duration-200 hover:scale-105">
                  {loading.leave ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <UserMinus className="w-4 h-4 mr-2" />
                  )}
                  {loading.leave ? "Leaving..." : "Leave Room"}
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <UserIcon className="w-4 h-4" />
                  <span className="text-sm">You're not a member yet</span>
                </div>
                <Button
                  onClick={actions.joinRoom}
                  disabled={loading.join || loading.leave}
                  size="sm"
                  className="w-full transition-all duration-200 hover:scale-105">
                  {loading.join ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <UserPlus className="w-4 h-4 mr-2" />
                  )}
                  {loading.join ? "Joining..." : "Join Room"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )} */}

      {/* Members List */}

      {/* <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-lg">
            <span>Members</span>
            <Badge variant="outline" className="text-xs">
              {onlineMembers} online
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
       
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="w-8 h-8">
                      <AvatarImage
                        src={member.user.image || ""}
                        alt={member.user.name || ""}
                      />
                      <AvatarFallback className="text-xs">
                        {member.user.name?.charAt(0) || "?"}
                      </AvatarFallback>
                    </Avatar>
             
                    <div
                      className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(
                        member.status
                      )}`}></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {member.user.name || "Unknown"}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {member.status.toLowerCase()}
                    </p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={`${getRoleBadgeColor(member.role)} text-xs`}>
                  {getRoleIcon(member.role)}
                  <span className="ml-1 hidden sm:inline">{member.role}</span>
                </Badge>
              </div>
            ))}

     
            {members.length === 0 && (
              <div className="text-center py-4 text-muted-foreground">
                <p className="text-sm">No members in this room</p>
              </div>
            )}

      
            {(loading.join || loading.leave) && (
              <div className="text-center py-4 text-muted-foreground">
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <p className="text-sm">Updating members...</p>
                </div>
              </div>
            )}

     
            {error && (
              <div className="text-center py-4 text-red-600">
                <p className="text-sm">{error}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
}
