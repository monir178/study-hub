"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { Socket } from "socket.io-client";
import { connectSocket, disconnectSocket } from "@/lib/socket-client";

export function useSocket() {
  const { data: session } = useSession();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (session?.user) {
      socketRef.current = connectSocket();
    }

    return () => {
      if (socketRef.current) {
        disconnectSocket();
      }
    };
  }, [session]);

  return {
    socket: socketRef.current,
    isConnected: socketRef.current?.connected || false,
  };
}

export function useRoomSocket(roomId: string) {
  const { socket } = useSocket();
  const { data: session } = useSession();

  useEffect(() => {
    if (socket && session?.user && roomId) {
      // Join the room
      socket.emit("room:join", {
        roomId,
        userId: session.user.id,
      });

      // Request current timer state
      socket.emit("timer:request-sync", { roomId });

      return () => {
        // Leave the room on cleanup
        socket.emit("room:leave", {
          roomId,
          userId: session.user.id,
        });
      };
    }
  }, [socket, session, roomId]);

  return {
    socket,
    isConnected: socket?.connected || false,
    userId: session?.user?.id,
    userRole: session?.user?.role,
  };
}
