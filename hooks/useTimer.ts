"use client";

import { useState, useEffect, useCallback } from "react";
import { useRoomSocket } from "./useSocket";

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
  startTimer: () => void;
  pauseTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
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

export function useTimer(roomId: string): TimerHookReturn {
  const { socket, userId, userRole } = useRoomSocket(roomId);
  const [timer, setTimer] = useState<TimerState | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastAction, setLastAction] = useState<{
    type: string;
    by: string;
  } | null>(null);

  // Check if user can control timer (Moderator/Admin only)
  const canControl = userRole === "MODERATOR" || userRole === "ADMIN";

  // Timer actions
  const startTimer = useCallback(() => {
    if (!socket || !userId || !canControl) return;
    setLoading(true);
    setError(null);
    socket.emit("timer:start", { roomId, userId });
  }, [socket, userId, roomId, canControl]);

  const pauseTimer = useCallback(() => {
    if (!socket || !userId || !canControl) return;
    setLoading(true);
    setError(null);
    socket.emit("timer:pause", { roomId, userId });
  }, [socket, userId, roomId, canControl]);

  const stopTimer = useCallback(() => {
    if (!socket || !userId || !canControl) return;
    setLoading(true);
    setError(null);
    socket.emit("timer:stop", { roomId, userId });
  }, [socket, userId, roomId, canControl]);

  const resetTimer = useCallback(() => {
    if (!socket || !userId || !canControl) return;
    setLoading(true);
    setError(null);
    socket.emit("timer:reset", { roomId, userId });
  }, [socket, userId, roomId, canControl]);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    const handleTimerSync = (data: TimerState) => {
      setTimer({
        roomId: data.roomId,
        phase: data.phase,
        remainingTime: data.remainingTime,
        session: data.session,
        totalSessions: data.totalSessions,
        isActive: data.isActive,
        isPaused: data.isPaused,
      });
      setLoading(false);
    };

    const handleTimerTick = (data: TimerState) => {
      setTimer(data);
    };

    const handleTimerStarted = (data: TimerState & { startedBy: string }) => {
      setTimer({
        roomId: data.roomId,
        phase: data.phase,
        remainingTime: data.remainingTime,
        session: data.session,
        totalSessions: data.totalSessions,
        isActive: data.isActive,
        isPaused: data.isPaused,
      });
      setLastAction({ type: "started", by: data.startedBy });
      setLoading(false);
    };

    const handleTimerPaused = (data: TimerState & { pausedBy: string }) => {
      setTimer({
        roomId: data.roomId,
        phase: data.phase,
        remainingTime: data.remainingTime,
        session: data.session,
        totalSessions: data.totalSessions,
        isActive: data.isActive,
        isPaused: data.isPaused,
      });
      setLastAction({ type: "paused", by: data.pausedBy });
      setLoading(false);
    };

    const handleTimerStopped = (data: TimerState & { stoppedBy: string }) => {
      setTimer({
        roomId: data.roomId,
        phase: data.phase,
        remainingTime: data.remainingTime,
        session: data.session,
        totalSessions: data.totalSessions,
        isActive: data.isActive,
        isPaused: data.isPaused,
      });
      setLastAction({ type: "stopped", by: data.stoppedBy });
      setLoading(false);
    };

    const handleTimerReset = (data: TimerState & { resetBy: string }) => {
      setTimer({
        roomId: data.roomId,
        phase: data.phase,
        remainingTime: data.remainingTime,
        session: data.session,
        totalSessions: data.totalSessions,
        isActive: data.isActive,
        isPaused: data.isPaused,
      });
      setLastAction({ type: "reset", by: data.resetBy });
      setLoading(false);
    };

    const handleTimerComplete = (data: {
      completedPhase: string;
      nextPhase: string;
    }) => {
      // Show notification or play sound
      console.log("Timer phase completed:", data);

      // You can add notification logic here
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification(`${data.completedPhase} completed!`, {
          body: `Time for ${data.nextPhase}`,
          icon: "/favicon.ico",
        });
      }
    };

    const handleTimerError = (data: { message: string }) => {
      setError(data.message);
      setLoading(false);
    };

    // Register event listeners
    socket.on("timer:sync", handleTimerSync);
    socket.on("timer:tick", handleTimerTick);
    socket.on("timer:started", handleTimerStarted);
    socket.on("timer:paused", handleTimerPaused);
    socket.on("timer:stopped", handleTimerStopped);
    socket.on("timer:reset", handleTimerReset);
    socket.on("timer:complete", handleTimerComplete);
    socket.on("timer:error", handleTimerError);

    return () => {
      // Cleanup event listeners
      socket.off("timer:sync", handleTimerSync);
      socket.off("timer:tick", handleTimerTick);
      socket.off("timer:started", handleTimerStarted);
      socket.off("timer:paused", handleTimerPaused);
      socket.off("timer:stopped", handleTimerStopped);
      socket.off("timer:reset", handleTimerReset);
      socket.off("timer:complete", handleTimerComplete);
      socket.off("timer:error", handleTimerError);
    };
  }, [socket]);

  // Request notification permission on mount
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

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
