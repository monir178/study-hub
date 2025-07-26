"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, BookOpen, Play } from "lucide-react";

const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
      delay: 0.5 + i * 0.2,
      ease: [0.25, 0.4, 0.25, 1],
    },
  }),
};

export function HeroButtons() {
  return (
    <motion.div
      custom={1.6}
      variants={fadeUpVariants as any}
      initial="hidden"
      animate="visible"
      className="flex flex-row gap-3 sm:gap-6 justify-center mb-8 sm:mb-12 px-4"
    >
      {/* Primary Button - Solid background, white text */}
      <Link href="/auth/signup">
        <motion.button
          className="group relative px-4 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold rounded-lg sm:rounded-xl overflow-hidden bg-primary text-white shadow-lg hover:shadow-xl transition-all duration-300"
          whileHover={{
            y: -1,
            transition: { duration: 0.2, ease: "easeOut" },
          }}
          whileTap={{
            y: 0,
            transition: { duration: 0.1 },
          }}
        >
          {/* Hover brightness overlay */}
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg sm:rounded-xl" />

          {/* Shimmer effect */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out">
            <div className="h-full w-8 bg-gradient-to-r from-transparent via-white/20 to-transparent rotate-12 opacity-70" />
          </div>

          <div className="flex items-center justify-center gap-2 sm:gap-3 relative z-10">
            <motion.div
              animate={{
                rotate: [0, 8, -8, 0],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                repeatDelay: 3,
              }}
            >
              <BookOpen className="w-4 sm:w-5 h-4 sm:h-5" />
            </motion.div>
            <span className="font-semibold whitespace-nowrap">
              Start Learning
            </span>
            <motion.div
              animate={{
                x: [0, 3, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                repeatDelay: 4,
              }}
            >
              <ArrowRight className="w-3 sm:w-4 h-3 sm:h-4" />
            </motion.div>
          </div>
        </motion.button>
      </Link>

      {/* Secondary Button - Transparent with border */}
      <Link href="/demo">
        <motion.button
          className="group relative px-4 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold rounded-lg sm:rounded-xl overflow-hidden border-2 border-border text-foreground hover:border-primary/50 hover:text-primary hover:bg-accent/20 transition-all duration-300"
          whileHover={{
            y: -1,
            transition: { duration: 0.2, ease: "easeOut" },
          }}
          whileTap={{
            y: 0,
            transition: { duration: 0.1 },
          }}
        >
          {/* Subtle shimmer */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out">
            <div className="h-full w-6 bg-gradient-to-r from-transparent via-primary/10 to-transparent rotate-12" />
          </div>

          <div className="flex items-center justify-center gap-2 sm:gap-3 relative z-10">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                repeatDelay: 4,
              }}
            >
              <Play className="w-3 sm:w-4 h-3 sm:h-4 group-hover:text-primary transition-colors duration-300" />
            </motion.div>
            <span className="font-semibold whitespace-nowrap">Watch Demo</span>
          </div>
        </motion.button>
      </Link>
    </motion.div>
  );
}
