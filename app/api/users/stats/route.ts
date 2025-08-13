import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - Get user session statistics
export async function GET(_request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    // Get user statistics from database
    const completedSessions = await prisma.studySession.findMany({
      where: {
        userId: session.user.id,
        status: "COMPLETED",
      },
      select: {
        duration: true,
        phase: true,
        session: true,
        endedAt: true,
        roomId: true,
      },
    });

    const totalSessions = completedSessions.length;
    const totalFocusTime = completedSessions
      .filter((s) => s.phase === "focus")
      .reduce((acc, s) => acc + (s.duration || 0), 0);
    const totalBreakTime = completedSessions
      .filter((s) => s.phase === "break")
      .reduce((acc, s) => acc + (s.duration || 0), 0);

    // Group by rooms to see activity
    const roomActivity = completedSessions.reduce(
      (acc, s) => {
        const roomId = s.roomId;
        if (!acc[roomId]) {
          acc[roomId] = { sessions: 0, focusTime: 0, breakTime: 0 };
        }
        acc[roomId].sessions++;
        if (s.phase === "focus") {
          acc[roomId].focusTime += s.duration || 0;
        } else {
          acc[roomId].breakTime += s.duration || 0;
        }
        return acc;
      },
      {} as Record<
        string,
        { sessions: number; focusTime: number; breakTime: number }
      >,
    );

    const stats = {
      totalSessions,
      totalFocusTime,
      totalBreakTime,
      totalTime: totalFocusTime + totalBreakTime,
      roomActivity,
      completedSessions: completedSessions.map((s) => ({
        phase: s.phase,
        duration: s.duration,
        sessionNumber: s.session,
        completedAt: s.endedAt,
        roomId: s.roomId,
      })),
    };

    return NextResponse.json({
      success: true,
      data: {
        userId: session.user.id,
        stats,
      },
    });
  } catch (error) {
    console.error("Error getting user stats:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get user statistics" },
      { status: 500 },
    );
  }
}
