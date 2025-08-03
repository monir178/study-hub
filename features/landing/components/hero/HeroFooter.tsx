"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("landing.hero");

  return (
    <motion.div
      custom={1.8}
      variants={fadeUpVariants as typeof fadeUpVariants}
      initial="hidden"
      animate="visible"
      className="text-xs sm:text-sm text-muted-foreground mb-6 sm:mb-8 font-light px-4"
    >
      {t("footer")}
    </motion.div>
  );
}
