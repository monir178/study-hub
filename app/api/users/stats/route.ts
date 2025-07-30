import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { TimerDatabase } from "@/lib/timer/server/timer-database";

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

    const stats = await TimerDatabase.getUserStats(session.user.id);

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
