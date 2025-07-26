"use client";

import { motion } from "framer-motion";

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

export function HeroFooter() {
  return (
    <motion.div
      custom={1.8}
      variants={fadeUpVariants as any}
      initial="hidden"
      animate="visible"
      className="text-xs sm:text-sm text-muted-foreground mb-6 sm:mb-8 font-light px-4"
    >
      Free to start • No credit card required • Join 10,000+ students worldwide
    </motion.div>
  );
}
