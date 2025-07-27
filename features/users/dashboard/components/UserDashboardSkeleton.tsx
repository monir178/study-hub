"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  FileText,
  Plus,
  Timer,
  Clock,
  BarChart3,
  Target,
  BookOpen,
} from "lucide-react";

export function UserDashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Study Sessions", icon: Clock },
          { title: "Total Hours", icon: Timer },
          { title: "Notes Created", icon: FileText },
          { title: "Goals Achieved", icon: Target },
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

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            icon: Plus,
            title: "Create Room",
            description: "Start a new study session",
          },
          {
            icon: Users,
            title: "Browse Rooms",
            description: "Find active study rooms",
          },
          {
            icon: Timer,
            title: "Pomodoro Timer",
            description: "Focus with timed sessions",
          },
          {
            icon: FileText,
            title: "My Notes",
            description: "Access saved notes",
          },
        ].map((item, index) => (
          <Card
            key={index}
            className="hover:shadow-md transition-shadow cursor-pointer group"
          >
            <CardHeader className="pb-3">
              <item.icon className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-6 w-32 mb-1" /> {/* Title */}
              <Skeleton className="h-4 w-full" /> {/* Description */}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Study Rooms</CardTitle>
            <Skeleton className="h-4 w-48" /> {/* Description */}
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="space-y-1">
                    <Skeleton className="h-5 w-48" /> {/* Room name */}
                    <Skeleton className="h-4 w-32" /> {/* Members info */}
                  </div>
                  <Skeleton className="h-8 w-16" /> {/* Join button */}
                </div>
              ))}
              <div className="text-center py-4">
                <Skeleton className="h-9 w-32 mx-auto" />{" "}
                {/* View All Button */}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Notes</CardTitle>
            <Skeleton className="h-4 w-48" /> {/* Description */}
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="space-y-1">
                    <Skeleton className="h-5 w-40" /> {/* Note title */}
                    <Skeleton className="h-4 w-28" /> {/* Last updated */}
                  </div>
                  <Skeleton className="h-8 w-16" /> {/* Open button */}
                </div>
              ))}
              <div className="text-center py-4">
                <Skeleton className="h-9 w-32 mx-auto" />{" "}
                {/* View All Button */}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Study Progress */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Weekly Progress
            </CardTitle>
            <Skeleton className="h-4 w-48" /> {/* Description */}
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-32 w-full" /> {/* Chart placeholder */}
              <div className="flex justify-between text-sm">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-18" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Learning Goals
            </CardTitle>
            <Skeleton className="h-4 w-48" /> {/* Description */}
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-32" /> {/* Goal name */}
                    <Skeleton className="h-4 w-12" /> {/* Percentage */}
                  </div>
                  <Skeleton className="h-2 w-full" /> {/* Progress bar */}
                </div>
              ))}
              <div className="text-center pt-2">
                <Skeleton className="h-9 w-28 mx-auto" />{" "}
                {/* View All Button */}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Feed</CardTitle>
          <Skeleton className="h-4 w-48" /> {/* Description */}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 border rounded-lg"
              >
                <Skeleton className="h-8 w-8 rounded-full" /> {/* Avatar */}
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-3/4" />{" "}
                  {/* Activity description */}
                  <Skeleton className="h-3 w-1/4" /> {/* Timestamp */}
                </div>
              </div>
            ))}
            <div className="text-center">
              <Skeleton className="h-9 w-32 mx-auto" /> {/* Load More Button */}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
