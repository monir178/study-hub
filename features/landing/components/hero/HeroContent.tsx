"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Zap } from "lucide-react";

const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
      delay: 0.2 + i * 0.2,
      ease: [0.25, 0.4, 0.25, 1],
    },
  }),
};

export function HeroContent() {
  return (
    <>
      <motion.div
        custom={1}
        variants={fadeUpVariants as any}
        initial="hidden"
        animate="visible"
      >
        <Badge
          variant="secondary"
          className="mb-8 px-6 py-2 text-xs font-medium bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/10 text-foreground hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-300 md:text-sm"
        >
          <Zap className="w-4 h-4 mr-2 text-primary " />
          Join the Future of Collaborative Learning
        </Badge>
      </motion.div>

      <motion.div
        custom={1.2}
        variants={fadeUpVariants as any}
        initial="hidden"
        animate="visible"
      >
        <h1 className="text-5xl  md:text-6xl  xl:text-8xl  font-bold mb-6 sm:mb-8 leading-[1.05] tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground/40 from-1% via-foreground/95 to-foreground/80">
            Study Together,
          </span>
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-violet-400">
            Achieve More
          </span>
        </h1>
      </motion.div>

      <motion.div
        custom={1.4}
        variants={fadeUpVariants as any}
        initial="hidden"
        animate="visible"
      >
        <p className="text-sm sm:text-lg md:text-xl   mb-8 sm:mb-12 leading-relaxed font-light tracking-wide max-w-4xl mx-auto px-4">
          Join study rooms with real-time Pomodoro timers, collaborative notes,
          and group chat — built for focused, productive learning.
        </p>
      </motion.div>
    </>
  );
}
