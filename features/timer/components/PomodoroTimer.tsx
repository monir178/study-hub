"use client";

import { useState, useEffect, useCallback } from "react";
import { useTimer } from "../hooks/useTimer";
import { useAuth } from "@/lib/hooks/useAuth";
import { useSound } from "@/lib/hooks/useSound";
import { Button } from "@/components/ui/button";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Volume2,
  VolumeX,
  Clock,
  Check,
  Settings,
  // Timer,
  // Coffee,
  // Play,
  // Pause,
  // RotateCcw,
  // Loader2,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  TimerDisplay,
  TimerControls,
  TimerProgress,
  TimerIcons,
} from "./index";
import { formatTime, getCircularProgress } from "../utils/timer.utils";

interface PomodoroTimerProps {
  roomId: string;
  roomCreatorId: string;
}

export function PomodoroTimer({ roomId, roomCreatorId }: PomodoroTimerProps) {
  const { timer, loading, error, canControl, actions } = useTimer({
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

  // Wrap actions with sound effects
  const actionsWithSound = {
    startTimer: async () => {
      if (soundEnabled) {
        playTimerStart();
      }
      await actions.startTimer();
    },
    pauseTimer: async () => {
      if (soundEnabled) {
        playTimerPause();
      }
      await actions.pauseTimer();
    },
    resetTimer: async () => {
      if (soundEnabled) {
        playTimerReset();
      }
      await actions.resetTimer();
    },
  };

  // Enhanced toggle with test sound
  const handleToggleSound = () => {
    toggleSound();
    // Play a test sound to confirm the toggle worked
    setTimeout(() => {
      if (!soundEnabled) {
        playTimerStart(); // Play start sound when enabling
      }
    }, 100);
  };
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
            y: 40, // Moved higher up from 80px to 40px
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
              <Clock className="w-12 h-12 text-muted-foreground animate-pulse " />
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
      <div className="hidden lg:block ">
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
                  strokeDasharray={`${(getCircularProgress(timer) / 360) * 264} 264`}
                />
              </svg>

              {/* Inner Content - Clean Circle */}
              <div
                className="absolute inset-4 rounded-full bg-primary/15 dark:bg-secondary backdrop-blur-sm border border-border/20 shadow-lg flex flex-col items-center justify-center cursor-move hover:shadow-xl transition-all duration-300"
                onMouseDown={handleMouseDown}
              >
                {/* Phase Icon */}
                <div className="mb-2">
                  <TimerIcons phase={timer.phase} size="lg" />
                </div>

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
                  <TimerDisplay timer={timer} variant="desktop" />

                  {/* Controls */}
                  <TimerControls
                    actions={actionsWithSound}
                    loading={loading}
                    canControl={canControl}
                    isRunning={timer?.isRunning || false}
                    _isPaused={timer?.isPaused || false}
                    variant="desktop"
                  />

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
                      onCheckedChange={handleToggleSound}
                      className="scale-90"
                    />
                  </div>

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
              className="absolute bottom-1 right-1 w-7 h-7 bg-primary text-primary-foreground rounded-full shadow-md flex items-center justify-center hover:bg-primary/90 transition-colors border border-primary/50 settings-button"
            >
              <Settings className="w-[1rem] h-[1rem]" />
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
            <TimerDisplay timer={timer} variant="mobile" />

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
              <TimerControls
                actions={actionsWithSound}
                loading={loading}
                canControl={canControl}
                isRunning={timer?.isRunning || false}
                _isPaused={timer?.isPaused || false}
                variant="mobile"
              />

              {/* Sound Toggle - Compact */}
              <Button
                onClick={handleToggleSound}
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
          </div>

          {/* Progress Bar - Compact */}
          <TimerProgress timer={timer} variant="mobile" />

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
