"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Search, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown, Shield, User as UserIcon, Trash2 } from "lucide-react";

import { User } from "@/features/users/types";
import { useAuth } from "@/lib/hooks/useAuth";
import {
  useUsers,
  useSearchUsers,
  useUpdateUserRole,
  useDeleteUser,
} from "@/features/users/hooks/useUsers";
import { useDebounce } from "@/lib/hooks/useDebounce";

interface UsersDataTableProps {
  className?: string;
}

export function UsersDataTable({}: UsersDataTableProps) {
  const [search, setSearch] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState("");
  const [deleteUserId, setDeleteUserId] = React.useState<string | null>(null);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Debounce search query for better performance
  const debouncedSearch = useDebounce(search, 500);

  // Get current user to check permissions
  const { user: currentUser } = useAuth();

  // Use database search when there's a query, otherwise get all users
  const shouldUseSearch =
    debouncedSearch.trim().length > 0 || (roleFilter && roleFilter !== "all");

  const {
    data: allUsersResponse,
    isLoading: loadingAll,
    error: errorAll,
    refetch: refetchAll,
    isRefetching: isRefetchingAll,
  } = useUsers(pagination.pageIndex + 1, pagination.pageSize, {
    enabled: !shouldUseSearch,
  });

  const {
    data: searchResponse,
    isLoading: loadingSearch,
    error: errorSearch,
    refetch: refetchSearch,
    isRefetching: isRefetchingSearch,
  } = useSearchUsers(
    debouncedSearch,
    roleFilter,
    pagination.pageIndex + 1,
    pagination.pageSize,
    { enabled: Boolean(shouldUseSearch) },
  );

  // Use the appropriate data source
  const response = shouldUseSearch ? searchResponse : allUsersResponse;
  const users = response?.data || [];
  const paginationInfo = response?.pagination;
  const loading = shouldUseSearch ? loadingSearch : loadingAll;
  const error = shouldUseSearch ? errorSearch : errorAll;
  const refetch = shouldUseSearch ? refetchSearch : refetchAll;
  const isRefetching = shouldUseSearch ? isRefetchingSearch : isRefetchingAll;

  // Mutation hooks
  const updateUserRole = useUpdateUserRole();
  const deleteUser = useDeleteUser();

  // Permission checking functions
  const canDeleteUser = (user: User) => {
    if (user.role === "ADMIN") return false;
    return currentUser?.role === "ADMIN";
  };

  const shouldShowActionDropdown = (user: User) => {
    if (user.role === "ADMIN") return false;
    return getAvailableRoles(user).length > 0 || canDeleteUser(user);
  };

  const getAvailableRoles = (user: User) => {
    const roles = [];

    if (currentUser?.role === "ADMIN") {
      if (user.role === "ADMIN" && currentUser.id !== user.id) {
        return [];
      }
      roles.push("USER", "MODERATOR", "ADMIN");
    } else if (currentUser?.role === "MODERATOR") {
      if (user.role === "USER") {
        roles.push("MODERATOR");
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
      setDeleteUserId(null);
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  const handleRefresh = () => {
    refetch();
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

  // Define columns
  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2"
          >
            User
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={user.image || ""} alt={user.name || ""} />
              <AvatarFallback>
                {user.name?.charAt(0) || user.email.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{user.name || "No name"}</div>
              <div className="text-sm text-muted-foreground">{user.email}</div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <Badge
            className={`${getRoleBadgeColor(user.role)} flex items-center gap-1 w-fit`}
          >
            {getRoleIcon(user.role)}
            {user.role}
            {user.role === "ADMIN" && (
              <Shield className="w-3 h-3 ml-1 opacity-60" />
            )}
          </Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Joined",
      cell: ({ row }) => {
        return (
          <div className="text-sm">
            {new Date(row.getValue("createdAt")).toLocaleDateString()}
          </div>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const user = row.original;

        if (!shouldShowActionDropdown(user)) {
          return <div className="text-muted-foreground text-sm">-</div>;
        }

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
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
                      {role === "ADMIN" && <Crown className="mr-2 h-4 w-4" />}
                      {role === "MODERATOR" && (
                        <Shield className="mr-2 h-4 w-4" />
                      )}
                      {role === "USER" && <UserIcon className="mr-2 h-4 w-4" />}
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

              {canDeleteUser(user) && (
                <>
                  {getAvailableRoles(user).length > 0 && (
                    <DropdownMenuSeparator />
                  )}
                  <AlertDialog
                    open={deleteUserId === user.id}
                    onOpenChange={(open) => !open && setDeleteUserId(null)}
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
                        <AlertDialogTitle>Delete User</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete{" "}
                          <strong>{user.name || user.email}</strong>? This
                          action cannot be undone and will permanently remove
                          the user and all their data.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={deleteUser.isPending}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          {deleteUser.isPending ? "Deleting..." : "Delete User"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  // Update table pagination when data changes
  React.useEffect(() => {
    if (paginationInfo) {
      const newPageCount = paginationInfo.totalPages;
      if (pagination.pageIndex >= newPageCount && newPageCount > 0) {
        setPagination((prev) => ({ ...prev, pageIndex: newPageCount - 1 }));
      }
    }
  }, [paginationInfo, pagination.pageIndex]);

  const table = useReactTable({
    data: users,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    manualPagination: true,
    pageCount: paginationInfo?.totalPages ?? 0,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination,
    },
  });

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
          <CardTitle>
            User Management ({paginationInfo?.totalUsers || 0})
          </CardTitle>
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
          <div className="flex justify-between gap-4 items-center">
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className=" ">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="USER">Users</SelectItem>
                <SelectItem value="MODERATOR">Moderators</SelectItem>
                <SelectItem value="ADMIN">Admins</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">Rows per page</p>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger className="h-10 w-[70px]">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col md:flex-row items-center justify-between px-2">
          <div className="flex-1 text-sm text-muted-foreground">
            Showing {users.length} of {paginationInfo?.totalUsers || 0} users
            {debouncedSearch && <span> • Search: "{debouncedSearch}"</span>}
            {roleFilter && roleFilter !== "all" && (
              <span> • Role: {roleFilter}</span>
            )}
          </div>
          <div className="flex flex-col gap-4 md:flex-row items-center space-x-6 lg:space-x-8">
            <div className="flex w-[100px] items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                First
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                Last
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
