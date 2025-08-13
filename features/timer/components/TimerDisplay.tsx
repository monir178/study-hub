import { Badge } from "@/components/ui/badge";
import { TimerData } from "../types";
import {
  formatTime,
  getPhaseLabel,
  getPhaseColorLegacy as getPhaseColor,
} from "../utils/timer-display.utils";
import { TimerIcons } from "./TimerIcons";

interface TimerDisplayProps {
  timer: TimerData | null;
  variant?: "desktop" | "mobile";
}

export function TimerDisplay({
  timer,
  variant = "desktop",
}: TimerDisplayProps) {
  if (!timer) {
    return (
      <div className="text-center">
        <p className="text-sm text-muted-foreground">No timer active</p>
      </div>
    );
  }

  if (variant === "mobile") {
    return (
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Phase Icon & Label */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <TimerIcons phase={timer.phase} size="sm" />
          <div className="hidden sm:block">
            <div className="text-sm mb-1.5 font-medium leading-none">
              {getPhaseLabel(timer.phase)}
            </div>
            <div className="text-xs text-muted-foreground">
              {timer.session}/{timer.totalSessions}
            </div>
          </div>
        </div>

        {/* Timer Display - Centered on mobile & tablet */}
        <div className="flex-1 min-w-0 flex justify-center lg:justify-start">
          <div className="text-center lg:text-left">
            <div className="text-xl font-mono font-bold tracking-tight">
              {formatTime(timer.remaining)}
            </div>
            <div className="text-xs text-muted-foreground sm:hidden">
              {timer.session}/{timer.totalSessions}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-2 mb-3">
        <TimerIcons phase={timer.phase} size="md" />
        <span className="text-sm font-semibold">
          {getPhaseLabel(timer.phase)}
        </span>
      </div>
      <Badge
        variant="outline"
        className={`text-xs px-3 py-1 ${getPhaseColor(timer.phase)}`}
      >
        {timer.isRunning ? "Running" : timer.isPaused ? "Paused" : "Stopped"}
      </Badge>
    </div>
  );
}
