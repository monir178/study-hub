import { apiClient } from "@/lib/api/client";
import { ModeratorDashboardData, ModeratorActivity } from "../types";

export class ModeratorDashboardService {
  private static readonly BASE_PATH = "/moderator/dashboard";

  // Get moderator dashboard data
  static async getDashboardData(): Promise<ModeratorDashboardData> {
    return apiClient.get<ModeratorDashboardData>(this.BASE_PATH);
  }

  // Get moderator statistics
  static async getStats(): Promise<ModeratorDashboardData["stats"]> {
    const data = await apiClient.get<ModeratorDashboardData>(this.BASE_PATH);
    return data.stats;
  }

  // Get recent users
  static async getRecentUsers(): Promise<
    ModeratorDashboardData["recentUsers"]
  > {
    const data = await apiClient.get<ModeratorDashboardData>(this.BASE_PATH);
    return data.recentUsers;
  }

  // Get recent rooms
  static async getRecentRooms(): Promise<
    ModeratorDashboardData["recentRooms"]
  > {
    const data = await apiClient.get<ModeratorDashboardData>(this.BASE_PATH);
    return data.recentRooms;
  }

  // Get recent sessions
  static async getRecentSessions(): Promise<
    ModeratorDashboardData["recentSessions"]
  > {
    const data = await apiClient.get<ModeratorDashboardData>(this.BASE_PATH);
    return data.recentSessions;
  }

  // Get recent messages
  static async getRecentMessages(): Promise<
    ModeratorDashboardData["recentMessages"]
  > {
    const data = await apiClient.get<ModeratorDashboardData>(this.BASE_PATH);
    return data.recentMessages;
  }

  // Get moderator activity
  static async getActivity(): Promise<ModeratorActivity[]> {
    return apiClient.get<ModeratorActivity[]>("/moderator/activity");
  }

  // Get moderator stats (separate from dashboard stats)
  static async getModeratorStats(): Promise<ModeratorDashboardData["stats"]> {
    return apiClient.get<ModeratorDashboardData["stats"]>("/moderator/stats");
  }
}
