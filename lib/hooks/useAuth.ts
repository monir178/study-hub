import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { fetchCurrentUserProfile } from "@/features/users/store/usersSlice";

export function useAuth() {
  const { data: session, status } = useSession();
  const dispatch = useDispatch();

  // Get user data from Redux - this is now the primary source
  const { user: authUser, isInitialized } = useSelector(
    (state: RootState) => state.auth,
  );
  const { currentUser, loading: userLoading } = useSelector(
    (state: RootState) => state.users,
  );

  // Fetch complete user profile when session is available but currentUser is incomplete
  useEffect(() => {
    if (
      session?.user?.id &&
      authUser &&
      isInitialized &&
      (!currentUser || !currentUser.locale || !currentUser.theme)
    ) {
      // @ts-expect-error - dispatch is typed correctly
      dispatch(fetchCurrentUserProfile());
    }
  }, [session, authUser, currentUser, isInitialized, dispatch]);

  // Return currentUser if available (complete profile), fallback to authUser (basic info)
  const user = currentUser?.id === authUser?.id ? currentUser : authUser;

  return {
    user,
    isLoading: status === "loading" || userLoading,
    isAuthenticated: !!session && !!authUser,
    session,
    dispatch,
    isInitialized,
  };
}
