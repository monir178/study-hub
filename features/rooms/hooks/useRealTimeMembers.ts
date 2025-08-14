import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import {
  setRoomMembers,
  addRoomMember,
  removeRoomMember,
  RoomMember,
} from "@/features/rooms/store/roomsSlice";
import {
  subscribeToRoomMembers,
  unsubscribeFromRoomMembers,
} from "@/lib/pusher";

interface MemberUpdateEvent {
  member: {
    id: string;
    name: string;
    email?: string;
    image?: string;
    role?: string;
  };
  memberCount: number;
  members?: RoomMember[]; // Full member list when available
}

export const useRealTimeMembers = (roomId: string) => {
  const dispatch = useAppDispatch();
  const roomMembers = useAppSelector((state) => state.rooms.roomMembers);
  const isConnected = useAppSelector((state) => state.rooms.isConnected);

  // Memoize the members array to prevent unnecessary re-renders
  const members = useMemo(() => {
    return roomMembers[roomId] || [];
  }, [roomMembers, roomId]);

  useEffect(() => {
    if (!roomId) return;

    const channel = subscribeToRoomMembers(roomId);

    // Listen for member join events
    channel.bind("member-joined", (data: MemberUpdateEvent) => {
      // If we have the full member list, use it
      if (data.members) {
        dispatch(
          setRoomMembers({
            roomId,
            members: data.members,
          }),
        );
      } else {
        // Otherwise, add the new member
        const newMember: RoomMember = {
          id: `${roomId}-${data.member.id}`, // Create a unique member ID
          user: {
            id: data.member.id,
            name: data.member.name,
            image: data.member.image || null,
          },
          role: data.member.role || "MEMBER",
        };

        dispatch(
          addRoomMember({
            roomId,
            member: newMember,
          }),
        );
      }
    });

    // Listen for member leave events
    channel.bind("member-left", (data: MemberUpdateEvent) => {
      // If we have the full member list, use it
      if (data.members) {
        dispatch(
          setRoomMembers({
            roomId,
            members: data.members,
          }),
        );
      } else {
        // Otherwise, remove the member
        dispatch(
          removeRoomMember({
            roomId,
            userId: data.member.id,
          }),
        );
      }
    });

    return () => {
      channel.unbind("member-joined");
      channel.unbind("member-left");
      unsubscribeFromRoomMembers(roomId);
    };
  }, [roomId, dispatch]);

  return {
    members,
    isConnected,
  };
};
