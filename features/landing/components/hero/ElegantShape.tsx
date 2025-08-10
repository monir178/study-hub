"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface ElegantShapeProps {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
  rotate?: number;
  gradient?: string;
  borderRadius?: number;
  skipInitialAnimation?: boolean;
}

export function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "from-primary/[0.08]",
  borderRadius = 16,
  skipInitialAnimation = false,
}: ElegantShapeProps) {
  const { theme } = useTheme();

  return (
    <motion.div
      initial={
        skipInitialAnimation
          ? {
              opacity: 1,
              y: 0,
              rotate: rotate,
            }
          : {
              opacity: 0,
              y: -150,
              rotate: rotate - 15,
            }
      }
      animate={{
        opacity: 1,
        y: 0,
        rotate: rotate,
      }}
      transition={
        skipInitialAnimation
          ? {}
          : {
              duration: 2.4,
              delay,
              ease: [0.23, 0.86, 0.39, 0.96],
              opacity: { duration: 1.2 },
            }
      }
      className={cn("absolute", className)}
    >
      <motion.div
        animate={{
          y: [0, 15, 0],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        style={{
          width,
          height,
        }}
        className="relative"
      >
        <div
          style={{ borderRadius }}
          className={cn(
            "absolute inset-0",
            "bg-gradient-to-r to-transparent",
            gradient,
            "backdrop-blur-[2px]",
            theme === "light"
              ? "ring-1 ring-gray-300/40 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.15)]"
              : "ring-1 ring-white/[0.08] shadow-[0_8px_32px_-12px_rgba(255,255,255,0.05)]",
            "after:absolute after:inset-0",
            theme === "light"
              ? "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.4),transparent_70%)]"
              : "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.08),transparent_70%)]",
            "after:rounded-[inherit]",
          )}
        />
      </motion.div>
    </motion.div>
  );
}
