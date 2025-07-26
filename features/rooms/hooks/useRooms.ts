import { useApiQuery } from "@/lib/api/hooks/use-api-query";
import { useApiMutation } from "@/lib/api/hooks/use-api-mutation";
import { useCacheUtils } from "@/lib/api/hooks/use-cache-utils";
import { RoomService } from "../services/room.service";
import { Room, CreateRoomData, UpdateRoomData } from "../types";
import { queryKeys } from "@/lib/query/keys";

// ===============================================
// QUERIES
// ===============================================

/**
 * Hook to fetch all rooms (admin view)
 */
export function useRooms() {
  return useApiQuery<Room[]>({
    queryKey: queryKeys.rooms,
    queryFn: () => RoomService.getRooms(),
    options: {
      staleTime: 10 * 60 * 1000, // 10 minutes (increased)
      gcTime: 20 * 60 * 1000, // 20 minutes
      // Keep previous data while loading new data
      placeholderData: (previousData: Room[] | undefined) => previousData,
    },
  });
}

/**
 * Hook to fetch a specific room by ID
 */
export function useRoom(id: string) {
  return useApiQuery<Room>({
    queryKey: queryKeys.room(id),
    queryFn: () => RoomService.getRoomById(id),
    options: {
      enabled: !!id,
      staleTime: 30 * 1000, // 30 seconds (room data changes frequently)
    },
  });
}

/**
 * Hook to fetch current user's rooms
 */
export function useMyRooms() {
  return useApiQuery<Room[]>({
    queryKey: queryKeys.myRooms(),
    queryFn: () => RoomService.getMyRooms(),
    options: {
      staleTime: 1 * 60 * 1000, // 1 minute
    },
  });
}

/**
 * Hook to fetch public rooms
 */
export function usePublicRooms() {
  return useApiQuery<Room[]>({
    queryKey: queryKeys.publicRooms(),
    queryFn: () => RoomService.getPublicRooms(),
    options: {
      staleTime: 1 * 60 * 1000, // 1 minute
    },
  });
}

// ===============================================
// MUTATIONS
// ===============================================

/**
 * Hook to create a new room
 */
export function useCreateRoom() {
  const cache = useCacheUtils();

  return useApiMutation<Room, CreateRoomData>({
    mutationFn: (roomData) => RoomService.createRoom(roomData),
    successMessage: "Room created successfully",
    options: {
      onSuccess: (newRoom) => {
        // Add to all rooms cache
        cache.appendToList(queryKeys.rooms, newRoom);

        // Add to my rooms cache
        cache.appendToList(queryKeys.myRooms(), newRoom);

        // Add to public rooms cache if it's public
        if (newRoom.isPublic) {
          cache.appendToList(queryKeys.publicRooms(), newRoom);
        }

        // Invalidate dashboard stats
        cache.invalidate(queryKeys.adminDashboard());
      },
    },
  });
}

/**
 * Hook to update a room
 */
export function useUpdateRoom() {
  const cache = useCacheUtils();

  return useApiMutation<Room, { id: string; roomData: UpdateRoomData }>({
    mutationFn: ({ id, roomData }) => RoomService.updateRoom(id, roomData),
    successMessage: "Room updated successfully",
    options: {
      onSuccess: (updatedRoom, { id }) => {
        // Update the specific room in cache
        cache.update(queryKeys.room(id), updatedRoom);

        // Update in all rooms list
        cache.updateInList(queryKeys.rooms, id, updatedRoom);

        // Update in my rooms list
        cache.updateInList(queryKeys.myRooms(), id, updatedRoom);

        // Update in public rooms list
        cache.updateInList(queryKeys.publicRooms(), id, updatedRoom);
      },
    },
  });
}

/**
 * Hook to delete a room
 */
export function useDeleteRoom() {
  const cache = useCacheUtils();

  return useApiMutation<void, string>({
    mutationFn: (id) => RoomService.deleteRoom(id),
    successMessage: "Room deleted successfully",
    options: {
      onSuccess: (_, deletedId) => {
        // Remove from all caches
        cache.removeFromList(queryKeys.rooms, deletedId);
        cache.removeFromList(queryKeys.myRooms(), deletedId);
        cache.removeFromList(queryKeys.publicRooms(), deletedId);

        // Remove individual room cache
        cache.remove(queryKeys.room(deletedId));

        // Update dashboard stats
        cache.invalidate(queryKeys.adminDashboard());
      },
    },
  });
}

/**
 * Hook to join a room
 */
export function useJoinRoom() {
  const cache = useCacheUtils();

  return useApiMutation<void, string>({
    mutationFn: (id) => RoomService.joinRoom(id),
    successMessage: "Joined room successfully",
    options: {
      onSuccess: (_, roomId) => {
        // Refresh the specific room to get updated participant count
        cache.invalidate(queryKeys.room(roomId));

        // Refresh my rooms list
        cache.invalidate(queryKeys.myRooms());
      },
    },
  });
}

/**
 * Hook to leave a room
 */
export function useLeaveRoom() {
  const cache = useCacheUtils();

  return useApiMutation<void, string>({
    mutationFn: (id) => RoomService.leaveRoom(id),
    successMessage: "Left room successfully",
    options: {
      onSuccess: (_, roomId) => {
        // Refresh the specific room to get updated participant count
        cache.invalidate(queryKeys.room(roomId));

        // Refresh my rooms list
        cache.invalidate(queryKeys.myRooms());
      },
    },
  });
}

// ===============================================
// UTILITY HOOKS
// ===============================================

/**
 * Hook to prefetch a room (useful for hover cards, navigation)
 */
export function usePrefetchRoom() {
  const cache = useCacheUtils();

  return (id: string) => {
    cache.prefetch(
      queryKeys.room(id),
      () => RoomService.getRoomById(id),
      30 * 1000,
    );
  };
}

/**
 * Hook to get cached room data without triggering a network request
 */
export function useCachedRoom(id: string) {
  const cache = useCacheUtils();
  return cache.getCached<Room>(queryKeys.room(id));
}
