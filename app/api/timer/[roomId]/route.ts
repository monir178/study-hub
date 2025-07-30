import { NextRequest } from "next/server";
import { TimerStore } from "@/lib/timer/server/timer-store";

// GET - Get current timer state
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ roomId: string }> },
) {
  try {
    const { roomId } = await params;
    const timerState = await TimerStore.getTimer(roomId);

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
        timerState = await TimerStore.startTimer(roomId, userId);
        break;
      case "pause":
        timerState = await TimerStore.pauseTimer(roomId, userId);
        break;
      case "reset":
        timerState = await TimerStore.resetTimer(roomId, userId);
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
