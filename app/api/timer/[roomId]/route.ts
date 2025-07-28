import { NextRequest } from "next/server";
import { timerManager } from "@/lib/timer-manager";

// GET - Get current timer state
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ roomId: string }> },
) {
  try {
    const { roomId } = await params;
    const timerState = timerManager.getTimerState(roomId);

    return Response.json({
      success: true,
      timer: timerState,
    });
  } catch (error) {
    console.error("Error getting timer state:", error);
    return Response.json(
      { success: false, error: "Failed to get timer state" },
      { status: 500 },
    );
  }
}

// POST - Control timer (start, pause, stop, reset)
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ roomId: string }> },
) {
  try {
    const { roomId } = await params;
    const { action, userId } = await req.json();

    let timerState;

    switch (action) {
      case "start":
        timerState = timerManager.startTimer(roomId, userId, null);
        break;
      case "pause":
        timerState = timerManager.pauseTimer(roomId);
        break;
      case "stop":
        timerState = timerManager.stopTimer(roomId);
        break;
      case "reset":
        timerState = timerManager.resetTimer(roomId, userId);
        break;
      default:
        return Response.json(
          { success: false, error: "Invalid action" },
          { status: 400 },
        );
    }

    return Response.json({
      success: true,
      timer: timerState,
      action,
      userId,
    });
  } catch (error) {
    console.error("Error controlling timer:", error);
    return Response.json(
      { success: false, error: "Failed to control timer" },
      { status: 500 },
    );
  }
}
