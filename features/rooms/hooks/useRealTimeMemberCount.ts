import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { setMemberCount } from "@/features/rooms/store/roomsSlice";
import {
  subscribeToRoomMembers,
  unsubscribeFromRoomMembers,
} from "@/lib/pusher";

interface MemberUpdateEvent {
  member: {
    id: string;
    name: string;
  };
  memberCount: number;
}

export const useRealTimeMemberCount = (roomId: string) => {
  const dispatch = useAppDispatch();
  const memberCount = useAppSelector(
    (state) => state.rooms.memberCounts[roomId],
  );
  const isConnected = useAppSelector((state) => state.rooms.isConnected);

  useEffect(() => {
    if (!roomId) return;

    const channel = subscribeToRoomMembers(roomId);

    // Listen for member join events
    channel.bind("member-joined", (data: MemberUpdateEvent) => {
      dispatch(
        setMemberCount({
          roomId,
          count: data.memberCount,
        }),
      );
    });

    // Listen for member leave events
    channel.bind("member-left", (data: MemberUpdateEvent) => {
      dispatch(
        setMemberCount({
          roomId,
          count: data.memberCount,
        }),
      );
    });

    return () => {
      channel.unbind("member-joined");
      channel.unbind("member-left");
      unsubscribeFromRoomMembers(roomId);
    };
  }, [roomId, dispatch]);

  return {
    memberCount,
    isConnected,
  };
};
