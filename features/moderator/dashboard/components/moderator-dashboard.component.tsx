"use client";

import { useTranslations } from "next-intl";
import { useModeratorDashboard } from "../../hooks/useModeratorDashboard";
import { ModeratorDashboardStats } from "../../components/ModeratorDashboardStats";
import { RecentUsers } from "../../components/RecentUsers";
import { RecentRooms } from "../../components/RecentRooms";
import { RecentSessions } from "../../components/RecentSessions";
import { UserManagement } from "@/features/admin/dashboard/components/user-management.component";
import {
  ModeratorDashboardStatsSkeleton,
  RecentUsersSkeleton,
  RecentRoomsSkeleton,
  RecentActivitySkeleton,
} from "./skeletons";

interface ModeratorDashboardProps {
  loading?: boolean;
}

export function ModeratorDashboard({ loading }: ModeratorDashboardProps) {
  const { data, error, isLoading } = useModeratorDashboard();
  const t = useTranslations("moderator");

  // Show error only if there's an actual error
  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold text-destructive">
            {t("failedToLoad")}
          </h3>
          <p className="text-sm text-muted-foreground mt-2">
            {t("tryRefresh")}
          </p>
        </div>
      </div>
    );
  }

  // If data is not available, show skeleton layout
  if (!data) {
    return (
      <div className="space-y-6 max-w-[1920px] mx-auto">
        {/* First Row: Dashboard Stats */}
        <ModeratorDashboardStatsSkeleton />

        {/* Second Row: Recent Data */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentUsersSkeleton />
          <RecentRoomsSkeleton />
        </div>

        {/* Third Row: Recent Sessions */}
        <RecentActivitySkeleton />

        {/* Fourth Row: User Management */}
        <div className="space-y-6">
          <div className="h-96 bg-muted animate-pulse rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1920px] mx-auto">
      {/* First Row: Dashboard Stats */}
      <ModeratorDashboardStats
        stats={data.stats}
        loading={isLoading || loading}
      />

      {/* Second Row: Recent Users + Recent Rooms */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentUsers
          users={data.recentUsers.slice(0, 5)}
          loading={isLoading || loading}
        />
        <RecentRooms
          rooms={data.recentRooms.slice(0, 5)}
          loading={isLoading || loading}
        />
      </div>

      {/* Third Row: Recent Sessions */}
      <RecentSessions
        sessions={data.recentSessions.slice(0, 5)}
        loading={isLoading || loading}
      />

      {/* Fourth Row: User Management */}
      <UserManagement />
    </div>
  );
}
