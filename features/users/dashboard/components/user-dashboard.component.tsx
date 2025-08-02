"use client";

import { useUserDashboard } from "../../hooks/useUserDashboard";
import { UserDashboardStats } from "../../components/UserDashboardStats";
import { UserDashboardBento } from "../../components/UserDashboardBento";
import { StudyTimeChart } from "../../components/StudyTimeChart";
import { RecentRooms } from "../../components/RecentRooms";
import { RecentNotes } from "../../components/RecentNotes";
import { UserDashboardSkeleton } from "./";

interface UserDashboardProps {
  loading?: boolean;
}

export function UserDashboard({ loading }: UserDashboardProps) {
  const { data, isLoading, error } = useUserDashboard();

  if (loading || isLoading) {
    return <UserDashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold text-destructive">
            Failed to load dashboard data
          </h3>
          <p className="text-sm text-muted-foreground mt-2">
            Please try refreshing the page
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold">No dashboard data available</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Start studying to see your progress
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1920px] mx-auto">
      {/* First Row: Dashboard Stats */}
      <UserDashboardStats stats={data.stats} trends={data.trends} />

      {/* Second Row: Left Chart + Right Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Study Time Area Chart */}
        <div className="h-full">
          <StudyTimeChart data={data.studyTimeByDay} />
        </div>

        {/* Right: Recent Rooms + Recent Notes */}
        <div className="space-y-6 h-full">
          <RecentRooms recentRooms={data.recentRooms.slice(0, 3)} />
          <RecentNotes recentNotes={data.recentNotes.slice(0, 3)} />
        </div>
      </div>

      {/* Third Row: Quick Actions + Streak */}
      <UserDashboardBento
        recentSessions={data.recentSessions}
        recentRooms={data.recentRooms}
        recentNotes={data.recentNotes}
        streak={data.streak}
      />
    </div>
  );
}
