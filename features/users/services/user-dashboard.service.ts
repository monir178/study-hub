import { apiClient } from "@/lib/api/client";
import { UserDashboardData } from "../types";

export class UserDashboardService {
  private static readonly BASE_PATH = "/users/dashboard";

  // Get user dashboard data
  static async getDashboardData(): Promise<UserDashboardData> {
    return apiClient.get<UserDashboardData>(this.BASE_PATH);
  }

  // Get user statistics
  static async getUserStats(): Promise<UserDashboardData["stats"]> {
    const data = await apiClient.get<UserDashboardData>(this.BASE_PATH);
    return data.stats;
  }

  // Get recent study sessions
  static async getRecentSessions(): Promise<
    UserDashboardData["recentSessions"]
  > {
    const data = await apiClient.get<UserDashboardData>(this.BASE_PATH);
    return data.recentSessions;
  }

  // Get recent rooms
  static async getRecentRooms(): Promise<UserDashboardData["recentRooms"]> {
    const data = await apiClient.get<UserDashboardData>(this.BASE_PATH);
    return data.recentRooms;
  }

  // Get recent notes
  static async getRecentNotes(): Promise<UserDashboardData["recentNotes"]> {
    const data = await apiClient.get<UserDashboardData>(this.BASE_PATH);
    return data.recentNotes;
  }

  // Get study time by day
  static async getStudyTimeByDay(): Promise<
    UserDashboardData["studyTimeByDay"]
  > {
    const data = await apiClient.get<UserDashboardData>(this.BASE_PATH);
    return data.studyTimeByDay;
  }

  // Get session types distribution
  static async getSessionTypes(): Promise<UserDashboardData["sessionTypes"]> {
    const data = await apiClient.get<UserDashboardData>(this.BASE_PATH);
    return data.sessionTypes;
  }

  // Get room activity
  static async getRoomActivity(): Promise<UserDashboardData["roomActivity"]> {
    const data = await apiClient.get<UserDashboardData>(this.BASE_PATH);
    return data.roomActivity;
  }
}
