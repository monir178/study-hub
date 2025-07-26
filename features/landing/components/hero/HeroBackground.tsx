"use client";

import { useTheme } from "next-themes";
import { ElegantShape } from "./ElegantShape";

export function HeroBackground() {
  const { theme } = useTheme();

  return (
    <>
      {/* Enhanced Floating Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Study-themed shapes with glassmorphism */}
        <ElegantShape
          delay={0.3}
          width={280}
          height={450}
          rotate={-8}
          borderRadius={32}
          gradient={
            theme === "light"
              ? "from-primary/[0.20] via-primary/[0.12] to-transparent"
              : "from-primary/[0.25] via-primary/[0.15] to-transparent"
          }
          className="left-[-12%] top-[-8%]"
        />

        <ElegantShape
          delay={0.5}
          width={550}
          height={180}
          rotate={15}
          borderRadius={28}
          gradient={
            theme === "light"
              ? "from-secondary/[0.20] via-secondary/[0.12] to-transparent"
              : "from-secondary/[0.25] via-secondary/[0.15] to-transparent"
          }
          className="right-[-18%] bottom-[-3%]"
        />

        <ElegantShape
          delay={0.4}
          width={320}
          height={320}
          rotate={24}
          borderRadius={40}
          gradient={
            theme === "light"
              ? "from-accent/[0.18] via-accent/[0.10] to-transparent"
              : "from-accent/[0.20] via-accent/[0.12] to-transparent"
          }
          className="left-[-3%] top-[35%]"
        />

        <ElegantShape
          delay={0.6}
          width={200}
          height={80}
          rotate={-20}
          borderRadius={20}
          gradient={
            theme === "light"
              ? "from-primary/[0.25] via-primary/[0.15] to-transparent"
              : "from-primary/[0.30] via-primary/[0.18] to-transparent"
          }
          className="right-[8%] top-[8%]"
        />

        {/* Wide rectangle - middle */}
        <ElegantShape
          delay={0.9}
          width={380}
          height={140}
          rotate={35}
          borderRadius={24}
          gradient={
            theme === "light"
              ? "from-secondary/[0.18] via-secondary/[0.10] to-transparent"
              : "from-secondary/[0.20] via-secondary/[0.12] to-transparent"
          }
          className="right-[-8%] top-[42%]"
        />
      </div>

      {/* Enhanced Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/60 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/90 pointer-events-none" />
    </>
  );
}
