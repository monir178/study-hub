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

export interface TimerAction {
  action: "start" | "pause" | "reset" | "tick" | "complete";
  controlledBy: string;
  timestamp: string;
}

export interface TimerUpdate {
  timer: TimerData;
  action: string;
  controlledBy: string;
  timestamp: string;
}

export interface TimerPermissions {
  canControl: boolean;
  isModerator: boolean;
  isAdmin: boolean;
  isRoomOwner: boolean;
}

export interface TimerState {
  timer: TimerData | null;
  loading: {
    start: boolean;
    pause: boolean;
    reset: boolean;
  };
  error: string | null;
  canControl: boolean;
}

export interface TimerActions {
  startTimer: () => Promise<void>;
  pauseTimer: () => Promise<void>;
  resetTimer: () => Promise<void>;
}

export interface UsePomodoroTimerReturn extends TimerState {
  actions: TimerActions;
}
