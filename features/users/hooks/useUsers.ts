import { useApiQuery } from "@/lib/api/hooks/use-api-query";
import { useApiMutation } from "@/lib/api/hooks/use-api-mutation";
import { useCacheUtils } from "@/lib/api/hooks/use-cache-utils";
import { UserService } from "../services/user.service";
import { User, CreateUserData, UpdateUserData } from "../types";
import { queryKeys, createQueryKeys } from "@/lib/query/keys";
import { useDispatch } from "react-redux";
import { updateUser as updateAuthUser } from "@/features/auth/store/authSlice";
import { updateCurrentUser } from "@/features/users/store/usersSlice";

// ===============================================
// QUERIES
// ===============================================

/**
 * Hook to fetch all users (admin only)
 */
export function useUsers(options?: { enabled?: boolean }) {
  return useApiQuery<User[]>({
    queryKey: queryKeys.users,
    queryFn: () => UserService.getUsers(),
    options: {
      // Users data is fairly stable - increased stale time
      staleTime: 15 * 60 * 1000, // 15 minutes
      // Keep data in cache longer
      gcTime: 30 * 60 * 1000, // 30 minutes
      // Keep previous data while loading new data
      placeholderData: (previousData: User[] | undefined) => previousData,
      // Conditional enabling
      enabled: options?.enabled !== false,
    },
  });
}

/**
 * Hook to fetch a specific user by ID
 */
export function useUser(id: string) {
  return useApiQuery<User>({
    queryKey: queryKeys.user(id),
    queryFn: () => UserService.getUserById(id),
    options: {
      // Individual user data doesn't change often - increased stale time
      staleTime: 20 * 60 * 1000, // 20 minutes
      // Keep data in cache longer
      gcTime: 45 * 60 * 1000, // 45 minutes
      // Only run query if ID is provided
      enabled: !!id,
      // Keep previous data while loading new data
      placeholderData: (previousData: User | undefined) => previousData,
    },
  });
}

/**
 * Hook to fetch current user profile
 */
export function useUserProfile() {
  return useApiQuery<User>({
    queryKey: queryKeys.userProfile(),
    queryFn: () => UserService.getProfile(),
    options: {
      // Profile data is important and should be fresh
      staleTime: 30 * 1000, // 30 seconds
      // Retry on failure since profile is critical
      retry: 3,
    },
  });
}

/**
 * Hook to search users
 */
export function useSearchUsers(
  query: string,
  role?: string,
  options?: { enabled?: boolean },
) {
  const hasQuery = query && query.trim().length > 0;
  const hasRoleFilter = role && role !== "all";
  const shouldEnable = Boolean(
    options?.enabled !== false && (hasQuery || hasRoleFilter),
  );

  return useApiQuery<User[]>({
    queryKey: createQueryKeys.usersSearch(query, role),
    queryFn: () => UserService.searchUsers(query, role),
    options: {
      // Search results should be fresh
      staleTime: 2 * 60 * 1000, // 2 minutes
      // Only search if enabled and has query or role filter
      enabled: shouldEnable,
      // Keep previous data while loading new data
      placeholderData: (previousData: User[] | undefined) => previousData,
    },
  });
}

// ===============================================
// MUTATIONS
// ===============================================

/**
 * Hook to create a new user
 */
export function useCreateUser() {
  const cache = useCacheUtils();

  return useApiMutation<User, CreateUserData>({
    mutationFn: (userData) => UserService.createUser(userData),
    successMessage: "User created successfully",
    options: {
      onSuccess: (newUser) => {
        // Add the new user to the cache
        cache.appendToList(queryKeys.users, newUser);
        // Invalidate to update counts
        cache.invalidate(queryKeys.users);
      },
    },
  });
}

/**
 * Hook to update a user
 */
export function useUpdateUser() {
  const cache = useCacheUtils();

  return useApiMutation<User, { id: string; userData: UpdateUserData }>({
    mutationFn: ({ id, userData }) => UserService.updateUser(id, userData),
    successMessage: "User updated successfully",
    options: {
      onSuccess: (updatedUser, { id }) => {
        // Update the specific user in cache
        cache.update(queryKeys.user(id), updatedUser);

        // Update the user in the users list
        cache.updateInList(queryKeys.users, id, updatedUser);
      },
    },
  });
}

/**
 * Hook to update current user profile
 */
export function useUpdateProfile() {
  const cache = useCacheUtils();
  const dispatch = useDispatch();

  return useApiMutation<User, Partial<UpdateUserData>>({
    mutationFn: (userData) => UserService.updateProfile(userData),
    successMessage: "Profile updated successfully",
    options: {
      onSuccess: (updatedProfile) => {
        // Update profile in cache
        cache.update(queryKeys.userProfile(), updatedProfile);

        // Update Redux state for global consistency
        if (
          updatedProfile.name !== undefined ||
          updatedProfile.image !== undefined ||
          updatedProfile.role !== undefined
        ) {
          dispatch(
            updateAuthUser({
              ...(updatedProfile.name !== undefined && {
                name: updatedProfile.name || undefined,
              }),
              ...(updatedProfile.image !== undefined && {
                image: updatedProfile.image || undefined,
              }),
              ...(updatedProfile.role !== undefined && {
                role: updatedProfile.role,
              }),
            }),
          );
        }

        // Update users slice with converted data
        const userUpdate = {
          ...(updatedProfile.id && { id: updatedProfile.id }),
          ...(updatedProfile.name !== undefined && {
            name: updatedProfile.name,
          }),
          ...(updatedProfile.email && { email: updatedProfile.email }),
          ...(updatedProfile.image !== undefined && {
            image: updatedProfile.image,
          }),
          ...(updatedProfile.role && { role: updatedProfile.role }),
          ...(updatedProfile.createdAt && {
            createdAt: updatedProfile.createdAt,
          }),
          ...(updatedProfile.updatedAt && {
            updatedAt: updatedProfile.updatedAt,
          }),
        };
        dispatch(updateCurrentUser(userUpdate));
      },
    },
  });
}

/**
 * Hook to update a user's role (admin only)
 */
export function useUpdateUserRole() {
  const cache = useCacheUtils();

  return useApiMutation<
    User,
    { userId: string; role: "USER" | "ADMIN" | "MODERATOR" }
  >({
    mutationFn: ({ userId, role }) => UserService.updateUser(userId, { role }),
    successMessage: "User role updated successfully",
    options: {
      onSuccess: (updatedUser, { userId }) => {
        // Update the specific user in cache
        cache.update(queryKeys.user(userId), updatedUser);

        // Update the user in the users list
        cache.updateInList(queryKeys.users, userId, updatedUser);

        // Invalidate admin dashboard stats to update role counts
        cache.invalidate(queryKeys.adminDashboard());
      },
    },
  });
}

/**
 * Hook to delete a user
 */
export function useDeleteUser() {
  const cache = useCacheUtils();

  return useApiMutation<void, string>({
    mutationFn: (id) => UserService.deleteUser(id),
    successMessage: "User deleted successfully",
    options: {
      onSuccess: (_, deletedId) => {
        // Remove user from cache
        cache.removeFromList(queryKeys.users, deletedId);

        // Remove individual user cache
        cache.remove(queryKeys.user(deletedId));

        // Update dashboard stats
        cache.invalidate(queryKeys.users);
      },
    },
  });
}

// ===============================================
// UTILITY HOOKS
// ===============================================

/**
 * Hook to prefetch a user (useful for hover cards, etc.)
 */
export function usePrefetchUser() {
  const cache = useCacheUtils();

  return (id: string) => {
    cache.prefetch(
      queryKeys.user(id),
      () => UserService.getUserById(id),
      5 * 60 * 1000, // 5 minutes
    );
  };
}

/**
 * Hook to get cached user data without triggering a network request
 */
export function useCachedUser(id: string) {
  const cache = useCacheUtils();
  return cache.getCached<User>(queryKeys.user(id));
}
