"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowLeft, MoreVertical, Trash2, Edit, Settings } from "lucide-react";
import { StudyRoom, useLeaveRoom, useDeleteRoom } from "../hooks/useRooms";
import { useAuth } from "@/lib/hooks/useAuth";

interface RoomHeaderProps {
  room: StudyRoom;
}

export function RoomHeader({ room }: RoomHeaderProps) {
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const leaveRoom = useLeaveRoom();
  const deleteRoom = useDeleteRoom();

  const handleLeaveRoom = async () => {
    try {
      await leaveRoom.mutateAsync(room.id);
      router.push("/dashboard/rooms");
    } catch {
      // Error handled by mutation hook
    }
  };

  const handleDeleteRoom = async () => {
    try {
      await deleteRoom.mutateAsync(room.id);
      setShowDeleteDialog(false);
      router.push("/dashboard/rooms");
    } catch {
      // Error handled by mutation hook
    }
  };

  // Check if current user can delete the room
  const canDeleteRoom = () => {
    if (!currentUser || !room) return false;
    if (room.creator.id === currentUser.id) return true;
    if (currentUser.role === "ADMIN") return true;
    if (currentUser.role === "MODERATOR") return true;
    return false;
  };

  // Check if current user can edit the room
  const canEditRoom = () => {
    if (!currentUser || !room) return false;
    if (room.creator.id === currentUser.id) return true;
    if (currentUser.role === "ADMIN") return true;
    if (currentUser.role === "MODERATOR" && room.userRole === "MODERATOR")
      return true;
    return false;
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Rooms
          </Button>
        </div>

        <div className="flex items-center gap-3">
          {/* User Role Badge */}
          {/* {room.userRole && (
            <Badge className={getRoleBadgeColor(room.userRole)}>
              {getRoleIcon(room.userRole)}
              <span className="ml-1">{room.userRole}</span>
            </Badge>
          )} */}

          {/* Leave Room Button */}
          {room.userRole !== "ADMIN" && room.creator.id !== currentUser?.id && (
            <Button
              variant="outline"
              onClick={handleLeaveRoom}
              disabled={leaveRoom.isPending}
            >
              {leaveRoom.isPending ? "Leaving..." : "Leave Room"}
            </Button>
          )}

          {/* Room Management Dropdown */}
          {(canEditRoom() || canDeleteRoom()) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {canEditRoom() && (
                  <>
                    <DropdownMenuItem>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Room
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="w-4 h-4 mr-2" />
                      Room Settings
                    </DropdownMenuItem>
                  </>
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
    </>
  );
}
