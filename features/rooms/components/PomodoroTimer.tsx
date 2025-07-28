/* eslint-disable */
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Play,
  Pause,
  RotateCcw,
  Settings,
  Clock,
  Coffee,
  Target,
  Users,
} from "lucide-react";

interface PomodoroTimerProps {
  roomId: string;
}

interface TimerState {
  minutes: number;
  seconds: number;
  isRunning: boolean;
  mode: "work" | "shortBreak" | "longBreak";
  session: number;
  totalSessions: number;
}

export function PomodoroTimer({ roomId }: PomodoroTimerProps) {
  const [timer, setTimer] = useState<TimerState>({
    minutes: 25,
    seconds: 0,
    isRunning: false,
    mode: "work",
    session: 1,
    totalSessions: 4,
  });

  const [settings, setSettings] = useState({
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    sessionsUntilLongBreak: 4,
  });

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (timer.isRunning) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev.seconds > 0) {
            return { ...prev, seconds: prev.seconds - 1 };
          } else if (prev.minutes > 0) {
            return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
          } else {
            // Timer finished
            handleTimerComplete();
            return { ...prev, isRunning: false };
          }
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [timer.isRunning]);

  const handleTimerComplete = () => {
    // Play notification sound (placeholder)
    console.log("Timer completed!");

    // Auto-switch to next mode
    setTimer((prev) => {
      let nextMode: "work" | "shortBreak" | "longBreak";
      let nextSession = prev.session;
      let duration: number;

      if (prev.mode === "work") {
        if (prev.session % settings.sessionsUntilLongBreak === 0) {
          nextMode = "longBreak";
          duration = settings.longBreakDuration;
        } else {
          nextMode = "shortBreak";
          duration = settings.shortBreakDuration;
        }
      } else {
        nextMode = "work";
        duration = settings.workDuration;
        if (prev.mode === "shortBreak" || prev.mode === "longBreak") {
          nextSession = prev.session + 1;
        }
      }

      return {
        ...prev,
        mode: nextMode,
        session: nextSession,
        minutes: duration,
        seconds: 0,
        isRunning: false,
      };
    });
  };

  const handleStart = () => {
    setTimer((prev) => ({ ...prev, isRunning: true }));
  };

  const handlePause = () => {
    setTimer((prev) => ({ ...prev, isRunning: false }));
  };

  const handleReset = () => {
    const duration =
      timer.mode === "work"
        ? settings.workDuration
        : timer.mode === "shortBreak"
          ? settings.shortBreakDuration
          : settings.longBreakDuration;

    setTimer((prev) => ({
      ...prev,
      minutes: duration,
      seconds: 0,
      isRunning: false,
    }));
  };

  const handleModeChange = (mode: "work" | "shortBreak" | "longBreak") => {
    const duration =
      mode === "work"
        ? settings.workDuration
        : mode === "shortBreak"
          ? settings.shortBreakDuration
          : settings.longBreakDuration;

    setTimer((prev) => ({
      ...prev,
      mode,
      minutes: duration,
      seconds: 0,
      isRunning: false,
    }));
  };

  const getTotalSeconds = () => {
    const duration =
      timer.mode === "work"
        ? settings.workDuration
        : timer.mode === "shortBreak"
          ? settings.shortBreakDuration
          : settings.longBreakDuration;
    return duration * 60;
  };

  const getCurrentSeconds = () => {
    return timer.minutes * 60 + timer.seconds;
  };

  const getProgress = () => {
    const total = getTotalSeconds();
    const current = getCurrentSeconds();
    return ((total - current) / total) * 100;
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case "work":
        return <Target className="w-4 h-4" />;
      case "shortBreak":
      case "longBreak":
        return <Coffee className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getModeColor = (mode: string) => {
    switch (mode) {
      case "work":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "shortBreak":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "longBreak":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Timer Display */}
      <Card>
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Badge className={getModeColor(timer.mode)}>
              {getModeIcon(timer.mode)}
              <span className="ml-1 capitalize">
                {timer.mode === "shortBreak"
                  ? "Short Break"
                  : timer.mode === "longBreak"
                    ? "Long Break"
                    : timer.mode}
              </span>
            </Badge>
          </div>
          <CardTitle className="text-6xl font-mono">
            {String(timer.minutes).padStart(2, "0")}:
            {String(timer.seconds).padStart(2, "0")}
          </CardTitle>
          <p className="text-muted-foreground">
            Session {timer.session} of {timer.totalSessions}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress Bar */}
          <Progress value={getProgress()} className="h-2" />

          {/* Control Buttons */}
          <div className="flex justify-center gap-3">
            {!timer.isRunning ? (
              <Button onClick={handleStart} size="lg">
                <Play className="w-4 h-4 mr-2" />
                Start
              </Button>
            ) : (
              <Button onClick={handlePause} variant="outline" size="lg">
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </Button>
            )}
            <Button onClick={handleReset} variant="outline" size="lg">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>

          {/* Mode Selector */}
          <div className="flex justify-center">
            <Select
              value={timer.mode}
              onValueChange={(value: "work" | "shortBreak" | "longBreak") =>
                handleModeChange(value)
              }
              disabled={timer.isRunning}
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="work">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Work Session
                  </div>
                </SelectItem>
                <SelectItem value="shortBreak">
                  <div className="flex items-center gap-2">
                    <Coffee className="w-4 h-4" />
                    Short Break
                  </div>
                </SelectItem>
                <SelectItem value="longBreak">
                  <div className="flex items-center gap-2">
                    <Coffee className="w-4 h-4" />
                    Long Break
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
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
              <span className="text-sm text-muted-foreground">Status</span>
              <Badge variant="outline" className="text-green-600">
                Connected
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Participants
              </span>
              <span className="text-sm font-medium">3 active</span>
            </div>
            <Separator />
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Timer will sync with room members when started
              </p>
              <Button variant="outline" size="sm" disabled>
                <Settings className="w-4 h-4 mr-2" />
                Sync Settings
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Today's Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold">4</div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold">100m</div>
              <div className="text-xs text-muted-foreground">Focus Time</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
