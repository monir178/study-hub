"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FloatingStudyIconProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  className?: string;
  delay?: number;
  size?: number;
  skipInitialAnimation?: boolean;
}

export function FloatingStudyIcon({
  icon: Icon,
  className,
  delay = 0,
  size = 24,
  skipInitialAnimation = false,
}: FloatingStudyIconProps) {
  return (
    <motion.div
      initial={
        skipInitialAnimation
          ? {
              opacity: 1,
              y: 0,
              scale: 1,
            }
          : {
              opacity: 0,
              y: 20,
              scale: 0.8,
            }
      }
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      transition={
        skipInitialAnimation
          ? {}
          : {
              duration: 2,
              delay,
              ease: [0.23, 0.86, 0.39, 0.96],
            }
      }
      className={cn("absolute", className)}
    >
      <motion.div
        animate={{
          y: [0, -10, 0],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 6,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: delay * 2,
        }}
        className="relative"
      >
        <div className="relative p-3 rounded-2xl bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-lg">
          <Icon
            size={size}
            className="text-primary/80 dark:text-primary/90 drop-shadow-sm"
          />
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent dark:from-white/10 dark:to-transparent" />
        </div>
      </motion.div>
    </motion.div>
  );
}
