"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Play,
  Pause,
  RotateCcw,
  Square,
  Clock,
  Coffee,
  Target,
  Users,
  Volume2,
  VolumeX,
  Wifi,
  AlertCircle,
  Crown,
  Shield,
} from "lucide-react";
// import { Howl } from "howler"; // Not using Howl, using custom Web Audio API
import { useTimerPolling } from "@/hooks/useTimerPolling";
import { useAuth } from "@/lib/hooks/useAuth";

interface PomodoroTimerProps {
  roomId: string;
  roomCreatorId?: string;
}

export function PomodoroTimer({ roomId, roomCreatorId }: PomodoroTimerProps) {
  const { user } = useAuth();
  const { timer, actions, loading, error, canControl, lastAction } =
    useTimerPolling({ roomId, roomCreatorId });
  const [soundEnabled, setSoundEnabled] = useState(false);
  const tickSoundRef = useRef<{ play: () => void; unload: () => void } | null>(
    null,
  );
  const completionSoundRef = useRef<{
    play: () => void;
    unload: () => void;
  } | null>(null);
  const [lastRemainingTime, setLastRemainingTime] = useState<number | null>(
    null,
  );

  // Initialize sounds using Web Audio API
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Create tick sound using Web Audio API (programmatic sound generation)
      const createTickSound = () => {
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        const audioContext = new AudioContextClass();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.type = "sine";

        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(
          0.1,
          audioContext.currentTime + 0.01,
        );
        gainNode.gain.exponentialRampToValueAtTime(
          0.001,
          audioContext.currentTime + 0.1,
        );

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
      };

      // Create completion sound
      const createCompletionSound = () => {
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        const audioContext = new AudioContextClass();

        // Create a pleasant completion chime
        const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5 chord

        frequencies.forEach((freq, index) => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();

          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);

          oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
          oscillator.type = "sine";

          const startTime = audioContext.currentTime + index * 0.1;
          gainNode.gain.setValueAtTime(0, startTime);
          gainNode.gain.linearRampToValueAtTime(0.2, startTime + 0.05);
          gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.8);

          oscillator.start(startTime);
          oscillator.stop(startTime + 0.8);
        });
      };

      // Wrap in Howl-like interface for consistency
      tickSoundRef.current = {
        play: () => {
          try {
            createTickSound();
          } catch {
            console.log("Audio context not available");
          }
        },
        unload: () => {},
      };

      completionSoundRef.current = {
        play: () => {
          try {
            createCompletionSound();
          } catch {
            console.log("Audio context not available");
          }
        },
        unload: () => {},
      };
    }

    return () => {
      // Cleanup sounds
      tickSoundRef.current?.unload();
      completionSoundRef.current?.unload();
    };
  }, []);

  // Play tick sound every second when timer is active
  useEffect(() => {
    if (
      timer?.isActive &&
      !timer.isPaused &&
      soundEnabled &&
      tickSoundRef.current
    ) {
      // Only play tick if time actually changed (to avoid multiple sounds)
      if (
        lastRemainingTime !== null &&
        timer.remainingTime !== lastRemainingTime
      ) {
        tickSoundRef.current.play();
      }
      setLastRemainingTime(timer.remainingTime);
    }
  }, [
    timer?.remainingTime,
    timer?.isActive,
    timer?.isPaused,
    soundEnabled,
    lastRemainingTime,
  ]);

  // Play completion sound when timer reaches zero
  useEffect(() => {
    if (
      timer &&
      timer.remainingTime === 0 &&
      lastRemainingTime &&
      lastRemainingTime > 0 &&
      soundEnabled
    ) {
      completionSoundRef.current?.play();

      // Show browser notification
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification(`${getPhaseLabel(timer.phase)} completed!`, {
          body: "Time for the next phase",
          icon: "/favicon.ico",
        });
      }
    }
  }, [
    timer?.remainingTime,
    lastRemainingTime,
    soundEnabled,
    timer?.phase,
    timer,
  ]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const getProgress = () => {
    if (!timer) return 0;
    const totalTime = getTotalTimeForPhase(timer.phase);
    return ((totalTime - timer.remainingTime) / totalTime) * 100;
  };

  const getTotalTimeForPhase = (phase: string) => {
    switch (phase) {
      case "focus":
        return 25 * 60; // 25 minutes
      case "shortBreak":
        return 5 * 60; // 5 minutes
      case "longBreak":
        return 15 * 60; // 15 minutes
      default:
        return 25 * 60;
    }
  };

  const getPhaseIcon = (phase: string) => {
    switch (phase) {
      case "focus":
        return <Target className="w-4 h-4" />;
      case "shortBreak":
      case "longBreak":
        return <Coffee className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case "focus":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "shortBreak":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "longBreak":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getPhaseLabel = (phase: string) => {
    switch (phase) {
      case "focus":
        return "Focus Time";
      case "shortBreak":
        return "Short Break";
      case "longBreak":
        return "Long Break";
      default:
        return "Focus Time";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "ADMIN":
        return <Crown className="w-3 h-3" />;
      case "MODERATOR":
        return <Shield className="w-3 h-3" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Permission Alert */}
      {!canControl && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Only moderators and admins can control the timer. You can view the
            current session.
          </AlertDescription>
        </Alert>
      )}

      {/* Timer Display */}
      <Card>
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Badge className={getPhaseColor(timer?.phase || "focus")}>
              {getPhaseIcon(timer?.phase || "focus")}
              <span className="ml-1">
                {getPhaseLabel(timer?.phase || "focus")}
              </span>
            </Badge>
            {timer?.isActive && (
              <Badge variant="outline" className="text-green-600">
                <Wifi className="w-3 h-3 mr-1" />
                Live
              </Badge>
            )}
          </div>
          <CardTitle className="text-6xl font-mono">
            {timer ? formatTime(timer.remainingTime) : "25:00"}
          </CardTitle>
          <p className="text-muted-foreground">
            Session {timer?.session || 1} of {timer?.totalSessions || 4}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress Bar */}
          <Progress value={getProgress()} className="h-2" />

          {/* Control Buttons */}
          <div className="flex justify-center gap-3">
            {canControl ? (
              <>
                {!timer?.isActive || timer?.isPaused ? (
                  <Button
                    onClick={actions.startTimer}
                    size="lg"
                    disabled={loading}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {loading
                      ? "Starting..."
                      : timer?.isPaused
                        ? "Resume"
                        : "Start"}
                  </Button>
                ) : (
                  <Button
                    onClick={actions.pauseTimer}
                    variant="outline"
                    size="lg"
                    disabled={loading}
                  >
                    <Pause className="w-4 h-4 mr-2" />
                    {loading ? "Pausing..." : "Pause"}
                  </Button>
                )}

                <Button
                  onClick={actions.stopTimer}
                  variant="outline"
                  size="lg"
                  disabled={loading || (!timer?.isActive && !timer?.isPaused)}
                >
                  <Square className="w-4 h-4 mr-2" />
                  Stop
                </Button>

                <Button
                  onClick={actions.resetTimer}
                  variant="outline"
                  size="lg"
                  disabled={loading}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  {loading ? "Resetting..." : "Reset"}
                </Button>
              </>
            ) : (
              <div className="text-center text-muted-foreground">
                <p className="text-sm">
                  Timer is controlled by room moderators
                </p>
                {lastAction && (
                  <p className="text-xs mt-1">
                    Last {lastAction.type} by {lastAction.by}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Sound Toggle */}
          <div className="flex items-center justify-center gap-2">
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-muted-foreground" />
            ) : (
              <VolumeX className="w-4 h-4 text-muted-foreground" />
            )}
            <Switch
              checked={soundEnabled}
              onCheckedChange={setSoundEnabled}
              aria-label="Toggle tick sound"
            />
            <span className="text-sm text-muted-foreground">Tick Sound</span>
          </div>
        </CardContent>
      </Card>

      {/* Room Sync Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="w-5 h-5" />
            Room Sync
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Connection</span>
              <Badge variant="outline" className="text-green-600">
                <Wifi className="w-3 h-3 mr-1" />
                Connected
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Timer Status
              </span>
              <Badge
                variant={timer?.isActive ? "default" : "outline"}
                className={timer?.isActive ? "text-green-600" : ""}
              >
                {timer?.isActive
                  ? timer.isPaused
                    ? "Paused"
                    : "Running"
                  : "Stopped"}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Your Role</span>
              <div className="flex items-center gap-1">
                {getRoleIcon(user?.role || "USER")}
                <span className="text-sm font-medium">
                  {user?.role || "USER"}
                </span>
              </div>
            </div>

            <Separator />

            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Timer syncs automatically with all room members
              </p>
              {timer?.isActive && (
                <p className="text-xs text-muted-foreground">
                  All participants see the same countdown
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Session Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold">{timer?.session || 1}</div>
              <div className="text-xs text-muted-foreground">Current</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold">
                {timer?.totalSessions || 4}
              </div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Progress</span>
              <span>
                {timer?.session || 1}/{timer?.totalSessions || 4}
              </span>
            </div>
            <Progress
              value={
                ((timer?.session || 1) / (timer?.totalSessions || 4)) * 100
              }
              className="h-2"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
