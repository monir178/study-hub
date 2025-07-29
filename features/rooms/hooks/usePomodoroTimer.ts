import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { subscribeToRoomTimer, unsubscribeFromRoomTimer } from "@/lib/pusher";
import { TimerData } from "@/lib/timer-store";

interface UsePomodoroTimerProps {
  roomId: string;
  roomCreatorId: string;
}

interface UsePomodoroTimerReturn {
  timer: TimerData | null;
  loading: {
    start: boolean;
    pause: boolean;
    reset: boolean;
  };
  error: string | null;
  canControl: boolean;
  actions: {
    startTimer: () => Promise<void>;
    pauseTimer: () => Promise<void>;
    resetTimer: () => Promise<void>;
  };
}

export function usePomodoroTimer({
  roomId,
  roomCreatorId,
}: UsePomodoroTimerProps): UsePomodoroTimerReturn {
  const { user } = useAuth();
  const [timer, setTimer] = useState<TimerData | null>(null);
  const [loading, setLoading] = useState({
    start: false,
    pause: false,
    reset: false,
  });
  const [error, setError] = useState<string | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const isOptimisticRef = useRef<boolean>(false);

  // Check if user can control timer
  const canControl =
    user?.role === "ADMIN" ||
    user?.role === "MODERATOR" ||
    user?.id === roomCreatorId;

  // Fetch initial timer state
  const fetchTimerState = useCallback(async () => {
    try {
      const response = await fetch(`/api/rooms/${roomId}/timer`);
      if (response.ok) {
        const data = await response.json();
        setTimer(data.timer);
      }
    } catch (err) {
      console.error("Error fetching timer state:", err);
    }
  }, [roomId]);

  // Optimistic start timer
  const startTimer = useCallback(async () => {
    if (!canControl || !timer) return;

    // Optimistic update - immediate UI response
    const optimisticTimer: TimerData = {
      ...timer,
      isRunning: true,
      controlledBy: user?.id || "",
      updatedAt: new Date(),
    };
    setTimer(optimisticTimer);
    setError(null);
    isOptimisticRef.current = true;

    // Show loading only for start button
    setLoading((prev) => ({ ...prev, start: true }));

    try {
      const response = await fetch(`/api/rooms/${roomId}/timer/start`, {
        method: "POST",
      });

      const data = await response.json();

      if (!data.success) {
        // Revert optimistic update on error
        setTimer(timer);
        setError(data.error || "Failed to start timer");
      }
    } catch (err) {
      console.error("Error starting timer:", err);
      // Revert optimistic update on error
      setTimer(timer);
      setError("Failed to start timer");
    } finally {
      setLoading((prev) => ({ ...prev, start: false }));
      // Reset optimistic flag after a short delay
      setTimeout(() => {
        isOptimisticRef.current = false;
      }, 100);
    }
  }, [canControl, timer, roomId, user?.id]);

  // Optimistic pause timer
  const pauseTimer = useCallback(async () => {
    if (!canControl || !timer) return;

    // Optimistic update - immediate UI response
    const optimisticTimer: TimerData = {
      ...timer,
      isRunning: false,
      controlledBy: user?.id || "",
      updatedAt: new Date(),
    };
    setTimer(optimisticTimer);
    setError(null);
    isOptimisticRef.current = true;

    // Show loading only for pause button
    setLoading((prev) => ({ ...prev, pause: true }));

    try {
      const response = await fetch(`/api/rooms/${roomId}/timer/pause`, {
        method: "POST",
      });

      const data = await response.json();

      if (!data.success) {
        // Revert optimistic update on error
        setTimer(timer);
        setError(data.error || "Failed to pause timer");
      }
    } catch (err) {
      console.error("Error pausing timer:", err);
      // Revert optimistic update on error
      setTimer(timer);
      setError("Failed to pause timer");
    } finally {
      setLoading((prev) => ({ ...prev, pause: false }));
      // Reset optimistic flag after a short delay
      setTimeout(() => {
        isOptimisticRef.current = false;
      }, 100);
    }
  }, [canControl, timer, roomId, user?.id]);

  // Optimistic reset timer
  const resetTimer = useCallback(async () => {
    if (!canControl || !timer) return;

    // Optimistic update - immediate UI response
    const optimisticTimer: TimerData = {
      ...timer,
      isRunning: false,
      remaining:
        timer.phase === "focus"
          ? 25 * 60
          : timer.phase === "break"
            ? 5 * 60
            : 15 * 60,
      controlledBy: user?.id || "",
      updatedAt: new Date(),
    };
    setTimer(optimisticTimer);
    setError(null);
    isOptimisticRef.current = true;

    // Show loading only for reset button
    setLoading((prev) => ({ ...prev, reset: true }));

    try {
      const response = await fetch(`/api/rooms/${roomId}/timer/reset`, {
        method: "POST",
      });

      const data = await response.json();

      if (!data.success) {
        // Revert optimistic update on error
        setTimer(timer);
        setError(data.error || "Failed to reset timer");
      }
    } catch (err) {
      console.error("Error resetting timer:", err);
      // Revert optimistic update on error
      setTimer(timer);
      setError("Failed to reset timer");
    } finally {
      setLoading((prev) => ({ ...prev, reset: false }));
      // Reset optimistic flag after a short delay
      setTimeout(() => {
        isOptimisticRef.current = false;
      }, 100);
    }
  }, [canControl, timer, roomId, user?.id]);

  // Client-side countdown
  useEffect(() => {
    if (timer?.isRunning && timer.remaining > 0) {
      countdownRef.current = setInterval(() => {
        setTimer((prev) => {
          if (!prev || !prev.isRunning || prev.remaining <= 0) {
            return prev;
          }
          return {
            ...prev,
            remaining: prev.remaining - 1,
          };
        });
      }, 1000);
    } else {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
      }
    }

    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, [timer?.isRunning, timer?.remaining]);

  // Subscribe to Pusher events for real-time updates
  useEffect(() => {
    if (!roomId) return;

    // Fetch initial state
    fetchTimerState();

    // Subscribe to timer updates
    const channel = subscribeToRoomTimer(roomId);

    channel.bind("update", (data: { timer: TimerData; action: string }) => {
      console.log("Timer update (real-time):", data);

      // Only update if we're not in optimistic state
      if (!isOptimisticRef.current) {
        setTimer(data.timer);
      }
      // Clear all loading states
      setLoading({ start: false, pause: false, reset: false });
    });

    return () => {
      unsubscribeFromRoomTimer(roomId);
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, [roomId, fetchTimerState]);

  return {
    timer,
    loading,
    error,
    canControl,
    actions: {
      startTimer,
      pauseTimer,
      resetTimer,
    },
  };
}
