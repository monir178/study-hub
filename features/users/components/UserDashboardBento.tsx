"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, FileText, TrendingUp, BookOpen } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { StudySession, RoomMember, Note, StudyStreak } from "../types";
import { UserDashboardBentoSkeleton } from "../dashboard/components/skeletons";

interface UserDashboardBentoProps {
  recentSessions: StudySession[];
  recentRooms: RoomMember[];
  recentNotes: Note[];
  streak: StudyStreak;
  loading?: boolean;
}

export function UserDashboardBento({
  recentSessions: _recentSessions,
  recentRooms: _recentRooms,
  recentNotes: _recentNotes,
  streak,
  loading,
}: UserDashboardBentoProps) {
  if (loading) {
    return (
      <div data-testid="user-bento-loading">
        <UserDashboardBentoSkeleton />
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-full "
      data-testid="user-bento"
    >
      {/* Quick Actions */}
      <Card className="md:col-span-2 lg:col-span-2 hover:shadow-md transition-shadow cursor-pointer group">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-20 flex flex-col gap-2"
              asChild
            >
              <Link
                href="/dashboard/rooms?create=true"
                data-testid="quick-create-room"
              >
                <BookOpen className="w-6 h-6" />
                <span className="text-sm">Create Room</span>
              </Link>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col gap-2"
              asChild
            >
              <Link href="/dashboard/rooms" data-testid="quick-browse-rooms">
                <Users className="w-6 h-6" />
                <span className="text-sm">Browse Rooms</span>
              </Link>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col gap-2"
              asChild
            >
              <Link href="/dashboard/notes" data-testid="quick-notes">
                <FileText className="w-6 h-6" />
                <span className="text-sm">Notes</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Study Streak */}
      <Card data-testid="user-bento-streak">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Streak</CardTitle>
            <TrendingUp className="w-5 h-5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div
              className="text-3xl font-bold text-primary"
              data-testid="streak-current"
            >
              {streak.current}
            </div>
            <p className="text-sm text-muted-foreground">days active</p>
            <div className="flex justify-center mt-2">
              {Array.from({ length: Math.min(streak.current, 7) }, (_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-primary rounded-full mx-0.5"
                />
              ))}
            </div>
            {streak.max > streak.current && (
              <p className="text-xs text-muted-foreground mt-1">
                Best: {streak.max} days
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
