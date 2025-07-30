import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Loader2 } from "lucide-react";
import { TimerActions } from "../types";

interface TimerControlsProps {
  actions: TimerActions;
  loading: {
    start: boolean;
    pause: boolean;
    reset: boolean;
  };
  canControl: boolean;
  isRunning: boolean;
  _isPaused: boolean;
  variant?: "desktop" | "mobile";
}

export function TimerControls({
  actions,
  loading,
  canControl,
  isRunning,
  _isPaused,
  variant = "desktop",
}: TimerControlsProps) {
  if (!canControl) {
    return (
      <div className="text-center p-3 rounded-lg bg-muted/20 border border-border/30">
        <p className="text-sm text-muted-foreground">
          Only moderators can control the timer
        </p>
      </div>
    );
  }

  if (variant === "mobile") {
    return (
      <div className="flex gap-1">
        <Button
          onClick={actions.startTimer}
          disabled={
            loading.start || loading.pause || loading.reset || isRunning
          }
          size="sm"
          className="h-8 w-8 p-0"
        >
          {loading.start ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <Play className="w-3 h-3" />
          )}
        </Button>
        <Button
          onClick={actions.pauseTimer}
          disabled={
            loading.start || loading.pause || loading.reset || !isRunning
          }
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0"
        >
          {loading.pause ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <Pause className="w-3 h-3" />
          )}
        </Button>
        <Button
          onClick={actions.resetTimer}
          disabled={loading.start || loading.pause || loading.reset}
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0"
        >
          {loading.reset ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <RotateCcw className="w-3 h-3" />
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Button
          onClick={actions.startTimer}
          disabled={
            loading.start || loading.pause || loading.reset || isRunning
          }
          size="sm"
          className="flex-1 h-9 font-medium transition-all duration-200 hover:scale-105"
        >
          {loading.start ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Play className="w-4 h-4" />
          )}
        </Button>
        <Button
          onClick={actions.pauseTimer}
          disabled={
            loading.start || loading.pause || loading.reset || !isRunning
          }
          variant="outline"
          size="sm"
          className="flex-1 h-9 font-medium transition-all duration-200 hover:scale-105"
        >
          {loading.pause ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Pause className="w-4 h-4" />
          )}
        </Button>
        <Button
          onClick={actions.resetTimer}
          disabled={loading.start || loading.pause || loading.reset}
          variant="outline"
          size="sm"
          className="flex-1 h-9 font-medium transition-all duration-200 hover:scale-105"
        >
          {loading.reset ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RotateCcw className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
