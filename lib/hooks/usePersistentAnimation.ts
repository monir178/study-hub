import { useEffect } from "react";
import { useAnimationPersistence } from "@/lib/providers/animation-provider";

interface UsePersistentAnimationOptions {
  /** Unique key for this animation */
  animationKey: string;
  /**
   * Whether this animation should reset on route changes
   * Set to false for animations that should only play once per session
   */
  resetOnRouteChange?: boolean;
  /**
   * Whether this animation should reset on locale changes
   * Set to false for animations that should persist across language changes
   */
  resetOnLocaleChange?: boolean;
}

export function usePersistentAnimation({
  animationKey,
  resetOnRouteChange: _resetOnRouteChange = false,
  resetOnLocaleChange: _resetOnLocaleChange = false,
}: UsePersistentAnimationOptions) {
  const { hasAnimationPlayed, markAnimationPlayed, resetSpecificAnimation } =
    useAnimationPersistence();

  const hasPlayed = hasAnimationPlayed(animationKey);

  // Mark animation as played after component mounts (when animation would complete)
  useEffect(() => {
    if (!hasPlayed) {
      // Delay marking as played to allow animation to complete
      const timer = setTimeout(() => {
        markAnimationPlayed(animationKey);
      }, 2000); // Adjust based on your longest animation duration

      return () => clearTimeout(timer);
    }
  }, [hasPlayed, markAnimationPlayed, animationKey]);

  // Provide methods to reset if needed
  const resetAnimation = () => resetSpecificAnimation(animationKey);

  return {
    /** Whether this animation has already been played */
    hasPlayed,
    /** Function to manually reset this specific animation */
    resetAnimation,
    /** Initial state for framer motion */
    initial: hasPlayed ? "visible" : "hidden",
    /** Animate state for framer motion */
    animate: "visible",
  };
}
