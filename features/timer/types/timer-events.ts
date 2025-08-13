// Timer event types for Pusher real-time synchronization

export interface TimerEventData {
  roomId: string;
  userId: string; // who triggered the action
  timestamp: string; // ISO string when action occurred
  sessionId?: string; // StudySession ID for tracking
}

export interface TimerStartEvent extends TimerEventData {
  type: "timer-start";
  phase: "focus" | "break" | "long_break";
  duration: number; // total duration for this phase in seconds
  sessionNumber: number; // current session number (1, 2, 3, 4...)
}

export interface TimerPauseEvent extends TimerEventData {
  type: "timer-pause";
  remainingTime: number; // how much time was left when paused
  phase: "focus" | "break" | "long_break";
  sessionNumber: number;
}

export interface TimerResetEvent extends TimerEventData {
  type: "timer-reset";
  phase: "focus"; // always reset to focus
  sessionNumber: 1; // always reset to session 1
}

export interface TimerResumeEvent extends TimerEventData {
  type: "timer-resume";
  sessionId: string;
  remainingTime: number; // remaining time when resumed
  phase: "focus" | "break" | "long_break";
  sessionNumber: number;
}

export interface TimerCompleteEvent extends TimerEventData {
  type: "timer-complete";
  completedPhase: "focus" | "break" | "long_break";
  nextPhase: "focus" | "break" | "long_break";
  sessionNumber: number;
}

// Union type for all timer events
export type TimerEvent =
  | TimerStartEvent
  | TimerPauseEvent
  | TimerResetEvent
  | TimerResumeEvent
  | TimerCompleteEvent;

// Timer configuration (same as before)
export const TIMER_CONFIG = {
  focus: 25 * 60, // 25 minutes in seconds
  break: 5 * 60, // 5 minutes in seconds
  longBreak: 15 * 60, // 15 minutes in seconds
  sessionsBeforeLongBreak: 4,
} as const;

// Helper to get duration for a phase
export function getPhaseDuration(
  phase: "focus" | "break" | "long_break",
): number {
  switch (phase) {
    case "focus":
      return TIMER_CONFIG.focus;
    case "break":
      return TIMER_CONFIG.break;
    case "long_break":
      return TIMER_CONFIG.longBreak;
    default:
      return TIMER_CONFIG.focus;
  }
}

// Helper to get next phase
export function getNextPhase(
  currentPhase: "focus" | "break" | "long_break",
  sessionNumber: number,
): "focus" | "break" | "long_break" {
  if (currentPhase === "focus") {
    // After focus, check if it's time for long break
    return sessionNumber % TIMER_CONFIG.sessionsBeforeLongBreak === 0
      ? "long_break"
      : "break";
  } else {
    // After any break, go back to focus
    return "focus";
  }
}
