/**
 * Example: User Management Component using TanStack Query
 *
 * This demonstrates the feature-based architecture with TanStack Query
 */

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useUsers,
  useUpdateUserRole,
  useDeleteUser,
  usePrefetchUser,
} from "@/features/users/hooks/useUsers";
import {
  Users,
  UserCheck,
  UserX,
  Crown,
  Shield,
  Trash2,
  RefreshCw,
} from "lucide-react";

export function UserManagementExample() {
  // Query hooks - automatic caching, refetching, error handling
  const {
    data: users = [],
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useUsers();

  // Mutation hooks - optimistic updates, cache invalidation
  const updateUserRole = useUpdateUserRole();
  const deleteUser = useDeleteUser();
  const prefetchUser = usePrefetchUser();

  // Loading state
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            User Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-8 w-8 rounded" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <UserX className="w-5 h-5" />
            Failed to Load Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              {error?.message || "Failed to fetch users"}
            </p>
            <Button onClick={() => refetch()} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Helper functions
  const handleRoleUpdate = async (
    userId: string,
    newRole: "USER" | "ADMIN" | "MODERATOR",
  ) => {
    try {
      await updateUserRole.mutateAsync({ userId, role: newRole });
      // TanStack Query automatically updates the cache and re-renders
    } catch (error) {
      console.error("Failed to update role:", error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser.mutateAsync(userId);
        // Cache is automatically updated by the mutation
      } catch (error) {
        console.error("Failed to delete user:", error);
      }
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "MODERATOR":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "ADMIN":
        return Crown;
      case "MODERATOR":
        return Shield;
      default:
        return UserCheck;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            User Management ({users.length})
          </CardTitle>
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
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {users.map((user) => {
          const RoleIcon = getRoleIcon(user.role);

          return (
            <div
              key={user.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              onMouseEnter={() => prefetchUser(user.id)} // Prefetch on hover
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <RoleIcon className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-medium">
                    {user.name || "Unknown User"}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {user.email}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge className={getRoleColor(user.role)}>{user.role}</Badge>

                {/* Role Update Buttons */}
                <div className="flex gap-1">
                  {user.role !== "USER" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRoleUpdate(user.id, "USER")}
                      disabled={updateUserRole.isPending}
                    >
                      Make User
                    </Button>
                  )}
                  {user.role !== "MODERATOR" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRoleUpdate(user.id, "MODERATOR")}
                      disabled={updateUserRole.isPending}
                    >
                      Make Mod
                    </Button>
                  )}
                  {user.role !== "ADMIN" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRoleUpdate(user.id, "ADMIN")}
                      disabled={updateUserRole.isPending}
                    >
                      Make Admin
                    </Button>
                  )}
                </div>

                {/* Delete Button */}
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDeleteUser(user.id)}
                  disabled={deleteUser.isPending}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          );
        })}

        {users.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No users found
          </div>
        )}
      </CardContent>
    </Card>
  );
}
