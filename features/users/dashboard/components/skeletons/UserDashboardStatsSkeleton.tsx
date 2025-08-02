"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Timer, Users, BookOpen } from "lucide-react";

export function UserDashboardStatsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[
        { title: "Study Sessions", icon: Timer },
        { title: "Joined Rooms", icon: Users },
        { title: "Created Rooms", icon: BookOpen },
        { title: "Private Rooms", icon: BookOpen },
      ].map((item, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
            <item.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <Skeleton className="h-8 w-12" />
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <Skeleton className="h-4 w-16 bg-green-100" />
              <Skeleton className="h-3 w-20" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
