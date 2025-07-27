"use client";

import { DashboardStats } from "@/features/dashboard/components/DashboardStats";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, FileText, Plus, Timer } from "lucide-react";
import Link from "next/link";

export function UserDashboard() {
  return (
    <div className="space-y-6">
      <DashboardStats role="USER" />

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-md transition-shadow cursor-pointer group">
          <CardHeader className="pb-3">
            <Plus className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
          </CardHeader>
          <CardContent>
            <CardTitle className="text-lg mb-1">Create Room</CardTitle>
            <CardDescription>Start a new study session</CardDescription>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer group">
          <CardHeader className="pb-3">
            <Users className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
          </CardHeader>
          <CardContent>
            <CardTitle className="text-lg mb-1">Browse Rooms</CardTitle>
            <CardDescription>Find active study rooms</CardDescription>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer group">
          <CardHeader className="pb-3">
            <Timer className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
          </CardHeader>
          <CardContent>
            <CardTitle className="text-lg mb-1">Pomodoro Timer</CardTitle>
            <CardDescription>Focus with timed sessions</CardDescription>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer group">
          <CardHeader className="pb-3">
            <FileText className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
          </CardHeader>
          <CardContent>
            <CardTitle className="text-lg mb-1">My Notes</CardTitle>
            <CardDescription>Access saved notes</CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Study Rooms</CardTitle>
            <CardDescription>Your recently joined rooms</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                <div>
                  <p className="font-medium">Mathematics Study Group</p>
                  <p className="text-sm text-muted-foreground">
                    3 members active
                  </p>
                </div>
                <Button size="sm" variant="outline">
                  Join
                </Button>
              </div>
              <div className="text-center py-4">
                <Button variant="ghost" asChild>
                  <Link href="/rooms">View All Rooms</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Notes</CardTitle>
            <CardDescription>Your latest study notes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
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
