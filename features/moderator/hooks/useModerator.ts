import { useApiQuery } from "@/lib/api/hooks/use-api-query";
import { useApiMutation } from "@/lib/api/hooks/use-api-mutation";
import { useCacheUtils } from "@/lib/api/hooks/use-cache-utils";
import { ModeratorService } from "../services/moderator.service";
import {
  ModeratorStats,
  Report,
  CreateReportData,
  UpdateReportData,
  ModeratorActivity,
} from "../types";
import { queryKeys } from "@/lib/query/keys";

// ===============================================
// QUERIES
// ===============================================

/**
 * Hook to fetch moderator dashboard stats
 */
export function useModeratorStats() {
  return useApiQuery<ModeratorStats>({
    queryKey: queryKeys.moderatorStats(),
    queryFn: () => ModeratorService.getStats(),
    options: {
      // Moderator stats should be fairly fresh
      staleTime: 5 * 60 * 1000, // 5 minutes
      // Keep data in cache
      gcTime: 15 * 60 * 1000, // 15 minutes
      // Keep previous data while loading new data
      placeholderData: (previousData: ModeratorStats | undefined) =>
        previousData,
    },
  });
}

/**
 * Hook to fetch all reports for moderator review
 */
export function useReports(status?: "PENDING" | "RESOLVED" | "DISMISSED") {
  return useApiQuery<Report[]>({
    queryKey: queryKeys.reports(status),
    queryFn: () => ModeratorService.getReports(status),
    options: {
      // Reports should be fresh
      staleTime: 2 * 60 * 1000, // 2 minutes
      // Keep data in cache
      gcTime: 10 * 60 * 1000, // 10 minutes
      // Keep previous data while loading new data
      placeholderData: (previousData: Report[] | undefined) => previousData,
    },
  });
}

/**
 * Hook to fetch a specific report by ID
 */
export function useReport(id: string) {
  return useApiQuery<Report>({
    queryKey: queryKeys.report(id),
    queryFn: () => ModeratorService.getReportById(id),
    options: {
      // Individual report data
      staleTime: 5 * 60 * 1000, // 5 minutes
      // Keep data in cache
      gcTime: 20 * 60 * 1000, // 20 minutes
      // Only run query if ID is provided
      enabled: !!id,
      // Keep previous data while loading new data
      placeholderData: (previousData: Report | undefined) => previousData,
    },
  });
}

/**
 * Hook to fetch moderator activity log
 */
export function useModeratorActivity() {
  return useApiQuery<ModeratorActivity[]>({
    queryKey: queryKeys.moderatorActivity(),
    queryFn: () => ModeratorService.getActivity(),
    options: {
      // Activity log should be reasonably fresh
      staleTime: 5 * 60 * 1000, // 5 minutes
      // Keep data in cache
      gcTime: 30 * 60 * 1000, // 30 minutes
      // Keep previous data while loading new data
      placeholderData: (previousData: ModeratorActivity[] | undefined) =>
        previousData,
    },
  });
}

// ===============================================
// MUTATIONS
// ===============================================

/**
 * Hook to create a new report
 */
export function useCreateReport() {
  const cache = useCacheUtils();

  return useApiMutation<Report, CreateReportData>({
    mutationFn: (reportData) => ModeratorService.createReport(reportData),
    successMessage: "Report submitted successfully",
    options: {
      onSuccess: (newReport) => {
        // Add the new report to the cache
        cache.appendToList(queryKeys.reports(), newReport);
        cache.appendToList(queryKeys.reports("PENDING"), newReport);
        // Invalidate stats to update counts
        cache.invalidate(queryKeys.moderatorStats());
      },
    },
  });
}

/**
 * Hook to update a report (resolve, dismiss, etc.)
 */
export function useUpdateReport() {
  const cache = useCacheUtils();

  return useApiMutation<Report, { id: string; reportData: UpdateReportData }>({
    mutationFn: ({ id, reportData }) =>
      ModeratorService.updateReport(id, reportData),
    successMessage: "Report updated successfully",
    options: {
      onSuccess: (updatedReport, { id }) => {
        // Update the specific report in cache
        cache.update(queryKeys.report(id), updatedReport);

        // Update the report in the reports list
        cache.updateInList(queryKeys.reports(), id, updatedReport);

        // Update filtered lists based on status
        if (updatedReport.status === "PENDING") {
          cache.updateInList(queryKeys.reports("PENDING"), id, updatedReport);
        } else if (updatedReport.status === "RESOLVED") {
          cache.updateInList(queryKeys.reports("RESOLVED"), id, updatedReport);
        } else if (updatedReport.status === "DISMISSED") {
          cache.updateInList(queryKeys.reports("DISMISSED"), id, updatedReport);
        }

        // Invalidate stats to update counts
        cache.invalidate(queryKeys.moderatorStats());
      },
    },
  });
}

/**
 * Hook to delete a report
 */
export function useDeleteReport() {
  const cache = useCacheUtils();

  return useApiMutation<void, string>({
    mutationFn: (id) => ModeratorService.deleteReport(id),
    successMessage: "Report deleted successfully",
    options: {
      onSuccess: (_, deletedId) => {
        // Remove report from cache
        cache.removeFromList(queryKeys.reports(), deletedId);
        cache.removeFromList(queryKeys.reports("PENDING"), deletedId);
        cache.removeFromList(queryKeys.reports("RESOLVED"), deletedId);
        cache.removeFromList(queryKeys.reports("DISMISSED"), deletedId);

        // Remove individual report cache
        cache.remove(queryKeys.report(deletedId));

        // Update stats
        cache.invalidate(queryKeys.moderatorStats());
      },
    },
  });
}

// ===============================================
// UTILITY HOOKS
// ===============================================

/**
 * Hook to prefetch a report
 */
export function usePrefetchReport() {
  const cache = useCacheUtils();

  return (id: string) => {
    cache.prefetch(
      queryKeys.report(id),
      () => ModeratorService.getReportById(id),
      5 * 60 * 1000, // 5 minutes
    );
  };
}

/**
 * Hook to get cached report data without triggering a network request
 */
export function useCachedReport(id: string) {
  const cache = useCacheUtils();
  return cache.getCached<Report>(queryKeys.report(id));
}
