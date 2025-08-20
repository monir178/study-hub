"use client";

import { useTranslations } from "next-intl";
import { useUserDashboard } from "../../hooks/useUserDashboard";
import { UserDashboardStats } from "../../components/UserDashboardStats";
import { UserDashboardBento } from "../../components/UserDashboardBento";
import { StudyTimeChart } from "../../components/StudyTimeChart";
import { RecentRooms } from "../../components/RecentRooms";
import { RecentNotes } from "../../components/RecentNotes";
import {
  UserDashboardStatsSkeleton,
  StudyTimeChartSkeleton,
  RecentRoomsSkeleton,
  RecentNotesSkeleton,
  UserDashboardBentoSkeleton,
} from "./skeletons";

interface UserDashboardProps {
  loading?: boolean;
}

export function UserDashboard({ loading }: UserDashboardProps) {
  const { data, error, isLoading } = useUserDashboard();
  const t = useTranslations("dashboard");

  // Show error only if there's an actual error
  if (error) {
    return (
      <div className="space-y-6" data-testid="user-dashboard-error">
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
      <div
        className="space-y-6 max-w-[1920px] mx-auto"
        data-testid="user-dashboard-skeleton"
      >
        {/* First Row: Dashboard Stats */}
        <UserDashboardStatsSkeleton />

        {/* Second Row: Left Chart + Right Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Study Time Area Chart */}
          <div className="h-full">
            <StudyTimeChartSkeleton />
          </div>

          {/* Right: Recent Rooms + Recent Notes */}
          <div className="space-y-6 h-full">
            <RecentRoomsSkeleton />
            <RecentNotesSkeleton />
          </div>
        </div>

        {/* Third Row: Quick Actions + Streak */}
        <UserDashboardBentoSkeleton />
      </div>
    );
  }

  return (
    <div
      className="space-y-6 max-w-[1920px] mx-auto"
      data-testid="user-dashboard"
    >
      {/* First Row: Dashboard Stats */}
      <UserDashboardStats
        stats={data.stats}
        trends={data.trends}
        studyTimeByDay={data.studyTimeByDay}
        sessionTypes={data.sessionTypes}
        roomActivity={data.roomActivity}
        chartData={data.chartData}
        loading={isLoading || loading}
      />

      {/* Second Row: Left Chart + Right Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Study Time Area Chart */}
        <div className="h-full">
          <StudyTimeChart
            data={data.studyTimeByDay}
            loading={isLoading || loading}
          />
        </div>

        {/* Right: Recent Rooms + Recent Notes */}
        <div className="space-y-6 h-full">
          <RecentRooms
            recentRooms={data.recentRooms.slice(0, 3)}
            loading={isLoading || loading}
          />
          <RecentNotes
            recentNotes={data.recentNotes.slice(0, 3)}
            loading={isLoading || loading}
          />
        </div>
      </div>

      {/* Third Row: Quick Actions + Streak */}
      <UserDashboardBento
        recentSessions={data.recentSessions}
        recentRooms={data.recentRooms}
        recentNotes={data.recentNotes}
        streak={data.streak}
        loading={isLoading || loading}
      />
    </div>
  );
}
