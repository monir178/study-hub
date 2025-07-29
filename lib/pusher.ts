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
