"use client";

import { useState, useEffect, useCallback } from "react";
import { usePomodoroTimer } from "../hooks/usePomodoroTimer";
import { useAuth } from "@/lib/hooks/useAuth";
import { useSound } from "@/lib/hooks/useSound";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Clock,
  Coffee,
  Timer,
  Loader2,
  Check,
  Settings,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PomodoroTimerProps {
  roomId: string;
  roomCreatorId: string;
}

export function PomodoroTimer({ roomId, roomCreatorId }: PomodoroTimerProps) {
  const { timer, loading, error, canControl, actions } = usePomodoroTimer({
    roomId,
    roomCreatorId,
  });
  const {} = useAuth();
  const {
    isEnabled: soundEnabled,
    toggleSound,
    playTimerComplete,
    playTimerStart,
    playTimerPause,
    playTimerReset,
    playPhaseChange,
  } = useSound();
  const [lastRemainingTime, setLastRemainingTime] = useState<number | null>(
    null,
  );
  const [lastPhase, setLastPhase] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Draggable state - start at top-right corner
  const [position, setPosition] = useState({ x: 0, y: 16 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isExpanded, setIsExpanded] = useState(false);

  // Custom draggable handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  // Smart dropdown positioning
  const getDropdownPosition = () => {
    if (typeof window === "undefined") return "bottom";

    const viewportWidth = window.innerWidth;
    // const viewportHeight = window.innerHeight;
    const timerWidth = 128; // w-32
    const dropdownWidth = 220; // min-w-[220px]
    const dropdownHeight = 300; // approximate height

    // Check available space in each direction
    const spaceRight = viewportWidth - (position.x + timerWidth + 20);
    const spaceLeft = position.x - dropdownWidth - 20;
    const spaceTop = position.y - dropdownHeight - 20;
    // const spaceBottom = viewportHeight - (position.y + timerWidth + 20);

    // Priority: right > left > top > bottom
    if (spaceRight >= dropdownWidth) return "right";
    if (spaceLeft >= dropdownWidth) return "left";
    if (spaceTop >= dropdownHeight) return "top";
    return "bottom";
  };

  // Click outside handler
  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as Element;
    if (
      !target.closest(".timer-container") &&
      !target.closest(".settings-button")
    ) {
      setIsExpanded(false);
    }
  };

  // Add click outside listener
  useEffect(() => {
    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isExpanded]);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;

      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;

      // Keep within viewport bounds
      const maxX = window.innerWidth - 96; // 96px = w-24
      const maxY = window.innerHeight - 96;

      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      });
    },
    [isDragging, dragStart.x, dragStart.y],
  );

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Smart positioning based on device size
  useEffect(() => {
    if (typeof window !== "undefined") {
      const updatePosition = () => {
        const isLargeDevice = window.innerWidth >= 1024; // lg breakpoint
        const isMediumDevice = window.innerWidth >= 768; // md breakpoint

        if (isLargeDevice) {
          // Calculate the exact middle position between Chat panel and RoomSidebar
          const viewportWidth = window.innerWidth;
          const containerMaxWidth = 1280; // max-w-7xl container
          const containerWidth = Math.min(containerMaxWidth, viewportWidth);
          const containerPadding = (viewportWidth - containerWidth) / 2; // centering padding

          // Grid layout: lg:grid-cols-4, so chat takes 3/4 and sidebar takes 1/4
          const chatWidth = (containerWidth * 3) / 4; // 75% of container
          const gap = 24; // gap-6 = 1.5rem = 24px

          // Position in the middle of the gap between chat and sidebar
          const chatEndX = containerPadding + chatWidth;
          const middleX = chatEndX + gap / 2 - 64; // 64px = half of timer width (128px/2)

          setPosition({
            x: middleX,
            y: 80, // Below room header (approximately)
          });
        } else if (isMediumDevice) {
          // Top-right for medium devices
          setPosition({
            x: window.innerWidth - 140,
            y: 20,
          });
        } else {
          // Top-center for mobile devices
          setPosition({
            x: (window.innerWidth - 120) / 2,
            y: 20,
          });
        }
      };

      updatePosition();
      window.addEventListener("resize", updatePosition);
      return () => window.removeEventListener("resize", updatePosition);
    }
  }, []);

  // Add global mouse event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, dragStart, handleMouseMove]);

  // Play completion sound when timer finishes
  useEffect(() => {
    if (
      timer?.remaining === 0 &&
      lastRemainingTime &&
      lastRemainingTime > 0 &&
      soundEnabled
    ) {
      playTimerComplete();
    }
  }, [timer?.remaining, lastRemainingTime, soundEnabled, playTimerComplete]);

  // Track last remaining time for completion detection
  useEffect(() => {
    setLastRemainingTime(timer?.remaining || null);
  }, [timer?.remaining]);

  // Track phase changes for sound effects
  useEffect(() => {
    if (
      timer?.phase &&
      lastPhase &&
      timer.phase !== lastPhase &&
      soundEnabled
    ) {
      playPhaseChange();
    }
    setLastPhase(timer?.phase || null);
  }, [timer?.phase, lastPhase, soundEnabled, playPhaseChange]);

  // Ticking sound during countdown - DISABLED
  // useEffect(() => {
  //   if (!timer?.isRunning || !soundEnabled) return;

  //   const tickInterval = setInterval(() => {
  //     if (timer.isRunning && timer.remaining > 0) {
  //       playTick();
  //     }
  //   }, 1000); // Tick every second

  //   return () => clearInterval(tickInterval);
  // }, [timer?.isRunning, timer?.remaining, soundEnabled, playTick]);

  // Show success feedback
  useEffect(() => {
    if (!loading.start && !loading.pause && !loading.reset && actionSuccess) {
      const timer = setTimeout(() => {
        setActionSuccess(null);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [loading.start, loading.pause, loading.reset, actionSuccess]);

  // Enhanced action handlers with success feedback
  const handleStartTimer = async () => {
    await actions.startTimer();
    if (!error) {
      setActionSuccess("Timer started!");
      playTimerStart();
    }
  };

  const handlePauseTimer = async () => {
    await actions.pauseTimer();
    if (!error) {
      setActionSuccess("Timer paused!");
      playTimerPause();
    }
  };

  const handleResetTimer = async () => {
    await actions.resetTimer();
    if (!error) {
      setActionSuccess("Timer reset!");
      playTimerReset();
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getProgress = (): number => {
    if (!timer) return 0;
    const total =
      timer.phase === "focus"
        ? 25 * 60
        : timer.phase === "break"
          ? 5 * 60
          : 15 * 60;
    const progress = ((total - timer.remaining) / total) * 100;
    return Math.max(0, Math.min(progress, 100)); // Clamp between 0 and 100
  };

  const getPhaseLabel = (phase: string): string => {
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

  const getPhaseIcon = (phase: string, size: "sm" | "md" | "lg" = "md") => {
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
  };

  const getPhaseColor = (phase: string): string => {
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

  // Circular progress calculation
  const getCircularProgress = (): number => {
    if (!timer) return 0;
    const total =
      timer.phase === "focus"
        ? 25 * 60
        : timer.phase === "break"
          ? 5 * 60
          : 15 * 60;
    return ((total - timer.remaining) / total) * 360; // Convert to degrees
  };

  if (!timer) {
    return (
      <>
        {/* Desktop - Fixed Circular Timer */}
        <div className="hidden lg:block">
          <div
            className="fixed z-50"
            style={{
              left: `${position.x}px`,
              top: `${position.y}px`,
            }}
          >
            <div className="w-32 h-32 rounded-full flex items-center justify-center">
              <Clock className="w-12 h-12 text-muted-foreground animate-pulse" />
            </div>
          </div>
        </div>

        {/* Mobile - Horizontal Bar */}
        <div className="block lg:hidden">
          <div className="bg-background/95 backdrop-blur-sm border rounded-lg p-4 shadow-lg">
            <div className="flex items-center justify-center">
              <Clock className="w-6 h-6 text-muted-foreground animate-pulse" />
              <span className="ml-2 text-sm text-muted-foreground">
                Initializing timer...
              </span>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Desktop - Fixed Circular Timer */}
      <div className="hidden lg:block">
        <div
          className="fixed z-50"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
          }}
        >
          {/* Success Feedback */}
          {actionSuccess && (
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-[60]">
              <div className="bg-green-600 text-white px-2 py-1 rounded text-xs shadow-lg flex items-center gap-1 animate-in slide-in-from-top dark:bg-green-500">
                <Check className="w-3 h-3" />
                <span>{actionSuccess}</span>
              </div>
            </div>
          )}

          {/* Circular Timer - No Background Container */}
          <div className="relative group timer-container">
            <div className="w-32 h-32 relative">
              {/* Progress Circle Only */}
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
                  strokeDasharray={`${(getCircularProgress() / 360) * 264} 264`}
                />
              </svg>

              {/* Inner Content - Clean Circle */}
              <div
                className="absolute inset-4 rounded-full bg-background/98 backdrop-blur-sm border border-border/20 shadow-lg flex flex-col items-center justify-center cursor-move hover:shadow-xl transition-all duration-300"
                onMouseDown={handleMouseDown}
              >
                {/* Phase Icon */}
                <div className="mb-2">{getPhaseIcon(timer.phase, "lg")}</div>

                {/* Timer Display */}
                <div className="text-base font-mono font-bold leading-none tracking-tight">
                  {formatTime(timer.remaining)}
                </div>

                {/* Session Counter */}
                <div className="text-xs text-muted-foreground mt-1.5 font-medium">
                  {timer.session}/{timer.totalSessions}
                </div>

                {/* Status Indicator */}
                <div className="absolute -top-2 -right-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      timer.isRunning
                        ? "bg-green-500 animate-pulse shadow-lg shadow-green-500/50"
                        : timer.isPaused
                          ? "bg-yellow-500 shadow-lg shadow-yellow-500/50"
                          : "bg-gray-400"
                    }`}
                  ></div>
                </div>
              </div>
            </div>

            {/* Expanded Controls Panel */}
            {isExpanded && (
              <div
                className={`absolute bg-gradient-to-br from-background/98 to-background/95 backdrop-blur-md border border-border/50 rounded-xl shadow-2xl p-4 min-w-[220px] animate-in duration-200 ${
                  getDropdownPosition() === "right"
                    ? "left-full ml-2 top-1/2 transform -translate-y-1/2 slide-in-from-left-2"
                    : getDropdownPosition() === "left"
                      ? "right-full mr-2 top-1/2 transform -translate-y-1/2 slide-in-from-right-2"
                      : getDropdownPosition() === "top"
                        ? "bottom-full mb-2 left-1/2 transform -translate-x-1/2 slide-in-from-bottom-2"
                        : "top-full mt-2 left-1/2 transform -translate-x-1/2 slide-in-from-top-2"
                }`}
              >
                <div className="space-y-4">
                  {/* Phase Info */}
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      {getPhaseIcon(timer.phase, "md")}
                      <span className="text-sm font-semibold">
                        {getPhaseLabel(timer.phase)}
                      </span>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-xs px-3 py-1 ${getPhaseColor(timer.phase)}`}
                    >
                      {timer.isRunning
                        ? "Running"
                        : timer.isPaused
                          ? "Paused"
                          : "Stopped"}
                    </Badge>
                  </div>

                  {/* Controls */}
                  {canControl && (
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Button
                          onClick={handleStartTimer}
                          disabled={
                            loading.start ||
                            loading.pause ||
                            loading.reset ||
                            timer.isRunning
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
                          onClick={handlePauseTimer}
                          disabled={
                            loading.start ||
                            loading.pause ||
                            loading.reset ||
                            !timer.isRunning
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
                          onClick={handleResetTimer}
                          disabled={
                            loading.start || loading.pause || loading.reset
                          }
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

                      {/* Sound Toggle */}
                      <div className="flex items-center justify-between p-2 rounded-lg bg-muted/20 border border-border/30">
                        <Label
                          htmlFor="sound-toggle"
                          className="text-sm flex items-center gap-2 font-medium cursor-pointer"
                        >
                          {soundEnabled ? (
                            <Volume2 className="w-4 h-4 text-green-600" />
                          ) : (
                            <VolumeX className="w-4 h-4 text-muted-foreground" />
                          )}
                          Sound Effects
                        </Label>
                        <Switch
                          id="sound-toggle"
                          checked={soundEnabled}
                          onCheckedChange={toggleSound}
                          className="scale-90"
                        />
                      </div>
                    </div>
                  )}

                  {!canControl && (
                    <div className="text-center p-3 rounded-lg bg-muted/20 border border-border/30">
                      <p className="text-sm text-muted-foreground">
                        Only moderators can control the timer
                      </p>
                    </div>
                  )}

                  {/* Error Display */}
                  {error && (
                    <Alert variant="destructive" className="p-3">
                      <AlertDescription className="text-sm">
                        {error}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>
            )}

            {/* Settings Button */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="absolute bottom-0 right-0 w-6 h-6 bg-background border rounded-full shadow-md flex items-center justify-center hover:bg-muted/50 transition-colors opacity-0 group-hover:opacity-100 settings-button"
            >
              <Settings className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile & Tablet - Ultra Minimalistic Design */}
      <div className="block lg:hidden">
        {/* Success Feedback */}
        {actionSuccess && (
          <div className="mb-2">
            <div className="bg-green-600 text-white px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-top dark:bg-green-500">
              <Check className="w-3 h-3" />
              <span className="text-xs font-medium">{actionSuccess}</span>
            </div>
          </div>
        )}

        <div className="bg-background/95 backdrop-blur-sm border rounded-lg p-3 shadow-lg">
          <div className="flex items-center justify-between">
            {/* Left: Phase Info & Timer */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {/* Phase Icon & Label */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {getPhaseIcon(timer.phase, "sm")}
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

            {/* Right: Status & Controls */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Status Indicator */}
              <div
                className={`w-2 h-2 rounded-full ${
                  timer.isRunning
                    ? "bg-green-500 animate-pulse"
                    : timer.isPaused
                      ? "bg-yellow-500"
                      : "bg-gray-400"
                }`}
              ></div>

              {/* Compact Controls */}
              {canControl && (
                <div className="flex gap-1">
                  <Button
                    onClick={handleStartTimer}
                    disabled={
                      loading.start ||
                      loading.pause ||
                      loading.reset ||
                      timer.isRunning
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
                    onClick={handlePauseTimer}
                    disabled={
                      loading.start ||
                      loading.pause ||
                      loading.reset ||
                      !timer.isRunning
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
                    onClick={handleResetTimer}
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

                  {/* Sound Toggle - Compact */}
                  <Button
                    onClick={toggleSound}
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                  >
                    {soundEnabled ? (
                      <Volume2 className="w-3 h-3 text-green-600" />
                    ) : (
                      <VolumeX className="w-3 h-3 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Progress Bar - Compact */}
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
                  width: `${getProgress()}%`,
                  boxShadow: timer.isRunning ? `0 0 4px currentColor` : "none",
                }}
              ></div>
            </div>
          </div>

          {/* Error Display - Compact */}
          {error && (
            <div className="mt-2">
              <Alert variant="destructive" className="p-2">
                <AlertDescription className="text-xs">{error}</AlertDescription>
              </Alert>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
