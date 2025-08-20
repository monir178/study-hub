import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";
import { TimerResetEvent } from "@/features/timer/types/timer-events";
import { canControlRoomTimer } from "@/lib/utils/timer-permissions";

// POST - Reset timer
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: roomId } = await params;
    const session = await auth();
    const body = await request.json();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { sessionId } = body;

    // Check permissions using the new hierarchy system
    const canControl = await canControlRoomTimer(
      session.user.id,
      session.user.role,
      roomId,
    );

    if (!canControl) {
      return NextResponse.json(
        {
          success: false,
          error: "Insufficient permissions to control this room's timer",
        },
        { status: 403 },
      );
    }

    // End current session if exists
    if (sessionId) {
      // First, get the current session to calculate duration
      const currentSession = await prisma.studySession.findUnique({
        where: { id: sessionId },
        select: { startedAt: true, duration: true },
      });

      if (currentSession) {
        // Calculate actual duration: endTime - startTime
        const startTime = currentSession.startedAt;
        const endTime = new Date();
        const actualDuration = Math.floor(
          (endTime.getTime() - startTime.getTime()) / 1000,
        );

        await prisma.studySession.update({
          where: { id: sessionId },
          data: {
            status: "COMPLETED",
            endedAt: endTime,
            duration: actualDuration, // Store the calculated duration
          },
        });
      }
    }

    // Create Pusher event
    const timerEvent: TimerResetEvent = {
      type: "timer-reset",
      roomId,
      userId: session.user.id,
      timestamp: new Date().toISOString(),
      sessionId: sessionId || undefined,
      phase: "focus",
      sessionNumber: 1,
    };

    // Emit to all room members
    await pusherServer.trigger(
      `room-${roomId}-timer`,
      "timer-reset",
      timerEvent,
    );

    return NextResponse.json({
      success: true,
      data: {
        event: timerEvent,
      },
    });
  } catch (error) {
    console.error("Error resetting timer:", error);
    return NextResponse.json(
      { success: false, error: "Failed to reset timer" },
      { status: 500 },
    );
  }
}
