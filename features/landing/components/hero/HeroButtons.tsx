"use client";

import { motion, Variants } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight, BookOpen, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePersistentAnimation } from "@/lib/hooks/usePersistentAnimation";
import { PopoverForm } from "@/components/ui/popover-form";
import { useState, useEffect } from "react";

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
  const { initial, animate } = usePersistentAnimation({
    animationKey: "hero-buttons",
    resetOnLocaleChange: false,
    resetOnRouteChange: false,
  });

  const [demoOpen, setDemoOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDemoOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [demoOpen]);

  return (
    <motion.div
      custom={1.6}
      variants={fadeUpVariants}
      initial={initial}
      animate={animate}
      className="flex flex-col md:flex-row items-center justify-center gap-6 mb-8 sm:mb-12 px-4"
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

      {/* Demo Popover Form */}
      <PopoverForm
        title={
          <div className="flex items-center gap-2 ">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-blue-500  to-purple-600 shadow-[0_0_8px_rgba(59,130,246,0.5)]">
              <Play className="w-3 h-3 text-white drop-shadow-[0_0_4px_rgba(255,255,255,0.8)]" />
            </div>
            <span className="font-semibold whitespace-nowrap">
              {t("watchDemo")}
            </span>
          </div>
        }
        open={demoOpen}
        setOpen={setDemoOpen}
        width="400px"
        height="280px"
        showCloseButton={true}
        showSuccess={false}
        openChild={
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex h-full flex-col items-center justify-center p-6"
          >
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-4 shadow-[0_0_20px_rgba(59,130,246,0.5)]">
              <Play className="w-8 h-8 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
            </div>

            <h3 className="text-xl font-bold text-foreground mb-2 text-center">
              Demo Coming Soon!
            </h3>

            <p className="text-sm text-muted-foreground text-center mb-6 max-w-xs">
              We're crafting an amazing interactive demo to showcase StudyHub's
              powerful features. Stay tuned!
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setDemoOpen(false)}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
            >
              Got It
            </motion.button>
          </motion.div>
        }
      />
    </motion.div>
  );
}
