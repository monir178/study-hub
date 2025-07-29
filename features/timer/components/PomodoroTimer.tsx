"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { usePomodoroTimer } from "../hooks/usePomodoroTimer";
import { useAuth } from "@/lib/hooks/useAuth";
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
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [lastRemainingTime, setLastRemainingTime] = useState<number | null>(
    null,
  );
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

  // Web Audio API for sounds
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize Web Audio API
  useEffect(() => {
    if (typeof window !== "undefined" && !audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext)();
    }
  }, []);

  // Play completion sound when timer finishes
  useEffect(() => {
    if (
      timer?.remaining === 0 &&
      lastRemainingTime &&
      lastRemainingTime > 0 &&
      soundEnabled &&
      audioContextRef.current
    ) {
      const completionOscillator = audioContextRef.current.createOscillator();
      const completionGain = audioContextRef.current.createGain();
      completionOscillator.connect(completionGain);
      completionGain.connect(audioContextRef.current.destination);
      completionOscillator.frequency.setValueAtTime(
        523.25,
        audioContextRef.current.currentTime,
      ); // C5
      completionGain.gain.setValueAtTime(
        0.3,
        audioContextRef.current.currentTime,
      );
      completionOscillator.start();
      completionOscillator.stop(audioContextRef.current.currentTime + 0.5);
    }
  }, [timer?.remaining, lastRemainingTime, soundEnabled]);

  // Track last remaining time for completion detection
  useEffect(() => {
    setLastRemainingTime(timer?.remaining || null);
  }, [timer?.remaining]);

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
    }
  };

  const handlePauseTimer = async () => {
    await actions.pauseTimer();
    if (!error) {
      setActionSuccess("Timer paused!");
    }
  };

  const handleResetTimer = async () => {
    await actions.resetTimer();
    if (!error) {
      setActionSuccess("Timer reset!");
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
    return ((total - timer.remaining) / total) * 100;
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
          <div className="relative group">
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
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-3 bg-gradient-to-br from-background/98 to-background/95 backdrop-blur-md border border-border/50 rounded-xl shadow-2xl p-4 min-w-[220px] animate-in slide-in-from-top-2 duration-200">
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
                          onCheckedChange={setSoundEnabled}
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
              className="absolute -bottom-2 -right-2 w-6 h-6 bg-background border rounded-full shadow-md flex items-center justify-center hover:bg-muted/50 transition-colors opacity-0 group-hover:opacity-100"
            >
              <Settings className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile - Minimalistic Horizontal Bar */}
      <div className="block lg:hidden">
        {/* Success Feedback */}
        {actionSuccess && (
          <div className="mb-2">
            <div className="bg-green-600 text-white px-3 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-top dark:bg-green-500">
              <Check className="w-4 h-4" />
              <span className="text-sm font-medium">{actionSuccess}</span>
            </div>
          </div>
        )}

        <div className="bg-background/95 backdrop-blur-sm border rounded-xl p-4 shadow-lg">
          <div className="space-y-4">
            {/* Timer Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {getPhaseIcon(timer.phase, "md")}
                  <span className="font-semibold text-lg">
                    {getPhaseLabel(timer.phase)}
                  </span>
                </div>
                <Badge
                  variant="outline"
                  className={`text-sm ${getPhaseColor(timer.phase)}`}
                >
                  {timer.isRunning
                    ? "Running"
                    : timer.isPaused
                      ? "Paused"
                      : "Stopped"}
                </Badge>
              </div>

              {/* Status Indicator */}
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

            {/* Timer Display and Progress */}
            <div className="space-y-3">
              <div className="text-center">
                <div className="text-3xl font-mono font-bold tracking-tight">
                  {formatTime(timer.remaining)}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Session {timer.session}/{timer.totalSessions}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="w-full bg-muted/20 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-1000 ${
                      timer.phase === "focus"
                        ? "bg-red-500"
                        : timer.phase === "break"
                          ? "bg-green-500"
                          : "bg-blue-500"
                    }`}
                    style={{
                      width: `${getProgress()}%`,
                      boxShadow: timer.isRunning
                        ? `0 0 8px currentColor`
                        : "none",
                    }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{Math.round(getProgress())}% Complete</span>
                  <span>{getPhaseLabel(timer.phase)} Time</span>
                </div>
              </div>
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
                    className="flex-1 h-10 font-medium"
                  >
                    {loading.start ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Play className="w-4 h-4 mr-2" />
                    )}
                    {loading.start ? "Starting..." : "Start"}
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
                    className="flex-1 h-10 font-medium"
                  >
                    {loading.pause ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Pause className="w-4 h-4 mr-2" />
                    )}
                    {loading.pause ? "Pausing..." : "Pause"}
                  </Button>
                  <Button
                    onClick={handleResetTimer}
                    disabled={loading.start || loading.pause || loading.reset}
                    variant="outline"
                    className="flex-1 h-10 font-medium"
                  >
                    {loading.reset ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <RotateCcw className="w-4 h-4 mr-2" />
                    )}
                    {loading.reset ? "Resetting..." : "Reset"}
                  </Button>
                </div>

                {/* Sound Toggle */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border/30">
                  <Label
                    htmlFor="mobile-sound-toggle"
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
                    id="mobile-sound-toggle"
                    checked={soundEnabled}
                    onCheckedChange={setSoundEnabled}
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
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
