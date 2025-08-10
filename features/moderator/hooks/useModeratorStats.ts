import { useApiQuery } from "@/lib/api/hooks/use-api-query";
import { ModeratorDashboardService } from "../services/moderator-dashboard.service";
import { ModeratorStats } from "../types";
import { queryKeys } from "@/lib/query/keys";

export const useModeratorStats = () => {
  return useApiQuery<ModeratorStats>({
    queryKey: queryKeys.moderatorStats(),
    queryFn: () => ModeratorDashboardService.getModeratorStats(),
    options: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    },
  });
};
