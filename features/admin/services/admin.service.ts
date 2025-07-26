import { apiClient } from "@/lib/api/client";
import { DashboardStats, SystemSettings, AdminAnalytics } from "../types";
import { User } from "@/features/users/types";

export class AdminService {
  private static readonly BASE_PATH = "/admin";

  // Get dashboard statistics
  static async getDashboardStats(): Promise<DashboardStats> {
    return apiClient.get<DashboardStats>(`${this.BASE_PATH}/dashboard/stats`);
  }

  // Get system settings
  static async getSystemSettings(): Promise<SystemSettings> {
    return apiClient.get<SystemSettings>(`${this.BASE_PATH}/settings`);
  }

  // Update system settings
  static async updateSystemSettings(
    settings: Partial<SystemSettings>,
  ): Promise<SystemSettings> {
    return apiClient.patch<SystemSettings>(
      `${this.BASE_PATH}/settings`,
      settings,
    );
  }

  // Get platform analytics
  static async getAnalytics(
    timeRange: "7d" | "30d" | "90d" = "30d",
  ): Promise<AdminAnalytics> {
    return apiClient.get<AdminAnalytics>(
      `${this.BASE_PATH}/analytics?timeRange=${timeRange}`,
    );
  }

  // User management operations
  static async getAllUsers(): Promise<User[]> {
    return apiClient.get<User[]>(`${this.BASE_PATH}/users`);
  }

  static async updateUserRole(userId: string, role: string): Promise<User> {
    return apiClient.patch<User>(`${this.BASE_PATH}/users/${userId}/role`, {
      role,
    });
  }

  static async deleteUser(userId: string): Promise<void> {
    await apiClient.delete(`${this.BASE_PATH}/users/${userId}`);
  }

  static async banUser(userId: string): Promise<void> {
    await apiClient.post(`${this.BASE_PATH}/users/${userId}/ban`);
  }

  static async unbanUser(userId: string): Promise<void> {
    await apiClient.post(`${this.BASE_PATH}/users/${userId}/unban`);
  }

  // System operations
  static async toggleMaintenanceMode(enabled: boolean): Promise<void> {
    await apiClient.post(`${this.BASE_PATH}/maintenance`, { enabled });
  }
}
