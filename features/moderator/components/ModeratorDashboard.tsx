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
  Calendar,
  Users,
  FileText,
  BarChart3,
  Shield,
  Flag,
} from "lucide-react";
import Link from "next/link";

interface ModeratorStats {
  users: {
    total: number;
    active: number;
  };
  sessions: {
    total: number;
    thisWeek: number;
    moderated: number;
  };
  reports: {
    pending: number;
    resolved: number;
  };
  content: {
    reviewed: number;
    flagged: number;
  };
}

export function ModeratorDashboard() {
  const [stats, setStats] = useState<ModeratorStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchModeratorStats();
  }, []);

  const fetchModeratorStats = async () => {
    try {
      // This would fetch real data from API
      // For now, using mock data
      setStats({
        users: { total: 245, active: 123 },
        sessions: { total: 178, thisWeek: 32, moderated: 45 },
        reports: { pending: 8, resolved: 67 },
        content: { reviewed: 234, flagged: 12 },
      });
    } catch (error) {
      console.error("Failed to fetch moderator stats:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Moderator Dashboard</h1>
          <p className="text-muted-foreground">
            Manage community content, moderate sessions, and maintain platform
            quality
          </p>
        </div>
        <Badge
          variant="secondary"
          className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
        >
          <Shield className="w-4 h-4 mr-1" />
          Moderator
        </Badge>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-md transition-shadow cursor-pointer group">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <Flag className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
            </div>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-lg mb-1">Review Reports</CardTitle>
            <CardDescription>Handle user reports and flags</CardDescription>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer group">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <FileText className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
            </div>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-lg mb-1">Moderate Content</CardTitle>
            <CardDescription>Review and approve content</CardDescription>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer group">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <Users className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
            </div>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-lg mb-1">Manage Users</CardTitle>
            <CardDescription>Monitor user behavior</CardDescription>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer group">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <BarChart3 className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
            </div>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-lg mb-1">View Analytics</CardTitle>
            <CardDescription>Monitor platform activity</CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : stats?.users.active || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              of {loading ? "..." : stats?.users.total || 0} total users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Reports
            </CardTitle>
            <Flag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : stats?.reports.pending || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {loading ? "..." : stats?.reports.resolved || 0} resolved this
              week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Content Reviewed
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : stats?.content.reviewed || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {loading ? "..." : stats?.content.flagged || 0} flagged items
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Sessions Moderated
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : stats?.sessions.moderated || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {loading ? "..." : stats?.sessions.thisWeek || 0} this week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Pending Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Reports</CardTitle>
            <CardDescription>User reports requiring attention</CardDescription>
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
                      <p className="font-medium">
                        Inappropriate content in chat
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Flag className="w-3 h-3 text-red-500" />
                        Reported by Sarah M. - 2 hours ago
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Room: Mathematics Study Group
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      Review
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div>
                      <p className="font-medium">Spam messages</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Flag className="w-3 h-3 text-orange-500" />
                        Reported by Mike J. - 5 hours ago
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Room: Physics Discussion
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      Review
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div>
                      <p className="font-medium">User harassment</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Flag className="w-3 h-3 text-red-500" />
                        Reported by Emma K. - 1 day ago
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Room: Chemistry Lab
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      Review
                    </Button>
                  </div>
                </>
              )}
              <div className="text-center py-4">
                <Button variant="ghost" asChild>
                  <Link href="/dashboard?tab=reports">View All Reports</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Moderation Activity</CardTitle>
            <CardDescription>Your recent moderation actions</CardDescription>
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
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Shield className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Resolved spam report</p>
                      <p className="text-sm text-muted-foreground">
                        Removed inappropriate messages - 1 hour ago
                      </p>
                    </div>
                    <Badge variant="outline" className="text-green-600">
                      Resolved
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">User warning issued</p>
                      <p className="text-sm text-muted-foreground">
                        Warning for inappropriate behavior - 3 hours ago
                      </p>
                    </div>
                    <Badge variant="outline" className="text-blue-600">
                      Action Taken
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <FileText className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Content approved</p>
                      <p className="text-sm text-muted-foreground">
                        Approved study material upload - 5 hours ago
                      </p>
                    </div>
                    <Badge variant="outline" className="text-purple-600">
                      Approved
                    </Badge>
                  </div>
                </>
              )}
              <div className="text-center py-4">
                <Button variant="ghost" asChild>
                  <Link href="/dashboard?tab=activity">View All Activity</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
