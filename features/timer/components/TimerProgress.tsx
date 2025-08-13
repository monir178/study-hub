import { TimerData } from "../types";
import { getProgress, getCircularProgress } from "../utils/timer-display.utils";

interface TimerProgressProps {
  timer: TimerData | null;
  variant?: "desktop" | "mobile";
}

export function TimerProgress({
  timer,
  variant = "desktop",
}: TimerProgressProps) {
  if (!timer) return null;

  if (variant === "mobile") {
    return (
      <div className="mt-3">
        <div className="w-full bg-muted/20 rounded-full h-1.5">
          <div
            className={`h-1.5 rounded-full transition-all duration-1000 ${
              timer.phase === "focus"
                ? "bg-red-500"
                : timer.phase === "break"
                  ? "bg-green-500"
                  : "bg-blue-500"
            }`}
            style={{
              width: `${getProgress(timer)}%`,
              boxShadow: timer.isRunning ? `0 0 4px currentColor` : "none",
            }}
          ></div>
        </div>
      </div>
    );
  }

  return (
    <svg
      className="absolute inset-0 w-full h-full transform -rotate-90"
      viewBox="0 0 100 100"
    >
      {/* Background track */}
      <circle
        cx="50"
        cy="50"
        r="42"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        className="text-muted/15"
      />
      {/* Progress track */}
      <circle
        cx="50"
        cy="50"
        r="42"
        fill="none"
        strokeWidth="3"
        strokeLinecap="round"
        className={`transition-all duration-1000 ${
          timer.phase === "focus"
            ? "stroke-red-500 dark:stroke-red-400"
            : timer.phase === "break"
              ? "stroke-green-500 dark:stroke-green-400"
              : "stroke-blue-500 dark:stroke-blue-400"
        }`}
        strokeDasharray={`${(getCircularProgress(timer) / 360) * 264} 264`}
      />
    </svg>
  );
}
