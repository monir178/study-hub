// Server-side timer state management
export interface TimerState {
  roomId: string;
  phase: "focus" | "shortBreak" | "longBreak";
  remainingTime: number; // in seconds
  totalTime: number; // in seconds
  isActive: boolean;
  isPaused: boolean;
  session: number;
  totalSessions: number;
  startedBy: string; // userId
  startedAt: number; // timestamp
  lastUpdated: number; // timestamp
}

export interface TimerSettings {
  focusDuration: number; // 25 minutes default
  shortBreakDuration: number; // 5 minutes default
  longBreakDuration: number; // 15 minutes default
  sessionsUntilLongBreak: number; // 4 sessions default
}

class TimerManager {
  private timers: Map<string, TimerState> = new Map();
  private intervals: Map<string, NodeJS.Timeout> = new Map();
  private static instance: TimerManager;

  private constructor() {}

  static getInstance(): TimerManager {
    if (!TimerManager.instance) {
      TimerManager.instance = new TimerManager();
    }
    return TimerManager.instance;
  }

  private getDefaultSettings(): TimerSettings {
    return {
      focusDuration: 25 * 60, // 25 minutes
      shortBreakDuration: 5 * 60, // 5 minutes
      longBreakDuration: 15 * 60, // 15 minutes
      sessionsUntilLongBreak: 4,
    };
  }

  private createInitialState(roomId: string, startedBy: string): TimerState {
    const settings = this.getDefaultSettings();
    return {
      roomId,
      phase: "focus",
      remainingTime: settings.focusDuration,
      totalTime: settings.focusDuration,
      isActive: false,
      isPaused: false,
      session: 1,
      totalSessions: settings.sessionsUntilLongBreak,
      startedBy,
      startedAt: Date.now(),
      lastUpdated: Date.now(),
    };
  }

  getTimerState(roomId: string): TimerState | null {
    return this.timers.get(roomId) || null;
  }

  startTimer(roomId: string, userId: string, _io: unknown = null): TimerState {
    let timer = this.timers.get(roomId);

    if (!timer) {
      timer = this.createInitialState(roomId, userId);
      this.timers.set(roomId, timer);
    }

    // If timer was paused, resume it
    if (timer.isPaused) {
      timer.isPaused = false;
      timer.isActive = true;
      timer.lastUpdated = Date.now();
    } else if (!timer.isActive) {
      // Starting fresh timer
      timer.isActive = true;
      timer.isPaused = false;
      timer.startedAt = Date.now();
      timer.lastUpdated = Date.now();
    }

    this.startInterval(roomId, _io);
    return timer;
  }

  pauseTimer(roomId: string): TimerState | null {
    const timer = this.timers.get(roomId);
    if (!timer) return null;

    timer.isActive = false;
    timer.isPaused = true;
    timer.lastUpdated = Date.now();

    this.clearInterval(roomId);
    return timer;
  }

  stopTimer(roomId: string): TimerState | null {
    const timer = this.timers.get(roomId);
    if (!timer) return null;

    timer.isActive = false;
    timer.isPaused = false;
    timer.lastUpdated = Date.now();

    this.clearInterval(roomId);
    return timer;
  }

  resetTimer(roomId: string, userId: string): TimerState {
    this.clearInterval(roomId);
    const newTimer = this.createInitialState(roomId, userId);
    this.timers.set(roomId, newTimer);
    return newTimer;
  }

  private startInterval(roomId: string, _io: unknown) {
    this.clearInterval(roomId);

    const interval = setInterval(() => {
      const timer = this.timers.get(roomId);
      if (!timer || !timer.isActive) {
        this.clearInterval(roomId);
        return;
      }

      timer.remainingTime -= 1;
      timer.lastUpdated = Date.now();

      // Timer completed
      if (timer.remainingTime <= 0) {
        this.handleTimerComplete(roomId, _io);
      }
    }, 1000);

    this.intervals.set(roomId, interval);
  }

  private handleTimerComplete(roomId: string, _io: unknown) {
    const timer = this.timers.get(roomId);
    if (!timer) return;

    this.clearInterval(roomId);

    const settings = this.getDefaultSettings();
    let nextPhase: "focus" | "shortBreak" | "longBreak";
    let nextDuration: number;
    let nextSession = timer.session;

    if (timer.phase === "focus") {
      // After focus, determine break type
      if (timer.session % settings.sessionsUntilLongBreak === 0) {
        nextPhase = "longBreak";
        nextDuration = settings.longBreakDuration;
      } else {
        nextPhase = "shortBreak";
        nextDuration = settings.shortBreakDuration;
      }
    } else {
      // After break, go to focus
      nextPhase = "focus";
      nextDuration = settings.focusDuration;
      if (timer.phase === "shortBreak" || timer.phase === "longBreak") {
        nextSession = timer.session + 1;
      }
    }

    // Update timer state
    timer.phase = nextPhase;
    timer.remainingTime = nextDuration;
    timer.totalTime = nextDuration;
    timer.session = nextSession;
    timer.isActive = false; // Stop automatically, user needs to start next phase
    timer.isPaused = false;
    timer.lastUpdated = Date.now();

    console.log(`Timer completed in room ${roomId}. Next phase: ${nextPhase}`);
  }

  private clearInterval(roomId: string) {
    const interval = this.intervals.get(roomId);
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(roomId);
    }
  }

  // Cleanup when room is empty
  cleanupRoom(roomId: string) {
    this.clearInterval(roomId);
    this.timers.delete(roomId);
  }

  // Get all active timers (for debugging)
  getAllTimers(): Map<string, TimerState> {
    return this.timers;
  }
}

export const timerManager = TimerManager.getInstance();
