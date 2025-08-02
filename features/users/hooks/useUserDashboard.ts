import { useApiQuery } from "@/lib/api/hooks/use-api-query";
import { queryKeys } from "@/lib/query/keys";
import { UserDashboardService } from "../services/user-dashboard.service";

export function useUserDashboard() {
  return useApiQuery({
    queryKey: queryKeys.userDashboard(),
    queryFn: () => UserDashboardService.getDashboardData(),
  });
}

export function useUserStats() {
  return useApiQuery({
    queryKey: queryKeys.userDashboardStats(),
    queryFn: () => UserDashboardService.getUserStats(),
  });
}

export function useRecentSessions() {
  return useApiQuery({
    queryKey: queryKeys.userSessions("current"),
    queryFn: () => UserDashboardService.getRecentSessions(),
  });
}

export function useRecentRooms() {
  return useApiQuery({
    queryKey: queryKeys.myRooms(),
    queryFn: () => UserDashboardService.getRecentRooms(),
  });
}

export function useRecentNotes() {
  return useApiQuery({
    queryKey: queryKeys.userNotes("current"),
    queryFn: () => UserDashboardService.getRecentNotes(),
  });
}

export function useStudyTimeByDay() {
  return useApiQuery({
    queryKey: queryKeys.userStudyTime(),
    queryFn: () => UserDashboardService.getStudyTimeByDay(),
  });
}

export function useSessionTypes() {
  return useApiQuery({
    queryKey: queryKeys.userSessionTypes(),
    queryFn: () => UserDashboardService.getSessionTypes(),
  });
}

export function useRoomActivity() {
  return useApiQuery({
    queryKey: queryKeys.userRoomActivity(),
    queryFn: () => UserDashboardService.getRoomActivity(),
  });
}
