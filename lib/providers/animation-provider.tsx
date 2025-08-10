"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface AnimationContextType {
  hasAnimationPlayed: (key: string) => boolean;
  markAnimationPlayed: (key: string) => void;
  resetAnimations: () => void;
  resetSpecificAnimation: (key: string) => void;
}

const AnimationContext = createContext<AnimationContextType | undefined>(
  undefined,
);

export function AnimationProvider({ children }: { children: React.ReactNode }) {
  const [playedAnimations, setPlayedAnimations] = useState<Set<string>>(
    new Set(),
  );

  const hasAnimationPlayed = useCallback(
    (key: string) => playedAnimations.has(key),
    [playedAnimations],
  );

  const markAnimationPlayed = useCallback((key: string) => {
    setPlayedAnimations((prev) => new Set(prev).add(key));
  }, []);

  const resetAnimations = useCallback(() => {
    setPlayedAnimations(new Set());
  }, []);

  const resetSpecificAnimation = useCallback((key: string) => {
    setPlayedAnimations((prev) => {
      const newSet = new Set(prev);
      newSet.delete(key);
      return newSet;
    });
  }, []);

  return (
    <AnimationContext.Provider
      value={{
        hasAnimationPlayed,
        markAnimationPlayed,
        resetAnimations,
        resetSpecificAnimation,
      }}
    >
      {children}
    </AnimationContext.Provider>
  );
}

export function useAnimationPersistence() {
  const context = useContext(AnimationContext);
  if (context === undefined) {
    throw new Error(
      "useAnimationPersistence must be used within an AnimationProvider",
    );
  }
  return context;
}
