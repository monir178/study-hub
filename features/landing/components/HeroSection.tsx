"use client";

import { motion, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowRight, Play, Users, Clock, MessageSquare } from "lucide-react";

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

const HeroStats = () => {
  return (
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
          className="flex items-center gap-2 text-muted-foreground"
          variants={fadeInUp}
        >
          <stat.icon className="w-5 h-5 text-primary" />
          <div>
            <div className="font-bold text-foreground">{stat.value}</div>
            <div className="text-sm">{stat.label}</div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

const HeroContent = () => {
  return (
    <div className="relative z-10 container mx-auto px-4 py-20 lg:py-32">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div variants={fadeInUp}>
          <Badge variant="secondary" className="mb-6">
            🚀 Join the Future of Collaborative Learning
          </Badge>
        </motion.div>

        <motion.h1
          className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 leading-tight text-foreground"
          variants={fadeInUp}
        >
          Study Together,
          <span className="text-transparent bg-gradient-to-r from-primary to-primary/70 bg-clip-text block">
            Achieve More
          </span>
        </motion.h1>

        <motion.p
          className="text-xl lg:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed text-muted-foreground"
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
            asChild
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Link href="/auth/signup" className="flex items-center gap-2">
              Explore Study Rooms
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="px-8 py-6 text-lg font-semibold rounded-full"
            asChild
          >
            <Link href="/demo" className="flex items-center gap-2">
              <Play className="w-5 h-5" />
              Watch Demo
            </Link>
          </Button>
        </motion.div>

        <motion.div
          className="text-sm text-muted-foreground"
          variants={fadeInUp}
        >
          Free to start • No credit card required • Join 10,000+ students
        </motion.div>

        <HeroStats />
      </div>
    </div>
  );
};

const HeroBackground = () => {
  return <div className="absolute inset-0 w-full h-full bg-background" />;
};

export default function HeroSection() {
  return (
    <section className="relative w-screen h-full flex items-center justify-center overflow-hidden bg-background">
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
