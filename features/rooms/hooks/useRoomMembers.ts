import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import {
  subscribeToRoomMembers,
  unsubscribeFromRoomMembers,
} from "@/lib/pusher";
import { StudyRoom } from "./useRooms";

interface RoomMember {
  id: string;
  userId: string;
  role: string;
  status: string;
  joinedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    image: string;
    role: string;
  };
}

interface UseRoomMembersProps {
  roomId: string;
  initialRoom: StudyRoom;
}

interface UseRoomMembersReturn {
  members: RoomMember[];
  memberCount: number;
  onlineMembers: number;
  loading: {
    join: boolean;
    leave: boolean;
  };
  error: string | null;
  actions: {
    joinRoom: () => Promise<void>;
    leaveRoom: () => Promise<void>;
  };
}

export function useRoomMembers({
  roomId,
  initialRoom,
}: UseRoomMembersProps): UseRoomMembersReturn {
  const { user } = useAuth();
  const [members, setMembers] = useState<RoomMember[]>(
    (initialRoom.members || []).map((member) => ({
      id: member.id,
      userId: member.user.id,
      role: member.role,
      status: member.status,
      joinedAt: member.joinedAt,
      user: {
        id: member.user.id,
        name: member.user.name || "",
        email: "", // Email not available in StudyRoom type
        image: member.user.image || "",
        role: "USER", // Role not available in StudyRoom type
      },
    })),
  );
  const [memberCount, setMemberCount] = useState(initialRoom.memberCount || 0);
  const [onlineMembers, setOnlineMembers] = useState(
    initialRoom.onlineMembers || 0,
  );
  const [loading, setLoading] = useState({
    join: false,
    leave: false,
  });
  const [error, setError] = useState<string | null>(null);
  const isOptimisticRef = useRef<boolean>(false);

  // Optimistic join room
  const joinRoom = useCallback(async () => {
    if (!user?.id) return;

    // Check if already a member
    const isAlreadyMember = members.some((m) => m.userId === user.id);
    if (isAlreadyMember) return;

    // Optimistic update - immediate UI response
    const newMember: RoomMember = {
      id: `temp-${user.id}`,
      userId: user.id,
      role: "MEMBER",
      status: "ONLINE",
      joinedAt: new Date().toISOString(),
      user: {
        id: user.id,
        name: user.name || "",
        email: user.email || "",
        image: user.image || "",
        role: user.role || "USER",
      },
    };

    setMembers((prev) => [...prev, newMember]);
    setMemberCount((prev) => prev + 1);
    setOnlineMembers((prev) => prev + 1);
    setError(null);
    isOptimisticRef.current = true;

    // Show loading only for join button
    setLoading((prev) => ({ ...prev, join: true }));

    try {
      const response = await fetch(`/api/rooms/${roomId}/members/join`, {
        method: "POST",
      });

      const data = await response.json();

      if (!data.success) {
        // Revert optimistic update on error
        setMembers((prev) => prev.filter((m) => m.userId !== user.id));
        setMemberCount((prev) => prev - 1);
        setOnlineMembers((prev) => prev - 1);
        setError(data.error || "Failed to join room");
      }
    } catch (err) {
      console.error("Error joining room:", err);
      // Revert optimistic update on error
      setMembers((prev) => prev.filter((m) => m.userId !== user.id));
      setMemberCount((prev) => prev - 1);
      setOnlineMembers((prev) => prev - 1);
      setError("Failed to join room");
    } finally {
      setLoading((prev) => ({ ...prev, join: false }));
      // Reset optimistic flag after a short delay
      setTimeout(() => {
        isOptimisticRef.current = false;
      }, 100);
    }
  }, [roomId, user, members]);

  // Optimistic leave room
  const leaveRoom = useCallback(async () => {
    if (!user?.id) return;

    // Check if user is a member
    const userMember = members.find((m) => m.userId === user.id);
    if (!userMember) return;

    // Optimistic update - immediate UI response
    setMembers((prev) => prev.filter((m) => m.userId !== user.id));
    setMemberCount((prev) => prev - 1);
    setOnlineMembers((prev) => prev - 1);
    setError(null);
    isOptimisticRef.current = true;

    // Show loading only for leave button
    setLoading((prev) => ({ ...prev, leave: true }));

    try {
      const response = await fetch(`/api/rooms/${roomId}/members/leave`, {
        method: "POST",
      });

      const data = await response.json();

      if (!data.success) {
        // Revert optimistic update on error
        setMembers((prev) => [...prev, userMember]);
        setMemberCount((prev) => prev + 1);
        setOnlineMembers((prev) => prev + 1);
        setError(data.error || "Failed to leave room");
      }
    } catch (err) {
      console.error("Error leaving room:", err);
      // Revert optimistic update on error
      setMembers((prev) => [...prev, userMember]);
      setMemberCount((prev) => prev + 1);
      setOnlineMembers((prev) => prev + 1);
      setError("Failed to leave room");
    } finally {
      setLoading((prev) => ({ ...prev, leave: false }));
      // Reset optimistic flag after a short delay
      setTimeout(() => {
        isOptimisticRef.current = false;
      }, 100);
    }
  }, [roomId, user, members]);

  // Subscribe to Pusher events for real-time updates
  useEffect(() => {
    if (!roomId) return;

    const channel = subscribeToRoomMembers(roomId);

    channel.bind(
      "member-joined",
      (data: {
        member: {
          id: string;
          name: string;
          email: string;
          image: string;
          role: string;
        };
        memberCount: number;
        onlineMembers: number;
      }) => {
        console.log("Member joined (real-time):", data);

        // Only update if we're not in optimistic state
        if (!isOptimisticRef.current) {
          setMembers((prev) => {
            const existingMember = prev.find(
              (m) => m.userId === data.member.id,
            );
            if (existingMember) {
              // Update existing member status
              return prev.map((m) =>
                m.userId === data.member.id ? { ...m, status: "ONLINE" } : m,
              );
            } else {
              // Add new member
              return [
                ...prev,
                {
                  id: data.member.id,
                  userId: data.member.id,
                  role: data.member.role,
                  status: "ONLINE",
                  joinedAt: new Date().toISOString(),
                  user: {
                    id: data.member.id,
                    name: data.member.name,
                    email: data.member.email,
                    image: data.member.image,
                    role: data.member.role,
                  },
                },
              ];
            }
          });
          setMemberCount(data.memberCount);
          setOnlineMembers(data.onlineMembers);
        }
      },
    );

    channel.bind(
      "member-left",
      (data: {
        member: {
          id: string;
          name: string;
          email: string;
          image: string;
          role: string;
        };
        memberCount: number;
        onlineMembers: number;
      }) => {
        console.log("Member left (real-time):", data);

        // Only update if we're not in optimistic state
        if (!isOptimisticRef.current) {
          setMembers((prev) => prev.filter((m) => m.userId !== data.member.id));
          setMemberCount(data.memberCount);
          setOnlineMembers(data.onlineMembers);
        }
      },
    );

    return () => {
      unsubscribeFromRoomMembers(roomId);
    };
  }, [roomId]);

  return {
    members,
    memberCount,
    onlineMembers,
    loading,
    error,
    actions: {
      joinRoom,
      leaveRoom,
    },
  };
}
