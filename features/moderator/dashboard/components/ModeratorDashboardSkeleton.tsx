"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  Flag,
  Calendar,
  FileText,
  Shield,
  Activity,
  AlertCircle,
  TrendingUp,
} from "lucide-react";

export function ModeratorDashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex items-center justify-end gap-3">
        <Skeleton className="h-9 w-20" /> {/* Refresh Button */}
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
        {[
          { title: "Active Users", icon: Users },
          { title: "Pending Reports", icon: Flag },
          { title: "Sessions Moderated", icon: Calendar },
          { title: "Content Reviewed", icon: FileText },
        ].map((item, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {item.title}
              </CardTitle>
              <item.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-8 w-16" /> {/* Main number */}
              <Skeleton className="h-3 w-24" /> {/* Subtitle */}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="reports">
            Reports
            <Skeleton className="h-5 w-4 ml-2 rounded-full" />{" "}
            {/* Badge placeholder */}
          </TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="content">Content Review</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Quick Actions */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Flag, title: "Review Reports" },
              { icon: FileText, title: "Moderate Content" },
              { icon: Users, title: "Manage Users" },
              { icon: TrendingUp, title: "Platform Analytics" },
            ].map((item, index) => (
              <Card
                key={index}
                className="hover:shadow-md transition-shadow cursor-pointer group"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <item.icon className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
                    {index === 0 && (
                      <Skeleton className="h-5 w-4 rounded-full" /> /* Badge placeholder */
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-6 w-32 mb-1" /> {/* Title */}
                  <Skeleton className="h-4 w-full" /> {/* Description */}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Activity Summary */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Recent Reports
                </CardTitle>
                <Skeleton className="h-4 w-48" /> {/* Description */}
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div className="space-y-1 flex-1">
                        <Skeleton className="h-4 w-3/4" /> {/* Report title */}
                        <Skeleton className="h-3 w-1/2" /> {/* Timestamp */}
                      </div>
                      <Skeleton className="h-6 w-16 rounded-full" />{" "}
                      {/* Priority badge */}
                    </div>
                  ))}
                </div>
                <Skeleton className="h-9 w-full mt-4" /> {/* View All Button */}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Recent Actions
                </CardTitle>
                <Skeleton className="h-4 w-48" /> {/* Description */}
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div className="space-y-1 flex-1">
                        <Skeleton className="h-4 w-3/4" /> {/* Action title */}
                        <Skeleton className="h-3 w-1/2" />{" "}
                        {/* Action description */}
                      </div>
                      <Skeleton className="h-3 w-12" /> {/* Timestamp */}
                    </div>
                  ))}
                </div>
                <Skeleton className="h-9 w-full mt-4" />{" "}
                {/* View Activity Log Button */}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Reports</CardTitle>
              <Skeleton className="h-4 w-64" /> {/* Description */}
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Flag className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <Skeleton className="h-6 w-48 mx-auto mb-2" /> {/* Title */}
                <Skeleton className="h-4 w-64 mx-auto" /> {/* Description */}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          {/* User Management Skeleton - Similar to AdminDashboardSkeleton */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-7 w-40" /> {/* Title */}
              <Skeleton className="h-4 w-80" /> {/* Description */}
            </div>

            {/* Search and Filter */}
            <div className="flex items-center justify-between gap-4">
              <Skeleton className="h-10 flex-1 max-w-sm" /> {/* Search */}
              <div className="flex gap-2">
                <Skeleton className="h-10 w-32" /> {/* Filter */}
                <Skeleton className="h-10 w-28" /> {/* Add User Button */}
              </div>
            </div>

            {/* User Table */}
            <Card>
              <CardContent className="p-0">
                <div className="space-y-4 p-6">
                  {/* Table Header */}
                  <div className="grid grid-cols-12 gap-4 text-sm font-medium text-muted-foreground">
                    <div className="col-span-3">User</div>
                    <div className="col-span-2">Role</div>
                    <div className="col-span-3">Activity</div>
                    <div className="col-span-2">Joined</div>
                    <div className="col-span-2">Actions</div>
                  </div>

                  {/* Table Rows */}
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="grid grid-cols-12 gap-4 items-center py-3 border-t"
                    >
                      {/* User */}
                      <div className="col-span-3 flex items-center gap-3">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-3 w-32" />
                        </div>
                      </div>

                      {/* Role */}
                      <div className="col-span-2">
                        <Skeleton className="h-6 w-16 rounded-full" />
                      </div>

                      {/* Activity */}
                      <div className="col-span-3 space-y-1">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-3 w-16" />
                      </div>

                      {/* Joined */}
                      <div className="col-span-2">
                        <Skeleton className="h-4 w-20" />
                      </div>

                      {/* Actions */}
                      <div className="col-span-2">
                        <Skeleton className="h-8 w-8 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Review</CardTitle>
              <Skeleton className="h-4 w-64" /> {/* Description */}
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <Skeleton className="h-6 w-48 mx-auto mb-2" /> {/* Title */}
                <Skeleton className="h-4 w-64 mx-auto" /> {/* Description */}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
              <Skeleton className="h-4 w-64" /> {/* Description */}
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <Skeleton className="h-6 w-48 mx-auto mb-2" /> {/* Title */}
                <Skeleton className="h-4 w-64 mx-auto" /> {/* Description */}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
