import { apiClient } from "@/lib/api/client";
import { TimerData } from "../types";

export class TimerService {
  // Get current timer state
  static async getTimer(roomId: string): Promise<TimerData | null> {
    try {
      const response = await apiClient.get<TimerData | null>(
        `/rooms/${roomId}/timer`,
      );
      return response;
    } catch (error) {
      console.error("Error fetching timer:", error);
      return null;
    }
  }

  // Start timer
  static async startTimer(roomId: string): Promise<TimerData> {
    const response = await apiClient.post<TimerData>(
      `/rooms/${roomId}/timer/start`,
    );
    return response;
  }

  // Pause timer
  static async pauseTimer(roomId: string): Promise<TimerData | null> {
    try {
      const response = await apiClient.post<TimerData | null>(
        `/rooms/${roomId}/timer/pause`,
      );
      return response;
    } catch (error) {
      console.error("Error pausing timer:", error);
      return null;
    }
  }

  // Reset timer
  static async resetTimer(roomId: string): Promise<TimerData> {
    const response = await apiClient.post<TimerData>(
      `/rooms/${roomId}/timer/reset`,
    );
    return response;
  }

  // Get timer configuration
  static async getTimerConfig(): Promise<{
    focus: number;
    break: number;
    longBreak: number;
    sessionsBeforeLongBreak: number;
  }> {
    const response = await apiClient.get<{
      focus: number;
      break: number;
      longBreak: number;
      sessionsBeforeLongBreak: number;
    }>("/timer/config");
    return response;
  }
}
