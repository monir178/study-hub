// Pusher integration for timer events
import { pusherClient } from "@/lib/pusher";
import { TimerEvent } from "../types/timer-events";

/**
 * Subscribe to timer events for a specific room
 */
export function subscribeToTimerEvents(
  roomId: string,
  onTimerEvent: (event: TimerEvent) => void,
) {
  const channel = pusherClient.subscribe(`room-${roomId}-timer`);

  // Listen to all timer event types
  channel.bind("timer-start", (data: TimerEvent) => {
    console.log("🟢 Timer started:", data);
    onTimerEvent(data);
  });

  channel.bind("timer-pause", (data: TimerEvent) => {
    console.log("⏸️ Timer paused:", data);
    onTimerEvent(data);
  });

  channel.bind("timer-resume", (data: TimerEvent) => {
    console.log("▶️ Timer resumed:", data);
    onTimerEvent(data);
  });

  channel.bind("timer-reset", (data: TimerEvent) => {
    console.log("🔄 Timer reset:", data);
    onTimerEvent(data);
  });

  channel.bind("timer-complete", (data: TimerEvent) => {
    console.log("✅ Timer completed:", data);
    onTimerEvent(data);
  });

  // Return cleanup function
  return () => {
    channel.unbind_all();
    pusherClient.unsubscribe(`room-${roomId}-timer`);
  };
}

/**
 * Check if current user can control timer
 */
export function checkTimerPermissions(
  user: { id: string; role: string } | null,
  roomCreatorId: string,
): { canControl: boolean; reason?: string } {
  if (!user) {
    return { canControl: false, reason: "Not authenticated" };
  }

  // Admin and Moderator can always control
  if (user.role === "ADMIN" || user.role === "MODERATOR") {
    return { canControl: true };
  }

  // Room creator can control
  if (user.id === roomCreatorId) {
    return { canControl: true };
  }

  return {
    canControl: false,
    reason: "Only room creator, moderators, and admins can control the timer",
  };
}
