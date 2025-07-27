"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Search,
  UserPlus,
  MoreHorizontal,
  // Edit,
  Trash2,
  Shield,
  Crown,
  User as UserIcon,
  RefreshCw,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useUsers,
  useSearchUsers,
  useUpdateUserRole,
  useDeleteUser,
} from "@/features/users/hooks/useUsers";
import { User } from "@/features/users/types";
import { useAuth } from "@/lib/hooks/useAuth";
import { useDebounce } from "@/lib/hooks/useDebounce";

export function UserManagement() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);

  // Debounce search query for better performance
  const debouncedSearch = useDebounce(search, 500);

  // Get current user to check permissions
  const { user: currentUser } = useAuth();

  // Use database search when there's a query, otherwise get all users
  const shouldUseSearch =
    debouncedSearch.trim().length > 0 || (roleFilter && roleFilter !== "all");

  const {
    data: allUsers = [],
    isLoading: loadingAll,
    error: errorAll,
    refetch: refetchAll,
    isRefetching: isRefetchingAll,
  } = useUsers({ enabled: !shouldUseSearch });

  const {
    data: searchUsers = [],
    isLoading: loadingSearch,
    error: errorSearch,
    refetch: refetchSearch,
    isRefetching: isRefetchingSearch,
  } = useSearchUsers(debouncedSearch, roleFilter, {
    enabled: Boolean(shouldUseSearch),
  });

  // Use the appropriate data source
  const users = shouldUseSearch ? searchUsers : allUsers;
  const loading = shouldUseSearch ? loadingSearch : loadingAll;
  const error = shouldUseSearch ? errorSearch : errorAll;
  const refetch = shouldUseSearch ? refetchSearch : refetchAll;
  const isRefetching = shouldUseSearch ? isRefetchingSearch : isRefetchingAll;

  // Mutation hooks
  const updateUserRole = useUpdateUserRole();
  const deleteUser = useDeleteUser();

  // Permission checking functions
  const canDeleteUser = (user: User) => {
    // Admin cannot be deleted by anyone, including themselves
    if (user.role === "ADMIN") return false;
    // Only admin can delete users
    return currentUser?.role === "ADMIN";
  };

  // const canChangeRole = (user: User, targetRole: string) => {
  //   // Admin role cannot be changed by anyone except themselves
  //   if (user.role === "ADMIN" && currentUser?.id !== user.id) return false;

  //   // Only admin can assign admin role
  //   if (targetRole === "ADMIN") return currentUser?.role === "ADMIN";

  //   // Admin can change any role
  //   if (currentUser?.role === "ADMIN") return true;

  //   // Moderator can only make users moderators, or demote themselves to user
  //   if (currentUser?.role === "MODERATOR") {
  //     if (currentUser.id === user.id && targetRole === "USER") return true; // Allow self-demotion
  //     return targetRole === "MODERATOR" && user.role === "USER";
  //   }

  //   return false;
  // };

  const shouldShowActionDropdown = (user: User) => {
    // Don't show dropdown for admin users (even for admin themselves)
    if (user.role === "ADMIN") return false;

    // Show if there are available roles or if user can be deleted
    return getAvailableRoles(user).length > 0 || canDeleteUser(user);
  };

  const getAvailableRoles = (user: User) => {
    const roles = [];

    if (currentUser?.role === "ADMIN") {
      // Admin can assign any role to any user (except changing other admins)
      if (user.role === "ADMIN" && currentUser.id !== user.id) {
        // Can't change other admin's role
        return [];
      }
      roles.push("USER", "MODERATOR", "ADMIN");
    } else if (currentUser?.role === "MODERATOR") {
      // Moderator can promote users to moderator or demote themselves to user
      if (user.role === "USER") {
        roles.push("USER", "MODERATOR");
      } else if (currentUser.id === user.id && user.role === "MODERATOR") {
        roles.push("USER", "MODERATOR"); // Allow self-demotion
      }
    }

    return roles.filter((role) => role !== user.role);
  };

  const handleRoleUpdate = async (
    userId: string,
    newRole: "USER" | "ADMIN" | "MODERATOR",
  ) => {
    try {
      await updateUserRole.mutateAsync({ userId, role: newRole });
    } catch (error) {
      console.error("Failed to update role:", error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser.mutateAsync(userId);
      setDeleteUserId(null); // Close the dialog
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  const handleRefresh = () => {
    if (shouldUseSearch) {
      refetchSearch();
    } else {
      refetchAll();
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "ADMIN":
        return <Crown className="w-4 h-4" />;
      case "MODERATOR":
        return <Shield className="w-4 h-4" />;
      default:
        return <UserIcon className="w-4 h-4" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "MODERATOR":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      default:
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    }
  };

  // Loading state
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-[180px]" />
            <Skeleton className="h-10 w-[120px]" />
          </div>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Activity</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Skeleton className="w-10 h-10 rounded-full" />
                        <div className="space-y-1">
                          <Skeleton className="w-24 h-4" />
                          <Skeleton className="w-32 h-3" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="w-16 h-6 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="w-20 h-4" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="w-24 h-4" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="w-8 h-8 rounded ml-auto" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-destructive">
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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>User Management ({users.length})</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
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
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search users by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="USER">Users</SelectItem>
              <SelectItem value="MODERATOR">Moderators</SelectItem>
              <SelectItem value="ADMIN">Admins</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <UserPlus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>

        {/* Users Table */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user: User) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage
                            src={user.image || ""}
                            alt={user.name || ""}
                          />
                          <AvatarFallback>
                            {user.name?.charAt(0) || user.email.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {user.name || "No name"}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`${getRoleBadgeColor(user.role)} flex items-center gap-1 w-fit`}
                      >
                        {getRoleIcon(user.role)}
                        {user.role}
                        {user.role === "ADMIN" && (
                          <Shield className="w-3 h-3 ml-1 opacity-60" />
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {shouldShowActionDropdown(user) ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {/* Role Management */}
                            {getAvailableRoles(user).length > 0 && (
                              <>
                                {getAvailableRoles(user).map((role) => (
                                  <DropdownMenuItem
                                    key={role}
                                    onClick={() =>
                                      handleRoleUpdate(
                                        user.id,
                                        role as "USER" | "ADMIN" | "MODERATOR",
                                      )
                                    }
                                    disabled={updateUserRole.isPending}
                                  >
                                    {role === "ADMIN" && (
                                      <Crown className="mr-2 h-4 w-4" />
                                    )}
                                    {role === "MODERATOR" && (
                                      <Shield className="mr-2 h-4 w-4" />
                                    )}
                                    {role === "USER" && (
                                      <UserIcon className="mr-2 h-4 w-4" />
                                    )}
                                    Make{" "}
                                    {role === "USER"
                                      ? "User"
                                      : role === "ADMIN"
                                        ? "Admin"
                                        : "Moderator"}
                                  </DropdownMenuItem>
                                ))}
                              </>
                            )}

                            {/* Delete User - Only if allowed */}
                            {canDeleteUser(user) && (
                              <>
                                {getAvailableRoles(user).length > 0 && (
                                  <DropdownMenuSeparator />
                                )}
                                <AlertDialog
                                  open={deleteUserId === user.id}
                                  onOpenChange={(open) =>
                                    !open && setDeleteUserId(null)
                                  }
                                >
                                  <AlertDialogTrigger asChild>
                                    <DropdownMenuItem
                                      className="text-red-600"
                                      onSelect={(e) => {
                                        e.preventDefault();
                                        setDeleteUserId(user.id);
                                      }}
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Delete User
                                    </DropdownMenuItem>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        Delete User
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete{" "}
                                        <strong>
                                          {user.name || user.email}
                                        </strong>
                                        ? This action cannot be undone and will
                                        permanently remove the user and all
                                        their data.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>
                                        Cancel
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() =>
                                          handleDeleteUser(user.id)
                                        }
                                        disabled={deleteUser.isPending}
                                        className="bg-red-600 hover:bg-red-700"
                                      >
                                        {deleteUser.isPending
                                          ? "Deleting..."
                                          : "Delete User"}
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        <div className="text-muted-foreground text-sm">-</div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Summary */}
        <div className="text-sm text-muted-foreground">
          Showing {users.length} users
          {shouldUseSearch && debouncedSearch && (
            <span> • Search: "{debouncedSearch}"</span>
          )}
          {roleFilter && roleFilter !== "all" && (
            <span> • Role: {roleFilter}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
