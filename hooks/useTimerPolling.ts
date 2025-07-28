"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/hooks/useAuth";

export interface TimerState {
  roomId: string;
  phase: "focus" | "shortBreak" | "longBreak";
  remainingTime: number;
  session: number;
  totalSessions: number;
  isActive: boolean;
  isPaused: boolean;
}

export interface TimerActions {
  startTimer: () => Promise<void>;
  pauseTimer: () => Promise<void>;
  stopTimer: () => Promise<void>;
  resetTimer: () => Promise<void>;
}

export interface TimerHookReturn {
  timer: TimerState | null;
  actions: TimerActions;
  loading: boolean;
  error: string | null;
  canControl: boolean;
  lastAction: {
    type: string;
    by: string;
  } | null;
}

interface UseTimerPollingOptions {
  roomId: string;
  roomCreatorId?: string;
}

export function useTimerPolling(
  options: UseTimerPollingOptions | string,
): TimerHookReturn {
  // Handle both old string format and new options format for backward compatibility
  const { roomId, roomCreatorId } =
    typeof options === "string"
      ? { roomId: options, roomCreatorId: undefined }
      : options;

  const { user } = useAuth();
  const [timer, setTimer] = useState<TimerState | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastAction, setLastAction] = useState<{
    type: string;
    by: string;
  } | null>(null);

  // Check if user can control timer (Moderator/Admin or room owner)
  const canControl =
    user?.role === "MODERATOR" ||
    user?.role === "ADMIN" ||
    (roomCreatorId && user?.id === roomCreatorId);

  // Fetch timer state
  const fetchTimerState = useCallback(async () => {
    try {
      const response = await fetch(`/api/timer/${roomId}`);
      const data = await response.json();

      if (data.success && data.timer) {
        setTimer(data.timer);
      }
    } catch (err) {
      console.error("Error fetching timer state:", err);
    }
  }, [roomId]);

  // Control timer
  const controlTimer = useCallback(
    async (action: string) => {
      if (!user?.id || !canControl) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/timer/${roomId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action,
            userId: user.id,
          }),
        });

        const data = await response.json();

        if (data.success) {
          setTimer(data.timer);
          setLastAction({ type: action, by: data.userId });
        } else {
          setError(data.error || "Failed to control timer");
        }
      } catch (err) {
        setError("Network error");
        console.error("Error controlling timer:", err);
      } finally {
        setLoading(false);
      }
    },
    [roomId, user?.id, canControl],
  );

  // Timer actions
  const startTimer = useCallback(() => controlTimer("start"), [controlTimer]);
  const pauseTimer = useCallback(() => controlTimer("pause"), [controlTimer]);
  const stopTimer = useCallback(() => controlTimer("stop"), [controlTimer]);
  const resetTimer = useCallback(() => controlTimer("reset"), [controlTimer]);

  // Poll for timer updates
  useEffect(() => {
    if (!roomId) return;

    // Initial fetch
    fetchTimerState();

    // Poll every second for updates
    const interval = setInterval(fetchTimerState, 1000);

    return () => clearInterval(interval);
  }, [roomId, fetchTimerState]);

  // Request notification permission
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Handle timer completion notifications
  useEffect(() => {
    if (timer && timer.remainingTime === 0 && timer.isActive) {
      // Show notification
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification(`${timer.phase} completed!`, {
          body: "Time for the next phase",
          icon: "/favicon.ico",
        });
      }
    }
  }, [timer]);

  return {
    timer,
    actions: {
      startTimer,
      pauseTimer,
      stopTimer,
      resetTimer,
    },
    loading,
    error,
    canControl,
    lastAction,
  };
}
