import { useApiQuery } from "@/lib/api/hooks/use-api-query";
import { useApiMutation } from "@/lib/api/hooks/use-api-mutation";
import { useCacheUtils } from "@/lib/api/hooks/use-cache-utils";
import { apiClient } from "@/lib/api/client";
import { queryKeys } from "@/lib/query/keys";

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
}) {
  const queryKey = params?.myRooms
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
        // Add new room to cache
        cache.update(queryKeys.room(newRoom.id), newRoom);
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
      },
    },
  });
}

// Delete room
export function useDeleteRoom() {
  const cache = useCacheUtils();

  return useApiMutation<void, string>({
    mutationFn: async (roomId: string): Promise<void> => {
      return apiClient.delete(`/rooms/${roomId}`);
    },
    successMessage: "Room deleted successfully!",
    options: {
      onSuccess: (_, roomId) => {
        // Remove room from cache
        cache.remove(queryKeys.room(roomId));
        // Invalidate rooms lists
        cache.invalidate(queryKeys.rooms);
        cache.invalidate(queryKeys.myRooms());
        cache.invalidate(queryKeys.publicRooms());
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
    successMessage: "Successfully joined the room!",
    options: {
      onSuccess: (_, { roomId }) => {
        // Invalidate room data to refresh member list
        cache.invalidate(queryKeys.room(roomId));
        cache.invalidate(queryKeys.roomMembers(roomId));
        cache.invalidate(queryKeys.rooms);
        cache.invalidate(queryKeys.myRooms());
        cache.invalidate(queryKeys.publicRooms());
      },
    },
  });
}

// Leave room
export function useLeaveRoom() {
  const cache = useCacheUtils();

  return useApiMutation<void, string>({
    mutationFn: async (roomId: string): Promise<void> => {
      return apiClient.delete(`/rooms/${roomId}/join`);
    },
    successMessage: "Successfully left the room!",
    options: {
      onSuccess: (_, roomId) => {
        // Invalidate room data to refresh member list
        cache.invalidate(queryKeys.room(roomId));
        cache.invalidate(queryKeys.roomMembers(roomId));
        cache.invalidate(queryKeys.rooms);
        cache.invalidate(queryKeys.myRooms());
        cache.invalidate(queryKeys.publicRooms());
      },
    },
  });
}
