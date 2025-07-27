"use client";

import { DashboardStats } from "@/features/dashboard/components/DashboardStats";
import { UserManagement } from "../components/user-management.component";
import { useAdminDashboardStats } from "../../hooks/useAdmin";
import { AdminDashboardSkeleton } from "./";

export function AdminDashboard() {
  const { data: stats, isLoading: loading, error } = useAdminDashboardStats();

  if (loading) {
    return <AdminDashboardSkeleton />;
  }

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
        role="ADMIN"
        stats={{
          totalUsers: stats?.users.total,
          activeStudyRooms: stats?.rooms.active,
          totalStudyTime: stats?.sessions.total,
          messagesCount: stats?.messages.total,
        }}
        loading={false} // Already handled by skeleton above
      />
      <UserManagement />
    </div>
  );
}
