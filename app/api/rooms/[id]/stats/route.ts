import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - Get room session statistics
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

    // Get room statistics from database
    const completedSessions = await prisma.studySession.findMany({
      where: {
        roomId,
        status: "COMPLETED",
      },
      select: {
        duration: true,
        phase: true,
        session: true,
        endedAt: true,
      },
    });

    const totalSessions = completedSessions.length;
    const totalFocusTime = completedSessions
      .filter((s) => s.phase === "focus")
      .reduce((acc, s) => acc + (s.duration || 0), 0);
    const totalBreakTime = completedSessions
      .filter((s) => s.phase === "break")
      .reduce((acc, s) => acc + (s.duration || 0), 0);

    const stats = {
      totalSessions,
      totalFocusTime,
      totalBreakTime,
      totalTime: totalFocusTime + totalBreakTime,
      completedSessions: completedSessions.map((s) => ({
        phase: s.phase,
        duration: s.duration,
        sessionNumber: s.session,
        completedAt: s.endedAt,
      })),
    };

    return NextResponse.json({
      success: true,
      data: {
        roomId,
        stats,
      },
    });
  } catch (error) {
    console.error("Error getting room stats:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get room statistics" },
      { status: 500 },
    );
  }
}
