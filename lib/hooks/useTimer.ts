import { useState, useEffect, useRef } from "react";

interface UseTimerProps {
  initialTime?: number;
  onComplete?: () => void;
  autoStart?: boolean;
}

export function useTimer({
  initialTime = 1500, // 25 minutes in seconds
  onComplete,
  autoStart = false,
}: UseTimerProps = {}) {
  const [time, setTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [isCompleted, setIsCompleted] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && time > 0) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 1) {
            setIsRunning(false);
            setIsCompleted(true);
            onComplete?.();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, time, onComplete]);

  const start = () => {
    setIsRunning(true);
    setIsCompleted(false);
  };

  const pause = () => {
    setIsRunning(false);
  };

  const reset = (newTime?: number) => {
    setIsRunning(false);
    setTime(newTime || initialTime);
    setIsCompleted(false);
  };

  const stop = () => {
    setIsRunning(false);
    setTime(initialTime);
    setIsCompleted(false);
  };

  return {
    time,
    isRunning,
    isCompleted,
    start,
    pause,
    reset,
    stop,
    formatTime: (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    },
  };
}
