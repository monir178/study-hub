/**
 * Study Rooms Page - Eximport { 
  useRooms, 
  useMyRooms,
  usePublicRooms,
  useCreateRoom, 
  useJoinRoom,
  useLeaveRoom,
  usePrefetchRoom 
} from '@/features/rooms/hooks/useRooms';TanStack Query Feature Architecture
 *
 * This component demonstrates:
 * - Feature-based organization with query hooks
 * - Automatic caching and refetching
 * - Error handling and loading states
 * - Optimistic updates with mutations
 * - Prefetching for better UX
 */

"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  useRooms,
  useMyRooms,
  usePublicRooms,
  useCreateRoom,
  useJoinRoom,
  useLeaveRoom,
  usePrefetchRoom,
} from "@/lib/query";
import {
  Users,
  Plus,
  Globe,
  Lock,
  UserPlus,
  UserMinus,
  RefreshCw,
  MapPin,
  Clock,
} from "lucide-react";

export function StudyRoomsPage() {
  const [activeTab, setActiveTab] = useState<"all" | "my" | "public">("public");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Query hooks - automatic caching and error handling
  const {
    data: allRooms = [],
    isLoading: allRoomsLoading,
    error: allRoomsError,
    refetch: refetchAllRooms,
    isRefetching: allRoomsRefetching,
  } = useRooms();

  const {
    data: myRooms = [],
    isLoading: myRoomsLoading,
    error: myRoomsError,
    refetch: refetchMyRooms,
    isRefetching: myRoomsRefetching,
  } = useMyRooms();

  const {
    data: publicRooms = [],
    isLoading: publicRoomsLoading,
    error: publicRoomsError,
    refetch: refetchPublicRooms,
    isRefetching: publicRoomsRefetching,
  } = usePublicRooms();

  // Mutation hooks
  const createRoom = useCreateRoom();
  const joinRoom = useJoinRoom();
  const leaveRoom = useLeaveRoom();
  const prefetchRoom = usePrefetchRoom();

  // Get current data based on active tab
  const getCurrentData = () => {
    switch (activeTab) {
      case "all":
        return {
          data: allRooms,
          isLoading: allRoomsLoading,
          error: allRoomsError,
          refetch: refetchAllRooms,
          isRefetching: allRoomsRefetching,
        };
      case "my":
        return {
          data: myRooms,
          isLoading: myRoomsLoading,
          error: myRoomsError,
          refetch: refetchMyRooms,
          isRefetching: myRoomsRefetching,
        };
      case "public":
        return {
          data: publicRooms,
          isLoading: publicRoomsLoading,
          error: publicRoomsError,
          refetch: refetchPublicRooms,
          isRefetching: publicRoomsRefetching,
        };
      default:
        return {
          data: [],
          isLoading: false,
          error: null,
          refetch: () => {},
          isRefetching: false,
        };
    }
  };

  const {
    data: rooms,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = getCurrentData();

  // Handle room actions
  const handleJoinRoom = async (roomId: string) => {
    try {
      await joinRoom.mutateAsync(roomId);
      // TanStack Query automatically updates the cache
    } catch (error) {
      console.error("Failed to join room:", error);
    }
  };

  const handleLeaveRoom = async (roomId: string) => {
    try {
      await leaveRoom.mutateAsync(roomId);
      // Cache is automatically updated
    } catch (error) {
      console.error("Failed to leave room:", error);
    }
  };

  // Room creation form
  const CreateRoomDialog = () => {
    const [formData, setFormData] = useState({
      name: "",
      description: "",
      isPublic: true,
      maxParticipants: 10,
      tags: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        await createRoom.mutateAsync({
          ...formData,
          tags: formData.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
        });
        setIsCreateDialogOpen(false);
        setFormData({
          name: "",
          description: "",
          isPublic: true,
          maxParticipants: 10,
          tags: "",
        });
      } catch (error) {
        console.error("Failed to create room:", error);
      }
    };

    return (
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogTrigger asChild>
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Room
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Study Room</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Room Name</label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter room name"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Describe your study room"
                rows={3}
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Public Room</label>
              <Switch
                checked={formData.isPublic}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isPublic: checked })
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium">Max Participants</label>
              <Input
                type="number"
                value={formData.maxParticipants}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maxParticipants: parseInt(e.target.value),
                  })
                }
                min="2"
                max="50"
              />
            </div>
            <div>
              <label className="text-sm font-medium">
                Tags (comma-separated)
              </label>
              <Input
                value={formData.tags}
                onChange={(e) =>
                  setFormData({ ...formData, tags: e.target.value })
                }
                placeholder="math, science, study group"
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={createRoom.isPending}>
                {createRoom.isPending ? "Creating..." : "Create Room"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    );
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="flex gap-2">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-24" />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="text-destructive text-lg font-semibold">
              Failed to Load Rooms
            </div>
            <p className="text-muted-foreground text-center">
              {error?.message || "Something went wrong while fetching rooms"}
            </p>
            <Button onClick={() => refetch()} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Study Rooms</h1>
          <p className="text-muted-foreground">
            Join or create study rooms to collaborate with others
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isRefetching}
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${isRefetching ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <CreateRoomDialog />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[
          { key: "public", label: "Public Rooms", icon: Globe },
          { key: "my", label: "My Rooms", icon: Users },
          { key: "all", label: "All Rooms", icon: MapPin },
        ].map(({ key, label, icon: Icon }) => (
          <Button
            key={key}
            variant={activeTab === key ? "default" : "outline"}
            onClick={() => setActiveTab(key as typeof activeTab)}
            className="flex items-center gap-2"
          >
            <Icon className="w-4 h-4" />
            {label}
          </Button>
        ))}
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <Card
            key={room.id}
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onMouseEnter={() => prefetchRoom(room.id)} // Prefetch on hover
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    {room.isPublic ? (
                      <Globe className="w-4 h-4 text-green-600" />
                    ) : (
                      <Lock className="w-4 h-4 text-amber-600" />
                    )}
                    {room.name}
                  </CardTitle>
                  {room.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {room.description}
                    </p>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Tags */}
              {room.tags && room.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {room.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {room.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{room.tags.length - 3}
                    </Badge>
                  )}
                </div>
              )}

              {/* Participants */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  {room.currentParticipants}/{room.maxParticipants}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  Active
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleJoinRoom(room.id)}
                  disabled={
                    joinRoom.isPending ||
                    room.currentParticipants >= room.maxParticipants
                  }
                  className="flex-1"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Join
                </Button>
                {activeTab === "my" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleLeaveRoom(room.id)}
                    disabled={leaveRoom.isPending}
                  >
                    <UserMinus className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty state */}
      {rooms.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
            <Users className="w-12 h-12 text-muted-foreground" />
            <div className="text-center">
              <h3 className="text-lg font-semibold">No rooms found</h3>
              <p className="text-muted-foreground">
                {activeTab === "my"
                  ? "You haven't joined any rooms yet"
                  : "No rooms available at the moment"}
              </p>
            </div>
            {activeTab !== "my" && <CreateRoomDialog />}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
