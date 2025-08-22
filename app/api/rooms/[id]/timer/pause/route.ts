import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";
import { TimerPauseEvent } from "@/features/timer/types/timer-events";
import { canControlRoomTimer } from "@/lib/utils/timer-permissions";

// POST - Pause timer
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

    const { sessionId, remainingTime, phase, sessionNumber } = body;

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

    // Get the current session to calculate how much time was actually studied
    const currentSession = await prisma.studySession.findUnique({
      where: { id: sessionId },
      select: { startedAt: true, duration: true },
    });

    if (!currentSession) {
      return NextResponse.json(
        { success: false, error: "Session not found" },
        { status: 404 },
      );
    }

    // Calculate time studied during this active period
    const studyStartTime = currentSession.startedAt;
    const pauseTime = new Date();
    const timeStudiedInThisSession = Math.floor(
      (pauseTime.getTime() - studyStartTime.getTime()) / 1000,
    );

    // Add to existing duration (for resumed sessions)
    const totalStudyTime =
      (currentSession.duration || 0) + timeStudiedInThisSession;

    // Update session to paused with accumulated study time
    const updatedSession = await prisma.studySession.update({
      where: { id: sessionId },
      data: {
        status: "PAUSED",
        remaining: remainingTime,
        duration: totalStudyTime, // Store actual time studied so far
        controlledBy: session.user.id,
      },
    });

    // Create Pusher event
    const timerEvent: TimerPauseEvent = {
      type: "timer-pause",
      roomId,
      userId: session.user.id,
      timestamp: new Date().toISOString(),
      sessionId,
      remainingTime,
      phase: phase as "focus" | "break" | "long_break",
      sessionNumber,
    };

    // Emit to all room members
    await pusherServer.trigger(
      `room-${roomId}-timer`,
      "timer-pause",
      timerEvent,
    );

    return NextResponse.json({
      success: true,
      data: {
        session: {
          sessionId: updatedSession.id,
          roomId: updatedSession.roomId,
          phase: updatedSession.phase,
          sessionNumber: updatedSession.session,
          startedAt: updatedSession.startedAt.toISOString(),
          remainingTime: updatedSession.remaining,
          status: updatedSession.status,
        },
        event: timerEvent,
      },
    });
  } catch (error) {
    console.error("Error pausing timer:", error);
    return NextResponse.json(
      { success: false, error: "Failed to pause timer" },
      { status: 500 },
    );
  }
}
