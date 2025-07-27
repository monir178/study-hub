"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Users,
  FileText,
  Shield,
  Flag,
  Activity,
  RefreshCw,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import { UserManagement } from "@/features/admin/dashboard/components/user-management.component";
import { useModeratorStats } from "../../hooks/useModeratorStats";

export function ModeratorDashboard() {
  // Use TanStack Query hook for stats instead of mock data
  const {
    data: stats,
    isLoading: loading,
    // error,
    refetch,
    isRefetching,
  } = useModeratorStats();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                <div className="h-4 w-4 bg-muted animate-pulse rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-12 bg-muted animate-pulse rounded mb-2" />
                <div className="h-3 w-24 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex items-center justify-end gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isRefetching}
        >
          <RefreshCw
            className={`w-4 h-4 mr-2 ${isRefetching ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
        <Badge
          variant="secondary"
          className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
        >
          <Shield className="w-4 h-4 mr-1" />
          Moderator
        </Badge>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.users.active || 0}</div>
            <p className="text-xs text-muted-foreground">
              +{stats?.users.newThisWeek || 0} new this week
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
            <div className="text-2xl font-bold text-orange-600">
              {stats?.reports.pending || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.reports.resolved || 0} resolved this month
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
              {stats?.sessions.moderated || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.sessions.thisWeek || 0} sessions this week
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
              {stats?.content.reviewed || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.content.flagged || 0} flagged items
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="reports">
            Reports
            {stats?.reports.pending && stats.reports.pending > 0 && (
              <Badge variant="destructive" className="ml-2">
                {stats.reports.pending}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="content">Content Review</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Quick Actions */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="hover:shadow-md transition-shadow cursor-pointer group">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Flag className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
                  {stats?.reports.pending && stats.reports.pending > 0 && (
                    <Badge variant="destructive">{stats.reports.pending}</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-lg mb-1">Review Reports</CardTitle>
                <CardDescription>
                  Handle user reports and complaints
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer group">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <FileText className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
                  {stats?.content.flagged && stats.content.flagged > 0 && (
                    <Badge variant="secondary">{stats.content.flagged}</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-lg mb-1">Moderate Content</CardTitle>
                <CardDescription>
                  Review and approve flagged content
                </CardDescription>
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
                <CardDescription>
                  Monitor user behavior and promote moderators
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer group">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <TrendingUp className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-lg mb-1">
                  Platform Analytics
                </CardTitle>
                <CardDescription>
                  View moderation metrics and trends
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity Summary */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Recent Reports
                </CardTitle>
                <CardDescription>
                  Latest user reports requiring attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="text-sm font-medium">
                        Inappropriate content in Study Room #42
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Reported 2 hours ago
                      </p>
                    </div>
                    <Badge variant="destructive">High</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="text-sm font-medium">
                        User harassment complaint
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Reported 4 hours ago
                      </p>
                    </div>
                    <Badge variant="outline" className="text-orange-600">
                      Medium
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="text-sm font-medium">
                        Spam messages in chat
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Reported 1 day ago
                      </p>
                    </div>
                    <Badge variant="outline">Low</Badge>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4" size="sm">
                  View All Reports
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Recent Actions
                </CardTitle>
                <CardDescription>
                  Your recent moderation activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="text-sm font-medium">
                        Resolved harassment report
                      </p>
                      <p className="text-xs text-muted-foreground">
                        User warned and content removed
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      2h ago
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="text-sm font-medium">
                        Promoted Sarah to moderator
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Role updated successfully
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      4h ago
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="text-sm font-medium">
                        Approved study guide content
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Content published to library
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      1d ago
                    </span>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4" size="sm">
                  View Activity Log
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>User Reports</CardTitle>
              <CardDescription>Review and manage user reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Flag className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Reports Management</h3>
                <p className="text-sm">
                  This feature will be implemented with the reports API.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          {/* Use the existing UserManagement component with moderator permissions */}
          <UserManagement />
        </TabsContent>

        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>Content Review</CardTitle>
              <CardDescription>
                Review flagged content and approve submissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Content Moderation</h3>
                <p className="text-sm">
                  This feature will be implemented with the content API.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
              <CardDescription>
                Your moderation activity history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Activity Tracking</h3>
                <p className="text-sm">
                  This feature will be implemented with the activity API.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
