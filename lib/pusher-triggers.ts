import { pusherServer } from "./pusher-server";

export { pusherServer };

// Server-side helper to trigger timer updates
export const triggerTimerUpdate = async (
  roomId: string,
  timer: Record<string, unknown>,
  action: string,
  controlledBy: string,
) => {
  try {
    if (!process.env.PUSHER_SECRET) {
      console.log("Skipping Pusher trigger - missing environment variables");
      return;
    }
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
    if (!process.env.PUSHER_SECRET) {
      console.log("Skipping Pusher trigger - missing environment variables");
      return;
    }
    await pusherServer.trigger(`room-${roomId}-chat`, "new-message", {
      message,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error triggering chat message:", error);
  }
};

// Server-side helper to trigger member updates
export const triggerMemberUpdate = async (
  roomId: string,
  event: "member-joined" | "member-left",
  data: {
    member: Record<string, unknown>;
    memberCount: number;
    members?: Array<{
      id: string;
      user: {
        id: string;
        name: string | null;
        image: string | null;
      };
      role: string;
    }>;
  },
) => {
  try {
    if (!process.env.PUSHER_SECRET) {
      console.log("Skipping Pusher trigger - missing environment variables");
      return;
    }
    await pusherServer.trigger(`room-${roomId}-members`, event, {
      ...data,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error triggering member update:", error);
  }
};
