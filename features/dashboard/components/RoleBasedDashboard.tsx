"use client";

import { useEffect, useState } from "react";
import { AdminDashboard } from "@/features/admin/components/AdminDashboard";
import { UserDashboard } from "@/features/user/components/UserDashboard";
import { ModeratorDashboard } from "@/features/moderator/components/ModeratorDashboard";

interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: "USER" | "MODERATOR" | "ADMIN";
}

interface RoleBasedDashboardProps {
  user: User;
}

export function RoleBasedDashboard({ user }: RoleBasedDashboardProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Loading your dashboard...</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-32 bg-muted animate-pulse rounded-lg"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  // Render dashboard based on user role
  switch (user.role) {
    case "ADMIN":
      return <AdminDashboard />;
    case "MODERATOR":
      return <ModeratorDashboard />;
    case "USER":
    default:
      return <UserDashboard />;
  }
}
