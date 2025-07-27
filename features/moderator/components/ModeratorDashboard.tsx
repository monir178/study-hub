"use client";

import { DashboardStats } from "@/features/dashboard/components/DashboardStats";
import { UserManagement } from "@/features/admin/components/UserManagement";
import { useModeratorStats } from "../hooks/useModeratorStats";

export function ModeratorDashboard() {
  const { data: stats, isLoading: loading, error } = useModeratorStats();

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Failed to load dashboard data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardStats
        role="MODERATOR"
        stats={{
          reportsCount: stats?.reports.pending,
          moderationActions: stats?.content.reviewed,
          activeStudyRooms: stats?.sessions.moderated,
          messagesCount: stats?.users.active,
        }}
        loading={loading}
      />
      <UserManagement />
    </div>
  );
}
