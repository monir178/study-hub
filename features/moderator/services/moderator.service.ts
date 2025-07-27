import { apiClient } from "@/lib/api/client";
import {
  ModeratorStats,
  Report,
  CreateReportData,
  UpdateReportData,
  ModeratorActivity,
} from "../types";

export class ModeratorService {
  private static readonly BASE_PATH = "/moderator";

  // Get moderator dashboard stats
  static async getStats(): Promise<ModeratorStats> {
    return apiClient.get<ModeratorStats>(`${this.BASE_PATH}/stats`);
  }

  // Get all reports (optionally filtered by status)
  static async getReports(
    status?: "PENDING" | "RESOLVED" | "DISMISSED",
  ): Promise<Report[]> {
    const params = status ? `?status=${status}` : "";
    return apiClient.get<Report[]>(`${this.BASE_PATH}/reports${params}`);
  }

  // Get report by ID
  static async getReportById(id: string): Promise<Report> {
    return apiClient.get<Report>(`${this.BASE_PATH}/reports/${id}`);
  }

  // Create new report
  static async createReport(reportData: CreateReportData): Promise<Report> {
    return apiClient.post<Report>(`${this.BASE_PATH}/reports`, reportData);
  }

  // Update report
  static async updateReport(
    id: string,
    reportData: UpdateReportData,
  ): Promise<Report> {
    return apiClient.patch<Report>(
      `${this.BASE_PATH}/reports/${id}`,
      reportData,
    );
  }

  // Delete report
  static async deleteReport(id: string): Promise<void> {
    await apiClient.delete(`${this.BASE_PATH}/reports/${id}`);
  }

  // Get moderator activity log
  static async getActivity(): Promise<ModeratorActivity[]> {
    return apiClient.get<ModeratorActivity[]>(`${this.BASE_PATH}/activity`);
  }

  // Warn a user
  static async warnUser(userId: string, reason: string): Promise<void> {
    await apiClient.post(`${this.BASE_PATH}/users/${userId}/warn`, { reason });
  }

  // Suspend a user
  static async suspendUser(
    userId: string,
    reason: string,
    duration?: number,
  ): Promise<void> {
    await apiClient.post(`${this.BASE_PATH}/users/${userId}/suspend`, {
      reason,
      duration,
    });
  }

  // Remove content
  static async removeContent(contentId: string, reason: string): Promise<void> {
    await apiClient.delete(`${this.BASE_PATH}/content/${contentId}`, {
      data: { reason },
    });
  }
}
