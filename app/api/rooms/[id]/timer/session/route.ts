import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - Get current active session for room
export async function GET(
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

    // Find current active or paused session for this room
    const activeSession = await prisma.studySession.findFirst({
      where: {
        roomId,
        status: { in: ["ACTIVE", "PAUSED"] },
      },
      orderBy: { startedAt: "desc" },
    });

    if (!activeSession) {
      return NextResponse.json({
        success: true,
        data: null, // No active session
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        sessionId: activeSession.id,
        roomId: activeSession.roomId,
        phase: activeSession.phase,
        sessionNumber: activeSession.session,
        startedAt: activeSession.startedAt.toISOString(),
        remainingTime: activeSession.remaining,
        status: activeSession.status,
        controlledBy: activeSession.controlledBy,
      },
    });
  } catch (error) {
    console.error("Error getting current session:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get current session" },
      { status: 500 },
    );
  }
}
