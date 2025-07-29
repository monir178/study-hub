"use client";

import { useState, useEffect, useRef } from "react";
import { usePomodoroTimer } from "../hooks/usePomodoroTimer";
import { useAuth } from "@/lib/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Crown,
  Shield,
  User as UserIcon,
  Clock,
  Coffee,
  Timer,
  Loader2,
  Check,
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
  const { user } = useAuth();
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [lastRemainingTime, setLastRemainingTime] = useState<number | null>(
    null,
  );
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

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

  const getPhaseIcon = (phase: string) => {
    switch (phase) {
      case "focus":
        return <Timer className="w-4 h-4" />;
      case "break":
      case "long_break":
        return <Coffee className="w-4 h-4" />;
      default:
        return <Timer className="w-4 h-4" />;
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

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "ADMIN":
        return <Crown className="w-3 h-3" />;
      case "MODERATOR":
        return <Shield className="w-3 h-3" />;
      default:
        return <UserIcon className="w-3 h-3" />;
    }
  };

  if (!timer) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Initializing timer...</p>
          <p className="text-xs text-muted-foreground mt-2">
            This may take a moment
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Success Feedback */}
      {actionSuccess && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-right dark:bg-green-500">
            <Check className="w-4 h-4" />
            <span className="text-sm font-medium">{actionSuccess}</span>
          </div>
        </div>
      )}

      {/* Timer Display */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl">
            {getPhaseIcon(timer.phase)}
            {getPhaseLabel(timer.phase)}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {/* Timer Countdown */}
          <div className="text-6xl font-mono font-bold">
            {formatTime(timer.remaining)}
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress value={getProgress()} className="h-2" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>
                Session {timer.session}/{timer.totalSessions}
              </span>
              <span>{Math.round(getProgress())}%</span>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center justify-center gap-2">
            <Badge variant="outline" className={getPhaseColor(timer.phase)}>
              {timer.isRunning
                ? "Running"
                : timer.isPaused
                  ? "Paused"
                  : "Stopped"}
            </Badge>
            {timer.controlledBy && (
              <Badge variant="outline" className="text-xs">
                {getRoleIcon(user?.role || "USER")}
                <span className="ml-1">
                  Controlled by{" "}
                  {timer.controlledBy === user?.id ? "you" : "someone else"}
                </span>
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      {canControl && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Timer Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button
                onClick={handleStartTimer}
                disabled={
                  loading.start ||
                  loading.pause ||
                  loading.reset ||
                  timer.isRunning
                }
                className="flex-1 transition-all duration-200 hover:scale-105"
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
                className="flex-1 transition-all duration-200 hover:scale-105"
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
                className="flex-1 transition-all duration-200 hover:scale-105"
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
            <div className="flex items-center space-x-2">
              <Switch
                id="sound-toggle"
                checked={soundEnabled}
                onCheckedChange={setSoundEnabled}
              />
              <Label htmlFor="sound-toggle" className="flex items-center gap-2">
                {soundEnabled ? (
                  <Volume2 className="w-4 h-4" />
                ) : (
                  <VolumeX className="w-4 h-4" />
                )}
                Sound Effects
              </Label>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Read-only view for non-controllers */}
      {!canControl && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Timer Status</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Only moderators and room creators can control the timer.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
