"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { setUser, clearAuth } from "@/features/auth/store/authSlice";
import { clearCurrentUser } from "@/features/users/store/usersSlice";

/**
 * Hook to sync NextAuth session with Redux state
 * Updates both auth slice (minimal session data) and users slice (full user object)
 */
export function useSessionSync() {
  const { data: session, status } = useSession();
  const dispatch = useAppDispatch();
  const authUser = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    if (status === "loading") return; // Still loading

    if (session?.user && authUser?.id !== session.user.id) {
      // Create minimal auth user from session (just for authentication state)
      const authUserFromSession = {
        id: session.user.id!,
        email: session.user.email!,
        name: session.user.name || undefined,
        image: session.user.image || undefined, // Ensure image is properly passed
        role: session.user.role || ("USER" as const),
      };

      // Update auth slice with basic user info
      dispatch(setUser(authUserFromSession));

      // Don't create currentUser from session - let useAuth fetch fresh data from API
      // This ensures we always get the latest profile data from database
    } else if (!session && authUser) {
      // User logged out
      dispatch(clearAuth());
      dispatch(clearCurrentUser());
    }
  }, [session, status, authUser, dispatch]);

  return {
    session,
    status,
    isLoading: status === "loading",
    isAuthenticated: !!session,
  };
}
