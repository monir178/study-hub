"use client";

import { motion, Variants } from "framer-motion";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Zap } from "lucide-react";

const fadeUpVariants: Variants = {
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
  const t = useTranslations("landing.hero");

  return (
    <>
      <motion.div
        custom={1}
        variants={fadeUpVariants}
        initial="hidden"
        animate="visible"
      >
        <Badge
          variant="secondary"
          className="mb-8 px-6 py-2 text-xs font-medium bg-black/5 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/10 text-foreground  transition-all duration-300 md:text-sm"
        >
          <Zap className="w-4 h-4 mr-2 text-primary " />
          {t("trustedBy")}
        </Badge>
      </motion.div>

      <motion.div
        custom={1.2}
        variants={fadeUpVariants}
        initial="hidden"
        animate="visible"
      >
        <h1 className="text-5xl  md:text-6xl  xl:text-8xl  font-bold mb-6 sm:mb-8 leading-[1.05] tracking-tight">
          {t("title")}
        </h1>
      </motion.div>

      <motion.div
        custom={1.4}
        variants={fadeUpVariants}
        initial="hidden"
        animate="visible"
      >
        <p className="text-sm sm:text-lg md:text-xl   mb-8 sm:mb-12 leading-relaxed font-light tracking-wide max-w-4xl mx-auto px-4">
          {t("subtitle")}
        </p>
      </motion.div>
    </>
  );
}
