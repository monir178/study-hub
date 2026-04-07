"use client";

import PusherClient from "pusher-js";

// Initialize Pusher client (for client-side) with fallbacks for build time
export const pusherClient = new PusherClient(
  process.env.NEXT_PUBLIC_PUSHER_KEY || "dummy-key",
  {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "us2",
    forceTLS: true,
  },
);

// Helper function to subscribe to room timer channel
export const subscribeToRoomTimer = (roomId: string) => {
  return pusherClient.subscribe(`room-${roomId}-timer`);
};

// Helper function to unsubscribe from room timer channel
export const unsubscribeFromRoomTimer = (roomId: string) => {
  pusherClient.unsubscribe(`room-${roomId}-timer`);
};

// Helper function to subscribe to room members channel
export const subscribeToRoomMembers = (roomId: string) => {
  return pusherClient.subscribe(`room-${roomId}-members`);
};

// Helper function to unsubscribe from room members channel
export const unsubscribeFromRoomMembers = (roomId: string) => {
  pusherClient.unsubscribe(`room-${roomId}-members`);
};

// Helper function to subscribe to room chat channel
export const subscribeToRoomChat = (roomId: string) => {
  return pusherClient.subscribe(`room-${roomId}-chat`);
};

// Helper function to unsubscribe from room chat channel
export const unsubscribeFromRoomChat = (roomId: string) => {
  pusherClient.unsubscribe(`room-${roomId}-chat`);
};
