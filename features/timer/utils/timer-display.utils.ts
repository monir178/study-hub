// Timer utility functions for formatting and display
import { TimerState } from "../types/timer-state";
import { TimerData } from "../types"; // Legacy type
import { TIMER_CONFIG } from "../types/timer-events";

/**
 * Convert legacy TimerData to TimerState for compatibility
 */
function convertTimerDataToState(timerData: TimerData): TimerState {
  const totalDuration =
    TIMER_CONFIG[timerData.phase as keyof typeof TIMER_CONFIG] ||
    TIMER_CONFIG.focus;

  return {
    roomId: timerData.roomId,
    phase: timerData.phase as "focus" | "break" | "long_break",
    remainingTime: timerData.remaining,
    totalDuration,
    sessionNumber: timerData.session || 1,
    isRunning: timerData.isRunning,
    isPaused: timerData.isPaused,
    sessionId: (timerData.sessionId as string) || undefined,
    startedAt: timerData.updatedAt,
    controlledBy: timerData.controlledBy,
  };
}

/**
 * Format seconds to MM:SS format
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

/**
 * Calculate progress percentage (0-100)
 */
export function getTimerProgress(state: TimerState): number {
  if (state.totalDuration === 0) return 0;

  const elapsed = state.totalDuration - state.remainingTime;
  const progress = (elapsed / state.totalDuration) * 100;
  return Math.max(0, Math.min(progress, 100));
}

/**
 * Get phase display label
 */
export function getPhaseLabel(phase: "focus" | "break" | "long_break"): string {
  switch (phase) {
    case "focus":
      return "Focus Time";
    case "break":
      return "Short Break";
    case "long_break":
      return "Long Break";
    default:
      return "Focus Time";
  }
}

/**
 * Get phase color for UI styling
 */
export function getPhaseColor(phase: "focus" | "break" | "long_break"): {
  background: string;
  text: string;
  border: string;
} {
  switch (phase) {
    case "focus":
      return {
        background: "bg-red-500/10",
        text: "text-red-600 dark:text-red-400",
        border: "border-red-500/20",
      };
    case "break":
      return {
        background: "bg-green-500/10",
        text: "text-green-600 dark:text-green-400",
        border: "border-green-500/20",
      };
    case "long_break":
      return {
        background: "bg-blue-500/10",
        text: "text-blue-600 dark:text-blue-400",
        border: "border-blue-500/20",
      };
    default:
      return {
        background: "bg-muted",
        text: "text-muted-foreground",
        border: "border-border",
      };
  }
}

/**
 * Check if timer is in the final minute
 */
export function isInFinalMinute(remainingTime: number): boolean {
  return remainingTime > 0 && remainingTime <= 60;
}

/**
 * Check if timer is about to complete (last 10 seconds)
 */
export function isAboutToComplete(remainingTime: number): boolean {
  return remainingTime > 0 && remainingTime <= 10;
}

/**
 * Get timer status text for UI
 */
export function getTimerStatusText(state: TimerState): string {
  if (state.isRunning) {
    return "Running";
  } else if (state.isPaused) {
    return "Paused";
  } else {
    return "Stopped";
  }
}

/**
 * Get appropriate button text based on timer state
 */
export function getTimerButtonText(state: TimerState): {
  primary: string;
  secondary: string;
} {
  if (state.isRunning) {
    return {
      primary: "Pause",
      secondary: "Reset",
    };
  } else if (state.isPaused) {
    return {
      primary: "Resume",
      secondary: "Reset",
    };
  } else {
    return {
      primary: "Start",
      secondary: "Reset",
    };
  }
}

/**
 * Calculate circular progress degrees for circular timer displays
 * Overloaded to support both TimerState and legacy TimerData
 */
export function getCircularProgress(state: TimerState): number;
export function getCircularProgress(timerData: TimerData): number;
export function getCircularProgress(input: TimerState | TimerData): number {
  let state: TimerState;

  // Check if it's TimerData (has 'remaining' property) or TimerState (has 'remainingTime')
  if ("remaining" in input) {
    // It's TimerData, convert it
    state = convertTimerDataToState(input as TimerData);
  } else {
    // It's already TimerState
    state = input as TimerState;
  }

  const progress = getTimerProgress(state);
  return (progress / 100) * 360; // Convert to degrees
}

/**
 * Get session progress text (e.g., "Session 2 of 4")
 */
export function getSessionProgressText(sessionNumber: number): string {
  const totalSessions = TIMER_CONFIG.sessionsBeforeLongBreak;
  return `Session ${sessionNumber} of ${totalSessions}`;
}

/**
 * Estimate total study time for current session cycle
 */
export function estimateSessionCycleTime(): {
  totalMinutes: number;
  focusMinutes: number;
  breakMinutes: number;
} {
  const focusMinutes =
    (TIMER_CONFIG.focus / 60) * TIMER_CONFIG.sessionsBeforeLongBreak;
  const shortBreakMinutes =
    (TIMER_CONFIG.break / 60) * (TIMER_CONFIG.sessionsBeforeLongBreak - 1);
  const longBreakMinutes = TIMER_CONFIG.longBreak / 60;

  return {
    totalMinutes: focusMinutes + shortBreakMinutes + longBreakMinutes,
    focusMinutes,
    breakMinutes: shortBreakMinutes + longBreakMinutes,
  };
}

// === Legacy compatibility functions ===

/**
 * Legacy getProgress function that works with TimerData
 */
export function getProgress(timerData: TimerData | null): number {
  if (!timerData) return 0;
  const state = convertTimerDataToState(timerData);
  return getTimerProgress(state);
}

/**
 * Legacy getPhaseColor function that returns a string for backward compatibility
 */
export function getPhaseColorLegacy(phase: string): string {
  const colors = getPhaseColor(phase as "focus" | "break" | "long_break");
  return `${colors.background} ${colors.text} ${colors.border}`;
}
