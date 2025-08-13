// Simple API client for timer operations
import { apiClient } from "@/lib/api/client";
import {
  TimerStartEvent,
  TimerPauseEvent,
  TimerResetEvent,
  TimerResumeEvent,
  getPhaseDuration,
} from "../types/timer-events";

export interface CreateSessionRequest {
  roomId: string;
  phase: "focus" | "break" | "long_break";
  sessionNumber: number;
}

export interface UpdateSessionRequest {
  sessionId: string;
  remainingTime?: number;
  endedAt?: string;
}

export interface SessionResponse {
  sessionId: string;
  roomId: string;
  phase: string;
  sessionNumber: number;
  startedAt: string;
  remainingTime: number;
  status: "ACTIVE" | "PAUSED" | "COMPLETED";
}

export class TimerApiService {
  /**
   * Start a new timer session
   * Creates a new StudySession and emits start event via Pusher
   */
  static async startTimer(
    roomId: string,
    phase: "focus" | "break" | "long_break" = "focus",
    sessionNumber: number = 1,
  ): Promise<{ session: SessionResponse; event: TimerStartEvent }> {
    const response = await apiClient.post<{
      session: SessionResponse;
      event: TimerStartEvent;
    }>(`/rooms/${roomId}/timer/start`, {
      phase,
      sessionNumber,
      duration: getPhaseDuration(phase),
    });

    return response;
  }

  /**
   * Pause current timer session
   * Updates StudySession status and emits pause event via Pusher
   */
  static async pauseTimer(
    roomId: string,
    sessionId: string,
    remainingTime: number,
    phase: "focus" | "break" | "long_break",
    sessionNumber: number,
  ): Promise<{ session: SessionResponse; event: TimerPauseEvent }> {
    const response = await apiClient.post<{
      session: SessionResponse;
      event: TimerPauseEvent;
    }>(`/rooms/${roomId}/timer/pause`, {
      sessionId,
      remainingTime,
      phase,
      sessionNumber,
    });

    return response;
  }

  /**
   * Resume paused timer session
   * Updates StudySession status and emits resume event via Pusher with remaining time
   */
  static async resumeTimer(
    roomId: string,
    sessionId: string,
    remainingTime: number,
  ): Promise<{ session: SessionResponse; event: TimerResumeEvent }> {
    const response = await apiClient.post<{
      session: SessionResponse;
      event: TimerResumeEvent;
    }>(`/rooms/${roomId}/timer/resume`, {
      sessionId,
      remainingTime,
    });

    return response;
  }

  /**
   * Reset timer session
   * Ends current session and emits reset event via Pusher
   */
  static async resetTimer(
    roomId: string,
    sessionId?: string,
  ): Promise<{ event: TimerResetEvent }> {
    const response = await apiClient.post<{
      event: TimerResetEvent;
    }>(`/rooms/${roomId}/timer/reset`, {
      sessionId,
    });

    return response;
  }

  /**
   * Get current active session for a room
   * Used for initialization/sync
   */
  static async getCurrentSession(
    roomId: string,
  ): Promise<SessionResponse | null> {
    try {
      const response = await apiClient.get<SessionResponse>(
        `/rooms/${roomId}/timer/session`,
      );
      return response;
    } catch (error) {
      // No active session is not an error, but log for debugging
      console.debug("No active session found:", error);
      return null;
    }
  }
}
