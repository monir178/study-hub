import { useApiQuery } from "@/lib/api/hooks/use-api-query";
import { ModeratorDashboardService } from "../services/moderator-dashboard.service";
import { ModeratorActivity } from "../types";
import { queryKeys } from "@/lib/query/keys";

/**
 * Hook to fetch moderator activity log
 */
export function useModeratorActivity() {
  return useApiQuery<ModeratorActivity[]>({
    queryKey: queryKeys.moderatorActivity(),
    queryFn: () => ModeratorDashboardService.getActivity(),
    options: {
      staleTime: 1 * 60 * 1000, // 1 minute - activity should be fresh
      refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes
    },
  });
}
