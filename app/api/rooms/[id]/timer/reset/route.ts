import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TimerStore } from "@/lib/timer-store";

// POST - Reset timer
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

    // Get room and check user permissions
    const room = await prisma.studyRoom.findUnique({
      where: { id: roomId },
      include: {
        creator: true,
        members: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!room) {
      return NextResponse.json(
        { success: false, error: "Room not found" },
        { status: 404 },
      );
    }

    // Check if user is moderator, admin, or room owner
    const isModerator = session.user.role === "MODERATOR";
    const isAdmin = session.user.role === "ADMIN";
    const isRoomOwner = room.creatorId === session.user.id;

    if (!isModerator && !isAdmin && !isRoomOwner) {
      return NextResponse.json(
        { success: false, error: "Insufficient permissions" },
        { status: 403 },
      );
    }

    // Reset the timer (this will trigger Pusher update automatically)
    const timer = await TimerStore.resetTimer(roomId, session.user.id);

    return NextResponse.json({
      success: true,
      timer,
    });
  } catch (error) {
    console.error("Error resetting timer:", error);
    return NextResponse.json(
      { success: false, error: "Failed to reset timer" },
      { status: 500 },
    );
  }
}
