import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TimerStore } from "@/lib/timer-store";
import Pusher from "pusher";

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});

// POST - Sync timer actions
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: roomId } = await params;
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { actions } = await request.json();

    if (!Array.isArray(actions)) {
      return NextResponse.json(
        { success: false, error: "Invalid actions format" },
        { status: 400 },
      );
    }

    // Get room to check permissions
    const room = await prisma.studyRoom.findUnique({
      where: { id: roomId },
      include: { creator: true },
    });

    if (!room) {
      return NextResponse.json(
        { success: false, error: "Room not found" },
        { status: 404 },
      );
    }

    // Check if user can control timer
    const canControl =
      session.user.role === "ADMIN" ||
      session.user.role === "MODERATOR" ||
      session.user.id === room.creator.id;

    if (!canControl) {
      return NextResponse.json(
        { success: false, error: "Insufficient permissions" },
        { status: 403 },
      );
    }

    let currentTimer = TimerStore.getTimer(roomId);
    if (!currentTimer) {
      currentTimer = TimerStore.setTimer(roomId, {});
    }

    // Process actions in order
    for (const action of actions) {
      switch (action) {
        case "start":
          currentTimer = TimerStore.startTimer(roomId, session.user.id);
          break;
        case "pause":
          currentTimer = TimerStore.pauseTimer(roomId, session.user.id);
          break;
        case "reset":
          currentTimer = TimerStore.resetTimer(roomId, session.user.id);
          break;
        default:
          console.warn(`Unknown action: ${action}`);
      }
    }

    // Trigger Pusher event for all actions
    await pusher.trigger(`room-${roomId}-timer`, "update", {
      timer: currentTimer,
      action: actions[actions.length - 1], // Last action
      controlledBy: session.user.id,
    });

    return NextResponse.json({
      success: true,
      timer: currentTimer,
    });
  } catch (error) {
    console.error("Error syncing timer actions:", error);
    return NextResponse.json(
      { success: false, error: "Failed to sync timer actions" },
      { status: 500 },
    );
  }
}
