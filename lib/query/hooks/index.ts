// Admin hooks - now from features
export {
  useAdminDashboardStats,
  useAdminSystemSettings,
  useAdminAnalytics,
  useUpdateSystemSettings,
  useBanUser,
  useUnbanUser,
  useToggleMaintenanceMode,
} from "@/features/admin/hooks/useAdmin";

// User hooks - now from features
export {
  useUsers,
  useUser,
  useUserProfile,
  useCreateUser,
  useUpdateUser,
  useUpdateProfile,
  useUpdateUserRole,
  useDeleteUser,
  usePrefetchUser,
  useCachedUser,
} from "@/features/users/hooks/useUsers";

// Room hooks - now from features
export {
  useRooms,
  useRoom,
  useMyRooms,
  usePublicRooms,
  useCreateRoom,
  useUpdateRoom,
  useDeleteRoom,
  useJoinRoom,
  useLeaveRoom,
  usePrefetchRoom,
} from "@/features/rooms/hooks/useRooms";

// Export query keys for manual cache manipulation
export { queryKeys, createQueryKeys } from "../keys";
