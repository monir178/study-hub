// Frontend timer state management types

export interface TimerState {
  // Current state
  isRunning: boolean;
  isPaused: boolean;
  phase: "focus" | "break" | "long_break";
  sessionNumber: number;

  // Time tracking
  remainingTime: number; // seconds left in current phase
  totalDuration: number; // total seconds for current phase

  // Session tracking
  sessionId?: string; // current StudySession ID from database
  startedAt?: Date; // when current phase started
  pausedAt?: Date; // when timer was paused (if paused)

  // Control
  controlledBy?: string; // userId who has control
  roomId: string;
}

// Initial timer state
export function createInitialTimerState(roomId: string): TimerState {
  return {
    isRunning: false,
    isPaused: false,
    phase: "focus",
    sessionNumber: 1,
    remainingTime: 25 * 60, // 25 minutes
    totalDuration: 25 * 60,
    roomId,
  };
}

// Timer permissions
export interface TimerPermissions {
  canControl: boolean;
  reason?: string; // why user can't control (for UI feedback)
}

// Timer actions (what user can do) - Updated to match existing components
export interface TimerActions {
  start: () => Promise<void>;
  pause: () => Promise<void>;
  reset: () => Promise<void>;
  // Legacy names for existing components
  startTimer: () => Promise<void>;
  pauseTimer: () => Promise<void>;
  resetTimer: () => Promise<void>;
}
