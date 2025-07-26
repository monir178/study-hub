"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  Users,
  FileText,
  Plus,
  User,
  Timer,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

interface UserStats {
  studyTime: {
    total: number; // in minutes
    thisWeek: number;
  };
  sessions: {
    total: number;
    thisWeek: number;
  };
  notes: {
    total: number;
    recent: number;
  };
  rooms: {
    joined: number;
    active: number;
  };
}

export function UserDashboard() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      // This would fetch real data from API
      // For now, using mock data
      setStats({
        studyTime: { total: 750, thisWeek: 180 }, // 12h 30m total, 3h this week
        sessions: { total: 45, thisWeek: 8 },
        notes: { total: 23, recent: 5 },
        rooms: { joined: 12, active: 3 },
      });
    } catch (error) {
      console.error("Failed to fetch user stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Track your learning progress and join study sessions
          </p>
        </div>
        <Badge
          variant="secondary"
          className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
        >
          <User className="w-4 h-4 mr-1" />
          User
        </Badge>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-md transition-shadow cursor-pointer group">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <Plus className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
            </div>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-lg mb-1">Create Room</CardTitle>
            <CardDescription>Start a new study session</CardDescription>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer group">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <Users className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
            </div>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-lg mb-1">Join Room</CardTitle>
            <CardDescription>Find active study rooms</CardDescription>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer group">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <Timer className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
            </div>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-lg mb-1">Pomodoro Timer</CardTitle>
            <CardDescription>Focus with timed sessions</CardDescription>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer group">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <FileText className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
            </div>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-lg mb-1">My Notes</CardTitle>
            <CardDescription>Access saved notes</CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : formatTime(stats?.studyTime.total || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              +{loading ? "..." : formatTime(stats?.studyTime.thisWeek || 0)}{" "}
              this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Study Sessions
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : stats?.sessions.total || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              +{loading ? "..." : stats?.sessions.thisWeek || 0} this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notes Created</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : stats?.notes.total || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              +{loading ? "..." : stats?.notes.recent || 0} recent
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rooms Joined</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : stats?.rooms.joined || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {loading ? "..." : stats?.rooms.active || 0} currently active
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Study Rooms */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Study Rooms</CardTitle>
            <CardDescription>Your recently joined rooms</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                // Loading skeleton
                Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="space-y-2">
                      <div className="w-32 h-4 bg-muted rounded animate-pulse"></div>
                      <div className="w-24 h-3 bg-muted rounded animate-pulse"></div>
                    </div>
                    <div className="w-16 h-8 bg-muted rounded animate-pulse"></div>
                  </div>
                ))
              ) : (
                <>
                  <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div>
                      <p className="font-medium">Mathematics Study Group</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Users className="w-3 h-3" />3 members active
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      Join
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div>
                      <p className="font-medium">Physics Homework Session</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Users className="w-3 h-3" />1 member active
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      Join
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div>
                      <p className="font-medium">Chemistry Lab Review</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Users className="w-3 h-3" />5 members active
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      Join
                    </Button>
                  </div>
                </>
              )}
              <div className="text-center py-4">
                <Button variant="ghost" asChild>
                  <Link href="/rooms">View All Rooms</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Notes</CardTitle>
            <CardDescription>Your latest study notes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                // Loading skeleton
                Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="space-y-2">
                      <div className="w-32 h-4 bg-muted rounded animate-pulse"></div>
                      <div className="w-24 h-3 bg-muted rounded animate-pulse"></div>
                    </div>
                    <div className="w-16 h-8 bg-muted rounded animate-pulse"></div>
                  </div>
                ))
              ) : (
                <>
                  <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div>
                      <p className="font-medium">Calculus Chapter 5</p>
                      <p className="text-sm text-muted-foreground">
                        Updated 2 hours ago
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      Open
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div>
                      <p className="font-medium">Biology Lab Notes</p>
                      <p className="text-sm text-muted-foreground">
                        Updated yesterday
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      Open
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div>
                      <p className="font-medium">History Essay Draft</p>
                      <p className="text-sm text-muted-foreground">
                        Updated 3 days ago
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      Open
                    </Button>
                  </div>
                </>
              )}
              <div className="text-center py-4">
                <Button variant="ghost" asChild>
                  <Link href="/notes">View All Notes</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
