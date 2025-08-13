import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { pusherServer } from "@/lib/pusher";
import { TimerResumeEvent } from "@/features/timer/types/timer-events";
import { prisma } from "@/lib/prisma";
import { canControlRoomTimer } from "@/lib/utils/timer-permissions";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: roomId } = await params;
    const { sessionId, remainingTime } = await request.json();

    if (!sessionId || typeof remainingTime !== "number") {
      return NextResponse.json(
        { error: "Missing sessionId or remainingTime" },
        { status: 400 },
      );
    }

    // Get the existing session
    const studySession = await prisma.studySession.findUnique({
      where: { id: sessionId },
      include: { room: true },
    });

    if (!studySession || studySession.roomId !== roomId) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Check permissions using the new hierarchy system
    const canControl = await canControlRoomTimer(
      session.user.id,
      session.user.role,
      roomId,
    );

    if (!canControl) {
      return NextResponse.json(
        { error: "Insufficient permissions to control this room's timer" },
        { status: 403 },
      );
    }

    // Update session to resume
    const now = new Date();
    const updatedSession = await prisma.studySession.update({
      where: { id: sessionId },
      data: {
        status: "ACTIVE",
        startedAt: now,
      },
    });

    // Create timer resume event for Pusher
    const timerEvent: TimerResumeEvent = {
      type: "timer-resume",
      roomId,
      userId: session.user.id,
      sessionId: updatedSession.id,
      phase: studySession.phase as "focus" | "break" | "long_break",
      sessionNumber: studySession.session, // Use 'session' field from schema
      remainingTime: remainingTime, // Resume with remaining time
      timestamp: now.toISOString(),
    };

    // Emit event via Pusher
    await pusherServer.trigger(
      `room-${roomId}-timer`,
      "timer-resume",
      timerEvent,
    );

    console.log(
      `⏯️ Timer resumed for room ${roomId} with ${remainingTime}s remaining`,
    );

    return NextResponse.json({
      session: {
        id: updatedSession.id,
        roomId: updatedSession.roomId,
        userId: updatedSession.userId,
        phase: updatedSession.phase,
        sessionNumber: updatedSession.session, // Use 'session' field from schema
        startedAt: updatedSession.startedAt.toISOString(),
        remainingTime: remainingTime,
        status: updatedSession.status,
      },
      event: timerEvent,
    });
  } catch (error) {
    console.error("Error resuming timer:", error);
    return NextResponse.json(
      { error: "Failed to resume timer" },
      { status: 500 },
    );
  }
}
