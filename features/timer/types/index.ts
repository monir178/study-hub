// Re-export new timer types
export * from "./timer-events";
export * from "./timer-state";

// Import types we need for the return interface
import { TimerState, TimerPermissions, TimerActions } from "./timer-state";

// Export services
export { TimerApiService } from "../services/timer-api.service";
export {
  subscribeToTimerEvents,
  checkTimerPermissions,
} from "../services/timer-pusher.service";

// Export hooks
export { useRoomTimer } from "../hooks/useRoomTimer";

// Export utilities
export * from "../utils/timer-display.utils";

// Legacy types (keeping for backward compatibility during migration)
export interface TimerData {
  roomId: string;
  phase: "focus" | "break" | "long_break";
  remaining: number; // in seconds
  isRunning: boolean;
  isPaused: boolean;
  updatedAt: Date;
  controlledBy: string; // userId
  session: number;
  totalSessions: number;
  [key: string]: unknown; // Add index signature
}

export interface TimerConfig {
  focus: number;
  break: number;
  longBreak: number;
  sessionsBeforeLongBreak: number;
}

export interface UsePomodoroTimerReturn {
  // Timer state
  state: TimerState;
  permissions: TimerPermissions;
  actions: TimerActions;

  // Loading states
  loading: {
    start: boolean;
    pause: boolean;
    reset: boolean;
  };

  // Error handling
  error: string | null;
}
