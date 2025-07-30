import { useState, useEffect, useCallback } from "react";
import { soundManager } from "@/lib/sounds";

export function useSound() {
  const [isEnabled, setIsEnabled] = useState(false);

  // Initialize sound state from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedState = localStorage.getItem("timer-sound-enabled");
      const enabled = savedState ? JSON.parse(savedState) : false;
      setIsEnabled(enabled);

      if (enabled) {
        soundManager.enable();
      } else {
        soundManager.disable();
      }
    }
  }, []);

  // Toggle sound on/off
  const toggleSound = useCallback(() => {
    const newState = !isEnabled;
    setIsEnabled(newState);

    if (newState) {
      soundManager.enable();
    } else {
      soundManager.disable();
    }

    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("timer-sound-enabled", JSON.stringify(newState));
    }
  }, [isEnabled]);

  // Enable sound
  const enableSound = useCallback(() => {
    setIsEnabled(true);
    soundManager.enable();
    if (typeof window !== "undefined") {
      localStorage.setItem("timer-sound-enabled", "true");
    }
  }, []);

  // Disable sound
  const disableSound = useCallback(() => {
    setIsEnabled(false);
    soundManager.disable();
    if (typeof window !== "undefined") {
      localStorage.setItem("timer-sound-enabled", "false");
    }
  }, []);

  // Play sound functions
  const playTimerComplete = useCallback(() => {
    soundManager.playTimerComplete();
  }, []);

  const playTimerStart = useCallback(() => {
    soundManager.playTimerStart();
  }, []);

  const playTimerPause = useCallback(() => {
    soundManager.playTimerPause();
  }, []);

  const playTimerReset = useCallback(() => {
    soundManager.playTimerReset();
  }, []);

  const playPhaseChange = useCallback(() => {
    soundManager.playPhaseChange();
  }, []);

  const playTick = useCallback(() => {
    soundManager.playTick();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Don't cleanup the soundManager as it's a singleton
      // Only cleanup if the component is unmounting and we want to disable sounds
    };
  }, []);

  return {
    isEnabled,
    toggleSound,
    enableSound,
    disableSound,
    playTimerComplete,
    playTimerStart,
    playTimerPause,
    playTimerReset,
    playPhaseChange,
    playTick,
  };
}
