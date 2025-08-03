"use client";

import { motion, Variants } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight, BookOpen, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeUpVariants: Variants = {
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
  const t = useTranslations("landing.hero");

  return (
    <motion.div
      custom={1.6}
      variants={fadeUpVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col md:flex-row gap-3 sm:gap-6 justify-center mb-8 sm:mb-12 px-4"
    >
      {/* Primary Button - Default variant */}
      <Link href="/auth/signup">
        <motion.div
          whileHover={{
            y: -1,
            transition: { duration: 0.2, ease: "easeOut" },
          }}
          whileTap={{
            y: 0,
            transition: { duration: 0.1 },
          }}
        >
          <Button size="lg" className="gap-2 sm:gap-3">
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
              {t("getStarted")}
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
          </Button>
        </motion.div>
      </Link>

      {/* Secondary Button - Ghost variant */}
      <Link href="/demo">
        <motion.div
          whileHover={{
            y: -1,
            transition: { duration: 0.2, ease: "easeOut" },
          }}
          whileTap={{
            y: 0,
            transition: { duration: 0.1 },
          }}
        >
          <Button variant="outline" size="lg" className="gap-2 sm:gap-3">
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
              <Play className="w-3 sm:w-4 h-3 sm:h-4" />
            </motion.div>
            <span className="font-semibold whitespace-nowrap">
              {t("watchDemo")}
            </span>
          </Button>
        </motion.div>
      </Link>
    </motion.div>
  );
}
