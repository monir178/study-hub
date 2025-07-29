import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { subscribeToRoomTimer, unsubscribeFromRoomTimer } from "@/lib/pusher";
import { TimerData } from "@/lib/timer-store";

interface UsePomodoroTimerProps {
  roomId: string;
  roomCreatorId?: string;
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

  // Check if user can control timer (Moderator/Admin or room owner)
  const canControl = Boolean(
    user?.role === "MODERATOR" ||
      user?.role === "ADMIN" ||
      (roomCreatorId && user?.id === roomCreatorId),
  );

  // Fetch initial timer state
  const fetchTimerState = useCallback(async () => {
    try {
      const response = await fetch(`/api/rooms/${roomId}/timer`);
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.timer) {
          setTimer(data.timer);
        }
      }
    } catch (err) {
      console.error("Error fetching timer state:", err);
    }
  }, [roomId]);

  // Start timer
  const startTimer = useCallback(async () => {
    if (!canControl) return;

    setLoading((prev) => ({ ...prev, start: true }));
    setError(null);

    try {
      const response = await fetch(`/api/rooms/${roomId}/timer/start`, {
        method: "POST",
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || "Failed to start timer");
      }
    } catch (err) {
      console.error("Error starting timer:", err);
      setError("Failed to start timer");
    } finally {
      setLoading((prev) => ({ ...prev, start: false }));
    }
  }, [canControl, roomId]);

  // Pause timer
  const pauseTimer = useCallback(async () => {
    if (!canControl) return;

    setLoading((prev) => ({ ...prev, pause: true }));
    setError(null);

    try {
      const response = await fetch(`/api/rooms/${roomId}/timer/pause`, {
        method: "POST",
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || "Failed to pause timer");
      }
    } catch (err) {
      console.error("Error pausing timer:", err);
      setError("Failed to pause timer");
    } finally {
      setLoading((prev) => ({ ...prev, pause: false }));
    }
  }, [canControl, roomId]);

  // Reset timer
  const resetTimer = useCallback(async () => {
    if (!canControl) return;

    setLoading((prev) => ({ ...prev, reset: true }));
    setError(null);

    try {
      const response = await fetch(`/api/rooms/${roomId}/timer/reset`, {
        method: "POST",
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || "Failed to reset timer");
      }
    } catch (err) {
      console.error("Error resetting timer:", err);
      setError("Failed to reset timer");
    } finally {
      setLoading((prev) => ({ ...prev, reset: false }));
    }
  }, [canControl, roomId]);

  // Subscribe to Pusher events for real-time updates
  useEffect(() => {
    if (!roomId) return;

    // Fetch initial state
    fetchTimerState();

    // Subscribe to timer updates
    const channel = subscribeToRoomTimer(roomId);

    channel.bind(
      "update",
      (data: { timer: TimerData; action: string; timestamp: string }) => {
        console.log("Timer update (real-time):", data);
        setTimer(data.timer);
        setError(null);
      },
    );

    return () => {
      unsubscribeFromRoomTimer(roomId);
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
