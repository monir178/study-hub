import { useApiQuery } from "@/lib/api/hooks/use-api-query";
import { useApiMutation } from "@/lib/api/hooks/use-api-mutation";
import { useCacheUtils } from "@/lib/api/hooks/use-cache-utils";
import { AdminService } from "../services/admin.service";
import { DashboardStats, SystemSettings, AdminAnalytics } from "../types";
import { queryKeys } from "@/lib/query/keys";

// ===============================================
// QUERIES
// ===============================================

/**
 * Hook to fetch dashboard statistics
 */
export function useAdminDashboardStats() {
  return useApiQuery<DashboardStats>({
    queryKey: queryKeys.adminDashboardStats(),
    queryFn: () => AdminService.getDashboardStats(),
    options: {
      // Refetch every 30 seconds for real-time dashboard
      refetchInterval: 30 * 1000,
      // Show stale data while refetching
      staleTime: 20 * 1000, // 20 seconds
    },
  });
}

/**
 * Hook to fetch system settings
 */
export function useAdminSystemSettings() {
  return useApiQuery<SystemSettings>({
    queryKey: queryKeys.adminSettings(),
    queryFn: () => AdminService.getSystemSettings(),
    options: {
      // Settings don't change often, cache for longer
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  });
}

/**
 * Hook to fetch analytics data
 */
export function useAdminAnalytics(timeRange: "7d" | "30d" | "90d" = "30d") {
  return useApiQuery<AdminAnalytics>({
    queryKey: queryKeys.adminAnalytics(timeRange),
    queryFn: () => AdminService.getAnalytics(timeRange),
    options: {
      // Cache analytics for a while since they're expensive to compute
      staleTime: 2 * 60 * 1000, // 2 minutes
    },
  });
}

// ===============================================
// MUTATIONS
// ===============================================

/**
 * Hook to update system settings
 */
export function useUpdateSystemSettings() {
  const cache = useCacheUtils();

  return useApiMutation<SystemSettings, Partial<SystemSettings>>({
    mutationFn: (settings) => AdminService.updateSystemSettings(settings),
    successMessage: "System settings updated successfully",
    options: {
      onSuccess: (updatedSettings) => {
        // Update settings cache
        cache.update(queryKeys.adminSettings(), updatedSettings);
      },
    },
  });
}

/**
 * Hook to ban a user
 */
export function useBanUser() {
  const cache = useCacheUtils();

  return useApiMutation<void, string>({
    mutationFn: (userId) => AdminService.banUser(userId),
    successMessage: "User banned successfully",
    options: {
      onSuccess: () => {
        // Invalidate user-related queries
        cache.invalidate(queryKeys.users);
        cache.invalidate(queryKeys.adminDashboard());
      },
    },
  });
}

/**
 * Hook to unban a user
 */
export function useUnbanUser() {
  const cache = useCacheUtils();

  return useApiMutation<void, string>({
    mutationFn: (userId) => AdminService.unbanUser(userId),
    successMessage: "User unbanned successfully",
    options: {
      onSuccess: () => {
        // Invalidate user-related queries
        cache.invalidate(queryKeys.users);
        cache.invalidate(queryKeys.adminDashboard());
      },
    },
  });
}

/**
 * Hook to toggle maintenance mode
 */
export function useToggleMaintenanceMode() {
  const cache = useCacheUtils();

  return useApiMutation<void, boolean>({
    mutationFn: (enabled) => AdminService.toggleMaintenanceMode(enabled),
    successMessage: "Maintenance mode updated successfully",
    options: {
      onSuccess: () => {
        // Invalidate settings to refresh maintenance mode status
        cache.invalidate(queryKeys.adminSettings());
      },
    },
  });
}
