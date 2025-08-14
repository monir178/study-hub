import { useEffect } from "react";
import { useAppDispatch } from "@/lib/store";
import { setRoomMembers, RoomMember } from "@/features/rooms/store/roomsSlice";

interface RoomMemberData {
  id: string;
  user: {
    id: string;
    name?: string | null;
    image?: string | null;
  };
  role: string;
}

export const useInitializeMembers = (
  roomId: string,
  members: RoomMemberData[],
) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (roomId && members && members.length > 0) {
      const roomMembers: RoomMember[] = members.map((member) => ({
        id: member.id,
        user: {
          id: member.user.id,
          name: member.user.name || null,
          image: member.user.image || null,
        },
        role: member.role,
      }));

      dispatch(
        setRoomMembers({
          roomId,
          members: roomMembers,
        }),
      );
    }
  }, [roomId, members, dispatch]);
};
