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
import { Users } from "lucide-react";
import { RecentUser } from "../types";
import { formatDistanceToNow } from "date-fns";

interface RecentUsersProps {
  users: RecentUser[];
  loading?: boolean;
}

export function RecentUsers({ users, loading }: RecentUsersProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Recent Users
          </CardTitle>
          <CardDescription>
            Latest users who joined the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-3 rounded-lg border">
                <div className="h-4 w-3/4 bg-muted animate-pulse rounded mb-2" />
                <div className="h-3 w-1/2 bg-muted animate-pulse rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getRoleColor = (role: RecentUser["role"]) => {
    switch (role) {
      case "ADMIN":
        return "destructive";
      case "MODERATOR":
        return "default";
      case "USER":
        return "secondary";
      default:
        return "secondary";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Recent Users
        </CardTitle>
        <CardDescription>Latest users who joined the platform</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {users.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No recent users</p>
            </div>
          ) : (
            users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 rounded-lg border"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {user.name || "Anonymous User"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {user.email} • Joined{" "}
                    {formatDistanceToNow(new Date(user.createdAt))} ago
                  </p>
                </div>
                <Badge variant={getRoleColor(user.role)}>{user.role}</Badge>
              </div>
            ))
          )}
        </div>
        {users.length > 0 && (
          <Button variant="outline" className="w-full mt-4" size="sm">
            View All Users
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
