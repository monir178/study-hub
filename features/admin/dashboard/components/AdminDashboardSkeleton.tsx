"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, BarChart3, Settings, Shield } from "lucide-react";

export function AdminDashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-9 w-64" /> {/* Title */}
          <Skeleton className="h-4 w-96" /> {/* Description */}
        </div>
        <Badge
          variant="secondary"
          className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
        >
          <Shield className="w-4 h-4 mr-1" />
          Admin Access
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Total Users", icon: Users },
          { title: "Active Sessions", icon: Users },
          { title: "Study Rooms", icon: Users },
          { title: "Messages Today", icon: Users },
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
              {index === 0 && (
                <div className="flex gap-2 mt-2">
                  <Skeleton className="h-5 w-16" /> {/* Badge 1 */}
                  <Skeleton className="h-5 w-16" /> {/* Badge 2 */}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">
            <Users className="w-4 h-4 mr-2" />
            User Management
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          {/* User Management Skeleton */}
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

        <TabsContent value="analytics" className="space-y-4">
          {/* Analytics Skeleton */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-7 w-32" /> {/* Title */}
              <Skeleton className="h-4 w-64" /> {/* Description */}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Chart Cards */}
              {[1, 2, 3, 4].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <CardTitle>
                      <Skeleton className="h-5 w-32" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-64 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          {/* Settings Skeleton */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-7 w-40" /> {/* Title */}
              <Skeleton className="h-4 w-72" /> {/* Description */}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {[1, 2].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <CardTitle>
                      <Skeleton className="h-5 w-40" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[1, 2, 3].map((j) => (
                      <div
                        key={j}
                        className="flex items-center justify-between"
                      >
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-48" />
                        </div>
                        <Skeleton className="h-6 w-10 rounded-full" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
