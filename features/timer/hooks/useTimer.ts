import { useCallback, useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { subscribeToRoomTimer, unsubscribeFromRoomTimer } from "@/lib/pusher";
import { useApiQuery } from "@/lib/api/hooks/use-api-query";
import { useApiMutation } from "@/lib/api/hooks/use-api-mutation";
import { useCacheUtils } from "@/lib/api/hooks/use-cache-utils";
import { TimerService } from "../services/timer.service";
import { TimerData, UsePomodoroTimerReturn } from "../types";
import { queryKeys } from "@/lib/query/keys";

interface UseTimerProps {
  roomId: string;
  roomCreatorId?: string;
}

export function useTimer({
  roomId,
  roomCreatorId,
}: UseTimerProps): UsePomodoroTimerReturn {
  const { user } = useAuth();
  const { update, invalidate } = useCacheUtils();

  // Check if user can control timer (Moderator/Admin or room owner)
  const canControl = Boolean(
    user?.role === "MODERATOR" ||
      user?.role === "ADMIN" ||
      (roomCreatorId && user?.id === roomCreatorId),
  );

  // Query for timer state
  const { data: timer, error: queryError } = useApiQuery({
    queryKey: queryKeys.timer(roomId),
    queryFn: () => TimerService.getTimer(roomId),
    options: {
      refetchInterval: 5000, // Refetch every 5 seconds as fallback
      refetchIntervalInBackground: false,
    },
  });

  // Start timer mutation
  const startMutation = useApiMutation({
    mutationFn: (_: void) => TimerService.startTimer(roomId),
    options: {
      onSuccess: (data) => {
        // Update cache with new timer state
        update(queryKeys.timer(roomId), data);

        // Invalidate user dashboard cache to update session stats
        invalidate(queryKeys.userDashboard());
        invalidate(queryKeys.userDashboardStats());
        invalidate(queryKeys.userSessions("current"));
        invalidate(queryKeys.userStudyTime());
        invalidate(queryKeys.userSessionTypes());
      },
    },
    successMessage: "Timer started successfully!",
  });

  // Pause timer mutation
  const pauseMutation = useApiMutation({
    mutationFn: (_: void) => TimerService.pauseTimer(roomId),
    options: {
      onSuccess: (data) => {
        if (data) {
          // Update cache with paused timer state
          update(queryKeys.timer(roomId), data);

          // Invalidate user dashboard cache to update session stats
          invalidate(queryKeys.userDashboard());
          invalidate(queryKeys.userDashboardStats());
          invalidate(queryKeys.userSessions("current"));
          invalidate(queryKeys.userStudyTime());
          invalidate(queryKeys.userSessionTypes());
        }
      },
    },
    successMessage: "Timer paused successfully!",
  });

  // Reset timer mutation
  const resetMutation = useApiMutation({
    mutationFn: (_: void) => TimerService.resetTimer(roomId),
    options: {
      onSuccess: (data) => {
        // Update cache with reset timer state
        update(queryKeys.timer(roomId), data);

        // Invalidate user dashboard cache to update session stats
        invalidate(queryKeys.userDashboard());
        invalidate(queryKeys.userDashboardStats());
        invalidate(queryKeys.userSessions("current"));
        invalidate(queryKeys.userStudyTime());
        invalidate(queryKeys.userSessionTypes());
      },
    },
    successMessage: "Timer reset successfully!",
  });

  // Start timer action
  const startTimer = async () => {
    if (!canControl) return;
    await startMutation.mutateAsync();
  };

  // Pause timer action
  const pauseTimer = async () => {
    if (!canControl) return;
    await pauseMutation.mutateAsync();
  };

  // Reset timer action
  const resetTimer = async () => {
    if (!canControl) return;
    await resetMutation.mutateAsync();
  };

  // Subscribe to Pusher events for real-time updates
  const subscribeToTimerUpdates = useCallback(() => {
    if (!roomId) return;

    const channel = subscribeToRoomTimer(roomId);

    channel.bind(
      "update",
      (data: { timer: TimerData; action: string; timestamp: string }) => {
        console.log("Timer update (real-time):", data);
        // Update cache with real-time data
        update(queryKeys.timer(roomId), data.timer);
      },
    );

    return () => {
      unsubscribeFromRoomTimer(roomId);
    };
  }, [roomId, update]);

  // Set up real-time subscription
  useEffect(() => {
    const unsubscribe = subscribeToTimerUpdates();
    return unsubscribe;
  }, [subscribeToTimerUpdates]);

  return {
    timer: timer || null,
    loading: {
      start: startMutation.isPending,
      pause: pauseMutation.isPending,
      reset: resetMutation.isPending,
    },
    error:
      queryError?.message ||
      startMutation.error?.message ||
      pauseMutation.error?.message ||
      resetMutation.error?.message ||
      null,
    canControl,
    actions: {
      startTimer,
      pauseTimer,
      resetTimer,
    },
  };
}
