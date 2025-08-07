"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { setUser, clearAuth } from "@/features/auth/store/authSlice";
import {
  setCurrentUser,
  clearCurrentUser,
} from "@/features/users/store/usersSlice";

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
      // Create minimal auth user from session
      const authUserFromSession = {
        id: session.user.id!,
        email: session.user.email!,
        name: session.user.name || undefined,
        image: session.user.image || undefined,
        role: session.user.role || ("USER" as const),
      };

      // Update auth slice with basic user info
      dispatch(setUser(authUserFromSession));

      // Create a full User object from session for users slice
      const userFromSession = {
        id: session.user.id!,
        email: session.user.email!,
        name: session.user.name || null,
        image: session.user.image || null,
        emailVerified: null,
        password: null,
        role: session.user.role || ("USER" as const),
        locale: "en",
        theme: "SYSTEM" as const,
        phoneNumber: null,
        gender: null,
        dateOfBirth: null,
        street: null,
        city: null,
        region: null,
        postalCode: null,
        country: null,
        createdAt: new Date().toISOString(), // Convert to ISO string
        updatedAt: new Date().toISOString(), // Convert to ISO string
      };

      // Update users slice with full user object
      dispatch(setCurrentUser(userFromSession));
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
