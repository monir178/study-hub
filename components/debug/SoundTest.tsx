"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSound } from "@/lib/hooks/useSound";
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Coffee,
  Timer,
} from "lucide-react";

export function SoundTest() {
  const {
    isEnabled,
    toggleSound,
    playTimerComplete,
    playTimerStart,
    playTimerPause,
    playTimerReset,
    playPhaseChange,
  } = useSound();

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isEnabled ? (
            <Volume2 className="w-5 h-5 text-green-600" />
          ) : (
            <VolumeX className="w-5 h-5 text-muted-foreground" />
          )}
          Sound Test
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Sound Effects</span>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleSound}
            className={isEnabled ? "text-green-600" : "text-muted-foreground"}
          >
            {isEnabled ? "Enabled" : "Disabled"}
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={playTimerStart}
            disabled={!isEnabled}
            size="sm"
            className="flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            Start
          </Button>

          <Button
            onClick={playTimerPause}
            disabled={!isEnabled}
            size="sm"
            variant="outline"
            className="flex items-center gap-2"
          >
            <Pause className="w-4 h-4" />
            Pause
          </Button>

          <Button
            onClick={playTimerReset}
            disabled={!isEnabled}
            size="sm"
            variant="outline"
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>

          <Button
            onClick={playTimerComplete}
            disabled={!isEnabled}
            size="sm"
            className="flex items-center gap-2"
          >
            <Timer className="w-4 h-4" />
            Complete
          </Button>

          <Button
            onClick={playPhaseChange}
            disabled={!isEnabled}
            size="sm"
            variant="outline"
            className="flex items-center gap-2 col-span-2"
          >
            <Coffee className="w-4 h-4" />
            Phase Change
          </Button>
        </div>

        <div className="text-xs text-muted-foreground">
          <p>• Start: High E note (659.25 Hz)</p>
          <p>• Pause: A note (440 Hz)</p>
          <p>• Reset: F note (349.23 Hz)</p>
          <p>• Complete: C note (523.25 Hz)</p>
          <p>• Phase Change: D note (587.33 Hz)</p>
        </div>
      </CardContent>
    </Card>
  );
}
