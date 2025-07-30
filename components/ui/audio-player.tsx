"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";

interface AudioPlayerProps {
  src: string;
  fileName?: string;
  className?: string;
}

export function AudioPlayer({
  src,
  fileName,
  className = "",
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  };

  const handleAudioPlay = () => {
    setIsPlaying(true);
  };

  const handleAudioPause = () => {
    setIsPlaying(false);
  };

  const isVoiceMessage = fileName?.includes("voice-message");

  return (
    <div
      className={`flex items-center gap-3 p-3 bg-muted/20 rounded-lg min-w-[220px] max-w-[280px] border ${className}`}
    >
      <Button
        size="sm"
        variant="ghost"
        className="h-8 w-8 p-0 flex-shrink-0 hover:bg-muted/50"
        onClick={handlePlayPause}
      >
        {isPlaying ? (
          <Pause className="w-4 h-4" />
        ) : (
          <Play className="w-4 h-4" />
        )}
      </Button>

      <div className="flex-1 min-w-0">
        <div className="text-xs font-medium text-foreground mb-1">
          {isVoiceMessage ? "Voice message" : "Audio file"}
        </div>
        <div className="text-xs text-muted-foreground">
          {isPlaying ? "Playing..." : "Click to play"}
        </div>
      </div>

      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        className="hidden"
        onPlay={handleAudioPlay}
        onPause={handleAudioPause}
        onEnded={handleAudioPause}
      />
    </div>
  );
}
