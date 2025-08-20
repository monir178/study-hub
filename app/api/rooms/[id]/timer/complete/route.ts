import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";
import { TimerCompleteEvent } from "@/features/timer/types/timer-events";

// POST - Complete timer (when timer naturally finishes)
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

    const { sessionId, phase, sessionNumber, completedDuration, nextPhase } =
      body;

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: "Session ID is required" },
        { status: 400 },
      );
    }

    // Get the current session to calculate duration
    const currentSession = await prisma.studySession.findUnique({
      where: { id: sessionId },
      select: { startedAt: true, duration: true, status: true },
    });

    if (!currentSession) {
      return NextResponse.json(
        { success: false, error: "Session not found" },
        { status: 404 },
      );
    }

    // Calculate actual duration based on how the session was completed
    let actualDuration: number;

    if (completedDuration && completedDuration > 0) {
      // Use the duration calculated by the frontend (for natural completion)
      actualDuration = completedDuration;
    } else {
      // Fallback: calculate from startedAt to now
      const startTime = currentSession.startedAt;
      const endTime = new Date();
      actualDuration = Math.floor(
        (endTime.getTime() - startTime.getTime()) / 1000,
      );
    }

    // Complete the session with calculated duration
    const completedSession = await prisma.studySession.update({
      where: { id: sessionId },
      data: {
        status: "COMPLETED",
        endedAt: new Date(),
        duration: actualDuration, // Store the calculated duration
      },
    });

    // Create Pusher event for timer completion
    const timerEvent: TimerCompleteEvent = {
      type: "timer-complete",
      roomId,
      userId: session.user.id,
      timestamp: new Date().toISOString(),
      sessionId,
      completedPhase: phase as "focus" | "break" | "long_break",
      nextPhase: nextPhase as "focus" | "break" | "long_break",
      sessionNumber,
    };

    // Emit to all room members
    await pusherServer.trigger(
      `room-${roomId}-timer`,
      "timer-complete",
      timerEvent,
    );

    return NextResponse.json({
      success: true,
      data: {
        session: {
          sessionId: completedSession.id,
          roomId: completedSession.roomId,
          phase: completedSession.phase,
          sessionNumber: completedSession.session,
          startedAt: completedSession.startedAt.toISOString(),
          endedAt: completedSession.endedAt?.toISOString(),
          duration: completedSession.duration,
          status: completedSession.status,
        },
        event: timerEvent,
      },
    });
  } catch (error) {
    console.error("Error completing timer:", error);
    return NextResponse.json(
      { success: false, error: "Failed to complete timer" },
      { status: 500 },
    );
  }
}
