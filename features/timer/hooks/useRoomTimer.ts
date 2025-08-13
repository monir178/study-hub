// Frontend timer hook with useState and real-time synchronization
import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import {
  TimerState,
  TimerPermissions,
  TimerActions,
  createInitialTimerState,
  TimerEvent,
  TimerStartEvent,
  TimerPauseEvent,
  TimerResetEvent,
  TimerResumeEvent,
  TIMER_CONFIG,
  getPhaseDuration,
  getNextPhase,
  UsePomodoroTimerReturn,
} from "../types";
import { TimerApiService } from "../services/timer-api.service";
import {
  subscribeToTimerEvents,
  checkTimerPermissions,
} from "../services/timer-pusher.service";

interface UseRoomTimerProps {
  roomId: string;
  roomCreatorId: string;
}

export function useRoomTimer({
  roomId,
  roomCreatorId,
}: UseRoomTimerProps): UsePomodoroTimerReturn {
  const { user } = useAuth();

  // Timer state
  const [state, setState] = useState<TimerState>(() =>
    createInitialTimerState(roomId),
  );

  // Loading states for API calls
  const [loading, setLoading] = useState({
    start: false,
    pause: false,
    reset: false,
  });

  // Error handling
  const [error, setError] = useState<string | null>(null);

  // Refs for countdown management
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const initialRemainingTimeRef = useRef<number>(0); // Store initial remaining time

  // Clear any errors after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Check permissions
  const permissions: TimerPermissions = checkTimerPermissions(
    user,
    roomCreatorId,
  );

  // Countdown logic - synchronized with server timestamps for accuracy
  const startCountdown = useCallback(() => {
    console.log("🔄 startCountdown called");
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }

    countdownIntervalRef.current = setInterval(() => {
      setState((prevState) => {
        if (
          !prevState.isRunning ||
          prevState.isPaused ||
          !prevState.startedAt
        ) {
          console.log(
            "⏸️ Countdown stopped - not running or missing startedAt:",
            {
              isRunning: prevState.isRunning,
              isPaused: prevState.isPaused,
              hasStartedAt: !!prevState.startedAt,
            },
          );
          return prevState;
        }

        // Calculate actual elapsed time from server timestamp
        const now = new Date();
        const elapsedMs = now.getTime() - prevState.startedAt.getTime();
        const elapsedSeconds = Math.floor(elapsedMs / 1000);

        // Calculate remaining time based on initial remaining time when started/resumed
        const newRemainingTime = Math.max(
          0,
          initialRemainingTimeRef.current - elapsedSeconds,
        );

        console.log("⏰ Countdown tick:", {
          elapsedSeconds,
          initialRemaining: initialRemainingTimeRef.current,
          newRemainingTime,
          totalDuration: prevState.totalDuration,
        });

        // Timer completed
        if (newRemainingTime === 0) {
          // Stop countdown
          if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
            countdownIntervalRef.current = null;
          }

          // Calculate next phase and session
          const nextPhase = getNextPhase(
            prevState.phase,
            prevState.sessionNumber,
          );
          const nextSessionNumber =
            prevState.phase === "focus"
              ? prevState.sessionNumber + 1
              : prevState.sessionNumber;

          // Auto-transition to next phase
          return {
            ...prevState,
            isRunning: false,
            isPaused: false,
            phase: nextPhase,
            sessionNumber: nextSessionNumber,
            remainingTime: getPhaseDuration(nextPhase),
            totalDuration: getPhaseDuration(nextPhase),
            startedAt: undefined,
            pausedAt: undefined,
          };
        }

        return {
          ...prevState,
          remainingTime: newRemainingTime,
        };
      });
    }, 100); // Update every 100ms for real-time accuracy
  }, []);

  // Stop countdown
  const stopCountdown = useCallback(() => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
  }, []);

  // Handle Pusher timer events
  const handleTimerEvent = useCallback(
    (event: TimerEvent) => {
      console.log("📡 Received timer event:", event.type, event);

      switch (event.type) {
        case "timer-start": {
          const startEvent = event as TimerStartEvent;
          console.log("🚀 Processing timer-start event:", startEvent);

          // Store initial remaining time for countdown calculation
          initialRemainingTimeRef.current = startEvent.duration;

          setState((prevState) => {
            // For resume, keep the original total duration, use event duration as remaining time
            const isResume =
              prevState.isPaused &&
              prevState.sessionId === startEvent.sessionId;
            const totalDuration = isResume
              ? prevState.totalDuration
              : startEvent.duration;

            console.log("📊 Timer state update:", {
              isResume,
              remainingTime: startEvent.duration,
              totalDuration,
              startedAt: startEvent.timestamp,
            });

            return {
              ...prevState,
              isRunning: true,
              isPaused: false,
              phase: startEvent.phase,
              sessionNumber: startEvent.sessionNumber,
              remainingTime: startEvent.duration,
              totalDuration: totalDuration,
              sessionId: startEvent.sessionId,
              startedAt: new Date(startEvent.timestamp),
              pausedAt: undefined,
              controlledBy: startEvent.userId,
            };
          });
          console.log("⏱️ Starting countdown...");
          startCountdown();
          break;
        }

        case "timer-pause": {
          const pauseEvent = event as TimerPauseEvent;
          setState((prevState) => ({
            ...prevState,
            isRunning: false,
            isPaused: true,
            remainingTime: pauseEvent.remainingTime,
            pausedAt: new Date(pauseEvent.timestamp),
            controlledBy: pauseEvent.userId,
          }));
          stopCountdown();
          break;
        }

        case "timer-resume": {
          const resumeEvent = event as TimerResumeEvent;
          console.log("🔄 Processing timer-resume event:", resumeEvent);

          // Store initial remaining time for countdown calculation
          initialRemainingTimeRef.current = resumeEvent.remainingTime;

          setState((prevState) => ({
            ...prevState,
            isRunning: true,
            isPaused: false,
            remainingTime: resumeEvent.remainingTime,
            startedAt: new Date(resumeEvent.timestamp),
            pausedAt: undefined,
            controlledBy: resumeEvent.userId,
          }));
          console.log("⏱️ Starting countdown from resume...");
          startCountdown();
          break;
        }

        case "timer-reset": {
          const resetEvent = event as TimerResetEvent;
          setState((prevState) => ({
            ...prevState,
            isRunning: false,
            isPaused: false,
            phase: "focus",
            sessionNumber: 1,
            remainingTime: TIMER_CONFIG.focus,
            totalDuration: TIMER_CONFIG.focus,
            sessionId: undefined,
            startedAt: undefined,
            pausedAt: undefined,
            controlledBy: resetEvent.userId,
          }));
          stopCountdown();
          break;
        }

        case "timer-complete": {
          // Handle phase completion if needed
          console.log("⏰ Timer phase completed");
          break;
        }
      }
    },
    [startCountdown, stopCountdown],
  );

  // Subscribe to Pusher events
  useEffect(() => {
    console.log("📡 Subscribing to Pusher events for room:", roomId);
    const unsubscribe = subscribeToTimerEvents(roomId, handleTimerEvent);
    return () => {
      console.log("📡 Unsubscribing from Pusher events for room:", roomId);
      unsubscribe();
      stopCountdown();
    };
  }, [roomId, handleTimerEvent, stopCountdown]);

  // Initialize timer state from server
  useEffect(() => {
    const initializeTimer = async () => {
      try {
        const currentSession = await TimerApiService.getCurrentSession(roomId);

        if (currentSession) {
          const startedAt = new Date(currentSession.startedAt);
          const now = new Date();

          // Calculate actual remaining time based on when it was started/paused
          let actualRemainingTime = currentSession.remainingTime;

          if (currentSession.status === "ACTIVE") {
            // Timer is running, calculate remaining time
            const elapsedSeconds = Math.floor(
              (now.getTime() - startedAt.getTime()) / 1000,
            );
            actualRemainingTime = Math.max(
              0,
              currentSession.remainingTime - elapsedSeconds,
            );

            // Set initial remaining time for countdown
            initialRemainingTimeRef.current = currentSession.remainingTime;
          }

          setState((prevState) => ({
            ...prevState,
            isRunning: currentSession.status === "ACTIVE",
            isPaused: currentSession.status === "PAUSED",
            phase: currentSession.phase as "focus" | "break" | "long_break",
            sessionNumber: currentSession.sessionNumber,
            remainingTime: actualRemainingTime,
            totalDuration: getPhaseDuration(
              currentSession.phase as "focus" | "break" | "long_break",
            ),
            sessionId: currentSession.sessionId,
            startedAt: startedAt,
            pausedAt: currentSession.status === "PAUSED" ? now : undefined,
            controlledBy: undefined, // Will be set by timer events
          }));

          // Start countdown if timer is active
          if (currentSession.status === "ACTIVE" && actualRemainingTime > 0) {
            startCountdown();
          }
        }
      } catch (error) {
        console.error("Failed to initialize timer:", error);
        setError("Failed to load timer state");
      }
    };

    initializeTimer();
  }, [roomId, startCountdown]);

  // Timer actions
  const actions: TimerActions = {
    start: async () => {
      if (!permissions.canControl) {
        setError(permissions.reason || "Cannot control timer");
        return;
      }

      console.log("🎬 Start button clicked - current state:", {
        isPaused: state.isPaused,
        sessionId: state.sessionId,
        remainingTime: state.remainingTime,
        isRunning: state.isRunning,
      });

      setLoading((prev) => ({ ...prev, start: true }));
      setError(null);

      try {
        // Check if we're resuming a paused timer or starting fresh
        if (state.isPaused && state.sessionId && state.remainingTime > 0) {
          console.log("🔄 Resuming existing session:", {
            sessionId: state.sessionId,
            remainingTime: state.remainingTime,
          });
          // Resume existing session
          await TimerApiService.resumeTimer(
            roomId,
            state.sessionId,
            state.remainingTime,
          );
        } else {
          console.log("🆕 Starting new session");
          // Start new session
          await TimerApiService.startTimer(
            roomId,
            state.phase,
            state.sessionNumber,
          );
        }
        // State will be updated via Pusher event
      } catch (error) {
        console.error("Failed to start timer:", error);
        setError("Failed to start timer");
      } finally {
        setLoading((prev) => ({ ...prev, start: false }));
      }
    },

    pause: async () => {
      if (!permissions.canControl || !state.sessionId) {
        setError(permissions.reason || "Cannot control timer");
        return;
      }

      setLoading((prev) => ({ ...prev, pause: true }));
      setError(null);

      try {
        await TimerApiService.pauseTimer(
          roomId,
          state.sessionId,
          state.remainingTime,
          state.phase,
          state.sessionNumber,
        );
        // State will be updated via Pusher event
      } catch (error) {
        console.error("Failed to pause timer:", error);
        setError("Failed to pause timer");
      } finally {
        setLoading((prev) => ({ ...prev, pause: false }));
      }
    },

    reset: async () => {
      if (!permissions.canControl) {
        setError(permissions.reason || "Cannot control timer");
        return;
      }

      setLoading((prev) => ({ ...prev, reset: true }));
      setError(null);

      try {
        await TimerApiService.resetTimer(roomId, state.sessionId);
        // State will be updated via Pusher event
      } catch (error) {
        console.error("Failed to reset timer:", error);
        setError("Failed to reset timer");
      } finally {
        setLoading((prev) => ({ ...prev, reset: false }));
      }
    },

    // Legacy method names for existing components
    startTimer: async () => actions.start(),
    pauseTimer: async () => actions.pause(),
    resetTimer: async () => actions.reset(),
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCountdown();
    };
  }, [stopCountdown]);

  return {
    state,
    permissions,
    actions,
    loading,
    error,
  };
}
