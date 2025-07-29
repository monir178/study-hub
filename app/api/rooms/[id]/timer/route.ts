import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { TimerStore } from "@/lib/timer-store";

// GET - Get current timer state
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

    let timer = await TimerStore.getTimer(roomId);

    // If timer doesn't exist, create a default one
    if (!timer) {
      timer = await TimerStore.setTimer(roomId, {
        roomId,
        phase: "focus",
        remaining: 25 * 60, // 25 minutes
        isRunning: false,
        isPaused: false,
        controlledBy: "",
        session: 1,
        totalSessions: 4,
      });
    }

    return NextResponse.json({
      success: true,
      timer,
    });
  } catch (error) {
    console.error("Error getting timer state:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get timer state" },
      { status: 500 },
    );
  }
}
