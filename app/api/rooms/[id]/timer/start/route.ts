import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";
import { TimerStartEvent } from "@/features/timer/types/timer-events";
import { canControlRoomTimer } from "@/lib/utils/timer-permissions";

// POST - Start timer (create new session and emit event)
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

    const { phase = "focus", sessionNumber = 1, duration = 25 * 60 } = body;

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

    // End any existing active sessions for this room
    await prisma.studySession.updateMany({
      where: {
        roomId,
        status: { in: ["ACTIVE", "PAUSED"] },
      },
      data: {
        status: "COMPLETED",
        endedAt: new Date(),
      },
    });

    // Create new session
    const newSession = await prisma.studySession.create({
      data: {
        roomId,
        userId: session.user.id, // User who started it
        phase,
        remaining: duration,
        session: sessionNumber,
        totalSessions: 4,
        status: "ACTIVE",
        controlledBy: session.user.id,
        duration: 0, // Will be calculated when completed
      },
    });

    // Create Pusher event
    const timerEvent: TimerStartEvent = {
      type: "timer-start",
      roomId,
      userId: session.user.id,
      timestamp: new Date().toISOString(),
      sessionId: newSession.id,
      phase: phase as "focus" | "break" | "long_break",
      duration,
      sessionNumber,
    };

    // Emit to all room members
    await pusherServer.trigger(
      `room-${roomId}-timer`,
      "timer-start",
      timerEvent,
    );

    return NextResponse.json({
      success: true,
      data: {
        session: {
          sessionId: newSession.id,
          roomId: newSession.roomId,
          phase: newSession.phase,
          sessionNumber: newSession.session,
          startedAt: newSession.startedAt.toISOString(),
          remainingTime: newSession.remaining,
          status: newSession.status,
        },
        event: timerEvent,
      },
    });
  } catch (error) {
    console.error("Error starting timer:", error);
    return NextResponse.json(
      { success: false, error: "Failed to start timer" },
      { status: 500 },
    );
  }
}
