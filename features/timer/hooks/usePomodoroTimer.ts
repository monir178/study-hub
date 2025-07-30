// This hook is deprecated. Use useTimer instead.
// Keeping for backward compatibility
import { useTimer } from "./useTimer";
import { UsePomodoroTimerReturn } from "../types";

interface UsePomodoroTimerProps {
  roomId: string;
  roomCreatorId?: string;
}

export function usePomodoroTimer({
  roomId,
  roomCreatorId,
}: UsePomodoroTimerProps): UsePomodoroTimerReturn {
  // Use the new useTimer hook
  return useTimer({ roomId, roomCreatorId });
}
