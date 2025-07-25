import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";

export function useAuth() {
  const { data: session, status } = useSession();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.users);

  return {
    user: session?.user || currentUser,
    isLoading: status === "loading",
    isAuthenticated: !!session,
    session,
    dispatch,
  };
}
