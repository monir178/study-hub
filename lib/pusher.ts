import PusherClient from "pusher-js";
import PusherServer from "pusher";

// Initialize Pusher client (for client-side)
export const pusherClient = new PusherClient(
  process.env.NEXT_PUBLIC_PUSHER_KEY!,
  {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    forceTLS: true,
  },
);

// Initialize Pusher server (for server-side)
export const pusherServer = new PusherServer({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});

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

// Server-side helper to trigger timer updates
export const triggerTimerUpdate = async (
  roomId: string,
  timer: Record<string, unknown>,
  action: string,
  controlledBy: string,
) => {
  try {
    await pusherServer.trigger(`room-${roomId}-timer`, "update", {
      timer,
      action,
      controlledBy,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error triggering timer update:", error);
  }
};

// Server-side helper to trigger chat message updates
export const triggerChatMessage = async (
  roomId: string,
  message: Record<string, unknown>,
) => {
  try {
    await pusherServer.trigger(`room-${roomId}-chat`, "new-message", {
      message,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error triggering chat message:", error);
  }
};
