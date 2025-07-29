// Server-side timer store for real-time Pomodoro timer
import { TimerDatabase } from "./timer-database";
import { triggerTimerUpdate } from "./pusher";

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

// In-memory timer store
const timerStore = new Map<string, TimerData>();
const countdownIntervals = new Map<string, NodeJS.Timeout>();

// Timer configuration
const TIMER_CONFIG = {
  focus: 25 * 60, // 25 minutes
  break: 5 * 60, // 5 minutes
  longBreak: 15 * 60, // 15 minutes
  sessionsBeforeLongBreak: 4,
};

export class TimerStore {
  // Get timer state for a room
  static async getTimer(roomId: string): Promise<TimerData | null> {
    // First check in-memory store
    let timer: TimerData | null = timerStore.get(roomId) || null;

    // If not in memory, try to load from database
    if (!timer) {
      timer = await TimerDatabase.loadTimer(roomId);
      if (timer) {
        // Cache in memory
        timerStore.set(roomId, timer);
      }
    }

    return timer;
  }

  // Create or update timer state
  static async setTimer(
    roomId: string,
    data: Partial<TimerData>,
  ): Promise<TimerData> {
    const existing = await this.getTimer(roomId);
    const timer: TimerData = {
      roomId,
      phase: "focus",
      remaining: TIMER_CONFIG.focus,
      isRunning: false,
      isPaused: false,
      updatedAt: new Date(),
      controlledBy: "",
      session: 1,
      totalSessions: TIMER_CONFIG.sessionsBeforeLongBreak,
      ...(existing || {}),
      ...data,
    };

    // Ensure updatedAt is always current
    timer.updatedAt = new Date();

    // Save to memory and database
    timerStore.set(roomId, timer);
    await TimerDatabase.saveTimer(roomId, timer);

    return timer;
  }

  // Start timer
  static async startTimer(roomId: string, userId: string): Promise<TimerData> {
    let timer = await this.getTimer(roomId);

    // If timer doesn't exist, create a default one
    if (!timer) {
      timer = await this.setTimer(roomId, {
        roomId,
        phase: "focus",
        remaining: TIMER_CONFIG.focus,
        isRunning: false,
        isPaused: false,
        controlledBy: "",
        session: 1,
        totalSessions: TIMER_CONFIG.sessionsBeforeLongBreak,
      });
    }

    const updatedTimer = await this.setTimer(roomId, {
      isRunning: true,
      isPaused: false,
      controlledBy: userId,
    });

    // Start server-side countdown
    this.startCountdown(roomId);

    // Trigger Pusher update
    await triggerTimerUpdate(roomId, updatedTimer, "started", userId);

    return updatedTimer;
  }

  // Pause timer
  static async pauseTimer(
    roomId: string,
    userId: string,
  ): Promise<TimerData | null> {
    let timer = await this.getTimer(roomId);

    // If timer doesn't exist, create a default one
    if (!timer) {
      timer = await this.setTimer(roomId, {
        roomId,
        phase: "focus",
        remaining: TIMER_CONFIG.focus,
        isRunning: false,
        isPaused: false,
        controlledBy: "",
        session: 1,
        totalSessions: TIMER_CONFIG.sessionsBeforeLongBreak,
      });
    }

    // Stop server-side countdown
    this.stopCountdown(roomId);

    const updatedTimer = await this.setTimer(roomId, {
      isRunning: false,
      isPaused: true,
      controlledBy: userId,
    });

    // Trigger Pusher update
    await triggerTimerUpdate(roomId, updatedTimer, "paused", userId);

    return updatedTimer;
  }

  // Reset timer
  static async resetTimer(roomId: string, userId: string): Promise<TimerData> {
    let timer = await this.getTimer(roomId);

    // If timer doesn't exist, create a default one
    if (!timer) {
      timer = await this.setTimer(roomId, {
        roomId,
        phase: "focus",
        remaining: TIMER_CONFIG.focus,
        isRunning: false,
        isPaused: false,
        controlledBy: "",
        session: 1,
        totalSessions: TIMER_CONFIG.sessionsBeforeLongBreak,
      });
    }

    // Stop server-side countdown
    this.stopCountdown(roomId);

    const updatedTimer = await this.setTimer(roomId, {
      isRunning: false,
      isPaused: false,
      remaining: TIMER_CONFIG.focus,
      controlledBy: userId,
    });

    // Trigger Pusher update
    await triggerTimerUpdate(roomId, updatedTimer, "reset", userId);

    return updatedTimer;
  }

  // Update timer (for countdown)
  static async updateTimer(
    roomId: string,
    remaining: number,
  ): Promise<TimerData | null> {
    const timer = await this.getTimer(roomId);
    if (!timer) return null;

    const updatedTimer = await this.setTimer(roomId, {
      remaining,
    });

    // Check if timer completed
    if (remaining <= 0) {
      await this.handleTimerComplete(roomId);
    } else {
      // Trigger Pusher update for countdown
      await triggerTimerUpdate(
        roomId,
        updatedTimer,
        "tick",
        timer.controlledBy,
      );
    }

    return updatedTimer;
  }

  // Server-side countdown
  private static startCountdown(roomId: string): void {
    // Clear existing countdown
    this.stopCountdown(roomId);

    const interval = setInterval(async () => {
      const timer = await this.getTimer(roomId);
      if (!timer || !timer.isRunning || timer.remaining <= 0) {
        this.stopCountdown(roomId);
        return;
      }

      await this.updateTimer(roomId, timer.remaining - 1);
    }, 1000);

    countdownIntervals.set(roomId, interval);
  }

  // Stop server-side countdown
  private static stopCountdown(roomId: string): void {
    const interval = countdownIntervals.get(roomId);
    if (interval) {
      clearInterval(interval);
      countdownIntervals.delete(roomId);
    }
  }

  // Handle timer completion
  private static async handleTimerComplete(roomId: string): Promise<TimerData> {
    const timer = await this.getTimer(roomId);
    if (!timer) {
      throw new Error("Timer not found");
    }

    // Complete the current session
    await TimerDatabase.completeSession(roomId, timer);

    // Determine next phase
    let nextPhase: "focus" | "break" | "long_break";
    let nextRemaining: number;
    let nextSession: number;

    if (timer.phase === "focus") {
      // Check if it's time for a long break
      if (timer.session % 4 === 0) {
        nextPhase = "long_break";
        nextRemaining = TIMER_CONFIG.longBreak;
        nextSession = timer.session;
      } else {
        nextPhase = "break";
        nextRemaining = TIMER_CONFIG.break;
        nextSession = timer.session;
      }
    } else {
      // From break to focus
      nextPhase = "focus";
      nextRemaining = TIMER_CONFIG.focus;
      nextSession = timer.session + 1;
    }

    // Create new session
    const newTimer = await this.setTimer(roomId, {
      phase: nextPhase,
      remaining: nextRemaining,
      isRunning: false,
      isPaused: false,
      session: nextSession,
      controlledBy: "",
    });

    // Trigger Pusher update for completion
    await triggerTimerUpdate(roomId, newTimer, "completed", timer.controlledBy);

    return newTimer;
  }

  // Get timer configuration
  static getConfig() {
    return TIMER_CONFIG;
  }

  // Clear timer (for cleanup)
  static clearTimer(roomId: string): void {
    this.stopCountdown(roomId);
    timerStore.delete(roomId);
  }

  // Get all timers (for debugging)
  static getAllTimers(): Map<string, TimerData> {
    return new Map(timerStore);
  }
}
