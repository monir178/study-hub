import { useEffect } from "react";
import { useAppDispatch } from "@/lib/store";
import { setMemberCount } from "@/features/rooms/store/roomsSlice";

/**
 * Hook to initialize member count in Redux when room data is loaded
 */
export const useInitializeMemberCount = (
  roomId: string,
  memberCount?: number,
) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (roomId && memberCount !== undefined) {
      dispatch(setMemberCount({ roomId, count: memberCount }));
    }
  }, [roomId, memberCount, dispatch]);
};
