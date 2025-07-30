import { Timer, Coffee } from "lucide-react";

interface TimerIconsProps {
  phase: string;
  size?: "sm" | "md" | "lg";
}

export function TimerIcons({ phase, size = "md" }: TimerIconsProps) {
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4 sm:w-5 sm:h-5",
    lg: "w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7",
  };

  switch (phase) {
    case "focus":
      return <Timer className={sizeClasses[size]} />;
    case "break":
    case "long_break":
      return <Coffee className={sizeClasses[size]} />;
    default:
      return <Timer className={sizeClasses[size]} />;
  }
}
