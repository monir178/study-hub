import { useApiQuery } from "@/lib/api/hooks/use-api-query";
import { queryKeys } from "@/lib/query/keys";
import { ModeratorDashboardService } from "../services/moderator-dashboard.service";

export function useModeratorDashboard() {
  return useApiQuery({
    queryKey: queryKeys.moderatorDashboard(),
    queryFn: () => ModeratorDashboardService.getDashboardData(),
  });
}

export function useRecentUsers() {
  return useApiQuery({
    queryKey: queryKeys.moderatorRecentUsers(),
    queryFn: () => ModeratorDashboardService.getRecentUsers(),
  });
}

export function useRecentRooms() {
  return useApiQuery({
    queryKey: queryKeys.moderatorRecentRooms(),
    queryFn: () => ModeratorDashboardService.getRecentRooms(),
  });
}

export function useRecentSessions() {
  return useApiQuery({
    queryKey: queryKeys.moderatorRecentSessions(),
    queryFn: () => ModeratorDashboardService.getRecentSessions(),
  });
}
