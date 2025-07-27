"use client";

import { useState } from "react";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  // AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Users,
  MessageSquare,
  Lock,
  Globe,
  Calendar,
  Crown,
  Shield,
  User as UserIcon,
  MoreVertical,
  Trash2,
  Edit,
} from "lucide-react";
import { StudyRoom, useDeleteRoom } from "../hooks/useRooms";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/lib/hooks/useAuth";

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
  const { user: currentUser } = useAuth();
  const deleteRoom = useDeleteRoom();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
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

  const handleDeleteRoom = async () => {
    try {
      await deleteRoom.mutateAsync(room.id);
      setShowDeleteDialog(false); // Close dialog after successful deletion
    } catch {
      // Error handled by mutation hook
    }
  };

  // Check if current user can delete the room
  const canDeleteRoom = () => {
    if (!currentUser || !room) return false;

    // Room owner can always delete
    if (room.creator.id === currentUser.id) return true;

    // Admin can delete any room
    if (currentUser.role === "ADMIN") return true;

    // Moderator can delete rooms except those created by Admin
    if (currentUser.role === "MODERATOR") {
      // For now, allow moderators to delete any room (we'd need creator role info to be more specific)
      return true;
    }

    return false;
  };

  // Check if current user can edit the room
  const canEditRoom = () => {
    if (!currentUser || !room) return false;

    // Room owner can edit
    if (room.creator.id === currentUser.id) return true;

    // Admin can edit any room
    if (currentUser.role === "ADMIN") return true;

    // Moderator can edit if they're a room member with MODERATOR role
    if (currentUser.role === "MODERATOR" && room.userRole === "MODERATOR")
      return true;

    return false;
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
          <div className="flex items-center gap-2">
            {room.userRole && (
              <Badge
                className={`${getRoleBadgeColor(room.userRole)} flex items-center gap-1`}
              >
                {getRoleIcon(room.userRole)}
                {room.userRole}
              </Badge>
            )}

            {/* Room Management Dropdown */}
            {(canEditRoom() || canDeleteRoom()) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {canEditRoom() && (
                    <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Room
                    </DropdownMenuItem>
                  )}

                  {canDeleteRoom() && (
                    <>
                      {canEditRoom() && <DropdownMenuSeparator />}
                      <DropdownMenuItem
                        className="text-red-600 focus:text-red-600"
                        onSelect={(e) => {
                          e.preventDefault();
                          setShowDeleteDialog(true);
                        }}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Room
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
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
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Created by {room.creator.name || "Unknown"}
            </span>
            <Badge
              variant="outline"
              className={`${getRoleBadgeColor(room.creator.role)} text-xs px-1.5 py-0.5`}
            >
              {getRoleIcon(room.creator.role)}
              <span className="ml-1">{room.creator.role}</span>
            </Badge>
          </div>
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

      {/* Delete Room Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Room</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete "{room.name}"? This
              action cannot be undone and will remove all messages, notes, and
              member data associated with this room.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteRoom.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteRoom}
              disabled={deleteRoom.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteRoom.isPending ? "Deleting..." : "Delete Room"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
