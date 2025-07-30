import { TimerData, TimerConfig } from "../types";

// Timer configuration
export const TIMER_CONFIG: TimerConfig = {
  focus: 25 * 60, // 25 minutes
  break: 5 * 60, // 5 minutes
  longBreak: 15 * 60, // 15 minutes
  sessionsBeforeLongBreak: 4,
};

// Format time from seconds to MM:SS
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

// Calculate progress percentage
export const getProgress = (timer: TimerData | null): number => {
  if (!timer) return 0;

  const total =
    TIMER_CONFIG[timer.phase as keyof TimerConfig] || TIMER_CONFIG.focus;
  const progress = ((total - timer.remaining) / total) * 100;
  return Math.max(0, Math.min(progress, 100)); // Clamp between 0 and 100
};

// Get phase label
export const getPhaseLabel = (phase: string): string => {
  switch (phase) {
    case "focus":
      return "Focus";
    case "break":
      return "Break";
    case "long_break":
      return "Long Break";
    default:
      return "Focus";
  }
};

// Get phase color for styling
export const getPhaseColor = (phase: string): string => {
  switch (phase) {
    case "focus":
      return "bg-destructive/10 text-destructive border-destructive/20";
    case "break":
      return "bg-green-500/10 text-green-600 border-green-500/20 dark:text-green-400";
    case "long_break":
      return "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
};

// Calculate circular progress for desktop timer
export const getCircularProgress = (timer: TimerData | null): number => {
  if (!timer) return 0;

  const total =
    TIMER_CONFIG[timer.phase as keyof TimerConfig] || TIMER_CONFIG.focus;
  const progress = ((total - timer.remaining) / total) * 360; // Convert to degrees
  return Math.max(0, Math.min(progress, 360)); // Clamp between 0 and 360
};

// Check if timer is in final minute
export const isInFinalMinute = (timer: TimerData | null): boolean => {
  if (!timer) return false;
  return timer.remaining <= 60;
};

// Check if timer is about to complete
export const isAboutToComplete = (timer: TimerData | null): boolean => {
  if (!timer) return false;
  return timer.remaining <= 10;
};

// Get next phase
export const getNextPhase = (
  currentPhase: string,
  currentSession: number,
): string => {
  if (currentPhase === "focus") {
    // After focus, check if it's time for long break
    if (currentSession % TIMER_CONFIG.sessionsBeforeLongBreak === 0) {
      return "long_break";
    } else {
      return "break";
    }
  } else {
    // After break or long break, go back to focus
    return "focus";
  }
};

// Get next session number
export const getNextSession = (
  currentPhase: string,
  currentSession: number,
): number => {
  if (currentPhase === "focus") {
    return currentSession + 1;
  } else {
    return currentSession;
  }
};
