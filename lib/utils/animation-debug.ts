/**
 * Debug utilities for animation persistence
 * Use in development to test animation behavior
 */

// This can be called from browser console to reset all animations
declare global {
  interface Window {
    resetAllAnimations?: () => void;
    resetHeroAnimations?: () => void;
  }
}

export function initAnimationDebugHelpers() {
  if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
    window.resetAllAnimations = () => {
      localStorage.removeItem("animation-persistence");
      window.location.reload();
    };

    window.resetHeroAnimations = () => {
      const keys = [
        "hero-background",
        "hero-floating-icons",
        "hero-badge",
        "hero-title",
        "hero-subtitle",
        "hero-buttons",
        "hero-footer",
        "hero-stats-container",
        "hero-stats-1",
        "hero-stats-2",
        "hero-stats-3",
        "navbar",
      ];

      // This would need to be integrated with the animation provider
      console.log("Would reset keys:", keys);
      console.log("Call resetAllAnimations() to fully reset");
    };

    console.log("Animation debug helpers available:");
    console.log("- resetAllAnimations(): Reset all animations and reload");
    console.log("- resetHeroAnimations(): Reset hero section animations");
  }
}

export default initAnimationDebugHelpers;
