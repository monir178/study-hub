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

  // Always fetch fresh user profile when authenticated but no currentUser exists
  useEffect(() => {
    if (session?.user?.id && authUser && isInitialized && !currentUser) {
      // @ts-expect-error - dispatch is typed correctly
      dispatch(fetchCurrentUserProfile());
    }
  }, [session, authUser, currentUser, isInitialized, dispatch]);

  // Return currentUser if available (complete profile), fallback to authUser (basic info)
  // Always ensure we have the latest image from the session
  let user = currentUser?.id === authUser?.id ? currentUser : authUser;

  // If we have a session with image but user has no image, use the session image
  if (session?.user?.image && (!user?.image || user.image === null)) {
    user = user ? { ...user, image: session.user.image } : user;
  }

  // Ensure Google images have proper size parameter
  if (user?.image && user.image.includes("googleusercontent.com")) {
    // Replace size parameter with a larger one for better quality
    user = { ...user, image: user.image.replace(/=s\d+-c$/, "=s200-c") };
  }

  return {
    user,
    isLoading: status === "loading" || userLoading,
    isAuthenticated: !!session && !!authUser,
    session,
    dispatch,
    isInitialized,
  };
}
