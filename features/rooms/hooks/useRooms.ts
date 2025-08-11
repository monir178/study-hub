import { useApiQuery } from "@/lib/api/hooks/use-api-query";
import { useApiMutation } from "@/lib/api/hooks/use-api-mutation";
import { useCacheUtils } from "@/lib/api/hooks/use-cache-utils";
import { apiClient } from "@/lib/api/client";
import { queryKeys } from "@/lib/query/keys";
import { useRouter } from "next/navigation";

export interface StudyRoom {
  id: string;
  name: string;
  description?: string;
  isPublic: boolean;
  maxMembers: number;
  createdAt: string;
  updatedAt: string;
  creator: {
    id: string;
    name?: string;
    image?: string;
    role: "USER" | "MODERATOR" | "ADMIN";
  };
  members: Array<{
    id: string;
    role: "MEMBER" | "MODERATOR" | "ADMIN";
    status: "ONLINE" | "OFFLINE" | "STUDYING" | "BREAK";
    joinedAt: string;
    user: {
      id: string;
      name?: string;
      image?: string;
    };
  }>;
  memberCount: number;
  messageCount: number;
  noteCount?: number;
  isJoined: boolean;
  onlineMembers: number;
  userRole?: "MEMBER" | "MODERATOR" | "ADMIN" | null;
}

export interface CreateRoomData {
  name: string;
  description?: string;
  isPublic?: boolean;
  maxMembers?: number;
  password?: string;
}

export interface UpdateRoomData {
  name?: string;
  description?: string;
  isPublic?: boolean;
  maxMembers?: number;
  password?: string;
}

export interface JoinRoomData {
  password?: string;
}

export interface RoomsResponse {
  rooms: StudyRoom[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Get all rooms with pagination and search
export function useRooms(params?: {
  page?: number;
  limit?: number;
  search?: string;
  myRooms?: boolean;
  joinedRooms?: boolean;
}) {
  const queryKey = params?.joinedRooms
    ? queryKeys.joinedRooms()
    : params?.myRooms
      ? queryKeys.myRooms()
      : queryKeys.publicRooms();

  return useApiQuery<RoomsResponse>({
    queryKey: [...queryKey, params],
    queryFn: async (): Promise<RoomsResponse> => {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.set("page", params.page.toString());
      if (params?.limit) searchParams.set("limit", params.limit.toString());
      if (params?.search) searchParams.set("search", params.search);
      if (params?.myRooms) searchParams.set("myRooms", "true");
      if (params?.joinedRooms) searchParams.set("joinedRooms", "true");

      return apiClient.get(`/rooms?${searchParams.toString()}`);
    },
    options: {
      staleTime: 30000, // 30 seconds
    },
  });
}

// Get single room details
export function useRoom(roomId: string) {
  return useApiQuery<StudyRoom>({
    queryKey: queryKeys.room(roomId),
    queryFn: async (): Promise<StudyRoom> => {
      return apiClient.get(`/rooms/${roomId}`);
    },
    options: {
      enabled: !!roomId,
      staleTime: 10000, // 10 seconds
    },
  });
}

// Create new room
export function useCreateRoom() {
  const cache = useCacheUtils();

  return useApiMutation<StudyRoom, CreateRoomData>({
    mutationFn: async (data: CreateRoomData): Promise<StudyRoom> => {
      return apiClient.post("/rooms", data);
    },
    successMessage: "Study room created successfully!",
    options: {
      onSuccess: (newRoom) => {
        // Invalidate rooms lists
        cache.invalidate(queryKeys.rooms);
        cache.invalidate(queryKeys.myRooms());
        cache.invalidate(queryKeys.publicRooms());
        cache.invalidate(queryKeys.joinedRooms());
        // Add new room to cache
        cache.update(queryKeys.room(newRoom.id), newRoom);

        // Invalidate user dashboard cache to update stats
        cache.invalidate(queryKeys.userDashboard());
        cache.invalidate(queryKeys.userDashboardStats());
        cache.invalidate(queryKeys.userRoomActivity());
      },
    },
  });
}

// Update room
export function useUpdateRoom(roomId: string) {
  const cache = useCacheUtils();

  return useApiMutation<StudyRoom, UpdateRoomData>({
    mutationFn: async (data: UpdateRoomData): Promise<StudyRoom> => {
      return apiClient.put(`/rooms/${roomId}`, data);
    },
    successMessage: "Room updated successfully!",
    options: {
      onSuccess: (updatedRoom) => {
        // Update room in cache
        cache.update(queryKeys.room(roomId), updatedRoom);
        // Invalidate rooms lists to reflect changes
        cache.invalidate(queryKeys.rooms);
        cache.invalidate(queryKeys.myRooms());
        cache.invalidate(queryKeys.publicRooms());
        cache.invalidate(queryKeys.joinedRooms());
      },
    },
  });
}

// Delete room (with navigation)
export function useDeleteRoom() {
  const cache = useCacheUtils();
  const router = useRouter();

  return useApiMutation<void, string>({
    mutationFn: async (roomId: string): Promise<void> => {
      await apiClient.delete(`/rooms/${roomId}`);
    },
    successMessage: "Room deleted permanently! All data has been removed.",
    options: {
      onSuccess: (_, roomId) => {
        // Remove room from cache
        cache.remove(queryKeys.room(roomId));
        // Invalidate rooms lists
        cache.invalidate(queryKeys.rooms);
        cache.invalidate(queryKeys.myRooms());
        cache.invalidate(queryKeys.publicRooms());
        cache.invalidate(queryKeys.joinedRooms());
        // Navigate back to rooms list
        router.push("/dashboard/rooms");
      },
    },
  });
}

// Join room
export function useJoinRoom() {
  const cache = useCacheUtils();

  return useApiMutation<void, { roomId: string; data: JoinRoomData }>({
    mutationFn: async ({
      roomId,
      data,
    }: {
      roomId: string;
      data: JoinRoomData;
    }): Promise<void> => {
      return apiClient.post(`/rooms/${roomId}/join`, data);
    },
    successMessage:
      "🎉 Welcome to the room! You can now participate in discussions and activities.",
    options: {
      onSuccess: (_, { roomId }) => {
        // Invalidate room data to refresh member list
        cache.invalidate(queryKeys.room(roomId));
        cache.invalidate(queryKeys.roomMembers(roomId));
        cache.invalidate(queryKeys.rooms);
        cache.invalidate(queryKeys.myRooms());
        cache.invalidate(queryKeys.publicRooms());
        cache.invalidate(queryKeys.joinedRooms());
      },
    },
  });
}

// Leave room
export function useLeaveRoom() {
  const router = useRouter();
  const { invalidate } = useCacheUtils();

  return useApiMutation<null, string>({
    mutationFn: async (roomId: string): Promise<null> => {
      return apiClient.delete(`/rooms/${roomId}/join`);
    },
    options: {
      onSuccess: (_, roomId) => {
        // Invalidate all room-related queries
        invalidate(queryKeys.rooms);
        invalidate(queryKeys.myRooms());
        invalidate(queryKeys.publicRooms());
        invalidate(queryKeys.joinedRooms());
        invalidate(queryKeys.room(roomId));

        // Navigate to rooms list
        router.push("/dashboard/rooms");
      },
    },
  });
}

// Convenience hooks for different types of rooms
export function useMyRooms(params?: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  return useRooms({ ...params, myRooms: true });
}

export function usePublicRooms(params?: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  return useRooms({ ...params, myRooms: false });
}

// Prefetch room hook
export function usePrefetchRoom() {
  // Simple prefetch function - returns the room ID for now
  return (roomId: string) => {
    // This is a simplified version - just return the roomId
    // In a full implementation, this would use queryClient.prefetchQuery
    return roomId;
  };
}
