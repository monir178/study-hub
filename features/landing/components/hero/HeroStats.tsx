"use client";

import { motion } from "framer-motion";
import { Users, Clock, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import CountUp from "@/components/ui/counter-up";

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

export function HeroStats() {
  const stats = [
    {
      icon: Users,
      label: "Active Learners",
      value: "10K+",
      numericValue: "10000", // For CountUp animation
      color: "text-blue-500",
    },
    {
      icon: Clock,
      label: "Study Hours",
      value: "50K+",
      numericValue: "50000", // For CountUp animation
      color: "text-emerald-500",
    },
    {
      icon: MessageSquare,
      label: "Messages Sent",
      value: "100K+",
      numericValue: "100000", // For CountUp animation
      color: "text-purple-500",
    },
  ];

  return (
    <motion.div
      className="flex flex-row justify-center gap-2 sm:gap-4 md:gap-6 mt-12 sm:mt-16 px-2 sm:px-4"
      custom={4}
      variants={fadeUpVariants as any}
      initial="hidden"
      animate="visible"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          className="group relative w-fit"
          custom={4 + index * 0.1}
          variants={fadeUpVariants as any}
          initial="hidden"
          animate="visible"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="relative p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl md:rounded-2xl bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
              <div
                className={cn(
                  "p-1 sm:p-1.5 md:p-2 rounded-md sm:rounded-lg bg-gradient-to-br from-primary/20 to-primary/10",
                  stat.color,
                )}
              >
                <stat.icon className="w-3 sm:w-4 md:w-5 h-3 sm:h-4 md:h-5 text-primary" />
              </div>
              <div className="text-center sm:text-left">
                <CountUp
                  from={0}
                  to={stat.value}
                  direction="up"
                  duration={1}
                  className="font-bold text-sm sm:text-base md:text-lg text-foreground block"
                />
                <div className="text-[10px] sm:text-xs md:text-sm text-muted-foreground leading-tight">
                  {stat.label}
                </div>
              </div>
            </div>
            <div className="absolute inset-0 rounded-lg sm:rounded-xl md:rounded-2xl bg-gradient-to-br from-white/10 to-transparent group-hover:from-white/20 transition-all duration-300" />
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
