"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Users, Timer, FileText } from "lucide-react";

export function UserDashboardBentoSkeleton() {
  return (
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
            <Skeleton className="h-6 w-32 mb-1" />
            <Skeleton className="h-4 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
