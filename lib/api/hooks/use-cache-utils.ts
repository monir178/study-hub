import { useQueryClient } from "@tanstack/react-query";

/**
 * Cache utilities hook for common cache operations
 */
export function useCacheUtils() {
  const queryClient = useQueryClient();

  return {
    // Invalidate queries to refetch data
    invalidate: (queryKey: readonly string[]) => {
      queryClient.invalidateQueries({ queryKey: [...queryKey] });
    },

    // Remove queries from cache
    remove: (queryKey: readonly string[]) => {
      queryClient.removeQueries({ queryKey: [...queryKey] });
    },

    // Update cache with new data
    update: <T>(queryKey: readonly string[], data: T) => {
      queryClient.setQueryData([...queryKey], data);
    },

    // Update list by adding item
    appendToList: <T>(queryKey: readonly string[], newItem: T) => {
      queryClient.setQueryData([...queryKey], (oldData: T[] | undefined) => {
        return oldData ? [...oldData, newItem] : [newItem];
      });
    },

    // Update list by prepending item
    prependToList: <T>(queryKey: readonly string[], newItem: T) => {
      queryClient.setQueryData([...queryKey], (oldData: T[] | undefined) => {
        return oldData ? [newItem, ...oldData] : [newItem];
      });
    },

    // Update item in list
    updateInList: <T extends { id: string }>(
      queryKey: readonly string[],
      itemId: string,
      updatedItem: T,
    ) => {
      queryClient.setQueryData([...queryKey], (oldData: T[] | undefined) => {
        return oldData?.map((item) =>
          item.id === itemId ? updatedItem : item,
        );
      });
    },

    // Remove item from list
    removeFromList: <T extends { id: string }>(
      queryKey: readonly string[],
      itemId: string,
    ) => {
      queryClient.setQueryData([...queryKey], (oldData: T[] | undefined) => {
        return oldData?.filter((item) => item.id !== itemId);
      });
    },

    // Prefetch data
    prefetch: <T>(
      queryKey: readonly string[],
      queryFn: () => Promise<T>,
      staleTime?: number,
    ) => {
      queryClient.prefetchQuery({
        queryKey: [...queryKey],
        queryFn,
        staleTime: staleTime || 5 * 60 * 1000, // 5 minutes default
      });
    },

    // Get cached data without triggering a request
    getCached: <T>(queryKey: readonly string[]): T | undefined => {
      return queryClient.getQueryData<T>([...queryKey]);
    },
  };
}
