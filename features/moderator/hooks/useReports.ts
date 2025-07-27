import { useApiQuery } from "@/lib/api/hooks/use-api-query";
import { useApiMutation } from "@/lib/api/hooks/use-api-mutation";
import { useCacheUtils } from "@/lib/api/hooks/use-cache-utils";
import { ModeratorService } from "../services/moderator.service";
import { Report, CreateReportData, UpdateReportData } from "../types";
import { queryKeys } from "@/lib/query/keys";

/**
 * Hook to fetch all reports (optionally filtered by status)
 */
export function useReports(status?: "PENDING" | "RESOLVED" | "DISMISSED") {
  return useApiQuery<Report[]>({
    queryKey: queryKeys.reports(status),
    queryFn: () => ModeratorService.getReports(status),
    options: {
      staleTime: 2 * 60 * 1000, // 2 minutes
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
      enabled: !!id,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  });
}

/**
 * Hook to create a new report
 */
export function useCreateReport() {
  const cache = useCacheUtils();

  return useApiMutation<Report, CreateReportData>({
    mutationFn: (reportData) => ModeratorService.createReport(reportData),
    successMessage: "Report created successfully",
    options: {
      onSuccess: (newReport) => {
        // Add the new report to the cache
        cache.appendToList(queryKeys.reports(), newReport);
        // Invalidate to update counts
        cache.invalidate(queryKeys.moderatorStats());
      },
    },
  });
}

/**
 * Hook to update a report
 */
export function useUpdateReport() {
  const cache = useCacheUtils();

  return useApiMutation<Report, { id: string; data: UpdateReportData }>({
    mutationFn: ({ id, data }) => ModeratorService.updateReport(id, data),
    successMessage: "Report updated successfully",
    options: {
      onSuccess: (updatedReport, { id }) => {
        // Update the specific report in cache
        cache.update(queryKeys.report(id), updatedReport);

        // Update the report in the reports list
        cache.updateInList(queryKeys.reports(), id, updatedReport);

        // Invalidate moderator stats to update counts
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
      onSuccess: (_, id) => {
        // Remove from cache
        cache.removeFromList(queryKeys.reports(), id);
        // Invalidate moderator stats to update counts
        cache.invalidate(queryKeys.moderatorStats());
      },
    },
  });
}
