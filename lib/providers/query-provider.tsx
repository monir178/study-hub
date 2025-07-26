"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

// Default query client configuration
const queryClientConfig = {
  defaultOptions: {
    queries: {
      // Stale time: how long until data is considered stale
      staleTime: 5 * 60 * 1000, // 5 minutes
      // Cache time: how long to keep unused data in cache
      gcTime: 10 * 60 * 1000, // 10 minutes (was cacheTime in v4)
      // Retry failed requests
      retry: (failureCount: number, error: unknown) => {
        // Don't retry on 4xx errors (client errors)
        const errorResponse = error as { response?: { status?: number } };
        if (
          errorResponse?.response?.status &&
          errorResponse.response.status >= 400 &&
          errorResponse.response.status < 500
        ) {
          return false;
        }
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },
      // Retry delay with exponential backoff
      retryDelay: (attemptIndex: number) =>
        Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch on window focus (useful for real-time data)
      refetchOnWindowFocus: true,
      // Refetch when coming back online
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry mutations once
      retry: 1,
    },
  },
};

export function QueryProvider({ children }: { children: React.ReactNode }) {
  // Create query client instance (stable across re-renders)
  const [queryClient] = useState(() => new QueryClient(queryClientConfig));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Show React Query DevTools in development */}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
