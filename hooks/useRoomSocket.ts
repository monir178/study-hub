"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/hooks/useAuth";

export interface RoomMember {
  id: string;
  role: "MEMBER" | "MODERATOR" | "ADMIN";
  status: "ONLINE" | "OFFLINE" | "STUDYING" | "BREAK";
  joinedAt: string;
  userId: string;
  user: {
    id: string;
    name?: string;
    image?: string;
  };
}

export interface RoomStats {
  memberCount: number;
  onlineMembers: number;
  messageCount: number;
  noteCount: number;
}

export interface UseRoomSocketReturn {
  members: RoomMember[];
  stats: RoomStats;
  isConnected: boolean;
  joinRoom: () => void;
  leaveRoom: () => void;
  updateMemberStatus: (status: RoomMember["status"]) => void;
}

export function useRoomSocket(roomId: string): UseRoomSocketReturn {
  const { user } = useAuth();
  const [members, setMembers] = useState<RoomMember[]>([]);
  const [stats, setStats] = useState<RoomStats>({
    memberCount: 0,
    onlineMembers: 0,
    messageCount: 0,
    noteCount: 0,
  });
  const [isConnected, setIsConnected] = useState(false);

  // Fetch room data function (similar to timer's fetchTimerState)
  const fetchRoomData = useCallback(async () => {
    try {
      const response = await fetch(`/api/rooms/${roomId}`);
      if (response.ok) {
        const roomData = await response.json();
        if (roomData.success && roomData.data) {
          setMembers(roomData.data.members || []);
          setStats({
            memberCount: roomData.data.memberCount || 0,
            onlineMembers: roomData.data.onlineMembers || 0,
            messageCount: roomData.data.messageCount || 0,
            noteCount: roomData.data.noteCount || 0,
          });
          setIsConnected(true);
        }
      } else {
        setIsConnected(false);
      }
    } catch (error) {
      console.error("Error fetching room data:", error);
      setIsConnected(false);
    }
  }, [roomId]);

  // Poll for room updates (similar to timer polling)
  useEffect(() => {
    if (!user?.id || !roomId) return;

    console.log(`Setting up room polling for room ${roomId}...`);

    // Initial fetch
    fetchRoomData();

    // Poll every 2 seconds for updates (same frequency as timer)
    const interval = setInterval(fetchRoomData, 2000);

    return () => {
      console.log("Cleaning up room polling");
      clearInterval(interval);
      setIsConnected(false);
    };
  }, [roomId, user?.id, fetchRoomData]);

  const joinRoom = useCallback(async () => {
    console.log("Join room called");
    try {
      const response = await fetch(`/api/rooms/${roomId}/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to join room");
      }

      console.log("Successfully joined room");
      // Immediately fetch updated data
      await fetchRoomData();
    } catch (error) {
      console.error("Error joining room:", error);
      throw error;
    }
  }, [roomId, fetchRoomData]);

  const leaveRoom = useCallback(async () => {
    console.log("Leave room called");
    try {
      const response = await fetch(`/api/rooms/${roomId}/join`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to leave room");
      }

      console.log("Successfully left room");
      // Immediately fetch updated data
      await fetchRoomData();
    } catch (error) {
      console.error("Error leaving room:", error);
      throw error;
    }
  }, [roomId, fetchRoomData]);

  const updateMemberStatus = useCallback(
    async (status: RoomMember["status"]) => {
      console.log("Update member status called:", status);
      try {
        const response = await fetch(`/api/rooms/${roomId}/status`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to update status");
        }

        console.log("Successfully updated member status");
        // Immediately fetch updated data
        await fetchRoomData();
      } catch (error) {
        console.error("Error updating member status:", error);
        throw error;
      }
    },
    [roomId, fetchRoomData],
  );

  return {
    members,
    stats,
    isConnected,
    joinRoom,
    leaveRoom,
    updateMemberStatus,
  };
}
