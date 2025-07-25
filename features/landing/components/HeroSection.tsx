"use client";

import { motion, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowRight, Play, Users, Clock, MessageSquare } from "lucide-react";
import DarkVeil from "@/components/ui/darkveli";

const fadeInUp: Variants = {
  initial: { opacity: 0, y: 60 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

// const fadeInLeft: Variants = {
//   initial: { opacity: 0, x: -60 },
//   animate: {
//     opacity: 1,
//     x: 0,
//     transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 },
//   },
// };

// const fadeInRight: Variants = {
//   initial: { opacity: 0, x: 60 },
//   animate: {
//     opacity: 1,
//     x: 0,
//     transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.4 },
//   },
// };

const staggerContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const HeroStats = () => (
  <motion.div
    className="flex flex-wrap justify-center gap-8 mt-12"
    variants={staggerContainer}
    initial="initial"
    animate="animate"
  >
    {[
      { icon: Users, label: "Active Learners", value: "10K+" },
      { icon: Clock, label: "Study Hours", value: "50K+" },
      { icon: MessageSquare, label: "Messages Sent", value: "100K+" },
    ].map((stat) => (
      <motion.div
        key={stat.label}
        className="flex items-center gap-2 text-white/80"
        variants={fadeInUp}
      >
        <stat.icon className="w-5 h-5 text-primary" />
        <div>
          <div className="font-bold text-white">{stat.value}</div>
          <div className="text-sm">{stat.label}</div>
        </div>
      </motion.div>
    ))}
  </motion.div>
);

const HeroContent = () => (
  <div className="relative z-10 container mx-auto px-4 py-20 lg:py-32">
    <div className="max-w-4xl mx-auto text-center">
      <motion.div variants={fadeInUp}>
        <Badge
          variant="secondary"
          className="mb-6 bg-white/10 text-white border-white/20 hover:bg-white/20"
        >
          🚀 Join the Future of Collaborative Learning
        </Badge>
      </motion.div>

      <motion.h1
        className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 text-white leading-tight"
        variants={fadeInUp}
      >
        Study Together,
        <span className="text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text block">
          Achieve More
        </span>
      </motion.h1>

      <motion.p
        className="text-xl lg:text-2xl text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed"
        variants={fadeInUp}
      >
        Join synchronized study rooms with real-time Pomodoro timers,
        collaborative markdown notes, and instant group chat. The ultimate
        platform for focused, productive learning sessions.
      </motion.p>

      <motion.div
        className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
        variants={fadeInUp}
      >
        <Button
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          asChild
        >
          <Link href="/rooms" className="flex items-center gap-2">
            Explore Study Rooms
            <ArrowRight className="w-5 h-5" />
          </Link>
        </Button>

        <Button
          size="lg"
          variant="outline"
          className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg font-semibold rounded-full backdrop-blur-sm"
          asChild
        >
          <Link href="/demo" className="flex items-center gap-2">
            <Play className="w-5 h-5" />
            Watch Demo
          </Link>
        </Button>
      </motion.div>

      <motion.div className="text-sm text-white/60" variants={fadeInUp}>
        Free to start • No credit card required • Join 10,000+ students
      </motion.div>

      <HeroStats />
    </div>
  </div>
);

const HeroBackground = () => (
  <div className="absolute inset-0 w-full h-full">
    <div className="w-full h-full">
      <DarkVeil speed={0.9} warpAmount={0.5} resolutionScale={1.0} />
    </div>
    {/* Overlay gradient for better text readability */}
    {/* <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" /> */}
  </div>
);

export default function HeroSection() {
  return (
    <section className="relative w-screen h-screen flex items-center justify-center overflow-hidden bg-background">
      <HeroBackground />
      <motion.div
        className="relative z-10 w-full"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <HeroContent />
      </motion.div>
    </section>
  );
}
