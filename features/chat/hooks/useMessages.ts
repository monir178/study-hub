import { useState, useEffect } from "react";
import { useApiQuery } from "@/lib/api/hooks/use-api-query";
import { useApiMutation } from "@/lib/api/hooks/use-api-mutation";
import { useCacheUtils } from "@/lib/api/hooks/use-cache-utils";
import { apiClient } from "@/lib/api/client";
import { queryKeys } from "@/lib/query/keys";
import { subscribeToRoomChat, unsubscribeFromRoomChat } from "@/lib/pusher";

export interface Message {
  id: string;
  content: string;
  type: "TEXT" | "SYSTEM" | "FILE";
  createdAt: string;
  author: {
    id: string;
    name?: string;
    image?: string;
    role: "USER" | "MODERATOR" | "ADMIN";
  };
  fileUrl?: string;
  fileName?: string;
  fileType?: string;
}

export interface MessagesResponse {
  messages: Message[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export interface SendMessageData {
  content: string;
  type?: "TEXT" | "SYSTEM" | "FILE";
  roomId: string;
  fileUrl?: string;
  fileName?: string;
  fileType?: string;
}

// Get messages for a room
export function useMessages(roomId: string, limit: number = 50) {
  const cache = useCacheUtils();
  const [messages, setMessages] = useState<Message[]>([]);

  const query = useApiQuery<MessagesResponse>({
    queryKey: queryKeys.roomMessages(roomId),
    queryFn: async (): Promise<MessagesResponse> => {
      return apiClient.get(`/messages?roomId=${roomId}&limit=${limit}`);
    },
    options: {
      enabled: !!roomId,
      staleTime: 30000, // 30 seconds
    },
  });

  // Subscribe to real-time updates
  useEffect(() => {
    if (!roomId) return;

    const channel = subscribeToRoomChat(roomId);

    channel.bind("new-message", (data: { message: Message }) => {
      console.log("New message received:", data.message);
      setMessages((prev) => {
        // Prevent duplicates by checking if message already exists
        const messageExists = prev.some((msg) => msg.id === data.message.id);
        if (messageExists) {
          return prev; // Don't add duplicate
        }
        return [...prev, data.message];
      });

      // Update cache
      cache.invalidate(queryKeys.roomMessages(roomId));
    });

    return () => {
      unsubscribeFromRoomChat(roomId);
    };
  }, [roomId, cache]);

  // Initialize messages from query data
  useEffect(() => {
    if (query.data?.messages) {
      setMessages(query.data.messages);
    }
  }, [query.data]);

  return {
    messages,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

// Send a message
export function useSendMessage() {
  const cache = useCacheUtils();

  return useApiMutation<Message, SendMessageData>({
    mutationFn: async (data: SendMessageData): Promise<Message> => {
      return apiClient.post("/messages", data);
    },
    options: {
      onSuccess: (_, { roomId }) => {
        // Invalidate messages cache
        cache.invalidate(queryKeys.roomMessages(roomId));
      },
    },
  });
}

// Upload file for message
export function useUploadFile() {
  return useApiMutation<
    {
      url: string;
      publicId: string;
      format: string;
      size: number;
      fileName: string;
    },
    { file: File; roomId: string }
  >({
    mutationFn: async ({
      file,
      roomId,
    }): Promise<{
      url: string;
      publicId: string;
      format: string;
      size: number;
      fileName: string;
    }> => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("roomId", roomId);

      return apiClient.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
  });
}
