import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { TimerDatabase } from "@/lib/timer-database";

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

    const stats = await TimerDatabase.getRoomStats(roomId);

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
